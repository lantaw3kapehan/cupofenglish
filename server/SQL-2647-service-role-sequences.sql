-- 2647 (Misty 21 Nov 20:38): Celine's "Review validity" Save failed ("Not saved. Try again.") from 11:00 UTC:
--   postgres: permission denied for sequence coe_validity_review_id_seq (role service_role via PostgREST, coe-ops valset).
-- 49 public sequences lacked USAGE for service_role. Fixed for all, and for future sequences:
grant usage, select on all sequences in schema public to service_role;
alter default privileges in schema public grant usage, select on sequences to service_role;

-- 2654 (Misty 21 Nov 21:34): coe_meet_from_write / coe_meet_takeover: "and lower(trim(c.teachers->>0)) = lower(trim(coalesce(new.who, '')))"
--   → "and (new.mode = 'mgmt' or lower(trim(c.teachers->>0)) = lower(trim(coalesce(new.who, ''))))" so management can set any student's meeting ID.
