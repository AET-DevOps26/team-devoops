export const mutationFeedbackCopy = {
  member: { create: 'Member not created', update: 'Member not updated', delete: 'Member not deleted' },
  feedback: { create: 'Feedback not added', update: 'Feedback not updated', delete: 'Feedback not deleted' },
  event: { create: 'Event not created', update: 'Event not updated', delete: 'Event not deleted' },
  sport: { create: 'Sport not created', update: 'Sport not updated', delete: 'Sport not deleted' },
  team: { create: 'Team not created', update: 'Team not updated', delete: 'Team not deleted' },
  transaction: { create: 'Transaction not recorded', delete: 'Transaction not deleted' },
  report: { generate: 'Report generation not started', delete: 'Report not deleted' },
  letter: { send: 'Email not sent', generatePdf: 'PDF not generated' },
  profile: { update: 'Profile not updated' },
} as const
