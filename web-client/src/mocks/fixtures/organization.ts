import type { Sport, Team } from '@/types'
import { CURRENT_MEMBER_ID } from './members'

// Sport is keyed by name; Team.sport is a sport name; member FKs are resolved refs.
export const sportFixtures: Sport[] = [
  {
    "name": "Football",
    "description": "Eleven-a-side football across youth and senior squads.",
    "created_at": "2021-10-08",
    "directors": [
      {
        "id": "99999999-0003-0000-daa6-00000001daa5",
        "first_name": "Director",
        "last_name": "Devoops"
      },
      {
        "id": "99999999-0001-0000-9e37-000000009e37",
        "first_name": "Johanna",
        "last_name": "Horn"
      }
    ]
  },
  {
    "name": "Basketball",
    "description": "Indoor basketball for juniors through varsity level.",
    "created_at": "2022-06-09",
    "directors": [
      {
        "id": "99999999-0001-0000-9e37-000000009e37",
        "first_name": "Johanna",
        "last_name": "Horn"
      },
      {
        "id": "99999999-0003-0000-daa6-00000001daa5",
        "first_name": "Director",
        "last_name": "Devoops"
      }
    ]
  },
  {
    "name": "Swimming",
    "description": "Lane swimming, technique and competitive squads.",
    "created_at": "2020-12-11",
    "directors": [
      {
        "id": "99999999-0001-0000-9e37-000000009e37",
        "first_name": "Johanna",
        "last_name": "Horn"
      },
      {
        "id": "99999999-0002-0000-3c6e-000000013c6e",
        "first_name": "Tilda",
        "last_name": "Huber"
      }
    ]
  },
  {
    "name": "Athletics",
    "description": "Track and field — sprints, distance, jumps and throws.",
    "created_at": "2018-02-22",
    "directors": [
      {
        "id": "99999999-0002-0000-3c6e-000000013c6e",
        "first_name": "Tilda",
        "last_name": "Huber"
      }
    ]
  },
  {
    "name": "Volleyball",
    "description": "Six-a-side indoor volleyball, mixed and youth groups.",
    "created_at": "2022-06-26",
    "directors": [
      {
        "id": "99999999-0001-0000-9e37-000000009e37",
        "first_name": "Johanna",
        "last_name": "Horn"
      }
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
    "sport": "Football",
    "trainers": [
      {
        "id": "99999999-000d-0000-08d1-0000000808cb",
        "first_name": "Coach",
        "last_name": "Devoops"
      }
    ],
    "trainees": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "first_name": "Lena",
        "last_name": "Roth"
      },
      {
        "id": "99999999-0013-0001-be1e-0000000bbe15",
        "first_name": "Marie",
        "last_name": "Wolf"
      },
      {
        "id": "99999999-0014-0001-5c55-0000000c5c4c",
        "first_name": "Linus",
        "last_name": "Koch"
      },
      {
        "id": "99999999-0015-0001-fa8c-0000000cfa83",
        "first_name": "Linus",
        "last_name": "Beck"
      },
      {
        "id": "99999999-0016-0001-98c4-0000000d98ba",
        "first_name": "Clara",
        "last_name": "Frank"
      },
      {
        "id": "99999999-0017-0001-36fb-0000000e36f1",
        "first_name": "Edda",
        "last_name": "Frank"
      },
      {
        "id": "99999999-0018-0001-d533-0000000ed528",
        "first_name": "Mia",
        "last_name": "Werner"
      },
      {
        "id": "99999999-0019-0001-736a-0000000f735f",
        "first_name": "Charlotte",
        "last_name": "Wagner"
      },
      {
        "id": "99999999-001a-0001-11a2-000000101196",
        "first_name": "Jakob",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-001b-0001-afd9-00000010afcd",
        "first_name": "Ella",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-001c-0001-4e11-000000114e04",
        "first_name": "Erik",
        "last_name": "Lange"
      },
      {
        "id": "99999999-001d-0001-ec48-00000011ec3b",
        "first_name": "Janne",
        "last_name": "Roth"
      },
      {
        "id": "99999999-001e-0001-8a80-000000128a72",
        "first_name": "Theo",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-001f-0001-28b7-0000001328a9",
        "first_name": "Samuel",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-0020-0002-c6ef-00000013c6e0",
        "first_name": "Levi",
        "last_name": "Voigt"
      },
      {
        "id": "99999999-0021-0002-6526-000000146517",
        "first_name": "Mia",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-0022-0002-035e-00000015034e",
        "first_name": "Ida",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-0023-0002-a195-00000015a185",
        "first_name": "Oskar",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-0024-0002-3fcd-000000163fbc",
        "first_name": "Clara",
        "last_name": "Koch"
      },
      {
        "id": "99999999-0025-0002-de04-00000016ddf3",
        "first_name": "Fynn",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-0026-0002-7c3c-000000177c2a",
        "first_name": "Moritz",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-0027-0002-1a73-000000181a61",
        "first_name": "Nora",
        "last_name": "Krause"
      },
      {
        "id": "99999999-0028-0002-b8ab-00000018b898",
        "first_name": "Mats",
        "last_name": "Huber"
      },
      {
        "id": "99999999-0029-0002-56e2-0000001956cf",
        "first_name": "Oskar",
        "last_name": "Werner"
      },
      {
        "id": "99999999-002a-0002-f519-00000019f506",
        "first_name": "Erik",
        "last_name": "Richter"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0002-0000-3c6e-000000013c6e",
    "name": "Football Group A",
    "description": "Football Group A squad.",
    "created_at": "2022-06-01",
    "address": "Mühlgasse 25, 81667 München",
    "sport": "Football",
    "trainers": [
      {
        "id": "99999999-000a-0000-2e2a-000000062e26",
        "first_name": "Ella",
        "last_name": "Frank"
      }
    ],
    "trainees": [
      {
        "id": "99999999-002b-0002-9351-0000001a933d",
        "first_name": "David",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-002c-0002-3188-0000001b3174",
        "first_name": "Marie",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-002d-0002-cfc0-0000001bcfab",
        "first_name": "Romi",
        "last_name": "Werner"
      },
      {
        "id": "99999999-002e-0002-6df7-0000001c6de2",
        "first_name": "Wilma",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-002f-0002-0c2f-0000001d0c19",
        "first_name": "Romi",
        "last_name": "Fuchs"
      },
      {
        "id": "99999999-0030-0003-aa66-0000001daa50",
        "first_name": "Ben",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-0031-0003-489e-0000001e4887",
        "first_name": "Edda",
        "last_name": "Zimmermann"
      },
      {
        "id": "99999999-0032-0003-e6d5-0000001ee6be",
        "first_name": "Toni",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-0033-0003-850d-0000001f84f5",
        "first_name": "Ida",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-0034-0003-2344-00000020232c",
        "first_name": "Stella",
        "last_name": "Zimmermann"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0003-0000-daa6-00000001daa5",
    "name": "Football Squad 2",
    "description": "Football Squad 2 squad.",
    "created_at": "2024-05-14",
    "address": "Sonnenweg 49, 80331 München",
    "sport": "Football",
    "trainers": [
      {
        "id": "99999999-000b-0000-cc62-00000006cc5d",
        "first_name": "Felix",
        "last_name": "Voigt"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0035-0003-c17c-00000020c163",
        "first_name": "Helena",
        "last_name": "Berger"
      },
      {
        "id": "99999999-0036-0003-5fb3-000000215f9a",
        "first_name": "Vincent",
        "last_name": "Richter"
      },
      {
        "id": "99999999-0037-0003-fdeb-00000021fdd1",
        "first_name": "Anton",
        "last_name": "Frank"
      },
      {
        "id": "99999999-0038-0003-9c22-000000229c08",
        "first_name": "Greta",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-0039-0003-3a5a-000000233a3f",
        "first_name": "Clara",
        "last_name": "Stein"
      },
      {
        "id": "99999999-003a-0003-d891-00000023d876",
        "first_name": "Joris",
        "last_name": "Stein"
      },
      {
        "id": "99999999-003b-0003-76c9-0000002476ad",
        "first_name": "Frieda",
        "last_name": "Bauer"
      },
      {
        "id": "99999999-003c-0003-1500-0000002514e4",
        "first_name": "Martha",
        "last_name": "Schwarz"
      },
      {
        "id": "99999999-003d-0003-b337-00000025b31b",
        "first_name": "Fynn",
        "last_name": "Koch"
      },
      {
        "id": "99999999-003e-0003-516f-000000265152",
        "first_name": "Marie",
        "last_name": "Fuchs"
      },
      {
        "id": "99999999-003f-0003-efa6-00000026ef89",
        "first_name": "Joris",
        "last_name": "Lehmann"
      },
      {
        "id": "99999999-0040-0004-8dde-000000278dc0",
        "first_name": "Helena",
        "last_name": "Graf"
      },
      {
        "id": "99999999-0041-0004-2c15-000000282bf7",
        "first_name": "Smilla",
        "last_name": "Krause"
      },
      {
        "id": "99999999-0042-0004-ca4d-00000028ca2e",
        "first_name": "Konrad",
        "last_name": "Schwarz"
      },
      {
        "id": "99999999-0043-0004-6884-000000296865",
        "first_name": "Rosa",
        "last_name": "Zimmermann"
      },
      {
        "id": "99999999-0044-0004-06bc-0000002a069c",
        "first_name": "Arne",
        "last_name": "Zimmermann"
      },
      {
        "id": "99999999-0045-0004-a4f3-0000002aa4d3",
        "first_name": "Mats",
        "last_name": "Graf"
      },
      {
        "id": "99999999-0046-0004-432b-0000002b430a",
        "first_name": "Martha",
        "last_name": "Voigt"
      },
      {
        "id": "99999999-0047-0004-e162-0000002be141",
        "first_name": "Stella",
        "last_name": "Horn"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0004-0000-78dd-0000000278dc",
    "name": "Football Seniors",
    "description": "Football Seniors squad.",
    "created_at": "2023-05-18",
    "address": "Birkenallee 109, 80333 München",
    "sport": "Football",
    "trainers": [
      {
        "id": "99999999-0006-0000-b54c-00000003b54a",
        "first_name": "Erik",
        "last_name": "Berger"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0048-0004-7f9a-0000002c7f78",
        "first_name": "Levi",
        "last_name": "Lange"
      },
      {
        "id": "99999999-0049-0004-1dd1-0000002d1daf",
        "first_name": "Henry",
        "last_name": "Richter"
      },
      {
        "id": "99999999-004a-0004-bc09-0000002dbbe6",
        "first_name": "Liv",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-004b-0004-5a40-0000002e5a1d",
        "first_name": "Vincent",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-004c-0004-f878-0000002ef854",
        "first_name": "Tomas",
        "last_name": "Hartmann"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0005-0000-1715-000000031713",
    "name": "Basketball Masters",
    "description": "Basketball Masters squad.",
    "created_at": "2019-10-15",
    "address": "Kirchplatz 104, 80337 München",
    "sport": "Basketball",
    "trainers": [
      {
        "id": "99999999-0008-0000-f1bb-00000004f1b8",
        "first_name": "Theo",
        "last_name": "Albrecht"
      }
    ],
    "trainees": [
      {
        "id": "99999999-004d-0004-96af-0000002f968b",
        "first_name": "Frida",
        "last_name": "Fuchs"
      },
      {
        "id": "99999999-004e-0004-34e7-0000003034c2",
        "first_name": "Luca",
        "last_name": "Ziegler"
      },
      {
        "id": "99999999-004f-0004-d31e-00000030d2f9",
        "first_name": "Til",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-0050-0005-7156-000000317130",
        "first_name": "Finn",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-0051-0005-0f8d-000000320f67",
        "first_name": "Paul",
        "last_name": "Busch"
      },
      {
        "id": "99999999-0052-0005-adc4-00000032ad9e",
        "first_name": "Martha",
        "last_name": "Braun"
      },
      {
        "id": "99999999-0053-0005-4bfc-000000334bd5",
        "first_name": "Johanna",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-0054-0005-ea33-00000033ea0c",
        "first_name": "Marie",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-0055-0005-886b-000000348843",
        "first_name": "Tomas",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-0056-0005-26a2-00000035267a",
        "first_name": "Lina",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-0057-0005-c4da-00000035c4b1",
        "first_name": "Helena",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-0058-0005-6311-0000003662e8",
        "first_name": "Leon",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-0059-0005-0149-00000037011f",
        "first_name": "Paul",
        "last_name": "Werner"
      },
      {
        "id": "99999999-005a-0005-9f80-000000379f56",
        "first_name": "Alma",
        "last_name": "Beck"
      },
      {
        "id": "99999999-005b-0005-3db8-000000383d8d",
        "first_name": "Romy",
        "last_name": "Voigt"
      },
      {
        "id": "99999999-005c-0005-dbef-00000038dbc4",
        "first_name": "Felix",
        "last_name": "Frank"
      },
      {
        "id": "99999999-005d-0005-7a27-0000003979fb",
        "first_name": "Jakob",
        "last_name": "Klein"
      },
      {
        "id": "99999999-005e-0005-185e-0000003a1832",
        "first_name": "Ben",
        "last_name": "Horn"
      },
      {
        "id": "99999999-005f-0005-b696-0000003ab669",
        "first_name": "Jonah",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-0060-0006-54cd-0000003b54a0",
        "first_name": "Lina",
        "last_name": "Graf"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0006-0000-b54c-00000003b54a",
    "name": "Basketball Juniors",
    "description": "Basketball Juniors squad.",
    "created_at": "2019-01-22",
    "address": "Ahornweg 41, 80331 München",
    "sport": "Basketball",
    "trainers": [
      {
        "id": "99999999-0006-0000-b54c-00000003b54a",
        "first_name": "Erik",
        "last_name": "Berger"
      }
    ],
    "trainees": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "first_name": "Lena",
        "last_name": "Roth"
      },
      {
        "id": "99999999-0061-0006-f305-0000003bf2d7",
        "first_name": "Leon",
        "last_name": "Braun"
      },
      {
        "id": "99999999-0062-0006-913c-0000003c910e",
        "first_name": "Lotte",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-0063-0006-2f74-0000003d2f45",
        "first_name": "Lena",
        "last_name": "Beck"
      },
      {
        "id": "99999999-0064-0006-cdab-0000003dcd7c",
        "first_name": "Greta",
        "last_name": "Roth"
      },
      {
        "id": "99999999-0065-0006-6be3-0000003e6bb3",
        "first_name": "Frida",
        "last_name": "Werner"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0007-0000-5384-000000045381",
    "name": "Basketball U14",
    "description": "Basketball U14 squad.",
    "created_at": "2020-08-16",
    "address": "Kirchplatz 131, 80337 München",
    "sport": "Basketball",
    "trainers": [
      {
        "id": "99999999-0011-0001-81af-0000000a81a7",
        "first_name": "Niklas",
        "last_name": "Engel"
      },
      {
        "id": "99999999-0006-0000-b54c-00000003b54a",
        "first_name": "Erik",
        "last_name": "Berger"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0066-0006-0a1a-0000003f09ea",
        "first_name": "Jonah",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-0067-0006-a851-0000003fa821",
        "first_name": "Luca",
        "last_name": "Peters"
      },
      {
        "id": "99999999-0068-0006-4689-000000404658",
        "first_name": "Clara",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-0069-0006-e4c0-00000040e48f",
        "first_name": "Edda",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-006a-0006-82f8-0000004182c6",
        "first_name": "Ben",
        "last_name": "Park"
      },
      {
        "id": "99999999-006b-0006-212f-0000004220fd",
        "first_name": "Felix",
        "last_name": "Koch"
      },
      {
        "id": "99999999-006c-0006-bf67-00000042bf34",
        "first_name": "Toni",
        "last_name": "Sauer"
      },
      {
        "id": "99999999-006d-0006-5d9e-000000435d6b",
        "first_name": "Tilda",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-006e-0006-fbd6-00000043fba2",
        "first_name": "Ben",
        "last_name": "Lehmann"
      },
      {
        "id": "99999999-006f-0006-9a0d-0000004499d9",
        "first_name": "Liv",
        "last_name": "Brandt"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0008-0000-f1bb-00000004f1b8",
    "name": "Basketball Squad 1",
    "description": "Basketball Squad 1 squad.",
    "created_at": "2019-08-24",
    "address": "Mühlgasse 134, 80337 München",
    "sport": "Basketball",
    "trainers": [
      {
        "id": "99999999-000f-0000-4540-000000094539",
        "first_name": "Mara",
        "last_name": "Koch"
      },
      {
        "id": "99999999-000d-0000-08d1-0000000808cb",
        "first_name": "Coach",
        "last_name": "Devoops"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0070-0007-3845-000000453810",
        "first_name": "Paul",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-0071-0007-d67c-00000045d647",
        "first_name": "Nele",
        "last_name": "Schwarz"
      },
      {
        "id": "99999999-0072-0007-74b4-00000046747e",
        "first_name": "Lena",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-0073-0007-12eb-0000004712b5",
        "first_name": "Helena",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-0074-0007-b123-00000047b0ec",
        "first_name": "Helena",
        "last_name": "Wagner"
      },
      {
        "id": "99999999-0075-0007-4f5a-000000484f23",
        "first_name": "Emil",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-0076-0007-ed92-00000048ed5a",
        "first_name": "Leon",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-0077-0007-8bc9-000000498b91",
        "first_name": "Ada",
        "last_name": "Hoffmann"
      },
      {
        "id": "99999999-0078-0007-2a01-0000004a29c8",
        "first_name": "Oskar",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-0079-0007-c838-0000004ac7ff",
        "first_name": "Charlotte",
        "last_name": "Berger"
      },
      {
        "id": "99999999-007a-0007-666f-0000004b6636",
        "first_name": "Leon",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-007b-0007-04a7-0000004c046d",
        "first_name": "Jonah",
        "last_name": "Wagner"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0009-0000-8ff3-000000058fef",
    "name": "Basketball Group B",
    "description": "Basketball Group B squad.",
    "created_at": "2020-05-08",
    "address": "Sonnenweg 93, 80333 München",
    "sport": "Basketball",
    "trainers": [
      {
        "id": "99999999-0011-0001-81af-0000000a81a7",
        "first_name": "Niklas",
        "last_name": "Engel"
      }
    ],
    "trainees": [
      {
        "id": "99999999-007c-0007-a2de-0000004ca2a4",
        "first_name": "Erik",
        "last_name": "Scholz"
      },
      {
        "id": "99999999-007d-0007-4116-0000004d40db",
        "first_name": "Mia",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-007e-0007-df4d-0000004ddf12",
        "first_name": "Elias",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-007f-0007-7d85-0000004e7d49",
        "first_name": "Tilda",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-0080-0008-1bbc-0000004f1b80",
        "first_name": "Noah",
        "last_name": "Richter"
      },
      {
        "id": "99999999-0081-0008-b9f4-0000004fb9b7",
        "first_name": "Leon",
        "last_name": "Busch"
      },
      {
        "id": "99999999-0082-0008-582b-0000005057ee",
        "first_name": "Aaron",
        "last_name": "Sauer"
      },
      {
        "id": "99999999-0083-0008-f663-00000050f625",
        "first_name": "Mats",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-0084-0008-949a-00000051945c",
        "first_name": "Juna",
        "last_name": "Reil"
      },
      {
        "id": "99999999-0085-0008-32d2-000000523293",
        "first_name": "Juna",
        "last_name": "Braun"
      },
      {
        "id": "99999999-0086-0008-d109-00000052d0ca",
        "first_name": "Johanna",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-0087-0008-6f41-000000536f01",
        "first_name": "Sofia",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-0088-0008-0d78-000000540d38",
        "first_name": "Samuel",
        "last_name": "Vogel"
      }
    ]
  },
  {
    "id": "bbbbbbbb-000a-0000-2e2a-000000062e26",
    "name": "Swimming Juniors",
    "description": "Swimming Juniors squad.",
    "created_at": "2022-09-13",
    "address": "Rosenstraße 77, 80801 München",
    "sport": "Swimming",
    "trainers": [
      {
        "id": "99999999-000d-0000-08d1-0000000808cb",
        "first_name": "Coach",
        "last_name": "Devoops"
      },
      {
        "id": "99999999-0012-0001-1fe6-0000000b1fde",
        "first_name": "Mats",
        "last_name": "Klein"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0089-0008-abb0-00000054ab6f",
        "first_name": "Hannah",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-008a-0008-49e7-0000005549a6",
        "first_name": "Fynn",
        "last_name": "Reil"
      },
      {
        "id": "99999999-008b-0008-e81f-00000055e7dd",
        "first_name": "Toni",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-008c-0008-8656-000000568614",
        "first_name": "Moritz",
        "last_name": "Wolf"
      },
      {
        "id": "99999999-008d-0008-248e-00000057244b",
        "first_name": "Frieda",
        "last_name": "Winter"
      },
      {
        "id": "99999999-008e-0008-c2c5-00000057c282",
        "first_name": "Charlotte",
        "last_name": "Schwarz"
      },
      {
        "id": "99999999-008f-0008-60fc-0000005860b9",
        "first_name": "Moritz",
        "last_name": "Krause"
      }
    ]
  },
  {
    "id": "bbbbbbbb-000b-0000-cc62-00000006cc5d",
    "name": "Swimming Group A",
    "description": "Swimming Group A squad.",
    "created_at": "2020-02-08",
    "address": "Rosenstraße 77, 80333 München",
    "sport": "Swimming",
    "trainers": [
      {
        "id": "99999999-000d-0000-08d1-0000000808cb",
        "first_name": "Coach",
        "last_name": "Devoops"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0090-0009-ff34-00000058fef0",
        "first_name": "Hannah",
        "last_name": "Lange"
      },
      {
        "id": "99999999-0091-0009-9d6b-000000599d27",
        "first_name": "Smilla",
        "last_name": "Busch"
      },
      {
        "id": "99999999-0092-0009-3ba3-0000005a3b5e",
        "first_name": "Ida",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-0093-0009-d9da-0000005ad995",
        "first_name": "Finn",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-0094-0009-7812-0000005b77cc",
        "first_name": "Greta",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-0095-0009-1649-0000005c1603",
        "first_name": "Lea",
        "last_name": "Park"
      },
      {
        "id": "99999999-0096-0009-b481-0000005cb43a",
        "first_name": "Frieda",
        "last_name": "Richter"
      },
      {
        "id": "99999999-0097-0009-52b8-0000005d5271",
        "first_name": "Stella",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-0098-0009-f0f0-0000005df0a8",
        "first_name": "Aaron",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-0099-0009-8f27-0000005e8edf",
        "first_name": "Bela",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-009a-0009-2d5f-0000005f2d16",
        "first_name": "Mathilda",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-009b-0009-cb96-0000005fcb4d",
        "first_name": "Jonas",
        "last_name": "Krause"
      },
      {
        "id": "99999999-009c-0009-69ce-000000606984",
        "first_name": "Carla",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-009d-0009-0805-0000006107bb",
        "first_name": "Lena",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-009e-0009-a63d-00000061a5f2",
        "first_name": "Joris",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-009f-0009-4474-000000624429",
        "first_name": "Wilma",
        "last_name": "Otto"
      },
      {
        "id": "99999999-00a0-000a-e2ac-00000062e260",
        "first_name": "Jonah",
        "last_name": "Peters"
      },
      {
        "id": "99999999-00a1-000a-80e3-000000638097",
        "first_name": "Amelie",
        "last_name": "Lange"
      },
      {
        "id": "99999999-00a2-000a-1f1b-000000641ece",
        "first_name": "Jonas",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-00a3-000a-bd52-00000064bd05",
        "first_name": "Emil",
        "last_name": "Krause"
      },
      {
        "id": "99999999-00a4-000a-5b89-000000655b3c",
        "first_name": "Smilla",
        "last_name": "Hoffmann"
      }
    ]
  },
  {
    "id": "bbbbbbbb-000c-0000-6a99-000000076a94",
    "name": "Swimming Group B",
    "description": "Swimming Group B squad.",
    "created_at": "2024-08-24",
    "address": "Kirchplatz 46, 80333 München",
    "sport": "Swimming",
    "trainers": [
      {
        "id": "99999999-0010-0001-e377-00000009e370",
        "first_name": "Wilma",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-000f-0000-4540-000000094539",
        "first_name": "Mara",
        "last_name": "Koch"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00a5-000a-f9c1-00000065f973",
        "first_name": "Toni",
        "last_name": "Huber"
      },
      {
        "id": "99999999-00a6-000a-97f8-0000006697aa",
        "first_name": "Jan",
        "last_name": "Lange"
      },
      {
        "id": "99999999-00a7-000a-3630-0000006735e1",
        "first_name": "Carla",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-00a8-000a-d467-00000067d418",
        "first_name": "Noah",
        "last_name": "Braun"
      },
      {
        "id": "99999999-00a9-000a-729f-00000068724f",
        "first_name": "Alma",
        "last_name": "Busch"
      },
      {
        "id": "99999999-00aa-000a-10d6-000000691086",
        "first_name": "Bela",
        "last_name": "Klein"
      },
      {
        "id": "99999999-00ab-000a-af0e-00000069aebd",
        "first_name": "Bruno",
        "last_name": "Berger"
      },
      {
        "id": "99999999-00ac-000a-4d45-0000006a4cf4",
        "first_name": "Romy",
        "last_name": "Beck"
      },
      {
        "id": "99999999-00ad-000a-eb7d-0000006aeb2b",
        "first_name": "Joris",
        "last_name": "Hoffmann"
      }
    ]
  },
  {
    "id": "bbbbbbbb-000d-0000-08d1-0000000808cb",
    "name": "Swimming Seniors",
    "description": "Swimming Seniors squad.",
    "created_at": "2024-10-28",
    "address": "Birkenallee 88, 80333 München",
    "sport": "Swimming",
    "trainers": [
      {
        "id": "99999999-0007-0000-5384-000000045381",
        "first_name": "Lina",
        "last_name": "Zimmermann"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00ae-000a-89b4-0000006b8962",
        "first_name": "Jonah",
        "last_name": "König"
      },
      {
        "id": "99999999-00af-000a-27ec-0000006c2799",
        "first_name": "Emil",
        "last_name": "Stein"
      },
      {
        "id": "99999999-00b0-000b-c623-0000006cc5d0",
        "first_name": "Mira",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-00b1-000b-645b-0000006d6407",
        "first_name": "Elias",
        "last_name": "Braun"
      },
      {
        "id": "99999999-00b2-000b-0292-0000006e023e",
        "first_name": "Noah",
        "last_name": "Beck"
      },
      {
        "id": "99999999-00b3-000b-a0ca-0000006ea075",
        "first_name": "David",
        "last_name": "Klein"
      },
      {
        "id": "99999999-00b4-000b-3f01-0000006f3eac",
        "first_name": "Leon",
        "last_name": "Berger"
      }
    ]
  },
  {
    "id": "bbbbbbbb-000e-0000-a708-00000008a702",
    "name": "Swimming Squad 1",
    "description": "Swimming Squad 1 squad.",
    "created_at": "2021-05-05",
    "address": "Sonnenweg 24, 80636 München",
    "sport": "Swimming",
    "trainers": [
      {
        "id": "99999999-000e-0000-a708-00000008a702",
        "first_name": "Smilla",
        "last_name": "Frank"
      },
      {
        "id": "99999999-0006-0000-b54c-00000003b54a",
        "first_name": "Erik",
        "last_name": "Berger"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00b5-000b-dd39-0000006fdce3",
        "first_name": "Marco",
        "last_name": "Bauer"
      },
      {
        "id": "99999999-00b6-000b-7b70-000000707b1a",
        "first_name": "Finn",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-00b7-000b-19a7-000000711951",
        "first_name": "Konrad",
        "last_name": "Klein"
      },
      {
        "id": "99999999-00b8-000b-b7df-00000071b788",
        "first_name": "Ben",
        "last_name": "Frank"
      },
      {
        "id": "99999999-00b9-000b-5616-0000007255bf",
        "first_name": "Frida",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-00ba-000b-f44e-00000072f3f6",
        "first_name": "Lea",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-00bb-000b-9285-00000073922d",
        "first_name": "Sofia",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-00bc-000b-30bd-000000743064",
        "first_name": "Jonah",
        "last_name": "Park"
      },
      {
        "id": "99999999-00bd-000b-cef4-00000074ce9b",
        "first_name": "Mara",
        "last_name": "Engel"
      },
      {
        "id": "99999999-00be-000b-6d2c-000000756cd2",
        "first_name": "Emil",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-00bf-000b-0b63-000000760b09",
        "first_name": "David",
        "last_name": "Braun"
      },
      {
        "id": "99999999-00c0-000c-a99b-00000076a940",
        "first_name": "Aaron",
        "last_name": "Hoffmann"
      }
    ]
  },
  {
    "id": "bbbbbbbb-000f-0000-4540-000000094539",
    "name": "Athletics Group A",
    "description": "Athletics Group A squad.",
    "created_at": "2022-09-24",
    "address": "Lindenstraße 37, 81667 München",
    "sport": "Athletics",
    "trainers": [
      {
        "id": "99999999-0009-0000-8ff3-000000058fef",
        "first_name": "Magda",
        "last_name": "Huber"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00c1-000c-47d2-000000774777",
        "first_name": "Emil",
        "last_name": "Schwarz"
      },
      {
        "id": "99999999-00c2-000c-e60a-00000077e5ae",
        "first_name": "Bela",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-00c3-000c-8441-0000007883e5",
        "first_name": "Rosa",
        "last_name": "Frank"
      },
      {
        "id": "99999999-00c4-000c-2279-00000079221c",
        "first_name": "Frida",
        "last_name": "Neumann"
      },
      {
        "id": "99999999-00c5-000c-c0b0-00000079c053",
        "first_name": "Clara",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-00c6-000c-5ee8-0000007a5e8a",
        "first_name": "Edda",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-00c7-000c-fd1f-0000007afcc1",
        "first_name": "Leon",
        "last_name": "Beck"
      },
      {
        "id": "99999999-00c8-000c-9b57-0000007b9af8",
        "first_name": "Emil",
        "last_name": "Klein"
      },
      {
        "id": "99999999-00c9-000c-398e-0000007c392f",
        "first_name": "Jonas",
        "last_name": "Stein"
      },
      {
        "id": "99999999-00ca-000c-d7c6-0000007cd766",
        "first_name": "Nele",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-00cb-000c-75fd-0000007d759d",
        "first_name": "Moritz",
        "last_name": "Busch"
      },
      {
        "id": "99999999-00cc-000c-1434-0000007e13d4",
        "first_name": "Rosa",
        "last_name": "Klein"
      },
      {
        "id": "99999999-00cd-000c-b26c-0000007eb20b",
        "first_name": "Samuel",
        "last_name": "Winter"
      },
      {
        "id": "99999999-00ce-000c-50a3-0000007f5042",
        "first_name": "Bruno",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-00cf-000c-eedb-0000007fee79",
        "first_name": "Toni",
        "last_name": "Krause"
      },
      {
        "id": "99999999-00d0-000d-8d12-000000808cb0",
        "first_name": "Lotte",
        "last_name": "Richter"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0010-0001-e377-00000009e370",
    "name": "Athletics Development",
    "description": "Athletics Development squad.",
    "created_at": "2019-10-14",
    "address": "Birkenallee 116, 80331 München",
    "sport": "Athletics",
    "trainers": [
      {
        "id": "99999999-0010-0001-e377-00000009e370",
        "first_name": "Wilma",
        "last_name": "Vogt"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00d1-000d-2b4a-000000812ae7",
        "first_name": "Lotte",
        "last_name": "Frank"
      },
      {
        "id": "99999999-00d2-000d-c981-00000081c91e",
        "first_name": "Mara",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-00d3-000d-67b9-000000826755",
        "first_name": "Ella",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-00d4-000d-05f0-00000083058c",
        "first_name": "Martha",
        "last_name": "Engel"
      },
      {
        "id": "99999999-00d5-000d-a428-00000083a3c3",
        "first_name": "Alma",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-00d6-000d-425f-0000008441fa",
        "first_name": "Nele",
        "last_name": "Scholz"
      },
      {
        "id": "99999999-00d7-000d-e097-00000084e031",
        "first_name": "Oskar",
        "last_name": "Stein"
      },
      {
        "id": "99999999-00d8-000d-7ece-000000857e68",
        "first_name": "Juna",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-00d9-000d-1d06-000000861c9f",
        "first_name": "Wilma",
        "last_name": "Stein"
      },
      {
        "id": "99999999-00da-000d-bb3d-00000086bad6",
        "first_name": "Fynn",
        "last_name": "Hoffmann"
      },
      {
        "id": "99999999-00db-000d-5975-00000087590d",
        "first_name": "Ida",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-00dc-000d-f7ac-00000087f744",
        "first_name": "Levi",
        "last_name": "Beck"
      },
      {
        "id": "99999999-00dd-000d-95e4-00000088957b",
        "first_name": "Felix",
        "last_name": "Krause"
      },
      {
        "id": "99999999-00de-000d-341b-0000008933b2",
        "first_name": "Helena",
        "last_name": "Koch"
      },
      {
        "id": "99999999-00df-000d-d253-00000089d1e9",
        "first_name": "Toni",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-00e0-000e-708a-0000008a7020",
        "first_name": "Nele",
        "last_name": "Braun"
      },
      {
        "id": "99999999-00e1-000e-0ec1-0000008b0e57",
        "first_name": "Ella",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-00e2-000e-acf9-0000008bac8e",
        "first_name": "Ben",
        "last_name": "Busch"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0011-0001-81af-0000000a81a7",
    "name": "Athletics Varsity",
    "description": "Athletics Varsity squad.",
    "created_at": "2024-10-07",
    "address": "Schulstraße 53, 80333 München",
    "sport": "Athletics",
    "trainers": [
      {
        "id": "99999999-0010-0001-e377-00000009e370",
        "first_name": "Wilma",
        "last_name": "Vogt"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00e3-000e-4b30-0000008c4ac5",
        "first_name": "Nele",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-00e4-000e-e968-0000008ce8fc",
        "first_name": "Jonah",
        "last_name": "Frank"
      },
      {
        "id": "99999999-00e5-000e-879f-0000008d8733",
        "first_name": "Aaron",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-00e6-000e-25d7-0000008e256a",
        "first_name": "Romi",
        "last_name": "König"
      },
      {
        "id": "99999999-00e7-000e-c40e-0000008ec3a1",
        "first_name": "Amelie",
        "last_name": "Seidel"
      },
      {
        "id": "99999999-00e8-000e-6246-0000008f61d8",
        "first_name": "Lea",
        "last_name": "Stein"
      },
      {
        "id": "99999999-00e9-000e-007d-00000090000f",
        "first_name": "Arne",
        "last_name": "Horn"
      },
      {
        "id": "99999999-00ea-000e-9eb5-000000909e46",
        "first_name": "Mira",
        "last_name": "Klein"
      },
      {
        "id": "99999999-00eb-000e-3cec-000000913c7d",
        "first_name": "Emil",
        "last_name": "Sauer"
      },
      {
        "id": "99999999-00ec-000e-db24-00000091dab4",
        "first_name": "Romi",
        "last_name": "Park"
      },
      {
        "id": "99999999-00ed-000e-795b-0000009278eb",
        "first_name": "Mats",
        "last_name": "Horn"
      },
      {
        "id": "99999999-00ee-000e-1793-000000931722",
        "first_name": "Lina",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-00ef-000e-b5ca-00000093b559",
        "first_name": "Henry",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-00f0-000f-5402-000000945390",
        "first_name": "Jonah",
        "last_name": "Braun"
      },
      {
        "id": "99999999-00f1-000f-f239-00000094f1c7",
        "first_name": "Charlotte",
        "last_name": "Ziegler"
      },
      {
        "id": "99999999-00f2-000f-9071-000000958ffe",
        "first_name": "Rosa",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-00f3-000f-2ea8-000000962e35",
        "first_name": "Marie",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-00f4-000f-ccdf-00000096cc6c",
        "first_name": "Stella",
        "last_name": "Frank"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0012-0001-1fe6-0000000b1fde",
    "name": "Athletics Masters",
    "description": "Athletics Masters squad.",
    "created_at": "2021-03-22",
    "address": "Birkenallee 84, 80469 München",
    "sport": "Athletics",
    "trainers": [
      {
        "id": "99999999-0007-0000-5384-000000045381",
        "first_name": "Lina",
        "last_name": "Zimmermann"
      }
    ],
    "trainees": [
      {
        "id": "99999999-00f5-000f-6b17-000000976aa3",
        "first_name": "Til",
        "last_name": "Lehmann"
      },
      {
        "id": "99999999-00f6-000f-094e-0000009808da",
        "first_name": "Anton",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-00f7-000f-a786-00000098a711",
        "first_name": "Marco",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-00f8-000f-45bd-000000994548",
        "first_name": "Til",
        "last_name": "Bauer"
      },
      {
        "id": "99999999-00f9-000f-e3f5-00000099e37f",
        "first_name": "Joris",
        "last_name": "Huber"
      },
      {
        "id": "99999999-00fa-000f-822c-0000009a81b6",
        "first_name": "Mara",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-00fb-000f-2064-0000009b1fed",
        "first_name": "Martha",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-00fc-000f-be9b-0000009bbe24",
        "first_name": "Mats",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-00fd-000f-5cd3-0000009c5c5b",
        "first_name": "Linus",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-00fe-000f-fb0a-0000009cfa92",
        "first_name": "Erik",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-00ff-000f-9942-0000009d98c9",
        "first_name": "Ida",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-0100-0010-3779-0000009e3700",
        "first_name": "Felix",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-0101-0010-d5b1-0000009ed537",
        "first_name": "Clara",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-0102-0010-73e8-0000009f736e",
        "first_name": "Niklas",
        "last_name": "Fuchs"
      },
      {
        "id": "99999999-0103-0010-1220-000000a011a5",
        "first_name": "Leon",
        "last_name": "Roth"
      },
      {
        "id": "99999999-0104-0010-b057-000000a0afdc",
        "first_name": "Alma",
        "last_name": "Roth"
      },
      {
        "id": "99999999-0105-0010-4e8f-000000a14e13",
        "first_name": "Levi",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-0106-0010-ecc6-000000a1ec4a",
        "first_name": "Nele",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-0107-0010-8afe-000000a28a81",
        "first_name": "Greta",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-0108-0010-2935-000000a328b8",
        "first_name": "Helena",
        "last_name": "Park"
      },
      {
        "id": "99999999-0109-0010-c76c-000000a3c6ef",
        "first_name": "Alma",
        "last_name": "Frank"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0013-0001-be1e-0000000bbe15",
    "name": "Volleyball Juniors",
    "description": "Volleyball Juniors squad.",
    "created_at": "2024-06-15",
    "address": "Birkenallee 28, 80538 München",
    "sport": "Volleyball",
    "trainers": [
      {
        "id": "99999999-000a-0000-2e2a-000000062e26",
        "first_name": "Ella",
        "last_name": "Frank"
      },
      {
        "id": "99999999-000c-0000-6a99-000000076a94",
        "first_name": "Liv",
        "last_name": "Scholz"
      }
    ],
    "trainees": [
      {
        "id": "99999999-010a-0010-65a4-000000a46526",
        "first_name": "Ida",
        "last_name": "Voigt"
      },
      {
        "id": "99999999-010b-0010-03db-000000a5035d",
        "first_name": "Theo",
        "last_name": "Roth"
      },
      {
        "id": "99999999-010c-0010-a213-000000a5a194",
        "first_name": "Joris",
        "last_name": "Krause"
      },
      {
        "id": "99999999-010d-0010-404a-000000a63fcb",
        "first_name": "Mia",
        "last_name": "Braun"
      },
      {
        "id": "99999999-010e-0010-de82-000000a6de02",
        "first_name": "Magda",
        "last_name": "Bauer"
      },
      {
        "id": "99999999-010f-0010-7cb9-000000a77c39",
        "first_name": "Martha",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-0110-0011-1af1-000000a81a70",
        "first_name": "Mira",
        "last_name": "Roth"
      },
      {
        "id": "99999999-0111-0011-b928-000000a8b8a7",
        "first_name": "Romy",
        "last_name": "Park"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0014-0001-5c55-0000000c5c4c",
    "name": "Volleyball Squad 1",
    "description": "Volleyball Squad 1 squad.",
    "created_at": "2022-04-11",
    "address": "Uferweg 19, 80333 München",
    "sport": "Volleyball",
    "trainers": [
      {
        "id": "99999999-0007-0000-5384-000000045381",
        "first_name": "Lina",
        "last_name": "Zimmermann"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0112-0011-5760-000000a956de",
        "first_name": "Paul",
        "last_name": "Reil"
      },
      {
        "id": "99999999-0113-0011-f597-000000a9f515",
        "first_name": "Nora",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-0114-0011-93cf-000000aa934c",
        "first_name": "Samuel",
        "last_name": "Koch"
      },
      {
        "id": "99999999-0115-0011-3206-000000ab3183",
        "first_name": "Wilma",
        "last_name": "Braun"
      },
      {
        "id": "99999999-0116-0011-d03e-000000abcfba",
        "first_name": "Pia",
        "last_name": "Zimmermann"
      },
      {
        "id": "99999999-0117-0011-6e75-000000ac6df1",
        "first_name": "Sofia",
        "last_name": "Wolf"
      },
      {
        "id": "99999999-0118-0011-0cad-000000ad0c28",
        "first_name": "Joris",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-0119-0011-aae4-000000adaa5f",
        "first_name": "Elias",
        "last_name": "Busch"
      },
      {
        "id": "99999999-011a-0011-491c-000000ae4896",
        "first_name": "Jonah",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-011b-0011-e753-000000aee6cd",
        "first_name": "Mats",
        "last_name": "Fuchs"
      },
      {
        "id": "99999999-011c-0011-858b-000000af8504",
        "first_name": "Greta",
        "last_name": "Koch"
      },
      {
        "id": "99999999-011d-0011-23c2-000000b0233b",
        "first_name": "Janne",
        "last_name": "Vogel"
      },
      {
        "id": "99999999-011e-0011-c1f9-000000b0c172",
        "first_name": "Amelie",
        "last_name": "Wolf"
      },
      {
        "id": "99999999-011f-0011-6031-000000b15fa9",
        "first_name": "Leon",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-0120-0012-fe68-000000b1fde0",
        "first_name": "Lea",
        "last_name": "Engel"
      },
      {
        "id": "99999999-0121-0012-9ca0-000000b29c17",
        "first_name": "Stella",
        "last_name": "Braun"
      },
      {
        "id": "99999999-0122-0012-3ad7-000000b33a4e",
        "first_name": "Helena",
        "last_name": "König"
      },
      {
        "id": "99999999-0123-0012-d90f-000000b3d885",
        "first_name": "Edda",
        "last_name": "Nowak"
      },
      {
        "id": "99999999-0124-0012-7746-000000b476bc",
        "first_name": "Nora",
        "last_name": "Hoffmann"
      },
      {
        "id": "99999999-0125-0012-157e-000000b514f3",
        "first_name": "Nele",
        "last_name": "Krause"
      },
      {
        "id": "99999999-0126-0012-b3b5-000000b5b32a",
        "first_name": "Johanna",
        "last_name": "Frank"
      },
      {
        "id": "99999999-0127-0012-51ed-000000b65161",
        "first_name": "Emil",
        "last_name": "Schulz"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0015-0001-fa8c-0000000cfa83",
    "name": "Volleyball Squad 2",
    "description": "Volleyball Squad 2 squad.",
    "created_at": "2024-10-15",
    "address": "Bergstraße 75, 80333 München",
    "sport": "Volleyball",
    "trainers": [
      {
        "id": "99999999-0011-0001-81af-0000000a81a7",
        "first_name": "Niklas",
        "last_name": "Engel"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0128-0012-f024-000000b6ef98",
        "first_name": "Linus",
        "last_name": "Scholz"
      },
      {
        "id": "99999999-0129-0012-8e5c-000000b78dcf",
        "first_name": "Luca",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-012a-0012-2c93-000000b82c06",
        "first_name": "Clara",
        "last_name": "Voigt"
      },
      {
        "id": "99999999-012b-0012-cacb-000000b8ca3d",
        "first_name": "Noah",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-012c-0012-6902-000000b96874",
        "first_name": "Linus",
        "last_name": "Graf"
      },
      {
        "id": "99999999-012d-0012-073a-000000ba06ab",
        "first_name": "Mats",
        "last_name": "Voigt"
      },
      {
        "id": "99999999-012e-0012-a571-000000baa4e2",
        "first_name": "Janne",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-012f-0012-43a9-000000bb4319",
        "first_name": "Nora",
        "last_name": "Bauer"
      },
      {
        "id": "99999999-0130-0013-e1e0-000000bbe150",
        "first_name": "Luca",
        "last_name": "Wolf"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0016-0001-98c4-0000000d98ba",
    "name": "Volleyball U16",
    "description": "Volleyball U16 squad.",
    "created_at": "2021-09-20",
    "address": "Rosenstraße 25, 80331 München",
    "sport": "Volleyball",
    "trainers": [
      {
        "id": "99999999-0009-0000-8ff3-000000058fef",
        "first_name": "Magda",
        "last_name": "Huber"
      },
      {
        "id": "99999999-000e-0000-a708-00000008a702",
        "first_name": "Smilla",
        "last_name": "Frank"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0131-0013-8017-000000bc7f87",
        "first_name": "Ada",
        "last_name": "Kaiser"
      },
      {
        "id": "99999999-0132-0013-1e4f-000000bd1dbe",
        "first_name": "Emil",
        "last_name": "Engel"
      },
      {
        "id": "99999999-0133-0013-bc86-000000bdbbf5",
        "first_name": "Max",
        "last_name": "Ziegler"
      },
      {
        "id": "99999999-0134-0013-5abe-000000be5a2c",
        "first_name": "Linus",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-0135-0013-f8f5-000000bef863",
        "first_name": "Romi",
        "last_name": "Vogt"
      },
      {
        "id": "99999999-0136-0013-972d-000000bf969a",
        "first_name": "Moritz",
        "last_name": "Albrecht"
      },
      {
        "id": "99999999-0137-0013-3564-000000c034d1",
        "first_name": "Juna",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-0138-0013-d39c-000000c0d308",
        "first_name": "Rosa",
        "last_name": "Koch"
      },
      {
        "id": "99999999-0139-0013-71d3-000000c1713f",
        "first_name": "Janne",
        "last_name": "Park"
      },
      {
        "id": "99999999-013a-0013-100b-000000c20f76",
        "first_name": "Romy",
        "last_name": "Sauer"
      },
      {
        "id": "99999999-013b-0013-ae42-000000c2adad",
        "first_name": "Lina",
        "last_name": "Beck"
      },
      {
        "id": "99999999-013c-0013-4c7a-000000c34be4",
        "first_name": "Theo",
        "last_name": "Hoffmann"
      },
      {
        "id": "99999999-013d-0013-eab1-000000c3ea1b",
        "first_name": "Alma",
        "last_name": "Klein"
      },
      {
        "id": "99999999-013e-0013-88e9-000000c48852",
        "first_name": "Martha",
        "last_name": "Lange"
      },
      {
        "id": "99999999-013f-0013-2720-000000c52689",
        "first_name": "Levi",
        "last_name": "Brandt"
      },
      {
        "id": "99999999-0140-0014-c558-000000c5c4c0",
        "first_name": "Mats",
        "last_name": "Hartmann"
      },
      {
        "id": "99999999-0141-0014-638f-000000c662f7",
        "first_name": "Amelie",
        "last_name": "Diaz"
      },
      {
        "id": "99999999-0142-0014-01c7-000000c7012e",
        "first_name": "Anton",
        "last_name": "Braun"
      },
      {
        "id": "99999999-0143-0014-9ffe-000000c79f65",
        "first_name": "Emil",
        "last_name": "Busch"
      }
    ]
  },
  {
    "id": "bbbbbbbb-0017-0001-36fb-0000000e36f1",
    "name": "Volleyball Varsity",
    "description": "Volleyball Varsity squad.",
    "created_at": "2024-08-12",
    "address": "Uferweg 126, 80636 München",
    "sport": "Volleyball",
    "trainers": [
      {
        "id": "99999999-000e-0000-a708-00000008a702",
        "first_name": "Smilla",
        "last_name": "Frank"
      }
    ],
    "trainees": [
      {
        "id": "99999999-0144-0014-3e36-000000c83d9c",
        "first_name": "Fynn",
        "last_name": "Bauer"
      },
      {
        "id": "99999999-0145-0014-dc6d-000000c8dbd3",
        "first_name": "David",
        "last_name": "Zimmermann"
      },
      {
        "id": "99999999-0146-0014-7aa4-000000c97a0a",
        "first_name": "Noah",
        "last_name": "Klein"
      },
      {
        "id": "99999999-0147-0014-18dc-000000ca1841",
        "first_name": "Henry",
        "last_name": "Huber"
      },
      {
        "id": "99999999-0148-0014-b713-000000cab678",
        "first_name": "Rosa",
        "last_name": "Schulz"
      },
      {
        "id": "99999999-0149-0014-554b-000000cb54af",
        "first_name": "Lotte",
        "last_name": "Engel"
      },
      {
        "id": "99999999-014a-0014-f382-000000cbf2e6",
        "first_name": "Samuel",
        "last_name": "Wolf"
      },
      {
        "id": "99999999-014b-0014-91ba-000000cc911d",
        "first_name": "Konrad",
        "last_name": "Sommer"
      },
      {
        "id": "99999999-014c-0014-2ff1-000000cd2f54",
        "first_name": "Elias",
        "last_name": "Wolf"
      },
      {
        "id": "99999999-014d-0014-ce29-000000cdcd8b",
        "first_name": "Konrad",
        "last_name": "Beck"
      },
      {
        "id": "99999999-014e-0014-6c60-000000ce6bc2",
        "first_name": "Hannah",
        "last_name": "Arnold"
      },
      {
        "id": "99999999-014f-0014-0a98-000000cf09f9",
        "first_name": "Bruno",
        "last_name": "Krüger"
      },
      {
        "id": "99999999-0150-0015-a8cf-000000cfa830",
        "first_name": "Luca",
        "last_name": "Pohl"
      },
      {
        "id": "99999999-0151-0015-4707-000000d04667",
        "first_name": "Aaron",
        "last_name": "Huber"
      },
      {
        "id": "99999999-0152-0015-e53e-000000d0e49e",
        "first_name": "Paul",
        "last_name": "Engel"
      }
    ]
  }
]

/** First team the signed-in member belongs to, for convenience. */
export const TEAM_U16 = 'bbbbbbbb-0001-0000-9e37-000000009e37'

/** name -> Sport. */
export const sportsByName: Record<string, Sport> = Object.fromEntries(
  sportFixtures.map((s) => [s.name, s]),
)

/** sport name -> its teams (one-to-many). */
export const teamsBySport: Record<string, Team[]> = sportFixtures.reduce(
  (acc, s) => {
    acc[s.name] = teamFixtures.filter((t) => t.sport === s.name)
    return acc
  },
  {} as Record<string, Team[]>,
)

/** Teams the signed-in member belongs to (trainees are resolved MemberRefs). */
export const myTeamFixtures: Team[] = teamFixtures.filter((t) =>
  t.trainees.some((m) => m.id === CURRENT_MEMBER_ID),
)
