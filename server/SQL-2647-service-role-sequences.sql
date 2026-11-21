-- 2647 (Misty 21 Nov 20:38): Celine's "Review validity" Save failed ("Not saved. Try again.") from 11:00 UTC:
--   postgres: permission denied for sequence coe_validity_review_id_seq (role service_role via PostgREST, coe-ops valset).
-- 49 public sequences lacked USAGE for service_role. Fixed for all, and for future sequences:
grant usage, select on all sequences in schema public to service_role;
alter default privileges in schema public grant usage, select on sequences to service_role;
