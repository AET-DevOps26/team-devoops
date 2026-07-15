import type { Sport, Team } from '@/types'
import { CURRENT_MEMBER_ID } from './members'

export const sportFixtures: Sport[] = [
  {
    "id": "cccccccc-0001-0000-f001-000000000001",
    "name": "Football",
    "description": "Eleven-a-side football across youth and senior squads.",
    "created_at": "2021-10-08",
    "directors": [
      { id: "99999999-0003-0000-daa6-00000001daa5", name: "Director Devoops" },
      { id: "99999999-0001-0000-9e37-000000009e37", name: "Johanna Horn" }
    ]
  },
  {
    "id": "cccccccc-0002-0000-b002-000000000002",
    "name": "Basketball",
    "description": "Indoor basketball for juniors through varsity level.",
    "created_at": "2022-06-09",
    "directors": [
      { id: "99999999-0001-0000-9e37-000000009e37", name: "Johanna Horn" },
      { id: "99999999-0003-0000-daa6-00000001daa5", name: "Director Devoops" }
    ]
  },
  {
    "id": "cccccccc-0003-0000-5003-000000000003",
    "name": "Swimming",
    "description": "Lane swimming, technique and competitive squads.",
    "created_at": "2020-12-11",
    "directors": [
      { id: "99999999-0001-0000-9e37-000000009e37", name: "Johanna Horn" },
      { id: "99999999-0002-0000-3c6e-000000013c6e", name: "Tilda Huber" }
    ]
  },
  {
    "id": "cccccccc-0004-0000-a004-000000000004",
    "name": "Athletics",
    "description": "Track and field — sprints, distance, jumps and throws.",
    "created_at": "2018-02-22",
    "directors": [
      { id: "99999999-0002-0000-3c6e-000000013c6e", name: "Tilda Huber" }
    ]
  },
  {
    "id": "cccccccc-0005-0000-0005-000000000005",
    "name": "Volleyball",
    "description": "Six-a-side indoor volleyball, mixed and youth groups.",
    "created_at": "2022-06-26",
    "directors": [
      { id: "99999999-0001-0000-9e37-000000009e37", name: "Johanna Horn" }
    ]
  }
]

export const teamFixtures: Team[] = [
  {
    "id": "bbbbbbbb-0001-0000-9e37-000000009e37",
    "name": "Football Juniors",
    "description": "Football Juniors squad.",
    "created_at": "2020-08-04",
    "address": "Birkenallee 36, 81243 München",
    "sport": {
      "id": "cccccccc-0001-0000-f001-000000000001",
      "name": "Football"
    },
    "trainers": [
      { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" }
    ],
    "trainees": [
      { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
      { id: "99999999-0013-0001-be1e-0000000bbe15", name: "Marie Wolf" },
      { id: "99999999-0014-0001-5c55-0000000c5c4c", name: "Linus Koch" },
      { id: "99999999-0015-0001-fa8c-0000000cfa83", name: "Linus Beck" },
      { id: "99999999-0016-0001-98c4-0000000d98ba", name: "Clara Frank" },
      { id: "99999999-0017-0001-36fb-0000000e36f1", name: "Edda Frank" },
      { id: "99999999-0018-0001-d533-0000000ed528", name: "Mia Werner" },
      { id: "99999999-0019-0001-736a-0000000f735f", name: "Charlotte Wagner" },
      { id: "99999999-001a-0001-11a2-000000101196", name: "Jakob Seidel" },
      { id: "99999999-001b-0001-afd9-00000010afcd", name: "Ella Krüger" },
      { id: "99999999-001c-0001-4e11-000000114e04", name: "Erik Lange" },
      { id: "99999999-001d-0001-ec48-00000011ec3b", name: "Janne Roth" },
      { id: "99999999-001e-0001-8a80-000000128a72", name: "Theo Diaz" },
      { id: "99999999-001f-0001-28b7-0000001328a9", name: "Samuel Neumann" },
      { id: "99999999-0020-0002-c6ef-00000013c6e0", name: "Levi Voigt" },
      { id: "99999999-0021-0002-6526-000000146517", name: "Mia Albrecht" },
      { id: "99999999-0022-0002-035e-00000015034e", name: "Ida Krüger" },
      { id: "99999999-0023-0002-a195-00000015a185", name: "Oskar Schulz" },
      { id: "99999999-0024-0002-3fcd-000000163fbc", name: "Clara Koch" },
      { id: "99999999-0025-0002-de04-00000016ddf3", name: "Fynn Vogt" },
      { id: "99999999-0026-0002-7c3c-000000177c2a", name: "Moritz Seidel" },
      { id: "99999999-0027-0002-1a73-000000181a61", name: "Nora Krause" },
      { id: "99999999-0028-0002-b8ab-00000018b898", name: "Mats Huber" },
      { id: "99999999-0029-0002-56e2-0000001956cf", name: "Oskar Werner" },
      { id: "99999999-002a-0002-f519-00000019f506", name: "Erik Richter" }
    ]
  },
  {
    "id": "bbbbbbbb-0002-0000-3c6e-000000013c6e",
    "name": "Football Group A",
    "description": "Football Group A squad.",
    "created_at": "2022-06-01",
    "address": "Mühlgasse 25, 81667 München",
    "sport": {
      "id": "cccccccc-0001-0000-f001-000000000001",
      "name": "Football"
    },
    "trainers": [
      { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" }
    ],
    "trainees": [
      { id: "99999999-002b-0002-9351-0000001a933d", name: "David Arnold" },
      { id: "99999999-002c-0002-3188-0000001b3174", name: "Marie Vogel" },
      { id: "99999999-002d-0002-cfc0-0000001bcfab", name: "Romi Werner" },
      { id: "99999999-002e-0002-6df7-0000001c6de2", name: "Wilma Kaiser" },
      { id: "99999999-002f-0002-0c2f-0000001d0c19", name: "Romi Fuchs" },
      { id: "99999999-0030-0003-aa66-0000001daa50", name: "Ben Vogel" },
      { id: "99999999-0031-0003-489e-0000001e4887", name: "Edda Zimmermann" },
      { id: "99999999-0032-0003-e6d5-0000001ee6be", name: "Toni Brandt" },
      { id: "99999999-0033-0003-850d-0000001f84f5", name: "Ida Arnold" },
      { id: "99999999-0034-0003-2344-00000020232c", name: "Stella Zimmermann" }
    ]
  },
  {
    "id": "bbbbbbbb-0003-0000-daa6-00000001daa5",
    "name": "Football Squad 2",
    "description": "Football Squad 2 squad.",
    "created_at": "2024-05-14",
    "address": "Sonnenweg 49, 80331 München",
    "sport": {
      "id": "cccccccc-0001-0000-f001-000000000001",
      "name": "Football"
    },
    "trainers": [
      { id: "99999999-000b-0000-cc62-00000006cc5d", name: "Felix Voigt" }
    ],
    "trainees": [
      { id: "99999999-0035-0003-c17c-00000020c163", name: "Helena Berger" },
      { id: "99999999-0036-0003-5fb3-000000215f9a", name: "Vincent Richter" },
      { id: "99999999-0037-0003-fdeb-00000021fdd1", name: "Anton Frank" },
      { id: "99999999-0038-0003-9c22-000000229c08", name: "Greta Nowak" },
      { id: "99999999-0039-0003-3a5a-000000233a3f", name: "Clara Stein" },
      { id: "99999999-003a-0003-d891-00000023d876", name: "Joris Stein" },
      { id: "99999999-003b-0003-76c9-0000002476ad", name: "Frieda Bauer" },
      { id: "99999999-003c-0003-1500-0000002514e4", name: "Martha Schwarz" },
      { id: "99999999-003d-0003-b337-00000025b31b", name: "Fynn Koch" },
      { id: "99999999-003e-0003-516f-000000265152", name: "Marie Fuchs" },
      { id: "99999999-003f-0003-efa6-00000026ef89", name: "Joris Lehmann" },
      { id: "99999999-0040-0004-8dde-000000278dc0", name: "Helena Graf" },
      { id: "99999999-0041-0004-2c15-000000282bf7", name: "Smilla Krause" },
      { id: "99999999-0042-0004-ca4d-00000028ca2e", name: "Konrad Schwarz" },
      { id: "99999999-0043-0004-6884-000000296865", name: "Rosa Zimmermann" },
      { id: "99999999-0044-0004-06bc-0000002a069c", name: "Arne Zimmermann" },
      { id: "99999999-0045-0004-a4f3-0000002aa4d3", name: "Mats Graf" },
      { id: "99999999-0046-0004-432b-0000002b430a", name: "Martha Voigt" },
      { id: "99999999-0047-0004-e162-0000002be141", name: "Stella Horn" }
    ]
  },
  {
    "id": "bbbbbbbb-0004-0000-78dd-0000000278dc",
    "name": "Football Seniors",
    "description": "Football Seniors squad.",
    "created_at": "2023-05-18",
    "address": "Birkenallee 109, 80333 München",
    "sport": {
      "id": "cccccccc-0001-0000-f001-000000000001",
      "name": "Football"
    },
    "trainers": [
      { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" }
    ],
    "trainees": [
      { id: "99999999-0048-0004-7f9a-0000002c7f78", name: "Levi Lange" },
      { id: "99999999-0049-0004-1dd1-0000002d1daf", name: "Henry Richter" },
      { id: "99999999-004a-0004-bc09-0000002dbbe6", name: "Liv Sommer" },
      { id: "99999999-004b-0004-5a40-0000002e5a1d", name: "Vincent Vogt" },
      { id: "99999999-004c-0004-f878-0000002ef854", name: "Tomas Hartmann" }
    ]
  },
  {
    "id": "bbbbbbbb-0005-0000-1715-000000031713",
    "name": "Basketball Masters",
    "description": "Basketball Masters squad.",
    "created_at": "2019-10-15",
    "address": "Kirchplatz 104, 80337 München",
    "sport": {
      "id": "cccccccc-0002-0000-b002-000000000002",
      "name": "Basketball"
    },
    "trainers": [
      { id: "99999999-0008-0000-f1bb-00000004f1b8", name: "Theo Albrecht" }
    ],
    "trainees": [
      { id: "99999999-004d-0004-96af-0000002f968b", name: "Frida Fuchs" },
      { id: "99999999-004e-0004-34e7-0000003034c2", name: "Luca Ziegler" },
      { id: "99999999-004f-0004-d31e-00000030d2f9", name: "Til Sommer" },
      { id: "99999999-0050-0005-7156-000000317130", name: "Finn Seidel" },
      { id: "99999999-0051-0005-0f8d-000000320f67", name: "Paul Busch" },
      { id: "99999999-0052-0005-adc4-00000032ad9e", name: "Martha Braun" },
      { id: "99999999-0053-0005-4bfc-000000334bd5", name: "Johanna Hartmann" },
      { id: "99999999-0054-0005-ea33-00000033ea0c", name: "Marie Pohl" },
      { id: "99999999-0055-0005-886b-000000348843", name: "Tomas Brandt" },
      { id: "99999999-0056-0005-26a2-00000035267a", name: "Lina Nowak" },
      { id: "99999999-0057-0005-c4da-00000035c4b1", name: "Helena Neumann" },
      { id: "99999999-0058-0005-6311-0000003662e8", name: "Leon Hartmann" },
      { id: "99999999-0059-0005-0149-00000037011f", name: "Paul Werner" },
      { id: "99999999-005a-0005-9f80-000000379f56", name: "Alma Beck" },
      { id: "99999999-005b-0005-3db8-000000383d8d", name: "Romy Voigt" },
      { id: "99999999-005c-0005-dbef-00000038dbc4", name: "Felix Frank" },
      { id: "99999999-005d-0005-7a27-0000003979fb", name: "Jakob Klein" },
      { id: "99999999-005e-0005-185e-0000003a1832", name: "Ben Horn" },
      { id: "99999999-005f-0005-b696-0000003ab669", name: "Jonah Krüger" },
      { id: "99999999-0060-0006-54cd-0000003b54a0", name: "Lina Graf" }
    ]
  },
  {
    "id": "bbbbbbbb-0006-0000-b54c-00000003b54a",
    "name": "Basketball Juniors",
    "description": "Basketball Juniors squad.",
    "created_at": "2019-01-22",
    "address": "Ahornweg 41, 80331 München",
    "sport": {
      "id": "cccccccc-0002-0000-b002-000000000002",
      "name": "Basketball"
    },
    "trainers": [
      { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" }
    ],
    "trainees": [
      { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" },
      { id: "99999999-0061-0006-f305-0000003bf2d7", name: "Leon Braun" },
      { id: "99999999-0062-0006-913c-0000003c910e", name: "Lotte Albrecht" },
      { id: "99999999-0063-0006-2f74-0000003d2f45", name: "Lena Beck" },
      { id: "99999999-0064-0006-cdab-0000003dcd7c", name: "Greta Roth" },
      { id: "99999999-0065-0006-6be3-0000003e6bb3", name: "Frida Werner" }
    ]
  },
  {
    "id": "bbbbbbbb-0007-0000-5384-000000045381",
    "name": "Basketball U14",
    "description": "Basketball U14 squad.",
    "created_at": "2020-08-16",
    "address": "Kirchplatz 131, 80337 München",
    "sport": {
      "id": "cccccccc-0002-0000-b002-000000000002",
      "name": "Basketball"
    },
    "trainers": [
      { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" },
      { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" }
    ],
    "trainees": [
      { id: "99999999-0066-0006-0a1a-0000003f09ea", name: "Jonah Nowak" },
      { id: "99999999-0067-0006-a851-0000003fa821", name: "Luca Peters" },
      { id: "99999999-0068-0006-4689-000000404658", name: "Clara Seidel" },
      { id: "99999999-0069-0006-e4c0-00000040e48f", name: "Edda Pohl" },
      { id: "99999999-006a-0006-82f8-0000004182c6", name: "Ben Park" },
      { id: "99999999-006b-0006-212f-0000004220fd", name: "Felix Koch" },
      { id: "99999999-006c-0006-bf67-00000042bf34", name: "Toni Sauer" },
      { id: "99999999-006d-0006-5d9e-000000435d6b", name: "Tilda Albrecht" },
      { id: "99999999-006e-0006-fbd6-00000043fba2", name: "Ben Lehmann" },
      { id: "99999999-006f-0006-9a0d-0000004499d9", name: "Liv Brandt" }
    ]
  },
  {
    "id": "bbbbbbbb-0008-0000-f1bb-00000004f1b8",
    "name": "Basketball Squad 1",
    "description": "Basketball Squad 1 squad.",
    "created_at": "2019-08-24",
    "address": "Mühlgasse 134, 80337 München",
    "sport": {
      "id": "cccccccc-0002-0000-b002-000000000002",
      "name": "Basketball"
    },
    "trainers": [
      { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" },
      { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" }
    ],
    "trainees": [
      { id: "99999999-0070-0007-3845-000000453810", name: "Paul Albrecht" },
      { id: "99999999-0071-0007-d67c-00000045d647", name: "Nele Schwarz" },
      { id: "99999999-0072-0007-74b4-00000046747e", name: "Lena Pohl" },
      { id: "99999999-0073-0007-12eb-0000004712b5", name: "Helena Vogel" },
      { id: "99999999-0074-0007-b123-00000047b0ec", name: "Helena Wagner" },
      { id: "99999999-0075-0007-4f5a-000000484f23", name: "Emil Kaiser" },
      { id: "99999999-0076-0007-ed92-00000048ed5a", name: "Leon Diaz" },
      { id: "99999999-0077-0007-8bc9-000000498b91", name: "Ada Hoffmann" },
      { id: "99999999-0078-0007-2a01-0000004a29c8", name: "Oskar Nowak" },
      { id: "99999999-0079-0007-c838-0000004ac7ff", name: "Charlotte Berger" },
      { id: "99999999-007a-0007-666f-0000004b6636", name: "Leon Neumann" },
      { id: "99999999-007b-0007-04a7-0000004c046d", name: "Jonah Wagner" }
    ]
  },
  {
    "id": "bbbbbbbb-0009-0000-8ff3-000000058fef",
    "name": "Basketball Group B",
    "description": "Basketball Group B squad.",
    "created_at": "2020-05-08",
    "address": "Sonnenweg 93, 80333 München",
    "sport": {
      "id": "cccccccc-0002-0000-b002-000000000002",
      "name": "Basketball"
    },
    "trainers": [
      { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" }
    ],
    "trainees": [
      { id: "99999999-007c-0007-a2de-0000004ca2a4", name: "Erik Scholz" },
      { id: "99999999-007d-0007-4116-0000004d40db", name: "Mia Neumann" },
      { id: "99999999-007e-0007-df4d-0000004ddf12", name: "Elias Diaz" },
      { id: "99999999-007f-0007-7d85-0000004e7d49", name: "Tilda Neumann" },
      { id: "99999999-0080-0008-1bbc-0000004f1b80", name: "Noah Richter" },
      { id: "99999999-0081-0008-b9f4-0000004fb9b7", name: "Leon Busch" },
      { id: "99999999-0082-0008-582b-0000005057ee", name: "Aaron Sauer" },
      { id: "99999999-0083-0008-f663-00000050f625", name: "Mats Sommer" },
      { id: "99999999-0084-0008-949a-00000051945c", name: "Juna Reil" },
      { id: "99999999-0085-0008-32d2-000000523293", name: "Juna Braun" },
      { id: "99999999-0086-0008-d109-00000052d0ca", name: "Johanna Kaiser" },
      { id: "99999999-0087-0008-6f41-000000536f01", name: "Sofia Brandt" },
      { id: "99999999-0088-0008-0d78-000000540d38", name: "Samuel Vogel" }
    ]
  },
  {
    "id": "bbbbbbbb-000a-0000-2e2a-000000062e26",
    "name": "Swimming Juniors",
    "description": "Swimming Juniors squad.",
    "created_at": "2022-09-13",
    "address": "Rosenstraße 77, 80801 München",
    "sport": {
      "id": "cccccccc-0003-0000-5003-000000000003",
      "name": "Swimming"
    },
    "trainers": [
      { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" },
      { id: "99999999-0012-0001-1fe6-0000000b1fde", name: "Mats Klein" }
    ],
    "trainees": [
      { id: "99999999-0089-0008-abb0-00000054ab6f", name: "Hannah Pohl" },
      { id: "99999999-008a-0008-49e7-0000005549a6", name: "Fynn Reil" },
      { id: "99999999-008b-0008-e81f-00000055e7dd", name: "Toni Neumann" },
      { id: "99999999-008c-0008-8656-000000568614", name: "Moritz Wolf" },
      { id: "99999999-008d-0008-248e-00000057244b", name: "Frieda Winter" },
      { id: "99999999-008e-0008-c2c5-00000057c282", name: "Charlotte Schwarz" },
      { id: "99999999-008f-0008-60fc-0000005860b9", name: "Moritz Krause" }
    ]
  },
  {
    "id": "bbbbbbbb-000b-0000-cc62-00000006cc5d",
    "name": "Swimming Group A",
    "description": "Swimming Group A squad.",
    "created_at": "2020-02-08",
    "address": "Rosenstraße 77, 80333 München",
    "sport": {
      "id": "cccccccc-0003-0000-5003-000000000003",
      "name": "Swimming"
    },
    "trainers": [
      { id: "99999999-000d-0000-08d1-0000000808cb", name: "Coach Devoops" }
    ],
    "trainees": [
      { id: "99999999-0090-0009-ff34-00000058fef0", name: "Hannah Lange" },
      { id: "99999999-0091-0009-9d6b-000000599d27", name: "Smilla Busch" },
      { id: "99999999-0092-0009-3ba3-0000005a3b5e", name: "Ida Neumann" },
      { id: "99999999-0093-0009-d9da-0000005ad995", name: "Finn Vogel" },
      { id: "99999999-0094-0009-7812-0000005b77cc", name: "Greta Pohl" },
      { id: "99999999-0095-0009-1649-0000005c1603", name: "Lea Park" },
      { id: "99999999-0096-0009-b481-0000005cb43a", name: "Frieda Richter" },
      { id: "99999999-0097-0009-52b8-0000005d5271", name: "Stella Krüger" },
      { id: "99999999-0098-0009-f0f0-0000005df0a8", name: "Aaron Sommer" },
      { id: "99999999-0099-0009-8f27-0000005e8edf", name: "Bela Arnold" },
      { id: "99999999-009a-0009-2d5f-0000005f2d16", name: "Mathilda Kaiser" },
      { id: "99999999-009b-0009-cb96-0000005fcb4d", name: "Jonas Krause" },
      { id: "99999999-009c-0009-69ce-000000606984", name: "Carla Albrecht" },
      { id: "99999999-009d-0009-0805-0000006107bb", name: "Lena Kaiser" },
      { id: "99999999-009e-0009-a63d-00000061a5f2", name: "Joris Schulz" },
      { id: "99999999-009f-0009-4474-000000624429", name: "Wilma Otto" },
      { id: "99999999-00a0-000a-e2ac-00000062e260", name: "Jonah Peters" },
      { id: "99999999-00a1-000a-80e3-000000638097", name: "Amelie Lange" },
      { id: "99999999-00a2-000a-1f1b-000000641ece", name: "Jonas Nowak" },
      { id: "99999999-00a3-000a-bd52-00000064bd05", name: "Emil Krause" },
      { id: "99999999-00a4-000a-5b89-000000655b3c", name: "Smilla Hoffmann" }
    ]
  },
  {
    "id": "bbbbbbbb-000c-0000-6a99-000000076a94",
    "name": "Swimming Group B",
    "description": "Swimming Group B squad.",
    "created_at": "2024-08-24",
    "address": "Kirchplatz 46, 80333 München",
    "sport": {
      "id": "cccccccc-0003-0000-5003-000000000003",
      "name": "Swimming"
    },
    "trainers": [
      { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" },
      { id: "99999999-000f-0000-4540-000000094539", name: "Mara Koch" }
    ],
    "trainees": [
      { id: "99999999-00a5-000a-f9c1-00000065f973", name: "Toni Huber" },
      { id: "99999999-00a6-000a-97f8-0000006697aa", name: "Jan Lange" },
      { id: "99999999-00a7-000a-3630-0000006735e1", name: "Carla Arnold" },
      { id: "99999999-00a8-000a-d467-00000067d418", name: "Noah Braun" },
      { id: "99999999-00a9-000a-729f-00000068724f", name: "Alma Busch" },
      { id: "99999999-00aa-000a-10d6-000000691086", name: "Bela Klein" },
      { id: "99999999-00ab-000a-af0e-00000069aebd", name: "Bruno Berger" },
      { id: "99999999-00ac-000a-4d45-0000006a4cf4", name: "Romy Beck" },
      { id: "99999999-00ad-000a-eb7d-0000006aeb2b", name: "Joris Hoffmann" }
    ]
  },
  {
    "id": "bbbbbbbb-000d-0000-08d1-0000000808cb",
    "name": "Swimming Seniors",
    "description": "Swimming Seniors squad.",
    "created_at": "2024-10-28",
    "address": "Birkenallee 88, 80333 München",
    "sport": {
      "id": "cccccccc-0003-0000-5003-000000000003",
      "name": "Swimming"
    },
    "trainers": [
      { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" }
    ],
    "trainees": [
      { id: "99999999-00ae-000a-89b4-0000006b8962", name: "Jonah König" },
      { id: "99999999-00af-000a-27ec-0000006c2799", name: "Emil Stein" },
      { id: "99999999-00b0-000b-c623-0000006cc5d0", name: "Mira Kaiser" },
      { id: "99999999-00b1-000b-645b-0000006d6407", name: "Elias Braun" },
      { id: "99999999-00b2-000b-0292-0000006e023e", name: "Noah Beck" },
      { id: "99999999-00b3-000b-a0ca-0000006ea075", name: "David Klein" },
      { id: "99999999-00b4-000b-3f01-0000006f3eac", name: "Leon Berger" }
    ]
  },
  {
    "id": "bbbbbbbb-000e-0000-a708-00000008a702",
    "name": "Swimming Squad 1",
    "description": "Swimming Squad 1 squad.",
    "created_at": "2021-05-05",
    "address": "Sonnenweg 24, 80636 München",
    "sport": {
      "id": "cccccccc-0003-0000-5003-000000000003",
      "name": "Swimming"
    },
    "trainers": [
      { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" },
      { id: "99999999-0006-0000-b54c-00000003b54a", name: "Erik Berger" }
    ],
    "trainees": [
      { id: "99999999-00b5-000b-dd39-0000006fdce3", name: "Marco Bauer" },
      { id: "99999999-00b6-000b-7b70-000000707b1a", name: "Finn Neumann" },
      { id: "99999999-00b7-000b-19a7-000000711951", name: "Konrad Klein" },
      { id: "99999999-00b8-000b-b7df-00000071b788", name: "Ben Frank" },
      { id: "99999999-00b9-000b-5616-0000007255bf", name: "Frida Brandt" },
      { id: "99999999-00ba-000b-f44e-00000072f3f6", name: "Lea Brandt" },
      { id: "99999999-00bb-000b-9285-00000073922d", name: "Sofia Pohl" },
      { id: "99999999-00bc-000b-30bd-000000743064", name: "Jonah Park" },
      { id: "99999999-00bd-000b-cef4-00000074ce9b", name: "Mara Engel" },
      { id: "99999999-00be-000b-6d2c-000000756cd2", name: "Emil Diaz" },
      { id: "99999999-00bf-000b-0b63-000000760b09", name: "David Braun" },
      { id: "99999999-00c0-000c-a99b-00000076a940", name: "Aaron Hoffmann" }
    ]
  },
  {
    "id": "bbbbbbbb-000f-0000-4540-000000094539",
    "name": "Athletics Group A",
    "description": "Athletics Group A squad.",
    "created_at": "2022-09-24",
    "address": "Lindenstraße 37, 81667 München",
    "sport": {
      "id": "cccccccc-0004-0000-a004-000000000004",
      "name": "Athletics"
    },
    "trainers": [
      { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" }
    ],
    "trainees": [
      { id: "99999999-00c1-000c-47d2-000000774777", name: "Emil Schwarz" },
      { id: "99999999-00c2-000c-e60a-00000077e5ae", name: "Bela Kaiser" },
      { id: "99999999-00c3-000c-8441-0000007883e5", name: "Rosa Frank" },
      { id: "99999999-00c4-000c-2279-00000079221c", name: "Frida Neumann" },
      { id: "99999999-00c5-000c-c0b0-00000079c053", name: "Clara Hartmann" },
      { id: "99999999-00c6-000c-5ee8-0000007a5e8a", name: "Edda Vogt" },
      { id: "99999999-00c7-000c-fd1f-0000007afcc1", name: "Leon Beck" },
      { id: "99999999-00c8-000c-9b57-0000007b9af8", name: "Emil Klein" },
      { id: "99999999-00c9-000c-398e-0000007c392f", name: "Jonas Stein" },
      { id: "99999999-00ca-000c-d7c6-0000007cd766", name: "Nele Seidel" },
      { id: "99999999-00cb-000c-75fd-0000007d759d", name: "Moritz Busch" },
      { id: "99999999-00cc-000c-1434-0000007e13d4", name: "Rosa Klein" },
      { id: "99999999-00cd-000c-b26c-0000007eb20b", name: "Samuel Winter" },
      { id: "99999999-00ce-000c-50a3-0000007f5042", name: "Bruno Hartmann" },
      { id: "99999999-00cf-000c-eedb-0000007fee79", name: "Toni Krause" },
      { id: "99999999-00d0-000d-8d12-000000808cb0", name: "Lotte Richter" }
    ]
  },
  {
    "id": "bbbbbbbb-0010-0001-e377-00000009e370",
    "name": "Athletics Development",
    "description": "Athletics Development squad.",
    "created_at": "2019-10-14",
    "address": "Birkenallee 116, 80331 München",
    "sport": {
      "id": "cccccccc-0004-0000-a004-000000000004",
      "name": "Athletics"
    },
    "trainers": [
      { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" }
    ],
    "trainees": [
      { id: "99999999-00d1-000d-2b4a-000000812ae7", name: "Lotte Frank" },
      { id: "99999999-00d2-000d-c981-00000081c91e", name: "Mara Seidel" },
      { id: "99999999-00d3-000d-67b9-000000826755", name: "Ella Pohl" },
      { id: "99999999-00d4-000d-05f0-00000083058c", name: "Martha Engel" },
      { id: "99999999-00d5-000d-a428-00000083a3c3", name: "Alma Vogel" },
      { id: "99999999-00d6-000d-425f-0000008441fa", name: "Nele Scholz" },
      { id: "99999999-00d7-000d-e097-00000084e031", name: "Oskar Stein" },
      { id: "99999999-00d8-000d-7ece-000000857e68", name: "Juna Diaz" },
      { id: "99999999-00d9-000d-1d06-000000861c9f", name: "Wilma Stein" },
      { id: "99999999-00da-000d-bb3d-00000086bad6", name: "Fynn Hoffmann" },
      { id: "99999999-00db-000d-5975-00000087590d", name: "Ida Vogel" },
      { id: "99999999-00dc-000d-f7ac-00000087f744", name: "Levi Beck" },
      { id: "99999999-00dd-000d-95e4-00000088957b", name: "Felix Krause" },
      { id: "99999999-00de-000d-341b-0000008933b2", name: "Helena Koch" },
      { id: "99999999-00df-000d-d253-00000089d1e9", name: "Toni Seidel" },
      { id: "99999999-00e0-000e-708a-0000008a7020", name: "Nele Braun" },
      { id: "99999999-00e1-000e-0ec1-0000008b0e57", name: "Ella Nowak" },
      { id: "99999999-00e2-000e-acf9-0000008bac8e", name: "Ben Busch" }
    ]
  },
  {
    "id": "bbbbbbbb-0011-0001-81af-0000000a81a7",
    "name": "Athletics Varsity",
    "description": "Athletics Varsity squad.",
    "created_at": "2024-10-07",
    "address": "Schulstraße 53, 80333 München",
    "sport": {
      "id": "cccccccc-0004-0000-a004-000000000004",
      "name": "Athletics"
    },
    "trainers": [
      { id: "99999999-0010-0001-e377-00000009e370", name: "Wilma Vogt" }
    ],
    "trainees": [
      { id: "99999999-00e3-000e-4b30-0000008c4ac5", name: "Nele Brandt" },
      { id: "99999999-00e4-000e-e968-0000008ce8fc", name: "Jonah Frank" },
      { id: "99999999-00e5-000e-879f-0000008d8733", name: "Aaron Arnold" },
      { id: "99999999-00e6-000e-25d7-0000008e256a", name: "Romi König" },
      { id: "99999999-00e7-000e-c40e-0000008ec3a1", name: "Amelie Seidel" },
      { id: "99999999-00e8-000e-6246-0000008f61d8", name: "Lea Stein" },
      { id: "99999999-00e9-000e-007d-00000090000f", name: "Arne Horn" },
      { id: "99999999-00ea-000e-9eb5-000000909e46", name: "Mira Klein" },
      { id: "99999999-00eb-000e-3cec-000000913c7d", name: "Emil Sauer" },
      { id: "99999999-00ec-000e-db24-00000091dab4", name: "Romi Park" },
      { id: "99999999-00ed-000e-795b-0000009278eb", name: "Mats Horn" },
      { id: "99999999-00ee-000e-1793-000000931722", name: "Lina Krüger" },
      { id: "99999999-00ef-000e-b5ca-00000093b559", name: "Henry Hartmann" },
      { id: "99999999-00f0-000f-5402-000000945390", name: "Jonah Braun" },
      { id: "99999999-00f1-000f-f239-00000094f1c7", name: "Charlotte Ziegler" },
      { id: "99999999-00f2-000f-9071-000000958ffe", name: "Rosa Brandt" },
      { id: "99999999-00f3-000f-2ea8-000000962e35", name: "Marie Nowak" },
      { id: "99999999-00f4-000f-ccdf-00000096cc6c", name: "Stella Frank" }
    ]
  },
  {
    "id": "bbbbbbbb-0012-0001-1fe6-0000000b1fde",
    "name": "Athletics Masters",
    "description": "Athletics Masters squad.",
    "created_at": "2021-03-22",
    "address": "Birkenallee 84, 80469 München",
    "sport": {
      "id": "cccccccc-0004-0000-a004-000000000004",
      "name": "Athletics"
    },
    "trainers": [
      { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" }
    ],
    "trainees": [
      { id: "99999999-00f5-000f-6b17-000000976aa3", name: "Til Lehmann" },
      { id: "99999999-00f6-000f-094e-0000009808da", name: "Anton Vogt" },
      { id: "99999999-00f7-000f-a786-00000098a711", name: "Marco Krüger" },
      { id: "99999999-00f8-000f-45bd-000000994548", name: "Til Bauer" },
      { id: "99999999-00f9-000f-e3f5-00000099e37f", name: "Joris Huber" },
      { id: "99999999-00fa-000f-822c-0000009a81b6", name: "Mara Vogel" },
      { id: "99999999-00fb-000f-2064-0000009b1fed", name: "Martha Vogel" },
      { id: "99999999-00fc-000f-be9b-0000009bbe24", name: "Mats Kaiser" },
      { id: "99999999-00fd-000f-5cd3-0000009c5c5b", name: "Linus Hartmann" },
      { id: "99999999-00fe-000f-fb0a-0000009cfa92", name: "Erik Schulz" },
      { id: "99999999-00ff-000f-9942-0000009d98c9", name: "Ida Kaiser" },
      { id: "99999999-0100-0010-3779-0000009e3700", name: "Felix Brandt" },
      { id: "99999999-0101-0010-d5b1-0000009ed537", name: "Clara Pohl" },
      { id: "99999999-0102-0010-73e8-0000009f736e", name: "Niklas Fuchs" },
      { id: "99999999-0103-0010-1220-000000a011a5", name: "Leon Roth" },
      { id: "99999999-0104-0010-b057-000000a0afdc", name: "Alma Roth" },
      { id: "99999999-0105-0010-4e8f-000000a14e13", name: "Levi Kaiser" },
      { id: "99999999-0106-0010-ecc6-000000a1ec4a", name: "Nele Kaiser" },
      { id: "99999999-0107-0010-8afe-000000a28a81", name: "Greta Sommer" },
      { id: "99999999-0108-0010-2935-000000a328b8", name: "Helena Park" },
      { id: "99999999-0109-0010-c76c-000000a3c6ef", name: "Alma Frank" }
    ]
  },
  {
    "id": "bbbbbbbb-0013-0001-be1e-0000000bbe15",
    "name": "Volleyball Juniors",
    "description": "Volleyball Juniors squad.",
    "created_at": "2024-06-15",
    "address": "Birkenallee 28, 80538 München",
    "sport": {
      "id": "cccccccc-0005-0000-0005-000000000005",
      "name": "Volleyball"
    },
    "trainers": [
      { id: "99999999-000a-0000-2e2a-000000062e26", name: "Ella Frank" },
      { id: "99999999-000c-0000-6a99-000000076a94", name: "Liv Scholz" }
    ],
    "trainees": [
      { id: "99999999-010a-0010-65a4-000000a46526", name: "Ida Voigt" },
      { id: "99999999-010b-0010-03db-000000a5035d", name: "Theo Roth" },
      { id: "99999999-010c-0010-a213-000000a5a194", name: "Joris Krause" },
      { id: "99999999-010d-0010-404a-000000a63fcb", name: "Mia Braun" },
      { id: "99999999-010e-0010-de82-000000a6de02", name: "Magda Bauer" },
      { id: "99999999-010f-0010-7cb9-000000a77c39", name: "Martha Diaz" },
      { id: "99999999-0110-0011-1af1-000000a81a70", name: "Mira Roth" },
      { id: "99999999-0111-0011-b928-000000a8b8a7", name: "Romy Park" }
    ]
  },
  {
    "id": "bbbbbbbb-0014-0001-5c55-0000000c5c4c",
    "name": "Volleyball Squad 1",
    "description": "Volleyball Squad 1 squad.",
    "created_at": "2022-04-11",
    "address": "Uferweg 19, 80333 München",
    "sport": {
      "id": "cccccccc-0005-0000-0005-000000000005",
      "name": "Volleyball"
    },
    "trainers": [
      { id: "99999999-0007-0000-5384-000000045381", name: "Lina Zimmermann" }
    ],
    "trainees": [
      { id: "99999999-0112-0011-5760-000000a956de", name: "Paul Reil" },
      { id: "99999999-0113-0011-f597-000000a9f515", name: "Nora Diaz" },
      { id: "99999999-0114-0011-93cf-000000aa934c", name: "Samuel Koch" },
      { id: "99999999-0115-0011-3206-000000ab3183", name: "Wilma Braun" },
      { id: "99999999-0116-0011-d03e-000000abcfba", name: "Pia Zimmermann" },
      { id: "99999999-0117-0011-6e75-000000ac6df1", name: "Sofia Wolf" },
      { id: "99999999-0118-0011-0cad-000000ad0c28", name: "Joris Arnold" },
      { id: "99999999-0119-0011-aae4-000000adaa5f", name: "Elias Busch" },
      { id: "99999999-011a-0011-491c-000000ae4896", name: "Jonah Diaz" },
      { id: "99999999-011b-0011-e753-000000aee6cd", name: "Mats Fuchs" },
      { id: "99999999-011c-0011-858b-000000af8504", name: "Greta Koch" },
      { id: "99999999-011d-0011-23c2-000000b0233b", name: "Janne Vogel" },
      { id: "99999999-011e-0011-c1f9-000000b0c172", name: "Amelie Wolf" },
      { id: "99999999-011f-0011-6031-000000b15fa9", name: "Leon Sommer" },
      { id: "99999999-0120-0012-fe68-000000b1fde0", name: "Lea Engel" },
      { id: "99999999-0121-0012-9ca0-000000b29c17", name: "Stella Braun" },
      { id: "99999999-0122-0012-3ad7-000000b33a4e", name: "Helena König" },
      { id: "99999999-0123-0012-d90f-000000b3d885", name: "Edda Nowak" },
      { id: "99999999-0124-0012-7746-000000b476bc", name: "Nora Hoffmann" },
      { id: "99999999-0125-0012-157e-000000b514f3", name: "Nele Krause" },
      { id: "99999999-0126-0012-b3b5-000000b5b32a", name: "Johanna Frank" },
      { id: "99999999-0127-0012-51ed-000000b65161", name: "Emil Schulz" }
    ]
  },
  {
    "id": "bbbbbbbb-0015-0001-fa8c-0000000cfa83",
    "name": "Volleyball Squad 2",
    "description": "Volleyball Squad 2 squad.",
    "created_at": "2024-10-15",
    "address": "Bergstraße 75, 80333 München",
    "sport": {
      "id": "cccccccc-0005-0000-0005-000000000005",
      "name": "Volleyball"
    },
    "trainers": [
      { id: "99999999-0011-0001-81af-0000000a81a7", name: "Niklas Engel" }
    ],
    "trainees": [
      { id: "99999999-0128-0012-f024-000000b6ef98", name: "Linus Scholz" },
      { id: "99999999-0129-0012-8e5c-000000b78dcf", name: "Luca Schulz" },
      { id: "99999999-012a-0012-2c93-000000b82c06", name: "Clara Voigt" },
      { id: "99999999-012b-0012-cacb-000000b8ca3d", name: "Noah Schulz" },
      { id: "99999999-012c-0012-6902-000000b96874", name: "Linus Graf" },
      { id: "99999999-012d-0012-073a-000000ba06ab", name: "Mats Voigt" },
      { id: "99999999-012e-0012-a571-000000baa4e2", name: "Janne Albrecht" },
      { id: "99999999-012f-0012-43a9-000000bb4319", name: "Nora Bauer" },
      { id: "99999999-0130-0013-e1e0-000000bbe150", name: "Luca Wolf" }
    ]
  },
  {
    "id": "bbbbbbbb-0016-0001-98c4-0000000d98ba",
    "name": "Volleyball U16",
    "description": "Volleyball U16 squad.",
    "created_at": "2021-09-20",
    "address": "Rosenstraße 25, 80331 München",
    "sport": {
      "id": "cccccccc-0005-0000-0005-000000000005",
      "name": "Volleyball"
    },
    "trainers": [
      { id: "99999999-0009-0000-8ff3-000000058fef", name: "Magda Huber" },
      { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" }
    ],
    "trainees": [
      { id: "99999999-0131-0013-8017-000000bc7f87", name: "Ada Kaiser" },
      { id: "99999999-0132-0013-1e4f-000000bd1dbe", name: "Emil Engel" },
      { id: "99999999-0133-0013-bc86-000000bdbbf5", name: "Max Ziegler" },
      { id: "99999999-0134-0013-5abe-000000be5a2c", name: "Linus Vogt" },
      { id: "99999999-0135-0013-f8f5-000000bef863", name: "Romi Vogt" },
      { id: "99999999-0136-0013-972d-000000bf969a", name: "Moritz Albrecht" },
      { id: "99999999-0137-0013-3564-000000c034d1", name: "Juna Schulz" },
      { id: "99999999-0138-0013-d39c-000000c0d308", name: "Rosa Koch" },
      { id: "99999999-0139-0013-71d3-000000c1713f", name: "Janne Park" },
      { id: "99999999-013a-0013-100b-000000c20f76", name: "Romy Sauer" },
      { id: "99999999-013b-0013-ae42-000000c2adad", name: "Lina Beck" },
      { id: "99999999-013c-0013-4c7a-000000c34be4", name: "Theo Hoffmann" },
      { id: "99999999-013d-0013-eab1-000000c3ea1b", name: "Alma Klein" },
      { id: "99999999-013e-0013-88e9-000000c48852", name: "Martha Lange" },
      { id: "99999999-013f-0013-2720-000000c52689", name: "Levi Brandt" },
      { id: "99999999-0140-0014-c558-000000c5c4c0", name: "Mats Hartmann" },
      { id: "99999999-0141-0014-638f-000000c662f7", name: "Amelie Diaz" },
      { id: "99999999-0142-0014-01c7-000000c7012e", name: "Anton Braun" },
      { id: "99999999-0143-0014-9ffe-000000c79f65", name: "Emil Busch" }
    ]
  },
  {
    "id": "bbbbbbbb-0017-0001-36fb-0000000e36f1",
    "name": "Volleyball Varsity",
    "description": "Volleyball Varsity squad.",
    "created_at": "2024-08-12",
    "address": "Uferweg 126, 80636 München",
    "sport": {
      "id": "cccccccc-0005-0000-0005-000000000005",
      "name": "Volleyball"
    },
    "trainers": [
      { id: "99999999-000e-0000-a708-00000008a702", name: "Smilla Frank" }
    ],
    "trainees": [
      { id: "99999999-0144-0014-3e36-000000c83d9c", name: "Fynn Bauer" },
      { id: "99999999-0145-0014-dc6d-000000c8dbd3", name: "David Zimmermann" },
      { id: "99999999-0146-0014-7aa4-000000c97a0a", name: "Noah Klein" },
      { id: "99999999-0147-0014-18dc-000000ca1841", name: "Henry Huber" },
      { id: "99999999-0148-0014-b713-000000cab678", name: "Rosa Schulz" },
      { id: "99999999-0149-0014-554b-000000cb54af", name: "Lotte Engel" },
      { id: "99999999-014a-0014-f382-000000cbf2e6", name: "Samuel Wolf" },
      { id: "99999999-014b-0014-91ba-000000cc911d", name: "Konrad Sommer" },
      { id: "99999999-014c-0014-2ff1-000000cd2f54", name: "Elias Wolf" },
      { id: "99999999-014d-0014-ce29-000000cdcd8b", name: "Konrad Beck" },
      { id: "99999999-014e-0014-6c60-000000ce6bc2", name: "Hannah Arnold" },
      { id: "99999999-014f-0014-0a98-000000cf09f9", name: "Bruno Krüger" },
      { id: "99999999-0150-0015-a8cf-000000cfa830", name: "Luca Pohl" },
      { id: "99999999-0151-0015-4707-000000d04667", name: "Aaron Huber" },
      { id: "99999999-0152-0015-e53e-000000d0e49e", name: "Paul Engel" }
    ]
  }
]

export const TEAM_U16 = 'bbbbbbbb-0001-0000-9e37-000000009e37'

export const sportsById: Record<string, Sport> = Object.fromEntries(
  sportFixtures.map((s) => [s.id, s]),
)

export const teamsBySport: Record<string, Team[]> = sportFixtures.reduce(
  (acc, s) => {
    acc[s.id] = teamFixtures.filter((t) => t.sport.id === s.id)
    return acc
  },
  {} as Record<string, Team[]>,
)

export const myTeamFixtures: Team[] = teamFixtures.filter((t) =>
  t.trainees.some((m) => m.id === CURRENT_MEMBER_ID),
)
