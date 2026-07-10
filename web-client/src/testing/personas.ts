import type { AuthUser } from '@/types'

// Persona ids are real members in the fixtures. `coach` maps to auth role `trainer`.
export type TestPersona = AuthUser

export const TEST_PERSONAS = {
  "member": {
    "id": "11111111-1111-1111-1111-111111111111",
    "role": "member",
    "name": "Lena Roth",
    "email": "lena.roth@club.de"
  },
  "coach": {
    "id": "99999999-000d-0000-08d1-0000000808cb",
    "role": "trainer",
    "name": "Coach Devoops",
    "email": "coach.devoops@club.de"
  },
  "director": {
    "id": "99999999-0003-0000-daa6-00000001daa5",
    "role": "director",
    "name": "Director Devoops",
    "email": "director.devoops@club.de"
  },
  "admin": {
    "id": "99999999-0004-0000-78dd-0000000278dc",
    "role": "admin",
    "name": "Admin Devoops",
    "email": "admin.devoops@club.de"
  }
} as const satisfies Record<string, TestPersona>

export type TestPersonaKey = keyof typeof TEST_PERSONAS
