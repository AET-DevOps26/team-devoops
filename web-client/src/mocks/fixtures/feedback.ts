import type { Feedback, FeedbackSummary } from '@/types'

// Summary rows (no body text); full text lives on feedbackDetailsById.
export const feedbackSummaryFixtures: FeedbackSummary[] = [
  {
    "id": "ffffffff-0001-0000-9e37-000000009e37",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-0015-0001-fa8c-0000000cfa83",
      "first_name": "Linus",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0002-0000-3c6e-000000013c6e",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0003-0000-daa6-00000001daa5",
    "event": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0004-0000-78dd-0000000278dc",
    "event": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
    "member": {
      "id": "99999999-001a-0001-11a2-000000101196",
      "first_name": "Jakob",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0005-0000-1715-000000031713",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-001d-0001-ec48-00000011ec3b",
      "first_name": "Janne",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0006-0000-b54c-00000003b54a",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-001e-0001-8a80-000000128a72",
      "first_name": "Theo",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-03T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0007-0000-5384-000000045381",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-001f-0001-28b7-0000001328a9",
      "first_name": "Samuel",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0008-0000-f1bb-00000004f1b8",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-0020-0002-c6ef-00000013c6e0",
      "first_name": "Levi",
      "last_name": "Voigt"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0009-0000-8ff3-000000058fef",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-0025-0002-de04-00000016ddf3",
      "first_name": "Fynn",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-000a-0000-2e2a-000000062e26",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-002c-0002-3188-0000001b3174",
      "first_name": "Marie",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-000b-0000-cc62-00000006cc5d",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-002d-0002-cfc0-0000001bcfab",
      "first_name": "Romi",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-000c-0000-6a99-000000076a94",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-0031-0003-489e-0000001e4887",
      "first_name": "Edda",
      "last_name": "Zimmermann"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-000d-0000-08d1-0000000808cb",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-0032-0003-e6d5-0000001ee6be",
      "first_name": "Toni",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-01T00:00:00.000Z"
  },
  {
    "id": "ffffffff-000e-0000-a708-00000008a702",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-000f-0000-4540-000000094539",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0010-0001-e377-00000009e370",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003a-0003-d891-00000023d876",
      "first_name": "Joris",
      "last_name": "Stein"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0011-0001-81af-0000000a81a7",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003b-0003-76c9-0000002476ad",
      "first_name": "Frieda",
      "last_name": "Bauer"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0012-0001-1fe6-0000000b1fde",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003d-0003-b337-00000025b31b",
      "first_name": "Fynn",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-20T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0013-0001-be1e-0000000bbe15",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003e-0003-516f-000000265152",
      "first_name": "Marie",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0014-0001-5c55-0000000c5c4c",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003f-0003-efa6-00000026ef89",
      "first_name": "Joris",
      "last_name": "Lehmann"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0015-0001-fa8c-0000000cfa83",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0041-0004-2c15-000000282bf7",
      "first_name": "Smilla",
      "last_name": "Krause"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 4
  },
  {
    "id": "ffffffff-0016-0001-98c4-0000000d98ba",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0045-0004-a4f3-0000002aa4d3",
      "first_name": "Mats",
      "last_name": "Graf"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0017-0001-36fb-0000000e36f1",
    "event": "aaaaaaaa-0007-0000-5384-000000045381",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0018-0001-d533-0000000ed528",
    "event": "aaaaaaaa-0007-0000-5384-000000045381",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0019-0001-736a-0000000f735f",
    "event": "aaaaaaaa-0007-0000-5384-000000045381",
    "member": {
      "id": "99999999-004c-0004-f878-0000002ef854",
      "first_name": "Tomas",
      "last_name": "Hartmann"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-001a-0001-11a2-000000101196",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-001b-0001-afd9-00000010afcd",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-001c-0001-4e11-000000114e04",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0051-0005-0f8d-000000320f67",
      "first_name": "Paul",
      "last_name": "Busch"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-03T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-001d-0001-ec48-00000011ec3b",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0054-0005-ea33-00000033ea0c",
      "first_name": "Marie",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-001e-0001-8a80-000000128a72",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0057-0005-c4da-00000035c4b1",
      "first_name": "Helena",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-001f-0001-28b7-0000001328a9",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0058-0005-6311-0000003662e8",
      "first_name": "Leon",
      "last_name": "Hartmann"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 3
  },
  {
    "id": "ffffffff-0020-0002-c6ef-00000013c6e0",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-005d-0005-7a27-0000003979fb",
      "first_name": "Jakob",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0021-0002-6526-000000146517",
    "event": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0022-0002-035e-00000015034e",
    "event": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0023-0002-a195-00000015a185",
    "event": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "99999999-0065-0006-6be3-0000003e6bb3",
      "first_name": "Frida",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0024-0002-3fcd-000000163fbc",
    "event": "aaaaaaaa-000d-0000-08d1-0000000808cb",
    "member": {
      "id": "99999999-0067-0006-a851-0000003fa821",
      "first_name": "Luca",
      "last_name": "Peters"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-05T00:00:00.000Z"
  },
  {
    "id": "ffffffff-0025-0002-de04-00000016ddf3",
    "event": "aaaaaaaa-000d-0000-08d1-0000000808cb",
    "member": {
      "id": "99999999-006f-0006-9a0d-0000004499d9",
      "first_name": "Liv",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 0
  },
  {
    "id": "ffffffff-0026-0002-7c3c-000000177c2a",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0072-0007-74b4-00000046747e",
      "first_name": "Lena",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0027-0002-1a73-000000181a61",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0075-0007-4f5a-000000484f23",
      "first_name": "Emil",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0028-0002-b8ab-00000018b898",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0076-0007-ed92-00000048ed5a",
      "first_name": "Leon",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0029-0002-56e2-0000001956cf",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0078-0007-2a01-0000004a29c8",
      "first_name": "Oskar",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-002a-0002-f519-00000019f506",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-007a-0007-666f-0000004b6636",
      "first_name": "Leon",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-05-20T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-002b-0002-9351-0000001a933d",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-007f-0007-7d85-0000004e7d49",
      "first_name": "Tilda",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-002c-0002-3188-0000001b3174",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0081-0008-b9f4-0000004fb9b7",
      "first_name": "Leon",
      "last_name": "Busch"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-002d-0002-cfc0-0000001bcfab",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0084-0008-949a-00000051945c",
      "first_name": "Juna",
      "last_name": "Reil"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-002e-0002-6df7-0000001c6de2",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0085-0008-32d2-000000523293",
      "first_name": "Juna",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-002f-0002-0c2f-0000001d0c19",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0087-0008-6f41-000000536f01",
      "first_name": "Sofia",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-17T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0030-0003-aa66-0000001daa50",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0088-0008-0d78-000000540d38",
      "first_name": "Samuel",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0031-0003-489e-0000001e4887",
    "event": "aaaaaaaa-0013-0001-be1e-0000000bbe15",
    "member": {
      "id": "99999999-008c-0008-8656-000000568614",
      "first_name": "Moritz",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0032-0003-e6d5-0000001ee6be",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0093-0009-d9da-0000005ad995",
      "first_name": "Finn",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-07T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0033-0003-850d-0000001f84f5",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0095-0009-1649-0000005c1603",
      "first_name": "Lea",
      "last_name": "Park"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-0034-0003-2344-00000020232c",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0098-0009-f0f0-0000005df0a8",
      "first_name": "Aaron",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0035-0003-c17c-00000020c163",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-009d-0009-0805-0000006107bb",
      "first_name": "Lena",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0036-0003-5fb3-000000215f9a",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-009e-0009-a63d-00000061a5f2",
      "first_name": "Joris",
      "last_name": "Schulz"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0037-0003-fdeb-00000021fdd1",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-00a1-000a-80e3-000000638097",
      "first_name": "Amelie",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0038-0003-9c22-000000229c08",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-00a2-000a-1f1b-000000641ece",
      "first_name": "Jonas",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0039-0003-3a5a-000000233a3f",
    "event": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
    "member": {
      "id": "99999999-00a7-000a-3630-0000006735e1",
      "first_name": "Carla",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-003a-0003-d891-00000023d876",
    "event": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
    "member": {
      "id": "99999999-00aa-000a-10d6-000000691086",
      "first_name": "Bela",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-003b-0003-76c9-0000002476ad",
    "event": "aaaaaaaa-0019-0001-736a-0000000f735f",
    "member": {
      "id": "99999999-00ae-000a-89b4-0000006b8962",
      "first_name": "Jonah",
      "last_name": "König"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-08T00:00:00.000Z"
  },
  {
    "id": "ffffffff-003c-0003-1500-0000002514e4",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00b6-000b-7b70-000000707b1a",
      "first_name": "Finn",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-003d-0003-b337-00000025b31b",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00b9-000b-5616-0000007255bf",
      "first_name": "Frida",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 4
  },
  {
    "id": "ffffffff-003e-0003-516f-000000265152",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00bb-000b-9285-00000073922d",
      "first_name": "Sofia",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-003f-0003-efa6-00000026ef89",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00bc-000b-30bd-000000743064",
      "first_name": "Jonah",
      "last_name": "Park"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0040-0004-8dde-000000278dc0",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00be-000b-6d2c-000000756cd2",
      "first_name": "Emil",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0041-0004-2c15-000000282bf7",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00bf-000b-0b63-000000760b09",
      "first_name": "David",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-14T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0042-0004-ca4d-00000028ca2e",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c1-000c-47d2-000000774777",
      "first_name": "Emil",
      "last_name": "Schwarz"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0043-0004-6884-000000296865",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c3-000c-8441-0000007883e5",
      "first_name": "Rosa",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0044-0004-06bc-0000002a069c",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c4-000c-2279-00000079221c",
      "first_name": "Frida",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-07T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-0045-0004-a4f3-0000002aa4d3",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c6-000c-5ee8-0000007a5e8a",
      "first_name": "Edda",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0046-0004-432b-0000002b430a",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c8-000c-9b57-0000007b9af8",
      "first_name": "Emil",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0047-0004-e162-0000002be141",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00cf-000c-eedb-0000007fee79",
      "first_name": "Toni",
      "last_name": "Krause"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 3
  },
  {
    "id": "ffffffff-0048-0004-7f9a-0000002c7f78",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00d0-000d-8d12-000000808cb0",
      "first_name": "Lotte",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0049-0004-1dd1-0000002d1daf",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d1-000d-2b4a-000000812ae7",
      "first_name": "Lotte",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-004a-0004-bc09-0000002dbbe6",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d2-000d-c981-00000081c91e",
      "first_name": "Mara",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-004b-0004-5a40-0000002e5a1d",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d3-000d-67b9-000000826755",
      "first_name": "Ella",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-004c-0004-f878-0000002ef854",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d6-000d-425f-0000008441fa",
      "first_name": "Nele",
      "last_name": "Scholz"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-14T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-004d-0004-96af-0000002f968b",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d7-000d-e097-00000084e031",
      "first_name": "Oskar",
      "last_name": "Stein"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 0
  },
  {
    "id": "ffffffff-004e-0004-34e7-0000003034c2",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00db-000d-5975-00000087590d",
      "first_name": "Ida",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-004f-0004-d31e-00000030d2f9",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00dc-000d-f7ac-00000087f744",
      "first_name": "Levi",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0050-0005-7156-000000317130",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00df-000d-d253-00000089d1e9",
      "first_name": "Toni",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0051-0005-0f8d-000000320f67",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00e0-000e-708a-0000008a7020",
      "first_name": "Nele",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0052-0005-adc4-00000032ad9e",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00e8-000e-6246-0000008f61d8",
      "first_name": "Lea",
      "last_name": "Stein"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-10T00:00:00.000Z"
  },
  {
    "id": "ffffffff-0053-0005-4bfc-000000334bd5",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00ed-000e-795b-0000009278eb",
      "first_name": "Mats",
      "last_name": "Horn"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-24T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0054-0005-ea33-00000033ea0c",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00ee-000e-1793-000000931722",
      "first_name": "Lina",
      "last_name": "Krüger"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0055-0005-886b-000000348843",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00f4-000f-ccdf-00000096cc6c",
      "first_name": "Stella",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-20T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0056-0005-26a2-00000035267a",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00f9-000f-e3f5-00000099e37f",
      "first_name": "Joris",
      "last_name": "Huber"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-29T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0057-0005-c4da-00000035c4b1",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fa-000f-822c-0000009a81b6",
      "first_name": "Mara",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0058-0005-6311-0000003662e8",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fb-000f-2064-0000009b1fed",
      "first_name": "Martha",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0059-0005-0149-00000037011f",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fc-000f-be9b-0000009bbe24",
      "first_name": "Mats",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-14T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-005a-0005-9f80-000000379f56",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fe-000f-fb0a-0000009cfa92",
      "first_name": "Erik",
      "last_name": "Schulz"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-005b-0005-3db8-000000383d8d",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0101-0010-d5b1-0000009ed537",
      "first_name": "Clara",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-005c-0005-dbef-00000038dbc4",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0102-0010-73e8-0000009f736e",
      "first_name": "Niklas",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-005d-0005-7a27-0000003979fb",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0106-0010-ecc6-000000a1ec4a",
      "first_name": "Nele",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-005e-0005-185e-0000003a1832",
    "event": "aaaaaaaa-0025-0002-de04-00000016ddf3",
    "member": {
      "id": "99999999-010e-0010-de82-000000a6de02",
      "first_name": "Magda",
      "last_name": "Bauer"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-005f-0005-b696-0000003ab669",
    "event": "aaaaaaaa-0025-0002-de04-00000016ddf3",
    "member": {
      "id": "99999999-0110-0011-1af1-000000a81a70",
      "first_name": "Mira",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0060-0006-54cd-0000003b54a0",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0112-0011-5760-000000a956de",
      "first_name": "Paul",
      "last_name": "Reil"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0061-0006-f305-0000003bf2d7",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0116-0011-d03e-000000abcfba",
      "first_name": "Pia",
      "last_name": "Zimmermann"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0062-0006-913c-0000003c910e",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0118-0011-0cad-000000ad0c28",
      "first_name": "Joris",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-07T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0063-0006-2f74-0000003d2f45",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011a-0011-491c-000000ae4896",
      "first_name": "Jonah",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0064-0006-cdab-0000003dcd7c",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011b-0011-e753-000000aee6cd",
      "first_name": "Mats",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0065-0006-6be3-0000003e6bb3",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011d-0011-23c2-000000b0233b",
      "first_name": "Janne",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 4
  },
  {
    "id": "ffffffff-0066-0006-0a1a-0000003f09ea",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011e-0011-c1f9-000000b0c172",
      "first_name": "Amelie",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0067-0006-a851-0000003fa821",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0120-0012-fe68-000000b1fde0",
      "first_name": "Lea",
      "last_name": "Engel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0068-0006-4689-000000404658",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0121-0012-9ca0-000000b29c17",
      "first_name": "Stella",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-24T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0069-0006-e4c0-00000040e48f",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0122-0012-3ad7-000000b33a4e",
      "first_name": "Helena",
      "last_name": "König"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-16T00:00:00.000Z"
  },
  {
    "id": "ffffffff-006a-0006-82f8-0000004182c6",
    "event": "aaaaaaaa-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-012b-0012-cacb-000000b8ca3d",
      "first_name": "Noah",
      "last_name": "Schulz"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-006b-0006-212f-0000004220fd",
    "event": "aaaaaaaa-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-012f-0012-43a9-000000bb4319",
      "first_name": "Nora",
      "last_name": "Bauer"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-006c-0006-bf67-00000042bf34",
    "event": "aaaaaaaa-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-0130-0013-e1e0-000000bbe150",
      "first_name": "Luca",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-006d-0006-5d9e-000000435d6b",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0131-0013-8017-000000bc7f87",
      "first_name": "Ada",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-006e-0006-fbd6-00000043fba2",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0133-0013-bc86-000000bdbbf5",
      "first_name": "Max",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-09T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-006f-0006-9a0d-0000004499d9",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0135-0013-f8f5-000000bef863",
      "first_name": "Romi",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 3
  },
  {
    "id": "ffffffff-0070-0007-3845-000000453810",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0136-0013-972d-000000bf969a",
      "first_name": "Moritz",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0071-0007-d67c-00000045d647",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-013d-0013-eab1-000000c3ea1b",
      "first_name": "Alma",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0072-0007-74b4-00000046747e",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0140-0014-c558-000000c5c4c0",
      "first_name": "Mats",
      "last_name": "Hartmann"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0073-0007-12eb-0000004712b5",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0142-0014-01c7-000000c7012e",
      "first_name": "Anton",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0074-0007-b123-00000047b0ec",
    "event": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
    "member": {
      "id": "99999999-014b-0014-91ba-000000cc911d",
      "first_name": "Konrad",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0075-0007-4f5a-000000484f23",
    "event": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
    "member": {
      "id": "99999999-014c-0014-2ff1-000000cd2f54",
      "first_name": "Elias",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 0
  },
  {
    "id": "ffffffff-0076-0007-ed92-00000048ed5a",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0077-0007-8bc9-000000498b91",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0078-0007-2a01-0000004a29c8",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 9
  }
]

export const feedbackDetailsById: Record<string, Feedback> = {
  "ffffffff-0001-0000-9e37-000000009e37": {
    "id": "ffffffff-0001-0000-9e37-000000009e37",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-0015-0001-fa8c-0000000cfa83",
      "first_name": "Linus",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0002-0000-3c6e-000000013c6e": {
    "id": "ffffffff-0002-0000-3c6e-000000013c6e",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-0016-0001-98c4-0000000d98ba",
      "first_name": "Clara",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 7
  },
  "ffffffff-0003-0000-daa6-00000001daa5": {
    "id": "ffffffff-0003-0000-daa6-00000001daa5",
    "event": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
    "member": {
      "id": "99999999-0019-0001-736a-0000000f735f",
      "first_name": "Charlotte",
      "last_name": "Wagner"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0004-0000-78dd-0000000278dc": {
    "id": "ffffffff-0004-0000-78dd-0000000278dc",
    "event": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
    "member": {
      "id": "99999999-001a-0001-11a2-000000101196",
      "first_name": "Jakob",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 6
  },
  "ffffffff-0005-0000-1715-000000031713": {
    "id": "ffffffff-0005-0000-1715-000000031713",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-001d-0001-ec48-00000011ec3b",
      "first_name": "Janne",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 8
  },
  "ffffffff-0006-0000-b54c-00000003b54a": {
    "id": "ffffffff-0006-0000-b54c-00000003b54a",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-001e-0001-8a80-000000128a72",
      "first_name": "Theo",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-03T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 5
  },
  "ffffffff-0007-0000-5384-000000045381": {
    "id": "ffffffff-0007-0000-5384-000000045381",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-001f-0001-28b7-0000001328a9",
      "first_name": "Samuel",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 7
  },
  "ffffffff-0008-0000-f1bb-00000004f1b8": {
    "id": "ffffffff-0008-0000-f1bb-00000004f1b8",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "99999999-0020-0002-c6ef-00000013c6e0",
      "first_name": "Levi",
      "last_name": "Voigt"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 9
  },
  "ffffffff-0009-0000-8ff3-000000058fef": {
    "id": "ffffffff-0009-0000-8ff3-000000058fef",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "99999999-0025-0002-de04-00000016ddf3",
      "first_name": "Fynn",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 6
  },
  "ffffffff-000a-0000-2e2a-000000062e26": {
    "id": "ffffffff-000a-0000-2e2a-000000062e26",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-002c-0002-3188-0000001b3174",
      "first_name": "Marie",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-000b-0000-cc62-00000006cc5d": {
    "id": "ffffffff-000b-0000-cc62-00000006cc5d",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-002d-0002-cfc0-0000001bcfab",
      "first_name": "Romi",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 10
  },
  "ffffffff-000c-0000-6a99-000000076a94": {
    "id": "ffffffff-000c-0000-6a99-000000076a94",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-0031-0003-489e-0000001e4887",
      "first_name": "Edda",
      "last_name": "Zimmermann"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 7
  },
  "ffffffff-000d-0000-08d1-0000000808cb": {
    "id": "ffffffff-000d-0000-08d1-0000000808cb",
    "event": "aaaaaaaa-0003-0000-daa6-00000001daa5",
    "member": {
      "id": "99999999-0032-0003-e6d5-0000001ee6be",
      "first_name": "Toni",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure."
  },
  "ffffffff-000e-0000-a708-00000008a702": {
    "id": "ffffffff-000e-0000-a708-00000008a702",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0036-0003-5fb3-000000215f9a",
      "first_name": "Vincent",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 9
  },
  "ffffffff-000f-0000-4540-000000094539": {
    "id": "ffffffff-000f-0000-4540-000000094539",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0037-0003-fdeb-00000021fdd1",
      "first_name": "Anton",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-0010-0001-e377-00000009e370": {
    "id": "ffffffff-0010-0001-e377-00000009e370",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003a-0003-d891-00000023d876",
      "first_name": "Joris",
      "last_name": "Stein"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0011-0001-81af-0000000a81a7": {
    "id": "ffffffff-0011-0001-81af-0000000a81a7",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003b-0003-76c9-0000002476ad",
      "first_name": "Frieda",
      "last_name": "Bauer"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-0012-0001-1fe6-0000000b1fde": {
    "id": "ffffffff-0012-0001-1fe6-0000000b1fde",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003d-0003-b337-00000025b31b",
      "first_name": "Fynn",
      "last_name": "Koch"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-20T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 9
  },
  "ffffffff-0013-0001-be1e-0000000bbe15": {
    "id": "ffffffff-0013-0001-be1e-0000000bbe15",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003e-0003-516f-000000265152",
      "first_name": "Marie",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 5
  },
  "ffffffff-0014-0001-5c55-0000000c5c4c": {
    "id": "ffffffff-0014-0001-5c55-0000000c5c4c",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-003f-0003-efa6-00000026ef89",
      "first_name": "Joris",
      "last_name": "Lehmann"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-0015-0001-fa8c-0000000cfa83": {
    "id": "ffffffff-0015-0001-fa8c-0000000cfa83",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0041-0004-2c15-000000282bf7",
      "first_name": "Smilla",
      "last_name": "Krause"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 4
  },
  "ffffffff-0016-0001-98c4-0000000d98ba": {
    "id": "ffffffff-0016-0001-98c4-0000000d98ba",
    "event": "aaaaaaaa-0005-0000-1715-000000031713",
    "member": {
      "id": "99999999-0045-0004-a4f3-0000002aa4d3",
      "first_name": "Mats",
      "last_name": "Graf"
    },
    "creator": {
      "id": "99999999-000b-0000-cc62-00000006cc5d",
      "first_name": "Felix",
      "last_name": "Voigt"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0017-0001-36fb-0000000e36f1": {
    "id": "ffffffff-0017-0001-36fb-0000000e36f1",
    "event": "aaaaaaaa-0007-0000-5384-000000045381",
    "member": {
      "id": "99999999-004a-0004-bc09-0000002dbbe6",
      "first_name": "Liv",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-0018-0001-d533-0000000ed528": {
    "id": "ffffffff-0018-0001-d533-0000000ed528",
    "event": "aaaaaaaa-0007-0000-5384-000000045381",
    "member": {
      "id": "99999999-004b-0004-5a40-0000002e5a1d",
      "first_name": "Vincent",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0019-0001-736a-0000000f735f": {
    "id": "ffffffff-0019-0001-736a-0000000f735f",
    "event": "aaaaaaaa-0007-0000-5384-000000045381",
    "member": {
      "id": "99999999-004c-0004-f878-0000002ef854",
      "first_name": "Tomas",
      "last_name": "Hartmann"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 8
  },
  "ffffffff-001a-0001-11a2-000000101196": {
    "id": "ffffffff-001a-0001-11a2-000000101196",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-004e-0004-34e7-0000003034c2",
      "first_name": "Luca",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-001b-0001-afd9-00000010afcd": {
    "id": "ffffffff-001b-0001-afd9-00000010afcd",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-004f-0004-d31e-00000030d2f9",
      "first_name": "Til",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-001c-0001-4e11-000000114e04": {
    "id": "ffffffff-001c-0001-4e11-000000114e04",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0051-0005-0f8d-000000320f67",
      "first_name": "Paul",
      "last_name": "Busch"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-03T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 10
  },
  "ffffffff-001d-0001-ec48-00000011ec3b": {
    "id": "ffffffff-001d-0001-ec48-00000011ec3b",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0054-0005-ea33-00000033ea0c",
      "first_name": "Marie",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 6
  },
  "ffffffff-001e-0001-8a80-000000128a72": {
    "id": "ffffffff-001e-0001-8a80-000000128a72",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0057-0005-c4da-00000035c4b1",
      "first_name": "Helena",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-001f-0001-28b7-0000001328a9": {
    "id": "ffffffff-001f-0001-28b7-0000001328a9",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-0058-0005-6311-0000003662e8",
      "first_name": "Leon",
      "last_name": "Hartmann"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 3
  },
  "ffffffff-0020-0002-c6ef-00000013c6e0": {
    "id": "ffffffff-0020-0002-c6ef-00000013c6e0",
    "event": "aaaaaaaa-0009-0000-8ff3-000000058fef",
    "member": {
      "id": "99999999-005d-0005-7a27-0000003979fb",
      "first_name": "Jakob",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0008-0000-f1bb-00000004f1b8",
      "first_name": "Theo",
      "last_name": "Albrecht"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0021-0002-6526-000000146517": {
    "id": "ffffffff-0021-0002-6526-000000146517",
    "event": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 9
  },
  "ffffffff-0022-0002-035e-00000015034e": {
    "id": "ffffffff-0022-0002-035e-00000015034e",
    "event": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "99999999-0062-0006-913c-0000003c910e",
      "first_name": "Lotte",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 5
  },
  "ffffffff-0023-0002-a195-00000015a185": {
    "id": "ffffffff-0023-0002-a195-00000015a185",
    "event": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
    "member": {
      "id": "99999999-0065-0006-6be3-0000003e6bb3",
      "first_name": "Frida",
      "last_name": "Werner"
    },
    "creator": {
      "id": "99999999-0006-0000-b54c-00000003b54a",
      "first_name": "Erik",
      "last_name": "Berger"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-0024-0002-3fcd-000000163fbc": {
    "id": "ffffffff-0024-0002-3fcd-000000163fbc",
    "event": "aaaaaaaa-000d-0000-08d1-0000000808cb",
    "member": {
      "id": "99999999-0067-0006-a851-0000003fa821",
      "first_name": "Luca",
      "last_name": "Peters"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine."
  },
  "ffffffff-0025-0002-de04-00000016ddf3": {
    "id": "ffffffff-0025-0002-de04-00000016ddf3",
    "event": "aaaaaaaa-000d-0000-08d1-0000000808cb",
    "member": {
      "id": "99999999-006f-0006-9a0d-0000004499d9",
      "first_name": "Liv",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 0
  },
  "ffffffff-0026-0002-7c3c-000000177c2a": {
    "id": "ffffffff-0026-0002-7c3c-000000177c2a",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0072-0007-74b4-00000046747e",
      "first_name": "Lena",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 7
  },
  "ffffffff-0027-0002-1a73-000000181a61": {
    "id": "ffffffff-0027-0002-1a73-000000181a61",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0075-0007-4f5a-000000484f23",
      "first_name": "Emil",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0028-0002-b8ab-00000018b898": {
    "id": "ffffffff-0028-0002-b8ab-00000018b898",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0076-0007-ed92-00000048ed5a",
      "first_name": "Leon",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 9
  },
  "ffffffff-0029-0002-56e2-0000001956cf": {
    "id": "ffffffff-0029-0002-56e2-0000001956cf",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-0078-0007-2a01-0000004a29c8",
      "first_name": "Oskar",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-002a-0002-f519-00000019f506": {
    "id": "ffffffff-002a-0002-f519-00000019f506",
    "event": "aaaaaaaa-000f-0000-4540-000000094539",
    "member": {
      "id": "99999999-007a-0007-666f-0000004b6636",
      "first_name": "Leon",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-000f-0000-4540-000000094539",
      "first_name": "Mara",
      "last_name": "Koch"
    },
    "created_at": "2026-05-20T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 7
  },
  "ffffffff-002b-0002-9351-0000001a933d": {
    "id": "ffffffff-002b-0002-9351-0000001a933d",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-007f-0007-7d85-0000004e7d49",
      "first_name": "Tilda",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 9
  },
  "ffffffff-002c-0002-3188-0000001b3174": {
    "id": "ffffffff-002c-0002-3188-0000001b3174",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0081-0008-b9f4-0000004fb9b7",
      "first_name": "Leon",
      "last_name": "Busch"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-002d-0002-cfc0-0000001bcfab": {
    "id": "ffffffff-002d-0002-cfc0-0000001bcfab",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0084-0008-949a-00000051945c",
      "first_name": "Juna",
      "last_name": "Reil"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-002e-0002-6df7-0000001c6de2": {
    "id": "ffffffff-002e-0002-6df7-0000001c6de2",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0085-0008-32d2-000000523293",
      "first_name": "Juna",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-002f-0002-0c2f-0000001d0c19": {
    "id": "ffffffff-002f-0002-0c2f-0000001d0c19",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0087-0008-6f41-000000536f01",
      "first_name": "Sofia",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-17T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0030-0003-aa66-0000001daa50": {
    "id": "ffffffff-0030-0003-aa66-0000001daa50",
    "event": "aaaaaaaa-0011-0001-81af-0000000a81a7",
    "member": {
      "id": "99999999-0088-0008-0d78-000000540d38",
      "first_name": "Samuel",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 9
  },
  "ffffffff-0031-0003-489e-0000001e4887": {
    "id": "ffffffff-0031-0003-489e-0000001e4887",
    "event": "aaaaaaaa-0013-0001-be1e-0000000bbe15",
    "member": {
      "id": "99999999-008c-0008-8656-000000568614",
      "first_name": "Moritz",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 6
  },
  "ffffffff-0032-0003-e6d5-0000001ee6be": {
    "id": "ffffffff-0032-0003-e6d5-0000001ee6be",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0093-0009-d9da-0000005ad995",
      "first_name": "Finn",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-07T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-0033-0003-850d-0000001f84f5": {
    "id": "ffffffff-0033-0003-850d-0000001f84f5",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0095-0009-1649-0000005c1603",
      "first_name": "Lea",
      "last_name": "Park"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 10
  },
  "ffffffff-0034-0003-2344-00000020232c": {
    "id": "ffffffff-0034-0003-2344-00000020232c",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-0098-0009-f0f0-0000005df0a8",
      "first_name": "Aaron",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-0035-0003-c17c-00000020c163": {
    "id": "ffffffff-0035-0003-c17c-00000020c163",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-009d-0009-0805-0000006107bb",
      "first_name": "Lena",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-0036-0003-5fb3-000000215f9a": {
    "id": "ffffffff-0036-0003-5fb3-000000215f9a",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-009e-0009-a63d-00000061a5f2",
      "first_name": "Joris",
      "last_name": "Schulz"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0037-0003-fdeb-00000021fdd1": {
    "id": "ffffffff-0037-0003-fdeb-00000021fdd1",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-00a1-000a-80e3-000000638097",
      "first_name": "Amelie",
      "last_name": "Lange"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 8
  },
  "ffffffff-0038-0003-9c22-000000229c08": {
    "id": "ffffffff-0038-0003-9c22-000000229c08",
    "event": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
    "member": {
      "id": "99999999-00a2-000a-1f1b-000000641ece",
      "first_name": "Jonas",
      "last_name": "Nowak"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-0039-0003-3a5a-000000233a3f": {
    "id": "ffffffff-0039-0003-3a5a-000000233a3f",
    "event": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
    "member": {
      "id": "99999999-00a7-000a-3630-0000006735e1",
      "first_name": "Carla",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 7
  },
  "ffffffff-003a-0003-d891-00000023d876": {
    "id": "ffffffff-003a-0003-d891-00000023d876",
    "event": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
    "member": {
      "id": "99999999-00aa-000a-10d6-000000691086",
      "first_name": "Bela",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 9
  },
  "ffffffff-003b-0003-76c9-0000002476ad": {
    "id": "ffffffff-003b-0003-76c9-0000002476ad",
    "event": "aaaaaaaa-0019-0001-736a-0000000f735f",
    "member": {
      "id": "99999999-00ae-000a-89b4-0000006b8962",
      "first_name": "Jonah",
      "last_name": "König"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today."
  },
  "ffffffff-003c-0003-1500-0000002514e4": {
    "id": "ffffffff-003c-0003-1500-0000002514e4",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00b6-000b-7b70-000000707b1a",
      "first_name": "Finn",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-003d-0003-b337-00000025b31b": {
    "id": "ffffffff-003d-0003-b337-00000025b31b",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00b9-000b-5616-0000007255bf",
      "first_name": "Frida",
      "last_name": "Brandt"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 4
  },
  "ffffffff-003e-0003-516f-000000265152": {
    "id": "ffffffff-003e-0003-516f-000000265152",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00bb-000b-9285-00000073922d",
      "first_name": "Sofia",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 7
  },
  "ffffffff-003f-0003-efa6-00000026ef89": {
    "id": "ffffffff-003f-0003-efa6-00000026ef89",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00bc-000b-30bd-000000743064",
      "first_name": "Jonah",
      "last_name": "Park"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 6
  },
  "ffffffff-0040-0004-8dde-000000278dc0": {
    "id": "ffffffff-0040-0004-8dde-000000278dc0",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00be-000b-6d2c-000000756cd2",
      "first_name": "Emil",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0041-0004-2c15-000000282bf7": {
    "id": "ffffffff-0041-0004-2c15-000000282bf7",
    "event": "aaaaaaaa-001b-0001-afd9-00000010afcd",
    "member": {
      "id": "99999999-00bf-000b-0b63-000000760b09",
      "first_name": "David",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-06-14T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 8
  },
  "ffffffff-0042-0004-ca4d-00000028ca2e": {
    "id": "ffffffff-0042-0004-ca4d-00000028ca2e",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c1-000c-47d2-000000774777",
      "first_name": "Emil",
      "last_name": "Schwarz"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-0043-0004-6884-000000296865": {
    "id": "ffffffff-0043-0004-6884-000000296865",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c3-000c-8441-0000007883e5",
      "first_name": "Rosa",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 7
  },
  "ffffffff-0044-0004-06bc-0000002a069c": {
    "id": "ffffffff-0044-0004-06bc-0000002a069c",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c4-000c-2279-00000079221c",
      "first_name": "Frida",
      "last_name": "Neumann"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-07T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 10
  },
  "ffffffff-0045-0004-a4f3-0000002aa4d3": {
    "id": "ffffffff-0045-0004-a4f3-0000002aa4d3",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c6-000c-5ee8-0000007a5e8a",
      "first_name": "Edda",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0046-0004-432b-0000002b430a": {
    "id": "ffffffff-0046-0004-432b-0000002b430a",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00c8-000c-9b57-0000007b9af8",
      "first_name": "Emil",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-0047-0004-e162-0000002be141": {
    "id": "ffffffff-0047-0004-e162-0000002be141",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00cf-000c-eedb-0000007fee79",
      "first_name": "Toni",
      "last_name": "Krause"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 3
  },
  "ffffffff-0048-0004-7f9a-0000002c7f78": {
    "id": "ffffffff-0048-0004-7f9a-0000002c7f78",
    "event": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
    "member": {
      "id": "99999999-00d0-000d-8d12-000000808cb0",
      "first_name": "Lotte",
      "last_name": "Richter"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 7
  },
  "ffffffff-0049-0004-1dd1-0000002d1daf": {
    "id": "ffffffff-0049-0004-1dd1-0000002d1daf",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d1-000d-2b4a-000000812ae7",
      "first_name": "Lotte",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 9
  },
  "ffffffff-004a-0004-bc09-0000002dbbe6": {
    "id": "ffffffff-004a-0004-bc09-0000002dbbe6",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d2-000d-c981-00000081c91e",
      "first_name": "Mara",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-004b-0004-5a40-0000002e5a1d": {
    "id": "ffffffff-004b-0004-5a40-0000002e5a1d",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d3-000d-67b9-000000826755",
      "first_name": "Ella",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-004c-0004-f878-0000002ef854": {
    "id": "ffffffff-004c-0004-f878-0000002ef854",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d6-000d-425f-0000008441fa",
      "first_name": "Nele",
      "last_name": "Scholz"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-14T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-004d-0004-96af-0000002f968b": {
    "id": "ffffffff-004d-0004-96af-0000002f968b",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00d7-000d-e097-00000084e031",
      "first_name": "Oskar",
      "last_name": "Stein"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 0
  },
  "ffffffff-004e-0004-34e7-0000003034c2": {
    "id": "ffffffff-004e-0004-34e7-0000003034c2",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00db-000d-5975-00000087590d",
      "first_name": "Ida",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 7
  },
  "ffffffff-004f-0004-d31e-00000030d2f9": {
    "id": "ffffffff-004f-0004-d31e-00000030d2f9",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00dc-000d-f7ac-00000087f744",
      "first_name": "Levi",
      "last_name": "Beck"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-0050-0005-7156-000000317130": {
    "id": "ffffffff-0050-0005-7156-000000317130",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00df-000d-d253-00000089d1e9",
      "first_name": "Toni",
      "last_name": "Seidel"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 9
  },
  "ffffffff-0051-0005-0f8d-000000320f67": {
    "id": "ffffffff-0051-0005-0f8d-000000320f67",
    "event": "aaaaaaaa-001f-0001-28b7-0000001328a9",
    "member": {
      "id": "99999999-00e0-000e-708a-0000008a7020",
      "first_name": "Nele",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0052-0005-adc4-00000032ad9e": {
    "id": "ffffffff-0052-0005-adc4-00000032ad9e",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00e8-000e-6246-0000008f61d8",
      "first_name": "Lea",
      "last_name": "Stein"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure."
  },
  "ffffffff-0053-0005-4bfc-000000334bd5": {
    "id": "ffffffff-0053-0005-4bfc-000000334bd5",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00ed-000e-795b-0000009278eb",
      "first_name": "Mats",
      "last_name": "Horn"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-24T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 9
  },
  "ffffffff-0054-0005-ea33-00000033ea0c": {
    "id": "ffffffff-0054-0005-ea33-00000033ea0c",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00ee-000e-1793-000000931722",
      "first_name": "Lina",
      "last_name": "Krüger"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-0055-0005-886b-000000348843": {
    "id": "ffffffff-0055-0005-886b-000000348843",
    "event": "aaaaaaaa-0021-0002-6526-000000146517",
    "member": {
      "id": "99999999-00f4-000f-ccdf-00000096cc6c",
      "first_name": "Stella",
      "last_name": "Frank"
    },
    "creator": {
      "id": "99999999-0010-0001-e377-00000009e370",
      "first_name": "Wilma",
      "last_name": "Vogt"
    },
    "created_at": "2026-05-20T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 8
  },
  "ffffffff-0056-0005-26a2-00000035267a": {
    "id": "ffffffff-0056-0005-26a2-00000035267a",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00f9-000f-e3f5-00000099e37f",
      "first_name": "Joris",
      "last_name": "Huber"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-29T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-0057-0005-c4da-00000035c4b1": {
    "id": "ffffffff-0057-0005-c4da-00000035c4b1",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fa-000f-822c-0000009a81b6",
      "first_name": "Mara",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-0058-0005-6311-0000003662e8": {
    "id": "ffffffff-0058-0005-6311-0000003662e8",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fb-000f-2064-0000009b1fed",
      "first_name": "Martha",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0059-0005-0149-00000037011f": {
    "id": "ffffffff-0059-0005-0149-00000037011f",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fc-000f-be9b-0000009bbe24",
      "first_name": "Mats",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-14T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 6
  },
  "ffffffff-005a-0005-9f80-000000379f56": {
    "id": "ffffffff-005a-0005-9f80-000000379f56",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-00fe-000f-fb0a-0000009cfa92",
      "first_name": "Erik",
      "last_name": "Schulz"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 8
  },
  "ffffffff-005b-0005-3db8-000000383d8d": {
    "id": "ffffffff-005b-0005-3db8-000000383d8d",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0101-0010-d5b1-0000009ed537",
      "first_name": "Clara",
      "last_name": "Pohl"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 10
  },
  "ffffffff-005c-0005-dbef-00000038dbc4": {
    "id": "ffffffff-005c-0005-dbef-00000038dbc4",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0102-0010-73e8-0000009f736e",
      "first_name": "Niklas",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-005d-0005-7a27-0000003979fb": {
    "id": "ffffffff-005d-0005-7a27-0000003979fb",
    "event": "aaaaaaaa-0023-0002-a195-00000015a185",
    "member": {
      "id": "99999999-0106-0010-ecc6-000000a1ec4a",
      "first_name": "Nele",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-005e-0005-185e-0000003a1832": {
    "id": "ffffffff-005e-0005-185e-0000003a1832",
    "event": "aaaaaaaa-0025-0002-de04-00000016ddf3",
    "member": {
      "id": "99999999-010e-0010-de82-000000a6de02",
      "first_name": "Magda",
      "last_name": "Bauer"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 9
  },
  "ffffffff-005f-0005-b696-0000003ab669": {
    "id": "ffffffff-005f-0005-b696-0000003ab669",
    "event": "aaaaaaaa-0025-0002-de04-00000016ddf3",
    "member": {
      "id": "99999999-0110-0011-1af1-000000a81a70",
      "first_name": "Mira",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000a-0000-2e2a-000000062e26",
      "first_name": "Ella",
      "last_name": "Frank"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0060-0006-54cd-0000003b54a0": {
    "id": "ffffffff-0060-0006-54cd-0000003b54a0",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0112-0011-5760-000000a956de",
      "first_name": "Paul",
      "last_name": "Reil"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0061-0006-f305-0000003bf2d7": {
    "id": "ffffffff-0061-0006-f305-0000003bf2d7",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0116-0011-d03e-000000abcfba",
      "first_name": "Pia",
      "last_name": "Zimmermann"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 7
  },
  "ffffffff-0062-0006-913c-0000003c910e": {
    "id": "ffffffff-0062-0006-913c-0000003c910e",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0118-0011-0cad-000000ad0c28",
      "first_name": "Joris",
      "last_name": "Arnold"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-07T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0063-0006-2f74-0000003d2f45": {
    "id": "ffffffff-0063-0006-2f74-0000003d2f45",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011a-0011-491c-000000ae4896",
      "first_name": "Jonah",
      "last_name": "Diaz"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-0064-0006-cdab-0000003dcd7c": {
    "id": "ffffffff-0064-0006-cdab-0000003dcd7c",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011b-0011-e753-000000aee6cd",
      "first_name": "Mats",
      "last_name": "Fuchs"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-0065-0006-6be3-0000003e6bb3": {
    "id": "ffffffff-0065-0006-6be3-0000003e6bb3",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011d-0011-23c2-000000b0233b",
      "first_name": "Janne",
      "last_name": "Vogel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 4
  },
  "ffffffff-0066-0006-0a1a-0000003f09ea": {
    "id": "ffffffff-0066-0006-0a1a-0000003f09ea",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-011e-0011-c1f9-000000b0c172",
      "first_name": "Amelie",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0067-0006-a851-0000003fa821": {
    "id": "ffffffff-0067-0006-a851-0000003fa821",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0120-0012-fe68-000000b1fde0",
      "first_name": "Lea",
      "last_name": "Engel"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0068-0006-4689-000000404658": {
    "id": "ffffffff-0068-0006-4689-000000404658",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0121-0012-9ca0-000000b29c17",
      "first_name": "Stella",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-05-24T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 9
  },
  "ffffffff-0069-0006-e4c0-00000040e48f": {
    "id": "ffffffff-0069-0006-e4c0-00000040e48f",
    "event": "aaaaaaaa-0027-0002-1a73-000000181a61",
    "member": {
      "id": "99999999-0122-0012-3ad7-000000b33a4e",
      "first_name": "Helena",
      "last_name": "König"
    },
    "creator": {
      "id": "99999999-0007-0000-5384-000000045381",
      "first_name": "Lina",
      "last_name": "Zimmermann"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine."
  },
  "ffffffff-006a-0006-82f8-0000004182c6": {
    "id": "ffffffff-006a-0006-82f8-0000004182c6",
    "event": "aaaaaaaa-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-012b-0012-cacb-000000b8ca3d",
      "first_name": "Noah",
      "last_name": "Schulz"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-006b-0006-212f-0000004220fd": {
    "id": "ffffffff-006b-0006-212f-0000004220fd",
    "event": "aaaaaaaa-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-012f-0012-43a9-000000bb4319",
      "first_name": "Nora",
      "last_name": "Bauer"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-006c-0006-bf67-00000042bf34": {
    "id": "ffffffff-006c-0006-bf67-00000042bf34",
    "event": "aaaaaaaa-0029-0002-56e2-0000001956cf",
    "member": {
      "id": "99999999-0130-0013-e1e0-000000bbe150",
      "first_name": "Luca",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-0011-0001-81af-0000000a81a7",
      "first_name": "Niklas",
      "last_name": "Engel"
    },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 10
  },
  "ffffffff-006d-0006-5d9e-000000435d6b": {
    "id": "ffffffff-006d-0006-5d9e-000000435d6b",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0131-0013-8017-000000bc7f87",
      "first_name": "Ada",
      "last_name": "Kaiser"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 6
  },
  "ffffffff-006e-0006-fbd6-00000043fba2": {
    "id": "ffffffff-006e-0006-fbd6-00000043fba2",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0133-0013-bc86-000000bdbbf5",
      "first_name": "Max",
      "last_name": "Ziegler"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-09T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-006f-0006-9a0d-0000004499d9": {
    "id": "ffffffff-006f-0006-9a0d-0000004499d9",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0135-0013-f8f5-000000bef863",
      "first_name": "Romi",
      "last_name": "Vogt"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 3
  },
  "ffffffff-0070-0007-3845-000000453810": {
    "id": "ffffffff-0070-0007-3845-000000453810",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0136-0013-972d-000000bf969a",
      "first_name": "Moritz",
      "last_name": "Albrecht"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0071-0007-d67c-00000045d647": {
    "id": "ffffffff-0071-0007-d67c-00000045d647",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-013d-0013-eab1-000000c3ea1b",
      "first_name": "Alma",
      "last_name": "Klein"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 9
  },
  "ffffffff-0072-0007-74b4-00000046747e": {
    "id": "ffffffff-0072-0007-74b4-00000046747e",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0140-0014-c558-000000c5c4c0",
      "first_name": "Mats",
      "last_name": "Hartmann"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-0073-0007-12eb-0000004712b5": {
    "id": "ffffffff-0073-0007-12eb-0000004712b5",
    "event": "aaaaaaaa-002b-0002-9351-0000001a933d",
    "member": {
      "id": "99999999-0142-0014-01c7-000000c7012e",
      "first_name": "Anton",
      "last_name": "Braun"
    },
    "creator": {
      "id": "99999999-0009-0000-8ff3-000000058fef",
      "first_name": "Magda",
      "last_name": "Huber"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-0074-0007-b123-00000047b0ec": {
    "id": "ffffffff-0074-0007-b123-00000047b0ec",
    "event": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
    "member": {
      "id": "99999999-014b-0014-91ba-000000cc911d",
      "first_name": "Konrad",
      "last_name": "Sommer"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 6
  },
  "ffffffff-0075-0007-4f5a-000000484f23": {
    "id": "ffffffff-0075-0007-4f5a-000000484f23",
    "event": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
    "member": {
      "id": "99999999-014c-0014-2ff1-000000cd2f54",
      "first_name": "Elias",
      "last_name": "Wolf"
    },
    "creator": {
      "id": "99999999-000e-0000-a708-00000008a702",
      "first_name": "Smilla",
      "last_name": "Frank"
    },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 0
  },
  "ffffffff-0076-0007-ed92-00000048ed5a": {
    "id": "ffffffff-0076-0007-ed92-00000048ed5a",
    "event": "aaaaaaaa-0031-0003-489e-0000001e4887",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 7
  },
  "ffffffff-0077-0007-8bc9-000000498b91": {
    "id": "ffffffff-0077-0007-8bc9-000000498b91",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-0078-0007-2a01-0000004a29c8": {
    "id": "ffffffff-0078-0007-2a01-0000004a29c8",
    "event": "aaaaaaaa-0001-0000-9e37-000000009e37",
    "member": {
      "id": "11111111-1111-1111-1111-111111111111",
      "first_name": "Lena",
      "last_name": "Roth"
    },
    "creator": {
      "id": "99999999-000d-0000-08d1-0000000808cb",
      "first_name": "Coach",
      "last_name": "Devoops"
    },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 9
  }
}
