-- Run after the earlier migrations. Existing orders and workspace isolation remain intact.
begin;
create table if not exists public.workspace_invites (
 organization_id uuid primary key references public.organizations(id) on delete cascade,
 code text not null unique default substr(replace(gen_random_uuid()::text || gen_random_uuid()::text,'-',''),1,48)
);
alter table public.workspace_invites enable row level security;
revoke all on public.workspace_invites from anon, authenticated;

create or replace function public.workspace_join_code() returns text
language plpgsql security definer set search_path=public as $$
declare org uuid; invite text;
begin
 org := public.ensure_personal_workspace();
 if not exists(select 1 from user_profiles where id=auth.uid() and role in ('administrator','planner')) then raise exception 'Only planners and administrators can invite members'; end if;
 insert into workspace_invites(organization_id) values(org) on conflict do nothing;
 select code into invite from workspace_invites where organization_id=org;
 return invite;
end $$;

create or replace function public.join_workspace(invite_code text) returns void
language plpgsql security definer set search_path=public as $$
declare target uuid; previous uuid;
begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 select organization_id into target from workspace_invites where code=trim(invite_code);
 if target is null then raise exception 'Invalid workspace join code'; end if;
 select organization_id into previous from user_profiles where id=auth.uid();
 if previous=target then return; end if;
 -- Do not strand a member's real orders or switch an established team member.
 if previous is not null and (
 exists(select 1 from job_orders where organization_id=previous and job_number not like 'SAMPLE-%') or
 exists(select 1 from user_profiles where organization_id=previous and id<>auth.uid())
 ) then raise exception 'This account already has orders or team members. Share its own join code with your friends instead.'; end if;
 insert into user_profiles(id,organization_id,full_name,role)
 select id,target,coalesce(nullif(raw_user_meta_data->>'full_name',''),email),'planner'::app_role from auth.users where id=auth.uid()
 on conflict(id) do update set organization_id=excluded.organization_id,role=excluded.role;
end $$;
revoke all on function public.workspace_join_code() from public;
revoke all on function public.join_workspace(text) from public;
grant execute on function public.workspace_join_code() to authenticated;
grant execute on function public.join_workspace(text) to authenticated;

-- Insert ten clearly labelled samples into each workspace, once only.
create or replace function public.seed_workspace_samples(target uuid) returns void
language sql security definer set search_path=public as $$
 insert into job_orders(organization_id,job_number,title,product,material,quantity,unit,priority,start_date,due_date,status,instructions)
 select target,'SAMPLE-'||lpad(n::text,3,'0'),'[Sample] '||title,product,material,quantity,'pcs',priority::text,current_date,current_date+days,status::job_status,'Sample order for exploring JobworkOS. Not a real production commitment.'
 from (values
 (1,'Bracket cutting and drilling','L-shaped mounting bracket','Mild steel sheet, 3 mm',500,'normal',7,'pending'),
 (2,'CNC housing machining','Motor housing cover','Aluminium 6061, 150 x 100 x 25 mm',200,'high',10,'active'),
 (3,'Shaft turning','Drive shaft','EN8 steel rod, diameter 25 mm',150,'normal',8,'pending'),
 (4,'Powder coating','Equipment enclosure','CRCA steel, 1.5 mm',300,'normal',12,'active'),
 (5,'Gear blank machining','Spur gear blank','EN24 steel, diameter 80 mm',100,'high',5,'delayed'),
 (6,'Sheet metal bending','Control panel cover','SS304 sheet, 2 mm',250,'normal',9,'pending'),
 (7,'Bush precision boring','Flanged bush','Phosphor bronze, diameter 40 mm',600,'low',14,'completed'),
 (8,'Laser profile cutting','Base mounting plate','Mild steel plate, 6 mm',400,'normal',6,'active'),
 (9,'Thread tapping','Threaded spacer','Aluminium 6061, M8 internal thread',1000,'low',11,'completed'),
 (10,'Welding and finishing','Support frame','MS square tube, 25 x 25 mm',80,'high',15,'blocked')
 ) as sample(n,title,product,material,quantity,priority,days,status)
 on conflict(organization_id,job_number) do nothing;
$$;
revoke all on function public.seed_workspace_samples(uuid) from public,anon,authenticated;
do $$ declare workspace record; begin
 for workspace in select id from public.organizations loop
 perform public.seed_workspace_samples(workspace.id);
 end loop;
end $$;
create or replace function public.seed_new_workspace() returns trigger
language plpgsql security definer set search_path=public as $$
begin perform public.seed_workspace_samples(new.id); return new; end $$;
revoke all on function public.seed_new_workspace() from public,anon,authenticated;
drop trigger if exists seed_sample_orders on public.organizations;
create trigger seed_sample_orders after insert on public.organizations for each row execute function public.seed_new_workspace();
notify pgrst,'reload schema';
commit;
