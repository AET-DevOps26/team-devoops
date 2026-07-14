import type { BrowserContext, Route } from '@playwright/test'

import { E2E_USER } from './auth'
import type { AuthUser } from '../../src/types'
import * as members from './server/members'
import * as events from './server/events'
import * as feedback from './server/feedback'
import * as payments from './server/payments'
import * as organization from './server/organization'
import * as helper from './server/helper'
import * as letters from './server/letters'
import * as dashboard from './server/dashboard'

// Module state is safe because workers are separate processes and tests are serial within a worker.

const USER: AuthUser = {
  id: E2E_USER.sub,
  name: E2E_USER.name,
  email: E2E_USER.email,
  role: 'admin',
}

type ApiError = Error & { response?: { status?: number; data?: unknown } }

const server = { members, events, feedback, payments, organization, helper, letters, dashboard }

function resetServer(): void {
  members.reset()
  events.reset()
  feedback.reset()
  payments.reset()
  organization.reset()
  helper.reset()
}

interface Parsed {
  method: string
  segments: string[]
  body: unknown
}

function parse(route: Route): Parsed {
  const request = route.request()
  const url = new URL(request.url())
  const after = url.pathname.replace(/^.*\/api\/v1\//, '')
  const segments = after.split('/').filter(Boolean).map(decodeURIComponent)
  let body: unknown
  try {
    body = request.postData() ? JSON.parse(request.postData() as string) : undefined
  } catch {
    body = request.postData()
  }
  return { method: request.method(), segments, body }
}

function updateMember(id: string, body: never) {
  const updated = server.members.updateMember(id, body, USER)
  const name = `${updated.first_name} ${updated.last_name}`
  server.organization.renameMemberInOrganization(id, name)
  server.feedback.renameMemberInFeedback(id, name)
  server.events.renameMemberInEvents(id, name)
  server.payments.renameMemberInPayments(id, name)
  server.helper.renameMemberInReports(id, name)
  return updated
}

function deleteMember(id: string): void {
  server.members.deleteMember(id, USER)
  server.organization.removeMemberFromOrganization(id)
  server.feedback.removeMemberFromFeedback(id)
  server.events.removeMemberFromEvents(id)
  server.payments.removeMemberFromPayments(id)
  server.helper.removeMemberFromReports(id)
}

function updateEvent(id: string, body: never) {
  const updated = server.events.updateEvent(id, body, USER)
  server.feedback.renameEventInFeedback(id, updated.name)
  return updated
}

function deleteEvent(id: string): void {
  server.events.deleteEvent(id, USER)
  server.feedback.removeEventFromFeedback(id)
}

function updateSport(id: string, body: never) {
  const updated = server.organization.updateSport(id, body, USER)
  server.events.renameSportInEvents(id, updated.name)
  return updated
}

function deleteSport(id: string): void {
  const teamIds = server.organization.teamIdsForSport(id)
  server.organization.deleteSport(id, USER)
  server.events.removeSportFromEvents(id)
  for (const teamId of teamIds) {
    server.events.removeTeamFromEvents(teamId)
    server.helper.removeTeamFromReports(teamId)
  }
}

async function updateTeam(id: string, body: never) {
  const updated = await server.organization.updateTeam(id, body, USER)
  server.events.renameTeamInEvents(id, updated.name)
  server.helper.renameTeamInReports(id, updated.name)
  return updated
}

function deleteTeam(id: string): void {
  server.organization.deleteTeam(id, USER)
  server.events.removeTeamFromEvents(id)
  server.helper.removeTeamFromReports(id)
}

async function run(route: Route, produce: () => unknown | Promise<unknown>): Promise<void> {
  try {
    const result = await produce()
    if (result === undefined) {
      await route.fulfill({ status: 204, body: '' })
      return
    }
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(result),
    })
  } catch (error) {
    const err = error as ApiError
    const status = err.response?.status ?? 500
    const data = err.response?.data ?? { message: err.message }
    await route.fulfill({
      status,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
  }
}

function dispatch({ method, segments, body }: Parsed): unknown | Promise<unknown> {
  const [service, a, b] = segments

  switch (service) {
    case 'members': {
      if (a === 'dashboard') return server.dashboard.getDashboard(USER)
      if (method === 'GET' && a === 'hello') return 'members'
      if (method === 'GET' && !a) return server.members.listMembers(USER)
      if (method === 'GET') return server.members.getMember(a, USER)
      if (method === 'POST') return server.members.createMember(body as never, USER)
      if (method === 'PATCH') return updateMember(a, body as never)
      if (method === 'DELETE') return deleteMember(a)
      break
    }
    case 'events': {
      if (method === 'GET' && a === 'hello') return 'events'
      if (method === 'GET' && !a) return server.events.listEvents(USER)
      if (method === 'GET') return server.events.getEvent(a, USER)
      if (method === 'POST') return server.events.createEvent(body as never, USER)
      if (method === 'PATCH') return updateEvent(a, body as never)
      if (method === 'DELETE') return deleteEvent(a)
      break
    }
    case 'feedback': {
      if (method === 'GET' && a === 'hello') return 'feedback'
      if (method === 'GET' && !a) return server.feedback.listFeedback(USER)
      if (method === 'GET') return server.feedback.getFeedback(a, USER)
      if (method === 'POST') return server.feedback.createFeedback(body as never, USER)
      if (method === 'PATCH') return server.feedback.updateFeedback(a, body as never, USER)
      if (method === 'DELETE') return server.feedback.deleteFeedback(a, USER)
      break
    }
    case 'finance': {
      if (method === 'GET' && a === 'hello') return 'finance'
      if (a === 'balances' && method === 'GET' && !b) return server.payments.listBalances(USER)
      if (a === 'balances' && method === 'GET') return server.payments.getMemberBalance(b, USER)
      if (a === 'transactions' && method === 'GET' && !b) return server.payments.listTransactions(USER)
      if (a === 'transactions' && method === 'GET') return server.payments.getTransaction(b, USER)
      if (a === 'transactions' && method === 'POST') return server.payments.createTransaction(body as never, USER)
      if (a === 'transactions' && method === 'PATCH') return server.payments.updateTransaction(b, body as never, USER)
      if (a === 'transactions' && method === 'DELETE') return server.payments.deleteTransaction(b, USER)
      break
    }
    case 'organization': {
      if (method === 'GET' && a === 'hello') return 'organization'
      if (a === 'sports' && method === 'GET' && !b) return server.organization.listSports()
      if (a === 'sports' && method === 'GET') return server.organization.getSport(b)
      if (a === 'sports' && method === 'POST') return server.organization.createSport(body as never, USER)
      if (a === 'sports' && method === 'PATCH') return updateSport(b, body as never)
      if (a === 'sports' && method === 'DELETE') return deleteSport(b)
      if (a === 'teams' && method === 'GET' && !b) return server.organization.listTeams()
      if (a === 'teams' && method === 'GET') return server.organization.getTeam(b)
      if (a === 'teams' && method === 'POST') return server.organization.createTeam(body as never, USER)
      if (a === 'teams' && method === 'PATCH') return updateTeam(b, body as never)
      if (a === 'teams' && method === 'DELETE') return deleteTeam(b)
      break
    }
    case 'helper': {
      if (method === 'GET' && a === 'hello') return 'helper'
      if (a === 'reports') {
        const [, , kind, id] = segments
        if (kind === 'member' && method === 'POST') return void server.helper.generateMemberReport(id, USER)
        if (kind === 'team' && method === 'POST') return void server.helper.generateTeamReport(id, USER)
        if (kind === 'member' && method === 'GET') return server.helper.listMemberReports(id, USER)
        if (kind === 'team' && method === 'GET') return server.helper.listTeamReports(id, USER)
        if (method === 'GET') return server.helper.getReport(kind)
        if (method === 'DELETE') return void server.helper.deleteReport(kind)
      }
      break
    }
    case 'letters': {
      if (method === 'GET' && a === 'hello') return server.letters.lettersHello()
      if (a === 'mail' && method === 'POST') return void server.letters.sendMail()
      if (a === 'pdf' && method === 'POST') return server.letters.generatePdf(body as never)
      break
    }
  }

  throw Object.assign(new Error(`Unhandled API route: ${method} /${segments.join('/')}`), {
    response: { status: 501, data: { message: 'Not implemented in the E2E server' } },
  })
}

export async function stubApi(context: BrowserContext): Promise<void> {
  resetServer()
  await context.route(
    (url) => url.pathname.includes('/api/v1/'),
    (route) => run(route, () => dispatch(parse(route))),
  )
}
