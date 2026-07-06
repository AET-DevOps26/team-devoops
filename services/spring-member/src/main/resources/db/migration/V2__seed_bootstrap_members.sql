-- Backfills member.members rows for the "admin" and "user" accounts that are
-- seeded directly into Keycloak via realm import (infra/keycloak/realm-config.json)
-- rather than through MemberService.createMember. Without this, any FK-constrained
-- write (e.g. event.events.creator_id) referencing these Keycloak ids fails, since
-- member.members.id is expected to equal the Keycloak user id for every member.
INSERT INTO member.members (id, first_name, last_name, email, joining_date)
VALUES
    ('32bd2021-1e95-4951-bd1d-3d756c579dce', 'Admin', 'Admin', 'teamdevoops2026+admin@gmail.com', CURRENT_DATE),
    ('3f3864aa-1d24-42ba-9d64-055b86bc92df', 'User', 'User', 'teamdevoops2026+user@gmail.com', CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;
