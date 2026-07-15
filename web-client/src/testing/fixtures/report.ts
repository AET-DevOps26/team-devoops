import type { MemberReportSummary, Report, TeamReportSummary } from '@/types'

const lenaText =
  "# Development report — Lena Roth\n\n## Attendance\nLena has attended **10 of 14** sessions this term (71%).\n\n## Technical progress\nCoach feedback over the last month highlights steady improvement in core skills:\n\n- Consistency under pressure is the main *growth area*.\n- Footwork and first touch are trending up.\n- Match awareness noted as a strength.\n\n## Suggested focus\n- Maintain attendance momentum.\n- Dedicate warm-up drills to the highlighted growth area.\n- Revisit in **4 weeks**."

const lenaTextMay =
  "# Development report — Lena Roth\n\n## Attendance\nLena has attended **8 of 11** sessions so far (73%).\n\n## Technical progress\nEarly-term assessment: solid fundamentals, with first touch as the standout strength.\n\n## Suggested focus\n- Build a consistent pre-session warm-up routine.\n- Revisit in **4 weeks** to track progress."

const marieText =
  "Development report — Marie Wolf\n\nAttendance\nMarie has attended 10 of 14 sessions this term (71%).\n\nTechnical progress\nCoach feedback over the last month highlights steady improvement in core skills, with consistency under pressure noted as the main growth area.\n\nMatch involvement\nFeatured in recent fixtures with feedback trending positive.\n\nSuggested focus\nMaintain attendance momentum and dedicate warm-up drills to the highlighted growth area. Revisit in 4 weeks."

const linusKochText =
  "Development report — Linus Koch\n\nAttendance\nLinus has attended 12 of 14 sessions this term (86%).\n\nTechnical progress\nCoach feedback over the last month highlights steady improvement in core skills, with consistency under pressure noted as the main growth area.\n\nMatch involvement\nFeatured in recent fixtures with feedback trending positive.\n\nSuggested focus\nMaintain attendance momentum and dedicate warm-up drills to the highlighted growth area. Revisit in 4 weeks."

const linusBeckText =
  "Development report — Linus Beck\n\nAttendance\nLinus has attended 10 of 14 sessions this term (71%).\n\nTechnical progress\nCoach feedback over the last month highlights steady improvement in core skills, with consistency under pressure noted as the main growth area.\n\nMatch involvement\nFeatured in recent fixtures with feedback trending positive.\n\nSuggested focus\nMaintain attendance momentum and dedicate warm-up drills to the highlighted growth area. Revisit in 4 weeks."

const footballJuniorsText =
  "# Team report — Football Juniors\n\n## Squad attendance\nThe squad averaged **78%** attendance across the last 14 sessions, with a small core of regulars driving training intensity.\n\n## Highlights\n- Strong group cohesion in possession drills.\n- Several trainees trending up on first touch and footwork.\n\n## Growth areas\n- Consistency under pressure across the wider squad.\n- Closing out the final minutes of scrimmages.\n\n## Suggested focus\n- Group warm-ups targeting decision-making under fatigue.\n- Revisit in **4 weeks**."

const lenaMemberRef = { id: "11111111-1111-1111-1111-111111111111", name: "Lena Roth" }
const marieRef = { id: "99999999-0013-0001-be1e-0000000bbe15", name: "Marie Wolf" }
const linusKochRef = { id: "99999999-0014-0001-5c55-0000000c5c4c", name: "Linus Koch" }
const linusBeckRef = { id: "99999999-0015-0001-fa8c-0000000cfa83", name: "Linus Beck" }
const footballJuniorsRef = { id: "bbbbbbbb-0001-0000-9e37-000000009e37", name: "Football Juniors" }

export const reportById: Record<string, Report> = {
  "dddddddd-0001-0000-9e37-000000009e37": {
    id: "dddddddd-0001-0000-9e37-000000009e37",
    kind: "member",
    member: lenaMemberRef,
    created_at: "2026-06-18T09:00:00.000Z",
    text: lenaText,
  },
  "dddddddd-0002-0000-3c6e-000000013c6e": {
    id: "dddddddd-0002-0000-3c6e-000000013c6e",
    kind: "member",
    member: lenaMemberRef,
    created_at: "2026-05-20T09:00:00.000Z",
    text: lenaTextMay,
  },
  "dddddddd-0003-0000-daa6-00000001daa5": {
    id: "dddddddd-0003-0000-daa6-00000001daa5",
    kind: "member",
    member: marieRef,
    created_at: "2026-06-12T09:00:00.000Z",
    text: marieText,
  },
  "dddddddd-0004-0000-78dd-0000000278dc": {
    id: "dddddddd-0004-0000-78dd-0000000278dc",
    kind: "member",
    member: linusKochRef,
    created_at: "2026-06-15T09:00:00.000Z",
    text: linusKochText,
  },
  "dddddddd-0005-0000-1715-000000031713": {
    id: "dddddddd-0005-0000-1715-000000031713",
    kind: "member",
    member: linusBeckRef,
    created_at: "2026-06-09T09:00:00.000Z",
    text: linusBeckText,
  },
  "eeeeeeee-0001-0000-9e37-000000009e37": {
    id: "eeeeeeee-0001-0000-9e37-000000009e37",
    kind: "team",
    team: footballJuniorsRef,
    created_at: "2026-06-16T09:00:00.000Z",
    text: footballJuniorsText,
  },
}

export const memberReportSummariesById: Record<string, MemberReportSummary[]> = {
  "11111111-1111-1111-1111-111111111111": [
    { id: "dddddddd-0001-0000-9e37-000000009e37", member: lenaMemberRef, created_at: "2026-06-18T09:00:00.000Z" },
    { id: "dddddddd-0002-0000-3c6e-000000013c6e", member: lenaMemberRef, created_at: "2026-05-20T09:00:00.000Z" },
  ],
  "99999999-0013-0001-be1e-0000000bbe15": [
    { id: "dddddddd-0003-0000-daa6-00000001daa5", member: marieRef, created_at: "2026-06-12T09:00:00.000Z" },
  ],
  "99999999-0014-0001-5c55-0000000c5c4c": [
    { id: "dddddddd-0004-0000-78dd-0000000278dc", member: linusKochRef, created_at: "2026-06-15T09:00:00.000Z" },
  ],
  "99999999-0015-0001-fa8c-0000000cfa83": [
    { id: "dddddddd-0005-0000-1715-000000031713", member: linusBeckRef, created_at: "2026-06-09T09:00:00.000Z" },
  ],
}

export const teamReportSummariesById: Record<string, TeamReportSummary[]> = {
  "bbbbbbbb-0001-0000-9e37-000000009e37": [
    { id: "eeeeeeee-0001-0000-9e37-000000009e37", team: footballJuniorsRef, created_at: "2026-06-16T09:00:00.000Z" },
  ],
}

export function memberReportSummaries(memberId: string): MemberReportSummary[] {
  return memberReportSummariesById[memberId] ?? []
}

export function teamReportSummaries(teamId: string): TeamReportSummary[] {
  return teamReportSummariesById[teamId] ?? []
}
