import type { Balance, Transaction } from '@/types'
import { CURRENT_MEMBER_ID } from './members'

// Convention: negative amount_cents = charge, positive = payment received.
export const transactionFixtures: Transaction[] = [
  {
    "id": "cccccccc-000a-0000-2e2a-000000062e26",
    "member": {
      "id": "99999999-0013-0001-be1e-0000000bbe15",
      "first_name": "Marie",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-03-13T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "99999999-0013-0001-be1e-0000000bbe15",
      "first_name": "Marie",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-05T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-000c-0000-6a99-000000076a94",
    "member": {
      "id": "99999999-0013-0001-be1e-0000000bbe15",
      "first_name": "Marie",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-08T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-000d-0000-08d1-0000000808cb",
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-04-04T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-000e-0000-a708-00000008a702",
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-22T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-24T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0010-0001-e377-00000009e370",
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-04-07T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-04-22T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0012-0001-1fe6-0000000b1fde",
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-06-14T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0013-0001-be1e-0000000bbe15",
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-06-13T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-0014-0001-5c55-0000000c5c4c",
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-03-22T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-06-11T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0016-0001-98c4-0000000d98ba",
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-04T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0017-0001-36fb-0000000e36f1",
    "member": {
      "id": "99999999-0017-0001-36fb-0000000e36f1",
      "first_name": "Edda",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-03-31T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0018-0001-d533-0000000ed528",
    "member": {
      "id": "99999999-0017-0001-36fb-0000000e36f1",
      "first_name": "Edda",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-06-13T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0019-0001-736a-0000000f735f",
    "member": {
      "id": "99999999-0017-0001-36fb-0000000e36f1",
      "first_name": "Edda",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-06-07T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-001a-0001-11a2-000000101196",
    "member": {
      "id": "99999999-0017-0001-36fb-0000000e36f1",
      "first_name": "Edda",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-05-14T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-04-03T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-001c-0001-4e11-000000114e04",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-04-16T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-04-25T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-001e-0001-8a80-000000128a72",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-25T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-27T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0020-0002-c6ef-00000013c6e0",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-02-22T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-04-02T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0022-0002-035e-00000015034e",
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-06-03T00:00:00.000Z",
    "title": "Payment received",
    "description": "Balancing payment"
  },
  {
    "id": "cccccccc-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-07T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0024-0002-3fcd-000000163fbc",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-06-04T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0025-0002-de04-00000016ddf3",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-05-20T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-0026-0002-7c3c-000000177c2a",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-05-14T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-03-11T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0028-0002-b8ab-00000018b898",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-06-01T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-05-27T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-002a-0002-f519-00000019f506",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-03-10T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-03-21T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-002c-0002-3188-0000001b3174",
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-14T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-002d-0002-cfc0-0000001bcfab",
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-03-10T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-002e-0002-6df7-0000001c6de2",
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-02T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-002f-0002-0c2f-0000001d0c19",
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-22T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0030-0003-aa66-0000001daa50",
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-05-25T00:00:00.000Z",
    "title": "Payment received",
    "description": "Balancing payment"
  },
  {
    "id": "cccccccc-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-002c-0002-3188-0000001b3174",
      "first_name": "Marie",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-16T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0032-0003-e6d5-0000001ee6be",
    "member": {
      "id": "99999999-002c-0002-3188-0000001b3174",
      "first_name": "Marie",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-06-12T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0033-0003-850d-0000001f84f5",
    "member": {
      "id": "99999999-002c-0002-3188-0000001b3174",
      "first_name": "Marie",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-03-04T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0034-0003-2344-00000020232c",
    "member": {
      "id": "99999999-002e-0002-6df7-0000001c6de2",
      "first_name": "Wilma",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-03-02T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0035-0003-c17c-00000020c163",
    "member": {
      "id": "99999999-002e-0002-6df7-0000001c6de2",
      "first_name": "Wilma",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-06-03T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0036-0003-5fb3-000000215f9a",
    "member": {
      "id": "99999999-002e-0002-6df7-0000001c6de2",
      "first_name": "Wilma",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-02-21T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0037-0003-fdeb-00000021fdd1",
    "member": {
      "id": "99999999-002e-0002-6df7-0000001c6de2",
      "first_name": "Wilma",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-06-02T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0038-0003-9c22-000000229c08",
    "member": {
      "id": "99999999-002e-0002-6df7-0000001c6de2",
      "first_name": "Wilma",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-05-01T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0039-0003-3a5a-000000233a3f",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-04-20T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-003a-0003-d891-00000023d876",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-04-10T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-003b-0003-76c9-0000002476ad",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-04-07T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-003c-0003-1500-0000002514e4",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-03-21T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-003d-0003-b337-00000025b31b",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-05-09T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-003e-0003-516f-000000265152",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-05-21T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-003f-0003-efa6-00000026ef89",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-02-19T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0040-0004-8dde-000000278dc0",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-06-14T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0041-0004-2c15-000000282bf7",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-04-24T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0042-0004-ca4d-00000028ca2e",
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 9500,
    "created_at": "2026-06-11T00:00:00.000Z",
    "title": "Payment received",
    "description": "Balancing payment"
  },
  {
    "id": "cccccccc-0043-0004-6884-000000296865",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-06-08T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0044-0004-06bc-0000002a069c",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-05-07T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0045-0004-a4f3-0000002aa4d3",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-06-13T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-0046-0004-432b-0000002b430a",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-06-12T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0047-0004-e162-0000002be141",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-05-20T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0048-0004-7f9a-0000002c7f78",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-06-11T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0049-0004-1dd1-0000002d1daf",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-03-07T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-004a-0004-bc09-0000002dbbe6",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-22T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-004b-0004-5a40-0000002e5a1d",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-05-26T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-004c-0004-f878-0000002ef854",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-02-25T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-004d-0004-96af-0000002f968b",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-05T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-004e-0004-34e7-0000003034c2",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-06-08T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-004f-0004-d31e-00000030d2f9",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-15T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0050-0005-7156-000000317130",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-04T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0051-0005-0f8d-000000320f67",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-06-16T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0052-0005-adc4-00000032ad9e",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-03-31T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0053-0005-4bfc-000000334bd5",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-23T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0054-0005-ea33-00000033ea0c",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-06T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0055-0005-886b-000000348843",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-02-28T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0056-0005-26a2-00000035267a",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-03-14T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0057-0005-c4da-00000035c4b1",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-06-08T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0058-0005-6311-0000003662e8",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-06-18T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0059-0005-0149-00000037011f",
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-05-08T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-005a-0005-9f80-000000379f56",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-03-07T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-005b-0005-3db8-000000383d8d",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-05-28T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-005c-0005-dbef-00000038dbc4",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-04-22T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-005d-0005-7a27-0000003979fb",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-03T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-005e-0005-185e-0000003a1832",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-04-01T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-005f-0005-b696-0000003ab669",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-04-25T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-0060-0006-54cd-0000003b54a0",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-03-02T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0061-0006-f305-0000003bf2d7",
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-05-01T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0062-0006-913c-0000003c910e",
    "member": {
      "id": "99999999-0049-0004-1dd1-0000002d1daf",
      "first_name": "Henry",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-13T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0063-0006-2f74-0000003d2f45",
    "member": {
      "id": "99999999-0049-0004-1dd1-0000002d1daf",
      "first_name": "Henry",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-03-11T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0064-0006-cdab-0000003dcd7c",
    "member": {
      "id": "99999999-0049-0004-1dd1-0000002d1daf",
      "first_name": "Henry",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-06-04T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0065-0006-6be3-0000003e6bb3",
    "member": {
      "id": "99999999-0049-0004-1dd1-0000002d1daf",
      "first_name": "Henry",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-04-29T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0066-0006-0a1a-0000003f09ea",
    "member": {
      "id": "99999999-0049-0004-1dd1-0000002d1daf",
      "first_name": "Henry",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-02-20T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0067-0006-a851-0000003fa821",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-28T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0068-0006-4689-000000404658",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-06-03T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0069-0006-e4c0-00000040e48f",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-06-03T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-006a-0006-82f8-0000004182c6",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-06-11T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-006b-0006-212f-0000004220fd",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-02-23T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-006c-0006-bf67-00000042bf34",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-05-23T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-006d-0006-5d9e-000000435d6b",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 2000,
    "created_at": "2026-04-25T00:00:00.000Z",
    "title": "Payment received",
    "description": "Standing order"
  },
  {
    "id": "cccccccc-006e-0006-fbd6-00000043fba2",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-17T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-006f-0006-9a0d-0000004499d9",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-30T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0070-0007-3845-000000453810",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-20T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0071-0007-d67c-00000045d647",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-04-14T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0072-0007-74b4-00000046747e",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-04-30T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0073-0007-12eb-0000004712b5",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-03-09T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0074-0007-b123-00000047b0ec",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-22T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0075-0007-4f5a-000000484f23",
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-06-13T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0076-0007-ed92-00000048ed5a",
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-28T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0077-0007-8bc9-000000498b91",
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-05-26T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-0078-0007-2a01-0000004a29c8",
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-06-10T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0079-0007-c838-0000004ac7ff",
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-06-04T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-007a-0007-666f-0000004b6636",
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-06-15T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-007b-0007-04a7-0000004c046d",
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -3000,
    "created_at": "2026-04-11T00:00:00.000Z",
    "title": "Equipment",
    "description": "Training gear"
  },
  {
    "id": "cccccccc-007c-0007-a2de-0000004ca2a4",
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-06-04T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-007d-0007-4116-0000004d40db",
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-04-30T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-007e-0007-df4d-0000004ddf12",
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-05-04T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-007f-0007-7d85-0000004e7d49",
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-03-23T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0080-0008-1bbc-0000004f1b80",
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-05-27T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0081-0008-b9f4-0000004fb9b7",
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-03-11T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0082-0008-582b-0000005057ee",
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-06-13T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0083-0008-f663-00000050f625",
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-27T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0084-0008-949a-00000051945c",
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-02-19T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-0085-0008-32d2-000000523293",
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-31T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0086-0008-d109-00000052d0ca",
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-02-28T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-0087-0008-6f41-000000536f01",
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-05-14T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0088-0008-0d78-000000540d38",
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-02-24T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  },
  {
    "id": "cccccccc-0089-0008-abb0-00000054ab6f",
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-06-12T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-008a-0008-49e7-0000005549a6",
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-06-13T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-008b-0008-e81f-00000055e7dd",
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-03-20T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-008c-0008-8656-000000568614",
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-06-15T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-008d-0008-248e-00000057244b",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -1500,
    "created_at": "2026-05-23T00:00:00.000Z",
    "title": "Tournament entry",
    "description": "Regional cup"
  },
  {
    "id": "cccccccc-008e-0008-c2c5-00000057c282",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-04-01T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-008f-0008-60fc-0000005860b9",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -4500,
    "created_at": "2026-03-09T00:00:00.000Z",
    "title": "Kit purchase",
    "description": "Club jersey + shorts"
  },
  {
    "id": "cccccccc-0090-0009-ff34-00000058fef0",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-03-27T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "Membership fee"
  },
  {
    "id": "cccccccc-0091-0009-9d6b-000000599d27",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-05-25T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0092-0009-3ba3-0000005a3b5e",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-05-08T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0093-0009-d9da-0000005ad995",
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 8000,
    "created_at": "2026-06-15T00:00:00.000Z",
    "title": "Payment received",
    "description": "Card payment"
  },
  {
    "id": "cccccccc-0094-0009-7812-0000005b77cc",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-06-01T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "June membership fee"
  },
  {
    "id": "cccccccc-0095-0009-1649-0000005c1603",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 6000,
    "created_at": "2026-05-26T00:00:00.000Z",
    "title": "Payment received",
    "description": "Bank transfer"
  },
  {
    "id": "cccccccc-0096-0009-b481-0000005cb43a",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2500,
    "created_at": "2026-05-20T00:00:00.000Z",
    "title": "Court fee",
    "description": "League match — away"
  },
  {
    "id": "cccccccc-0097-0009-52b8-0000005d5271",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": -2000,
    "created_at": "2026-05-01T00:00:00.000Z",
    "title": "Monthly dues",
    "description": "May membership fee"
  },
  {
    "id": "cccccccc-0098-0009-f0f0-0000005df0a8",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0004-0000-78dd-0000000278dc",
      "first_name": "Admin",
      "last_name": "Devoops"
    },
    "amount_cents": 4000,
    "created_at": "2026-04-20T00:00:00.000Z",
    "title": "Payment received",
    "description": "Cash — front desk"
  }
]

export const balanceFixtures: Balance[] = [
  {
    "member": {
      "id": "99999999-0013-0001-be1e-0000000bbe15",
      "first_name": "Marie",
      "last_name": "Wolf"
    },
    "balance_cents": -1000
  },
  {
    "member": {
      "id": "99999999-0014-0001-5c55-0000000c5c4c",
      "first_name": "Linus",
      "last_name": "Koch"
    },
    "balance_cents": 9500
  },
  {
    "member": {
      "id": "99999999-0015-0001-fa8c-0000000cfa83",
      "first_name": "Linus",
      "last_name": "Beck"
    },
    "balance_cents": 0
  },
  {
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "balance_cents": 1500
  },
  {
    "member": {
      "id": "99999999-0017-0001-36fb-0000000e36f1",
      "first_name": "Edda",
      "last_name": "Frank"
    },
    "balance_cents": -500
  },
  {
    "member": {
      "id": "99999999-0018-0001-d533-0000000ed528",
      "first_name": "Mia",
      "last_name": "Werner"
    },
    "balance_cents": 0
  },
  {
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "balance_cents": 8500
  },
  {
    "member": {
      "id": "99999999-002b-0002-9351-0000001a933d",
      "first_name": "David",
      "last_name": "Arnold"
    },
    "balance_cents": 3000
  },
  {
    "member": {
      "id": "99999999-002c-0002-3188-0000001b3174",
      "first_name": "Marie",
      "last_name": "Vogel"
    },
    "balance_cents": -3000
  },
  {
    "member": {
      "id": "99999999-002d-0002-cfc0-0000001bcfab",
      "first_name": "Romi",
      "last_name": "Werner"
    },
    "balance_cents": 0
  },
  {
    "member": {
      "id": "99999999-002e-0002-6df7-0000001c6de2",
      "first_name": "Wilma",
      "last_name": "Kaiser"
    },
    "balance_cents": 1000
  },
  {
    "member": {
      "id": "99999999-0035-0003-c17c-00000020c163",
      "first_name": "Helena",
      "last_name": "Berger"
    },
    "balance_cents": 3000
  },
  {
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "balance_cents": -7500
  },
  {
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "balance_cents": 4500
  },
  {
    "member": {
      "id": "99999999-0038-0003-9c22-000000229c08",
      "first_name": "Greta",
      "last_name": "Nowak"
    },
    "balance_cents": 9000
  },
  {
    "member": {
      "id": "99999999-0048-0004-7f9a-0000002c7f78",
      "first_name": "Levi",
      "last_name": "Lange"
    },
    "balance_cents": 5500
  },
  {
    "member": {
      "id": "99999999-0049-0004-1dd1-0000002d1daf",
      "first_name": "Henry",
      "last_name": "Richter"
    },
    "balance_cents": -6500
  },
  {
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "balance_cents": 2000
  },
  {
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "balance_cents": 11000
  },
  {
    "member": {
      "id": "99999999-004d-0004-96af-0000002f968b",
      "first_name": "Frida",
      "last_name": "Fuchs"
    },
    "balance_cents": 1500
  },
  {
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "balance_cents": -5500
  },
  {
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "balance_cents": 5000
  },
  {
    "member": {
      "id": "99999999-0050-0005-7156-000000317130",
      "first_name": "Finn",
      "last_name": "Seidel"
    },
    "balance_cents": 500
  },
  {
    "member": {
      "id": "99999999-0061-0006-f305-0000003bf2d7",
      "first_name": "Leon",
      "last_name": "Braun"
    },
    "balance_cents": 0
  },
  {
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "balance_cents": -9000
  },
  {
    "member": {
      "id": "99999999-0063-0006-2f74-0000003d2f45",
      "first_name": "Lena",
      "last_name": "Beck"
    },
    "balance_cents": 11500
  },
  {
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "balance_cents": 3500
  }
]

export const currentMemberBalance: Balance =
  balanceFixtures.find((b) => b.member.id === CURRENT_MEMBER_ID) ?? balanceFixtures[0]
