-- Table privileges and RLS are both required for authenticated API requests.
-- Existing own_profile / org_jobs / create_org_jobs policies still enforce scope.
grant usage on schema public to authenticated;
grant select on public.user_profiles to authenticated;
grant select, insert on public.job_orders to authenticated;

-- Repair provisioning of an existing profile without organization membership.
-- Profiles already assigned to a workspace retain their existing role.
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
 on conflict(id) do update set organization_id=excluded.organization_id, role=excluded.role;
 return org;
end $$;
revoke all on function public.ensure_personal_workspace() from public;
grant execute on function public.ensure_personal_workspace() to authenticated;

notify pgrst, 'reload schema';
