// Persona ids are real members in the fixtures. `roles` mirrors the Keycloak `member_roles`
// claim (display labels), so personas resolve through `highestRole()` exactly like a real
// token. `coach` maps to server role `trainer` (label "Coach").
export interface MockPersona { id: string; roles: string[]; name: string; email: string }

export const MOCK_PERSONAS = {
  "member": {
    "id": "11111111-1111-1111-1111-111111111111",
    "roles": ["Trainee"],
    "name": "Lena Roth",
    "email": "lena.roth@club.de"
  },
  "coach": {
    "id": "99999999-000d-0000-08d1-0000000808cb",
    "roles": ["Coach"],
    "name": "Coach Devoops",
    "email": "coach.devoops@club.de"
  },
  "director": {
    "id": "99999999-0003-0000-daa6-00000001daa5",
    "roles": ["Director"],
    "name": "Director Devoops",
    "email": "director.devoops@club.de"
  },
  "admin": {
    "id": "99999999-0004-0000-78dd-0000000278dc",
    "roles": ["Admin"],
    "name": "Admin Devoops",
    "email": "admin.devoops@club.de"
  }
} as const satisfies Record<string, MockPersona>

export type MockPersonaKey = keyof typeof MOCK_PERSONAS
