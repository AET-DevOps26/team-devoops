import type { Feedback, FeedbackSummary } from '@/types'

// Summary rows (no body text); full text lives on feedbackDetailsById. Every entry is rated (0–10, PR #99).
export const feedbackSummaryFixtures: FeedbackSummary[] = [
  {
    "id": "ffffffff-0001-0000-9e37-000000009e37",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0015-0001-fa8c-0000000cfa83", name: "Linus Beck" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0002-0000-3c6e-000000013c6e",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0016-0001-98c4-0000000d98ba", name: "Clara Frank" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0003-0000-daa6-00000001daa5",
    "event": {
      "id": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
      "name": "Football Juniors Match"
    },
    "member": { id: "99999999-0019-0001-736a-0000000f735f", name: "Charlotte Wagner" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0004-0000-78dd-0000000278dc",
    "event": {
      "id": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
      "name": "Football Juniors Match"
    },
    "member": { id: "99999999-001a-0001-11a2-000000101196", name: "Jakob Seidel" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0005-0000-1715-000000031713",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-001d-0001-ec48-00000011ec3b", name: "Janne Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0006-0000-b54c-00000003b54a",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-001e-0001-8a80-000000128a72", name: "Theo Diaz" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-03T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0007-0000-5384-000000045381",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-001f-0001-28b7-0000001328a9", name: "Samuel Neumann" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0008-0000-f1bb-00000004f1b8",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0020-0002-c6ef-00000013c6e0", name: "Levi Voigt" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0009-0000-8ff3-000000058fef",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0025-0002-de04-00000016ddf3", name: "Fynn Vogt" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-000a-0000-2e2a-000000062e26",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-002c-0002-3188-0000001b3174", name: "Marie Vogel" },
    "creator": null,
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-000b-0000-cc62-00000006cc5d",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-002d-0002-cfc0-0000001bcfab", name: "Romi Werner" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-000c-0000-6a99-000000076a94",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-0031-0003-489e-0000001e4887", name: "Edda Zimmermann" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-000d-0000-08d1-0000000808cb",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-0032-0003-e6d5-0000001ee6be", name: "Toni Brandt" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-000e-0000-a708-00000008a702",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0036-0003-5fb3-000000215f9a", name: "Vincent Richter" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-000f-0000-4540-000000094539",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0037-0003-fdeb-00000021fdd1", name: "Anton Frank" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0010-0001-e377-00000009e370",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003a-0003-d891-00000023d876", name: "Joris Stein" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0011-0001-81af-0000000a81a7",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003b-0003-76c9-0000002476ad", name: "Frieda Bauer" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0012-0001-1fe6-0000000b1fde",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003d-0003-b337-00000025b31b", name: "Fynn Koch" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-20T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0013-0001-be1e-0000000bbe15",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003e-0003-516f-000000265152", name: "Marie Fuchs" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0014-0001-5c55-0000000c5c4c",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003f-0003-efa6-00000026ef89", name: "Joris Lehmann" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0015-0001-fa8c-0000000cfa83",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0041-0004-2c15-000000282bf7", name: "Smilla Krause" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 4
  },
  {
    "id": "ffffffff-0016-0001-98c4-0000000d98ba",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0045-0004-a4f3-0000002aa4d3", name: "Mats Graf" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0017-0001-36fb-0000000e36f1",
    "event": {
      "id": "aaaaaaaa-0007-0000-5384-000000045381",
      "name": "Football Seniors Training"
    },
    "member": { id: "99999999-004a-0004-bc09-0000002dbbe6", name: "Liv Sommer" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0018-0001-d533-0000000ed528",
    "event": {
      "id": "aaaaaaaa-0007-0000-5384-000000045381",
      "name": "Football Seniors Training"
    },
    "member": { id: "99999999-004b-0004-5a40-0000002e5a1d", name: "Vincent Vogt" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0019-0001-736a-0000000f735f",
    "event": {
      "id": "aaaaaaaa-0007-0000-5384-000000045381",
      "name": "Football Seniors Training"
    },
    "member": { id: "99999999-004c-0004-f878-0000002ef854", name: "Tomas Hartmann" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-001a-0001-11a2-000000101196",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-004e-0004-34e7-0000003034c2", name: "Luca Ziegler" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-001b-0001-afd9-00000010afcd",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-004f-0004-d31e-00000030d2f9", name: "Til Sommer" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-001c-0001-4e11-000000114e04",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0051-0005-0f8d-000000320f67", name: "Paul Busch" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-03T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-001d-0001-ec48-00000011ec3b",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0054-0005-ea33-00000033ea0c", name: "Marie Pohl" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-001e-0001-8a80-000000128a72",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0057-0005-c4da-00000035c4b1", name: "Helena Neumann" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-001f-0001-28b7-0000001328a9",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0058-0005-6311-0000003662e8", name: "Leon Hartmann" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 3
  },
  {
    "id": "ffffffff-0020-0002-c6ef-00000013c6e0",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-005d-0005-7a27-0000003979fb", name: "Jakob Klein" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0021-0002-6526-000000146517",
    "event": {
      "id": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
      "name": "Basketball Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0022-0002-035e-00000015034e",
    "event": {
      "id": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
      "name": "Basketball Juniors Open Session"
    },
    "member": { id: "99999999-0062-0006-913c-0000003c910e", name: "Lotte Albrecht" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0023-0002-a195-00000015a185",
    "event": {
      "id": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
      "name": "Basketball Juniors Open Session"
    },
    "member": { id: "99999999-0065-0006-6be3-0000003e6bb3", name: "Frida Werner" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0024-0002-3fcd-000000163fbc",
    "event": {
      "id": "aaaaaaaa-000d-0000-08d1-0000000808cb",
      "name": "Basketball U14 Tournament"
    },
    "member": { id: "99999999-0067-0006-a851-0000003fa821", name: "Luca Peters" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0025-0002-de04-00000016ddf3",
    "event": {
      "id": "aaaaaaaa-000d-0000-08d1-0000000808cb",
      "name": "Basketball U14 Tournament"
    },
    "member": { id: "99999999-006f-0006-9a0d-0000004499d9", name: "Liv Brandt" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 0
  },
  {
    "id": "ffffffff-0026-0002-7c3c-000000177c2a",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0072-0007-74b4-00000046747e", name: "Lena Pohl" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0027-0002-1a73-000000181a61",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0075-0007-4f5a-000000484f23", name: "Emil Kaiser" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0028-0002-b8ab-00000018b898",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0076-0007-ed92-00000048ed5a", name: "Leon Diaz" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0029-0002-56e2-0000001956cf",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0078-0007-2a01-0000004a29c8", name: "Oskar Nowak" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-002a-0002-f519-00000019f506",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-007a-0007-666f-0000004b6636", name: "Leon Neumann" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-05-20T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-002b-0002-9351-0000001a933d",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-007f-0007-7d85-0000004e7d49", name: "Tilda Neumann" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-002c-0002-3188-0000001b3174",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0081-0008-b9f4-0000004fb9b7", name: "Leon Busch" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-002d-0002-cfc0-0000001bcfab",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0084-0008-949a-00000051945c", name: "Juna Reil" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-002e-0002-6df7-0000001c6de2",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0085-0008-32d2-000000523293", name: "Juna Braun" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-002f-0002-0c2f-0000001d0c19",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0087-0008-6f41-000000536f01", name: "Sofia Brandt" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-17T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0030-0003-aa66-0000001daa50",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0088-0008-0d78-000000540d38", name: "Samuel Vogel" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0031-0003-489e-0000001e4887",
    "event": {
      "id": "aaaaaaaa-0013-0001-be1e-0000000bbe15",
      "name": "Swimming Juniors Open Session"
    },
    "member": { id: "99999999-008c-0008-8656-000000568614", name: "Moritz Wolf" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0032-0003-e6d5-0000001ee6be",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-0093-0009-d9da-0000005ad995", name: "Finn Vogel" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-07T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0033-0003-850d-0000001f84f5",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-0095-0009-1649-0000005c1603", name: "Lea Park" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-0034-0003-2344-00000020232c",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-0098-0009-f0f0-0000005df0a8", name: "Aaron Sommer" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0035-0003-c17c-00000020c163",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-009d-0009-0805-0000006107bb", name: "Lena Kaiser" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0036-0003-5fb3-000000215f9a",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-009e-0009-a63d-00000061a5f2", name: "Joris Schulz" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0037-0003-fdeb-00000021fdd1",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-00a1-000a-80e3-000000638097", name: "Amelie Lange" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0038-0003-9c22-000000229c08",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-00a2-000a-1f1b-000000641ece", name: "Jonas Nowak" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0039-0003-3a5a-000000233a3f",
    "event": {
      "id": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
      "name": "Swimming Group B Time Trial"
    },
    "member": { id: "99999999-00a7-000a-3630-0000006735e1", name: "Carla Arnold" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-003a-0003-d891-00000023d876",
    "event": {
      "id": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
      "name": "Swimming Group B Time Trial"
    },
    "member": { id: "99999999-00aa-000a-10d6-000000691086", name: "Bela Klein" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-003b-0003-76c9-0000002476ad",
    "event": {
      "id": "aaaaaaaa-0019-0001-736a-0000000f735f",
      "name": "Swimming Seniors Open Session"
    },
    "member": { id: "99999999-00ae-000a-89b4-0000006b8962", name: "Jonah König" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-003c-0003-1500-0000002514e4",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00b6-000b-7b70-000000707b1a", name: "Finn Neumann" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-003d-0003-b337-00000025b31b",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00b9-000b-5616-0000007255bf", name: "Frida Brandt" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 4
  },
  {
    "id": "ffffffff-003e-0003-516f-000000265152",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00bb-000b-9285-00000073922d", name: "Sofia Pohl" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-003f-0003-efa6-00000026ef89",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00bc-000b-30bd-000000743064", name: "Jonah Park" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0040-0004-8dde-000000278dc0",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00be-000b-6d2c-000000756cd2", name: "Emil Diaz" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0041-0004-2c15-000000282bf7",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00bf-000b-0b63-000000760b09", name: "David Braun" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-14T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0042-0004-ca4d-00000028ca2e",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c1-000c-47d2-000000774777", name: "Emil Schwarz" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0043-0004-6884-000000296865",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c3-000c-8441-0000007883e5", name: "Rosa Frank" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0044-0004-06bc-0000002a069c",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c4-000c-2279-00000079221c", name: "Frida Neumann" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-07T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-0045-0004-a4f3-0000002aa4d3",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c6-000c-5ee8-0000007a5e8a", name: "Edda Vogt" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0046-0004-432b-0000002b430a",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c8-000c-9b57-0000007b9af8", name: "Emil Klein" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0047-0004-e162-0000002be141",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00cf-000c-eedb-0000007fee79", name: "Toni Krause" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-02T00:00:00.000Z",
    "rating": 3
  },
  {
    "id": "ffffffff-0048-0004-7f9a-0000002c7f78",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00d0-000d-8d12-000000808cb0", name: "Lotte Richter" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0049-0004-1dd1-0000002d1daf",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d1-000d-2b4a-000000812ae7", name: "Lotte Frank" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-004a-0004-bc09-0000002dbbe6",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d2-000d-c981-00000081c91e", name: "Mara Seidel" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-004b-0004-5a40-0000002e5a1d",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d3-000d-67b9-000000826755", name: "Ella Pohl" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-004c-0004-f878-0000002ef854",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d6-000d-425f-0000008441fa", name: "Nele Scholz" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-14T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-004d-0004-96af-0000002f968b",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d7-000d-e097-00000084e031", name: "Oskar Stein" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 0
  },
  {
    "id": "ffffffff-004e-0004-34e7-0000003034c2",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00db-000d-5975-00000087590d", name: "Ida Vogel" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-004f-0004-d31e-00000030d2f9",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00dc-000d-f7ac-00000087f744", name: "Levi Beck" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0050-0005-7156-000000317130",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00df-000d-d253-00000089d1e9", name: "Toni Seidel" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0051-0005-0f8d-000000320f67",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00e0-000e-708a-0000008a7020", name: "Nele Braun" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0052-0005-adc4-00000032ad9e",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00e8-000e-6246-0000008f61d8", name: "Lea Stein" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0053-0005-4bfc-000000334bd5",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00ed-000e-795b-0000009278eb", name: "Mats Horn" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-24T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0054-0005-ea33-00000033ea0c",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00ee-000e-1793-000000931722", name: "Lina Krüger" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0055-0005-886b-000000348843",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00f4-000f-ccdf-00000096cc6c", name: "Stella Frank" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-20T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0056-0005-26a2-00000035267a",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00f9-000f-e3f5-00000099e37f", name: "Joris Huber" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-29T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0057-0005-c4da-00000035c4b1",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fa-000f-822c-0000009a81b6", name: "Mara Vogel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0058-0005-6311-0000003662e8",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fb-000f-2064-0000009b1fed", name: "Martha Vogel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0059-0005-0149-00000037011f",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fc-000f-be9b-0000009bbe24", name: "Mats Kaiser" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-14T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-005a-0005-9f80-000000379f56",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fe-000f-fb0a-0000009cfa92", name: "Erik Schulz" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-005b-0005-3db8-000000383d8d",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-0101-0010-d5b1-0000009ed537", name: "Clara Pohl" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-005c-0005-dbef-00000038dbc4",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-0102-0010-73e8-0000009f736e", name: "Niklas Fuchs" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-005d-0005-7a27-0000003979fb",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-0106-0010-ecc6-000000a1ec4a", name: "Nele Kaiser" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-005e-0005-185e-0000003a1832",
    "event": {
      "id": "aaaaaaaa-0025-0002-de04-00000016ddf3",
      "name": "Volleyball Juniors Time Trial"
    },
    "member": { id: "99999999-010e-0010-de82-000000a6de02", name: "Magda Bauer" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-005f-0005-b696-0000003ab669",
    "event": {
      "id": "aaaaaaaa-0025-0002-de04-00000016ddf3",
      "name": "Volleyball Juniors Time Trial"
    },
    "member": { id: "99999999-0110-0011-1af1-000000a81a70", name: "Mira Roth" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0060-0006-54cd-0000003b54a0",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0112-0011-5760-000000a956de", name: "Paul Reil" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0061-0006-f305-0000003bf2d7",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0116-0011-d03e-000000abcfba", name: "Pia Zimmermann" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0062-0006-913c-0000003c910e",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0118-0011-0cad-000000ad0c28", name: "Joris Arnold" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-07T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0063-0006-2f74-0000003d2f45",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011a-0011-491c-000000ae4896", name: "Jonah Diaz" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0064-0006-cdab-0000003dcd7c",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011b-0011-e753-000000aee6cd", name: "Mats Fuchs" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0065-0006-6be3-0000003e6bb3",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011d-0011-23c2-000000b0233b", name: "Janne Vogel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 4
  },
  {
    "id": "ffffffff-0066-0006-0a1a-0000003f09ea",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011e-0011-c1f9-000000b0c172", name: "Amelie Wolf" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0067-0006-a851-0000003fa821",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0120-0012-fe68-000000b1fde0", name: "Lea Engel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0068-0006-4689-000000404658",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0121-0012-9ca0-000000b29c17", name: "Stella Braun" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-24T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0069-0006-e4c0-00000040e48f",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0122-0012-3ad7-000000b33a4e", name: "Helena König" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-006a-0006-82f8-0000004182c6",
    "event": {
      "id": "aaaaaaaa-0029-0002-56e2-0000001956cf",
      "name": "Volleyball Squad 2 Match"
    },
    "member": { id: "99999999-012b-0012-cacb-000000b8ca3d", name: "Noah Schulz" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-006b-0006-212f-0000004220fd",
    "event": {
      "id": "aaaaaaaa-0029-0002-56e2-0000001956cf",
      "name": "Volleyball Squad 2 Match"
    },
    "member": { id: "99999999-012f-0012-43a9-000000bb4319", name: "Nora Bauer" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-006c-0006-bf67-00000042bf34",
    "event": {
      "id": "aaaaaaaa-0029-0002-56e2-0000001956cf",
      "name": "Volleyball Squad 2 Match"
    },
    "member": { id: "99999999-0130-0013-e1e0-000000bbe150", name: "Luca Wolf" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "rating": 10
  },
  {
    "id": "ffffffff-006d-0006-5d9e-000000435d6b",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0131-0013-8017-000000bc7f87", name: "Ada Kaiser" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-006e-0006-fbd6-00000043fba2",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0133-0013-bc86-000000bdbbf5", name: "Max Ziegler" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-09T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-006f-0006-9a0d-0000004499d9",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0135-0013-f8f5-000000bef863", name: "Romi Vogt" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 3
  },
  {
    "id": "ffffffff-0070-0007-3845-000000453810",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0136-0013-972d-000000bf969a", name: "Moritz Albrecht" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0071-0007-d67c-00000045d647",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-013d-0013-eab1-000000c3ea1b", name: "Alma Klein" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 9
  },
  {
    "id": "ffffffff-0072-0007-74b4-00000046747e",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0140-0014-c558-000000c5c4c0", name: "Mats Hartmann" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "rating": 5
  },
  {
    "id": "ffffffff-0073-0007-12eb-0000004712b5",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0142-0014-01c7-000000c7012e", name: "Anton Braun" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0074-0007-b123-00000047b0ec",
    "event": {
      "id": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
      "name": "Volleyball Varsity Open Session"
    },
    "member": { id: "99999999-014b-0014-91ba-000000cc911d", name: "Konrad Sommer" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "rating": 6
  },
  {
    "id": "ffffffff-0075-0007-4f5a-000000484f23",
    "event": {
      "id": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
      "name": "Volleyball Varsity Open Session"
    },
    "member": { id: "99999999-014c-0014-2ff1-000000cd2f54", name: "Elias Wolf" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "rating": 0
  },
  {
    "id": "ffffffff-0076-0007-ed92-00000048ed5a",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "rating": 7
  },
  {
    "id": "ffffffff-0077-0007-8bc9-000000498b91",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "rating": 8
  },
  {
    "id": "ffffffff-0078-0007-2a01-0000004a29c8",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "rating": 9
  }
]

export const feedbackDetailsById: Record<string, Feedback> = {
  "ffffffff-0001-0000-9e37-000000009e37": {
    "id": "ffffffff-0001-0000-9e37-000000009e37",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0015-0001-fa8c-0000000cfa83", name: "Linus Beck" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0002-0000-3c6e-000000013c6e": {
    "id": "ffffffff-0002-0000-3c6e-000000013c6e",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0016-0001-98c4-0000000d98ba", name: "Clara Frank" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 7
  },
  "ffffffff-0003-0000-daa6-00000001daa5": {
    "id": "ffffffff-0003-0000-daa6-00000001daa5",
    "event": {
      "id": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
      "name": "Football Juniors Match"
    },
    "member": { id: "99999999-0019-0001-736a-0000000f735f", name: "Charlotte Wagner" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0004-0000-78dd-0000000278dc": {
    "id": "ffffffff-0004-0000-78dd-0000000278dc",
    "event": {
      "id": "aaaaaaaa-002f-0002-0c2f-0000001d0c19",
      "name": "Football Juniors Match"
    },
    "member": { id: "99999999-001a-0001-11a2-000000101196", name: "Jakob Seidel" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 6
  },
  "ffffffff-0005-0000-1715-000000031713": {
    "id": "ffffffff-0005-0000-1715-000000031713",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-001d-0001-ec48-00000011ec3b", name: "Janne Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 8
  },
  "ffffffff-0006-0000-b54c-00000003b54a": {
    "id": "ffffffff-0006-0000-b54c-00000003b54a",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-001e-0001-8a80-000000128a72", name: "Theo Diaz" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-03T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 5
  },
  "ffffffff-0007-0000-5384-000000045381": {
    "id": "ffffffff-0007-0000-5384-000000045381",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-001f-0001-28b7-0000001328a9", name: "Samuel Neumann" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 7
  },
  "ffffffff-0008-0000-f1bb-00000004f1b8": {
    "id": "ffffffff-0008-0000-f1bb-00000004f1b8",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0020-0002-c6ef-00000013c6e0", name: "Levi Voigt" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 9
  },
  "ffffffff-0009-0000-8ff3-000000058fef": {
    "id": "ffffffff-0009-0000-8ff3-000000058fef",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "99999999-0025-0002-de04-00000016ddf3", name: "Fynn Vogt" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 6
  },
  "ffffffff-000a-0000-2e2a-000000062e26": {
    "id": "ffffffff-000a-0000-2e2a-000000062e26",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-002c-0002-3188-0000001b3174", name: "Marie Vogel" },
    "creator": null,
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-000b-0000-cc62-00000006cc5d": {
    "id": "ffffffff-000b-0000-cc62-00000006cc5d",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-002d-0002-cfc0-0000001bcfab", name: "Romi Werner" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 10
  },
  "ffffffff-000c-0000-6a99-000000076a94": {
    "id": "ffffffff-000c-0000-6a99-000000076a94",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-0031-0003-489e-0000001e4887", name: "Edda Zimmermann" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 7
  },
  "ffffffff-000d-0000-08d1-0000000808cb": {
    "id": "ffffffff-000d-0000-08d1-0000000808cb",
    "event": {
      "id": "aaaaaaaa-0003-0000-daa6-00000001daa5",
      "name": "Football Group A Open Session"
    },
    "member": { id: "99999999-0032-0003-e6d5-0000001ee6be", name: "Toni Brandt" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-000e-0000-a708-00000008a702": {
    "id": "ffffffff-000e-0000-a708-00000008a702",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0036-0003-5fb3-000000215f9a", name: "Vincent Richter" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 9
  },
  "ffffffff-000f-0000-4540-000000094539": {
    "id": "ffffffff-000f-0000-4540-000000094539",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0037-0003-fdeb-00000021fdd1", name: "Anton Frank" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-0010-0001-e377-00000009e370": {
    "id": "ffffffff-0010-0001-e377-00000009e370",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003a-0003-d891-00000023d876", name: "Joris Stein" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0011-0001-81af-0000000a81a7": {
    "id": "ffffffff-0011-0001-81af-0000000a81a7",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003b-0003-76c9-0000002476ad", name: "Frieda Bauer" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-0012-0001-1fe6-0000000b1fde": {
    "id": "ffffffff-0012-0001-1fe6-0000000b1fde",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003d-0003-b337-00000025b31b", name: "Fynn Koch" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-20T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 9
  },
  "ffffffff-0013-0001-be1e-0000000bbe15": {
    "id": "ffffffff-0013-0001-be1e-0000000bbe15",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003e-0003-516f-000000265152", name: "Marie Fuchs" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 5
  },
  "ffffffff-0014-0001-5c55-0000000c5c4c": {
    "id": "ffffffff-0014-0001-5c55-0000000c5c4c",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-003f-0003-efa6-00000026ef89", name: "Joris Lehmann" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-0015-0001-fa8c-0000000cfa83": {
    "id": "ffffffff-0015-0001-fa8c-0000000cfa83",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0041-0004-2c15-000000282bf7", name: "Smilla Krause" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 4
  },
  "ffffffff-0016-0001-98c4-0000000d98ba": {
    "id": "ffffffff-0016-0001-98c4-0000000d98ba",
    "event": {
      "id": "aaaaaaaa-0005-0000-1715-000000031713",
      "name": "Football Squad 2 Open Session"
    },
    "member": { id: "99999999-0045-0004-a4f3-0000002aa4d3", name: "Mats Graf" },
    "creator": { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0017-0001-36fb-0000000e36f1": {
    "id": "ffffffff-0017-0001-36fb-0000000e36f1",
    "event": {
      "id": "aaaaaaaa-0007-0000-5384-000000045381",
      "name": "Football Seniors Training"
    },
    "member": { id: "99999999-004a-0004-bc09-0000002dbbe6", name: "Liv Sommer" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-0018-0001-d533-0000000ed528": {
    "id": "ffffffff-0018-0001-d533-0000000ed528",
    "event": {
      "id": "aaaaaaaa-0007-0000-5384-000000045381",
      "name": "Football Seniors Training"
    },
    "member": { id: "99999999-004b-0004-5a40-0000002e5a1d", name: "Vincent Vogt" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0019-0001-736a-0000000f735f": {
    "id": "ffffffff-0019-0001-736a-0000000f735f",
    "event": {
      "id": "aaaaaaaa-0007-0000-5384-000000045381",
      "name": "Football Seniors Training"
    },
    "member": { id: "99999999-004c-0004-f878-0000002ef854", name: "Tomas Hartmann" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 8
  },
  "ffffffff-001a-0001-11a2-000000101196": {
    "id": "ffffffff-001a-0001-11a2-000000101196",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-004e-0004-34e7-0000003034c2", name: "Luca Ziegler" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-001b-0001-afd9-00000010afcd": {
    "id": "ffffffff-001b-0001-afd9-00000010afcd",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-004f-0004-d31e-00000030d2f9", name: "Til Sommer" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-001c-0001-4e11-000000114e04": {
    "id": "ffffffff-001c-0001-4e11-000000114e04",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0051-0005-0f8d-000000320f67", name: "Paul Busch" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-03T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 10
  },
  "ffffffff-001d-0001-ec48-00000011ec3b": {
    "id": "ffffffff-001d-0001-ec48-00000011ec3b",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0054-0005-ea33-00000033ea0c", name: "Marie Pohl" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 6
  },
  "ffffffff-001e-0001-8a80-000000128a72": {
    "id": "ffffffff-001e-0001-8a80-000000128a72",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0057-0005-c4da-00000035c4b1", name: "Helena Neumann" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-001f-0001-28b7-0000001328a9": {
    "id": "ffffffff-001f-0001-28b7-0000001328a9",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-0058-0005-6311-0000003662e8", name: "Leon Hartmann" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 3
  },
  "ffffffff-0020-0002-c6ef-00000013c6e0": {
    "id": "ffffffff-0020-0002-c6ef-00000013c6e0",
    "event": {
      "id": "aaaaaaaa-0009-0000-8ff3-000000058fef",
      "name": "Basketball Masters Tournament"
    },
    "member": { id: "99999999-005d-0005-7a27-0000003979fb", name: "Jakob Klein" },
    "creator": { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0021-0002-6526-000000146517": {
    "id": "ffffffff-0021-0002-6526-000000146517",
    "event": {
      "id": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
      "name": "Basketball Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 9
  },
  "ffffffff-0022-0002-035e-00000015034e": {
    "id": "ffffffff-0022-0002-035e-00000015034e",
    "event": {
      "id": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
      "name": "Basketball Juniors Open Session"
    },
    "member": { id: "99999999-0062-0006-913c-0000003c910e", name: "Lotte Albrecht" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 5
  },
  "ffffffff-0023-0002-a195-00000015a185": {
    "id": "ffffffff-0023-0002-a195-00000015a185",
    "event": {
      "id": "aaaaaaaa-000b-0000-cc62-00000006cc5d",
      "name": "Basketball Juniors Open Session"
    },
    "member": { id: "99999999-0065-0006-6be3-0000003e6bb3", name: "Frida Werner" },
    "creator": { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-0024-0002-3fcd-000000163fbc": {
    "id": "ffffffff-0024-0002-3fcd-000000163fbc",
    "event": {
      "id": "aaaaaaaa-000d-0000-08d1-0000000808cb",
      "name": "Basketball U14 Tournament"
    },
    "member": { id: "99999999-0067-0006-a851-0000003fa821", name: "Luca Peters" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-0025-0002-de04-00000016ddf3": {
    "id": "ffffffff-0025-0002-de04-00000016ddf3",
    "event": {
      "id": "aaaaaaaa-000d-0000-08d1-0000000808cb",
      "name": "Basketball U14 Tournament"
    },
    "member": { id: "99999999-006f-0006-9a0d-0000004499d9", name: "Liv Brandt" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 0
  },
  "ffffffff-0026-0002-7c3c-000000177c2a": {
    "id": "ffffffff-0026-0002-7c3c-000000177c2a",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0072-0007-74b4-00000046747e", name: "Lena Pohl" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 7
  },
  "ffffffff-0027-0002-1a73-000000181a61": {
    "id": "ffffffff-0027-0002-1a73-000000181a61",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0075-0007-4f5a-000000484f23", name: "Emil Kaiser" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0028-0002-b8ab-00000018b898": {
    "id": "ffffffff-0028-0002-b8ab-00000018b898",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0076-0007-ed92-00000048ed5a", name: "Leon Diaz" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 9
  },
  "ffffffff-0029-0002-56e2-0000001956cf": {
    "id": "ffffffff-0029-0002-56e2-0000001956cf",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-0078-0007-2a01-0000004a29c8", name: "Oskar Nowak" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-002a-0002-f519-00000019f506": {
    "id": "ffffffff-002a-0002-f519-00000019f506",
    "event": {
      "id": "aaaaaaaa-000f-0000-4540-000000094539",
      "name": "Basketball Squad 1 Time Trial"
    },
    "member": { id: "99999999-007a-0007-666f-0000004b6636", name: "Leon Neumann" },
    "creator": { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
    "created_at": "2026-05-20T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 7
  },
  "ffffffff-002b-0002-9351-0000001a933d": {
    "id": "ffffffff-002b-0002-9351-0000001a933d",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-007f-0007-7d85-0000004e7d49", name: "Tilda Neumann" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 9
  },
  "ffffffff-002c-0002-3188-0000001b3174": {
    "id": "ffffffff-002c-0002-3188-0000001b3174",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0081-0008-b9f4-0000004fb9b7", name: "Leon Busch" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-002d-0002-cfc0-0000001bcfab": {
    "id": "ffffffff-002d-0002-cfc0-0000001bcfab",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0084-0008-949a-00000051945c", name: "Juna Reil" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-002e-0002-6df7-0000001c6de2": {
    "id": "ffffffff-002e-0002-6df7-0000001c6de2",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0085-0008-32d2-000000523293", name: "Juna Braun" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-002f-0002-0c2f-0000001d0c19": {
    "id": "ffffffff-002f-0002-0c2f-0000001d0c19",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0087-0008-6f41-000000536f01", name: "Sofia Brandt" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-17T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0030-0003-aa66-0000001daa50": {
    "id": "ffffffff-0030-0003-aa66-0000001daa50",
    "event": {
      "id": "aaaaaaaa-0011-0001-81af-0000000a81a7",
      "name": "Basketball Group B Friendly"
    },
    "member": { id: "99999999-0088-0008-0d78-000000540d38", name: "Samuel Vogel" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 9
  },
  "ffffffff-0031-0003-489e-0000001e4887": {
    "id": "ffffffff-0031-0003-489e-0000001e4887",
    "event": {
      "id": "aaaaaaaa-0013-0001-be1e-0000000bbe15",
      "name": "Swimming Juniors Open Session"
    },
    "member": { id: "99999999-008c-0008-8656-000000568614", name: "Moritz Wolf" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 6
  },
  "ffffffff-0032-0003-e6d5-0000001ee6be": {
    "id": "ffffffff-0032-0003-e6d5-0000001ee6be",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-0093-0009-d9da-0000005ad995", name: "Finn Vogel" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-07T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-0033-0003-850d-0000001f84f5": {
    "id": "ffffffff-0033-0003-850d-0000001f84f5",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-0095-0009-1649-0000005c1603", name: "Lea Park" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 10
  },
  "ffffffff-0034-0003-2344-00000020232c": {
    "id": "ffffffff-0034-0003-2344-00000020232c",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-0098-0009-f0f0-0000005df0a8", name: "Aaron Sommer" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-0035-0003-c17c-00000020c163": {
    "id": "ffffffff-0035-0003-c17c-00000020c163",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-009d-0009-0805-0000006107bb", name: "Lena Kaiser" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-0036-0003-5fb3-000000215f9a": {
    "id": "ffffffff-0036-0003-5fb3-000000215f9a",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-009e-0009-a63d-00000061a5f2", name: "Joris Schulz" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0037-0003-fdeb-00000021fdd1": {
    "id": "ffffffff-0037-0003-fdeb-00000021fdd1",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-00a1-000a-80e3-000000638097", name: "Amelie Lange" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 8
  },
  "ffffffff-0038-0003-9c22-000000229c08": {
    "id": "ffffffff-0038-0003-9c22-000000229c08",
    "event": {
      "id": "aaaaaaaa-0015-0001-fa8c-0000000cfa83",
      "name": "Swimming Group A Tournament"
    },
    "member": { id: "99999999-00a2-000a-1f1b-000000641ece", name: "Jonas Nowak" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-0039-0003-3a5a-000000233a3f": {
    "id": "ffffffff-0039-0003-3a5a-000000233a3f",
    "event": {
      "id": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
      "name": "Swimming Group B Time Trial"
    },
    "member": { id: "99999999-00a7-000a-3630-0000006735e1", name: "Carla Arnold" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 7
  },
  "ffffffff-003a-0003-d891-00000023d876": {
    "id": "ffffffff-003a-0003-d891-00000023d876",
    "event": {
      "id": "aaaaaaaa-0017-0001-36fb-0000000e36f1",
      "name": "Swimming Group B Time Trial"
    },
    "member": { id: "99999999-00aa-000a-10d6-000000691086", name: "Bela Klein" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Technique is coming along well. Focus next on consistency across both sides.",
    "rating": 9
  },
  "ffffffff-003b-0003-76c9-0000002476ad": {
    "id": "ffffffff-003b-0003-76c9-0000002476ad",
    "event": {
      "id": "aaaaaaaa-0019-0001-736a-0000000f735f",
      "name": "Swimming Seniors Open Session"
    },
    "member": { id: "99999999-00ae-000a-89b4-0000006b8962", name: "Jonah König" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 6
  },
  "ffffffff-003c-0003-1500-0000002514e4": {
    "id": "ffffffff-003c-0003-1500-0000002514e4",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00b6-000b-7b70-000000707b1a", name: "Finn Neumann" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-003d-0003-b337-00000025b31b": {
    "id": "ffffffff-003d-0003-b337-00000025b31b",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00b9-000b-5616-0000007255bf", name: "Frida Brandt" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 4
  },
  "ffffffff-003e-0003-516f-000000265152": {
    "id": "ffffffff-003e-0003-516f-000000265152",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00bb-000b-9285-00000073922d", name: "Sofia Pohl" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 7
  },
  "ffffffff-003f-0003-efa6-00000026ef89": {
    "id": "ffffffff-003f-0003-efa6-00000026ef89",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00bc-000b-30bd-000000743064", name: "Jonah Park" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 6
  },
  "ffffffff-0040-0004-8dde-000000278dc0": {
    "id": "ffffffff-0040-0004-8dde-000000278dc0",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00be-000b-6d2c-000000756cd2", name: "Emil Diaz" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0041-0004-2c15-000000282bf7": {
    "id": "ffffffff-0041-0004-2c15-000000282bf7",
    "event": {
      "id": "aaaaaaaa-001b-0001-afd9-00000010afcd",
      "name": "Swimming Squad 1 Tournament"
    },
    "member": { id: "99999999-00bf-000b-0b63-000000760b09", name: "David Braun" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-06-14T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 8
  },
  "ffffffff-0042-0004-ca4d-00000028ca2e": {
    "id": "ffffffff-0042-0004-ca4d-00000028ca2e",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c1-000c-47d2-000000774777", name: "Emil Schwarz" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-0043-0004-6884-000000296865": {
    "id": "ffffffff-0043-0004-6884-000000296865",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c3-000c-8441-0000007883e5", name: "Rosa Frank" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 7
  },
  "ffffffff-0044-0004-06bc-0000002a069c": {
    "id": "ffffffff-0044-0004-06bc-0000002a069c",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c4-000c-2279-00000079221c", name: "Frida Neumann" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-07T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 10
  },
  "ffffffff-0045-0004-a4f3-0000002aa4d3": {
    "id": "ffffffff-0045-0004-a4f3-0000002aa4d3",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c6-000c-5ee8-0000007a5e8a", name: "Edda Vogt" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0046-0004-432b-0000002b430a": {
    "id": "ffffffff-0046-0004-432b-0000002b430a",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00c8-000c-9b57-0000007b9af8", name: "Emil Klein" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-13T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 8
  },
  "ffffffff-0047-0004-e162-0000002be141": {
    "id": "ffffffff-0047-0004-e162-0000002be141",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00cf-000c-eedb-0000007fee79", name: "Toni Krause" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-02T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 3
  },
  "ffffffff-0048-0004-7f9a-0000002c7f78": {
    "id": "ffffffff-0048-0004-7f9a-0000002c7f78",
    "event": {
      "id": "aaaaaaaa-001d-0001-ec48-00000011ec3b",
      "name": "Athletics Group A Time Trial"
    },
    "member": { id: "99999999-00d0-000d-8d12-000000808cb0", name: "Lotte Richter" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 7
  },
  "ffffffff-0049-0004-1dd1-0000002d1daf": {
    "id": "ffffffff-0049-0004-1dd1-0000002d1daf",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d1-000d-2b4a-000000812ae7", name: "Lotte Frank" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-06T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 9
  },
  "ffffffff-004a-0004-bc09-0000002dbbe6": {
    "id": "ffffffff-004a-0004-bc09-0000002dbbe6",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d2-000d-c981-00000081c91e", name: "Mara Seidel" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-004b-0004-5a40-0000002e5a1d": {
    "id": "ffffffff-004b-0004-5a40-0000002e5a1d",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d3-000d-67b9-000000826755", name: "Ella Pohl" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-004c-0004-f878-0000002ef854": {
    "id": "ffffffff-004c-0004-f878-0000002ef854",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d6-000d-425f-0000008441fa", name: "Nele Scholz" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-14T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-004d-0004-96af-0000002f968b": {
    "id": "ffffffff-004d-0004-96af-0000002f968b",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00d7-000d-e097-00000084e031", name: "Oskar Stein" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 0
  },
  "ffffffff-004e-0004-34e7-0000003034c2": {
    "id": "ffffffff-004e-0004-34e7-0000003034c2",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00db-000d-5975-00000087590d", name: "Ida Vogel" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-23T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 7
  },
  "ffffffff-004f-0004-d31e-00000030d2f9": {
    "id": "ffffffff-004f-0004-d31e-00000030d2f9",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00dc-000d-f7ac-00000087f744", name: "Levi Beck" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-0050-0005-7156-000000317130": {
    "id": "ffffffff-0050-0005-7156-000000317130",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00df-000d-d253-00000089d1e9", name: "Toni Seidel" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 9
  },
  "ffffffff-0051-0005-0f8d-000000320f67": {
    "id": "ffffffff-0051-0005-0f8d-000000320f67",
    "event": {
      "id": "aaaaaaaa-001f-0001-28b7-0000001328a9",
      "name": "Athletics Development Open Session"
    },
    "member": { id: "99999999-00e0-000e-708a-0000008a7020", name: "Nele Braun" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0052-0005-adc4-00000032ad9e": {
    "id": "ffffffff-0052-0005-adc4-00000032ad9e",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00e8-000e-6246-0000008f61d8", name: "Lea Stein" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 9
  },
  "ffffffff-0053-0005-4bfc-000000334bd5": {
    "id": "ffffffff-0053-0005-4bfc-000000334bd5",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00ed-000e-795b-0000009278eb", name: "Mats Horn" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-24T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 9
  },
  "ffffffff-0054-0005-ea33-00000033ea0c": {
    "id": "ffffffff-0054-0005-ea33-00000033ea0c",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00ee-000e-1793-000000931722", name: "Lina Krüger" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 6
  },
  "ffffffff-0055-0005-886b-000000348843": {
    "id": "ffffffff-0055-0005-886b-000000348843",
    "event": {
      "id": "aaaaaaaa-0021-0002-6526-000000146517",
      "name": "Athletics Varsity Friendly"
    },
    "member": { id: "99999999-00f4-000f-ccdf-00000096cc6c", name: "Stella Frank" },
    "creator": { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
    "created_at": "2026-05-20T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 8
  },
  "ffffffff-0056-0005-26a2-00000035267a": {
    "id": "ffffffff-0056-0005-26a2-00000035267a",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00f9-000f-e3f5-00000099e37f", name: "Joris Huber" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-29T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-0057-0005-c4da-00000035c4b1": {
    "id": "ffffffff-0057-0005-c4da-00000035c4b1",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fa-000f-822c-0000009a81b6", name: "Mara Vogel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-21T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-0058-0005-6311-0000003662e8": {
    "id": "ffffffff-0058-0005-6311-0000003662e8",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fb-000f-2064-0000009b1fed", name: "Martha Vogel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0059-0005-0149-00000037011f": {
    "id": "ffffffff-0059-0005-0149-00000037011f",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fc-000f-be9b-0000009bbe24", name: "Mats Kaiser" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-14T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 6
  },
  "ffffffff-005a-0005-9f80-000000379f56": {
    "id": "ffffffff-005a-0005-9f80-000000379f56",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-00fe-000f-fb0a-0000009cfa92", name: "Erik Schulz" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 8
  },
  "ffffffff-005b-0005-3db8-000000383d8d": {
    "id": "ffffffff-005b-0005-3db8-000000383d8d",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-0101-0010-d5b1-0000009ed537", name: "Clara Pohl" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 10
  },
  "ffffffff-005c-0005-dbef-00000038dbc4": {
    "id": "ffffffff-005c-0005-dbef-00000038dbc4",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-0102-0010-73e8-0000009f736e", name: "Niklas Fuchs" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-08T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-005d-0005-7a27-0000003979fb": {
    "id": "ffffffff-005d-0005-7a27-0000003979fb",
    "event": {
      "id": "aaaaaaaa-0023-0002-a195-00000015a185",
      "name": "Athletics Masters Training"
    },
    "member": { id: "99999999-0106-0010-ecc6-000000a1ec4a", name: "Nele Kaiser" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-005e-0005-185e-0000003a1832": {
    "id": "ffffffff-005e-0005-185e-0000003a1832",
    "event": {
      "id": "aaaaaaaa-0025-0002-de04-00000016ddf3",
      "name": "Volleyball Juniors Time Trial"
    },
    "member": { id: "99999999-010e-0010-de82-000000a6de02", name: "Magda Bauer" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-05-26T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 9
  },
  "ffffffff-005f-0005-b696-0000003ab669": {
    "id": "ffffffff-005f-0005-b696-0000003ab669",
    "event": {
      "id": "aaaaaaaa-0025-0002-de04-00000016ddf3",
      "name": "Volleyball Juniors Time Trial"
    },
    "member": { id: "99999999-0110-0011-1af1-000000a81a70", name: "Mira Roth" },
    "creator": { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 8
  },
  "ffffffff-0060-0006-54cd-0000003b54a0": {
    "id": "ffffffff-0060-0006-54cd-0000003b54a0",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0112-0011-5760-000000a956de", name: "Paul Reil" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0061-0006-f305-0000003bf2d7": {
    "id": "ffffffff-0061-0006-f305-0000003bf2d7",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0116-0011-d03e-000000abcfba", name: "Pia Zimmermann" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-22T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 7
  },
  "ffffffff-0062-0006-913c-0000003c910e": {
    "id": "ffffffff-0062-0006-913c-0000003c910e",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0118-0011-0cad-000000ad0c28", name: "Joris Arnold" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-07T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 9
  },
  "ffffffff-0063-0006-2f74-0000003d2f45": {
    "id": "ffffffff-0063-0006-2f74-0000003d2f45",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011a-0011-491c-000000ae4896", name: "Jonah Diaz" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-31T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-0064-0006-cdab-0000003dcd7c": {
    "id": "ffffffff-0064-0006-cdab-0000003dcd7c",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011b-0011-e753-000000aee6cd", name: "Mats Fuchs" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 8
  },
  "ffffffff-0065-0006-6be3-0000003e6bb3": {
    "id": "ffffffff-0065-0006-6be3-0000003e6bb3",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011d-0011-23c2-000000b0233b", name: "Janne Vogel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 4
  },
  "ffffffff-0066-0006-0a1a-0000003f09ea": {
    "id": "ffffffff-0066-0006-0a1a-0000003f09ea",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-011e-0011-c1f9-000000b0c172", name: "Amelie Wolf" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0067-0006-a851-0000003fa821": {
    "id": "ffffffff-0067-0006-a851-0000003fa821",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0120-0012-fe68-000000b1fde0", name: "Lea Engel" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-11T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 6
  },
  "ffffffff-0068-0006-4689-000000404658": {
    "id": "ffffffff-0068-0006-4689-000000404658",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0121-0012-9ca0-000000b29c17", name: "Stella Braun" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-05-24T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 9
  },
  "ffffffff-0069-0006-e4c0-00000040e48f": {
    "id": "ffffffff-0069-0006-e4c0-00000040e48f",
    "event": {
      "id": "aaaaaaaa-0027-0002-1a73-000000181a61",
      "name": "Volleyball Squad 1 Training"
    },
    "member": { id: "99999999-0122-0012-3ad7-000000b33a4e", name: "Helena König" },
    "creator": { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 5
  },
  "ffffffff-006a-0006-82f8-0000004182c6": {
    "id": "ffffffff-006a-0006-82f8-0000004182c6",
    "event": {
      "id": "aaaaaaaa-0029-0002-56e2-0000001956cf",
      "name": "Volleyball Squad 2 Match"
    },
    "member": { id: "99999999-012b-0012-cacb-000000b8ca3d", name: "Noah Schulz" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 5
  },
  "ffffffff-006b-0006-212f-0000004220fd": {
    "id": "ffffffff-006b-0006-212f-0000004220fd",
    "event": {
      "id": "aaaaaaaa-0029-0002-56e2-0000001956cf",
      "name": "Volleyball Squad 2 Match"
    },
    "member": { id: "99999999-012f-0012-43a9-000000bb4319", name: "Nora Bauer" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 7
  },
  "ffffffff-006c-0006-bf67-00000042bf34": {
    "id": "ffffffff-006c-0006-bf67-00000042bf34",
    "event": {
      "id": "aaaaaaaa-0029-0002-56e2-0000001956cf",
      "name": "Volleyball Squad 2 Match"
    },
    "member": { id: "99999999-0130-0013-e1e0-000000bbe150", name: "Luca Wolf" },
    "creator": { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
    "created_at": "2026-06-16T00:00:00.000Z",
    "feedback": "Great session — first touch under pressure has noticeably improved. Keep your head up earlier when scanning.",
    "rating": 10
  },
  "ffffffff-006d-0006-5d9e-000000435d6b": {
    "id": "ffffffff-006d-0006-5d9e-000000435d6b",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0131-0013-8017-000000bc7f87", name: "Ada Kaiser" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-05-28T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 6
  },
  "ffffffff-006e-0006-fbd6-00000043fba2": {
    "id": "ffffffff-006e-0006-fbd6-00000043fba2",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0133-0013-bc86-000000bdbbf5", name: "Max Ziegler" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-09T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-006f-0006-9a0d-0000004499d9": {
    "id": "ffffffff-006f-0006-9a0d-0000004499d9",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0135-0013-f8f5-000000bef863", name: "Romi Vogt" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 3
  },
  "ffffffff-0070-0007-3845-000000453810": {
    "id": "ffffffff-0070-0007-3845-000000453810",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0136-0013-972d-000000bf969a", name: "Moritz Albrecht" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-01T00:00:00.000Z",
    "feedback": "Nice progress since last month. The extra reps are showing in your sharpness.",
    "rating": 7
  },
  "ffffffff-0071-0007-d67c-00000045d647": {
    "id": "ffffffff-0071-0007-d67c-00000045d647",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-013d-0013-eab1-000000c3ea1b", name: "Alma Klein" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Worked hard in the drills. Weight of pass is improving but still occasionally heavy under pressure.",
    "rating": 9
  },
  "ffffffff-0072-0007-74b4-00000046747e": {
    "id": "ffffffff-0072-0007-74b4-00000046747e",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0140-0014-c558-000000c5c4c0", name: "Mats Hartmann" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-04T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 5
  },
  "ffffffff-0073-0007-12eb-0000004712b5": {
    "id": "ffffffff-0073-0007-12eb-0000004712b5",
    "event": {
      "id": "aaaaaaaa-002b-0002-9351-0000001a933d",
      "name": "Volleyball U16 Tournament"
    },
    "member": { id: "99999999-0142-0014-01c7-000000c7012e", name: "Anton Braun" },
    "creator": { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 8
  },
  "ffffffff-0074-0007-b123-00000047b0ec": {
    "id": "ffffffff-0074-0007-b123-00000047b0ec",
    "event": {
      "id": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
      "name": "Volleyball Varsity Open Session"
    },
    "member": { id: "99999999-014b-0014-91ba-000000cc911d", name: "Konrad Sommer" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-27T00:00:00.000Z",
    "feedback": "Excellent attitude and leadership on the pitch. Communication with teammates stood out today.",
    "rating": 6
  },
  "ffffffff-0075-0007-4f5a-000000484f23": {
    "id": "ffffffff-0075-0007-4f5a-000000484f23",
    "event": {
      "id": "aaaaaaaa-002d-0002-cfc0-0000001bcfab",
      "name": "Volleyball Varsity Open Session"
    },
    "member": { id: "99999999-014c-0014-2ff1-000000cd2f54", name: "Elias Wolf" },
    "creator": { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
    "created_at": "2026-05-25T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 0
  },
  "ffffffff-0076-0007-ed92-00000048ed5a": {
    "id": "ffffffff-0076-0007-ed92-00000048ed5a",
    "event": {
      "id": "aaaaaaaa-0031-0003-489e-0000001e4887",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-05T00:00:00.000Z",
    "feedback": "Strong recovery runs and good awareness defensively. Keep building match fitness.",
    "rating": 7
  },
  "ffffffff-0077-0007-8bc9-000000498b91": {
    "id": "ffffffff-0077-0007-8bc9-000000498b91",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-15T00:00:00.000Z",
    "feedback": "Solid work today. Positional discipline was strong; decision-making in the final third can be quicker.",
    "rating": 8
  },
  "ffffffff-0078-0007-2a01-0000004a29c8": {
    "id": "ffffffff-0078-0007-2a01-0000004a29c8",
    "event": {
      "id": "aaaaaaaa-0001-0000-9e37-000000009e37",
      "name": "Football Juniors Open Session"
    },
    "member": { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
    "creator": { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
    "created_at": "2026-06-10T00:00:00.000Z",
    "feedback": "Good intensity throughout the conditioning block. Keep up the post-session stretching routine.",
    "rating": 9
  }
}
