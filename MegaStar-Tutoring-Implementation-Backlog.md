# MegaStar Tutoring Implementation Backlog

## Purpose

Turn the product blueprint into a build sequence that can ship on Vercel in small, safe steps.

This backlog is organized to get the platform working early, then layer on smarter features.

## Working Rules

- keep client data private
- build tutor/admin first
- add client portal only after the core workflow works
- use calendar sync as a source of truth for planning
- keep invoice output private per client
- introduce AI as assistant support, not core logic

## Milestone 1 - Project Foundation

### 1.1 Repository setup

- create the Next.js app
- add Tailwind or chosen styling system
- configure linting and formatting
- add environment variable handling
- set up folders for app, components, lib, and types

### 1.2 Deployment setup

- connect GitHub repo to Vercel
- configure preview and production deployments
- add domain or subdomain
- verify build and routing

### 1.3 Auth foundation

- choose auth provider
- implement sign in and sign up
- create role-based access
- protect tutor and client routes

## Milestone 2 - Data Model

### 2.1 Database setup

- create Postgres database
- define migrations or schema files
- seed initial tutor account

### 2.2 Core entities

- users
- tutor profiles
- client profiles
- availability blocks
- sessions
- invoices
- invoice items
- session feedback
- reschedule requests
- calendar connections
- AI actions

### 2.3 Access rules

- client can only see their own records
- tutor can see all assigned clients
- admin can see all operational data

## Milestone 3 - Public Frontend

### 3.1 Landing page

- hero section
- product promise
- feature highlights
- sign in button
- trust and privacy messaging

### 3.2 Brand system

- define colors
- define typography
- define button styles
- define card and table styles

### 3.3 Marketing pages

- pricing
- contact
- privacy
- terms

## Milestone 4 - Tutor Dashboard

### 4.1 App shell

- top navigation
- side navigation
- responsive layout
- empty state components

### 4.2 Overview dashboard

- today’s schedule
- upcoming lessons
- missed sessions
- billing alerts
- reschedule alerts
- client summary cards

### 4.3 Client management

- client list
- create client form
- edit client profile
- save rate, days, and notes
- assign tutor ownership

## Milestone 5 - Scheduling Core

### 5.1 Weekly planner

- display days and time slots
- show planned sessions
- show free slots
- show conflicts

### 5.2 Availability manager

- add recurring availability
- add buffer times
- add blackout dates
- edit weekly working hours

### 5.3 Calendar sync

- connect Google Calendar
- pull events
- match events to clients
- mark imported events
- store sync state

### 5.4 Reschedule logic

- detect clashes
- suggest next free slot
- create reschedule request
- mark resolved sessions

## Milestone 6 - Session Tracking

### 6.1 Session log

- list all sessions
- filter by client
- filter by status
- mark completed, missed, partial, cancelled

### 6.2 Feedback flow

- attach feedback to session
- allow tutor notes
- store billing-relevant feedback
- mark whether client was present

### 6.3 Missed session detection

- flag missing calendar events
- flag no-shows
- flag partial attendance
- highlight unpaid or unresolved items

## Milestone 7 - Invoice System

### 7.1 Invoice builder

- choose client
- choose month
- auto-load sessions
- calculate rate and total
- show invoice preview

### 7.2 Private invoice export

- export Excel first
- keep one client per file
- name files automatically
- include only selected client data

### 7.3 Invoice history

- list past invoices
- view totals
- track status
- reopen draft if needed

## Milestone 8 - Tutor Ratings

### 8.1 Review capture

- allow rating after completed sessions
- use verified reviews only
- add comment field

### 8.2 Rating display

- show average stars
- show punctuality score
- show communication score
- show recent trend

### 8.3 Moderation

- hide abusive reviews
- allow internal review approval
- prevent self-rating

## Milestone 9 - AI Layer

### 9.1 Assistant panel

- answer what needs attention today
- summarize schedule
- suggest next actions

### 9.2 Scheduler assistant

- suggest best reschedule slots
- highlight conflicts
- summarize availability gaps

### 9.3 Billing assistant

- draft invoice summaries
- flag billing anomalies
- suggest missing charges

### 9.4 Client support assistant

- draft polite reschedule messages
- draft follow-up notes
- generate quick replies

## Milestone 10 - Client Portal

### 10.1 Client dashboard

- show upcoming sessions
- show history
- show invoices
- show ratings and feedback

### 10.2 Client actions

- request reschedule
- leave a rating
- confirm attendance
- view session notes if enabled

### 10.3 Permissions

- only own data visible
- no access to other clients
- no tutor admin tools exposed

## Milestone 11 - Polish and Scale

### 11.1 Mobile responsiveness

- fix dashboard layout on small screens
- refine tables
- collapse side navigation

### 11.2 PWA readiness

- add manifest
- add install behavior
- support offline shell if useful

### 11.3 Analytics

- track usage
- track invoice exports
- track session completion
- track ratings trend

## Suggested Build Order

1. project foundation
2. data model
3. tutor dashboard
4. scheduling core
5. session tracking
6. invoice system
7. ratings
8. AI helpers
9. client portal
10. polish and scale

## MVP Definition

The first shippable version should include:

- auth
- tutor dashboard
- client profiles
- weekly scheduler
- Google Calendar sync
- session tracking
- private invoice export
- ratings

## Nice Later Additions

- payments
- tutor marketplace
- multiple tutors per organization
- team admin
- advanced AI planning
- public client booking

## Recommendation

Build this as a strong private tutor platform first.

Then expand into a client-facing service once the core workflow is smooth and reliable.
