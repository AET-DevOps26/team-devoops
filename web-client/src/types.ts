import type { components } from './api'

type S = components['schemas']

export type Member = S['Member']
export type MemberSummary = S['MemberSummary']
export type MemberCreate = S['MemberCreate']
export type MemberPartialUpdate = S['MemberPartialUpdate']

export type SportEvent = S['Event']
export type EventSummary = S['EventSummary']
export type EventCreate = S['EventCreate']
export type EventPartialUpdate = S['EventPartialUpdate']

export type Sport = S['Sport']
export type SportCreate = S['SportCreate']
export type SportPartialUpdate = S['SportPartialUpdate']

export type Team = S['Team']
export type TeamCreate = S['TeamCreate']
export type TeamPartialUpdate = S['TeamPartialUpdate']

export type Feedback = S['Feedback']
export type FeedbackSummary = S['FeedbackSummary']
export type FeedbackCreate = S['FeedbackCreate']
export type FeedbackPartialUpdate = S['FeedbackPartialUpdate']

export type Transaction = S['Transaction']
export type TransactionCreate = S['TransactionCreate']
export type TransactionPartialUpdate = S['TransactionPartialUpdate']
export type Balance = S['Balance']
