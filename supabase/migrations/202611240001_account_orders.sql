-- Every new user gets an isolated workspace; existing organization membership is preserved.
create or replace function public.ensure_personal_workspace() returns uuid
language plpgsql security definer set search_path = public as $$
declare org uuid;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 select organization_id into org from user_profiles where id=auth.uid();
 if org is not null then return org; end if;
 insert into organizations(name,code) values ('My workspace',auth.uid()::text) returning id into org;
 insert into user_profiles(id,organization_id,full_name,role)
 select id,org,coalesce(nullif(raw_user_meta_data->>'full_name',''),email),'planner'::app_role from auth.users where id=auth.uid()
 on conflict(id) do update set organization_id=excluded.organization_id;
 return org;
end $$;
revoke all on function public.ensure_personal_workspace() from public;
grant execute on function public.ensure_personal_workspace() to authenticated;
create policy create_org_jobs on public.job_orders for insert to authenticated
with check (organization_id=public.current_org() and created_by=auth.uid() and exists(select 1 from public.user_profiles where id=auth.uid() and role in ('administrator','planner')));
