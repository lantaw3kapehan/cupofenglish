-- 1544 (29 Oct 2026) · applied as migration renew_at_service_read_1544
-- coe-student v26's renewal-month guard (renew.ts) reads coe_renew_at with the service key. SELECT had been revoked from every
-- API role, so the read failed, renewFlags returned null and every student showed 核对中 for ~4 minutes after the v26 deploy.
-- Read-only grant to service_role only (edge functions); anon / authenticated stay without SELECT. No rows changed.
grant select on public.coe_renew_at to service_role;
-- undo: revoke select on public.coe_renew_at from service_role;   (only together with rolling coe-student back to v25)
