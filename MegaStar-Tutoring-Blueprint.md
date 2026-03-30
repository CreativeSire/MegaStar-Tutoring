# MegaStar Tutoring Blueprint

## Product Goal

Build a tutoring platform that combines scheduling, client management, session tracking, invoicing, and AI-assisted planning in one private system.

The product should feel like a GoStudent-level tutor platform, but with stronger automation, cleaner invoicing, and a more intelligent internal workflow.

## Product Direction

- **Primary user:** tutor / admin
- **Secondary user:** client / student
- **Core promise:** keep every client private, organized, and billed correctly
- **Differentiator:** AI-assisted scheduler and work assistant

This is not just an invoice generator. It is a tutor operating system.

## Key Principles

1. **Client isolation**
   - No client can see another client’s schedule, pricing, or notes.
   - Each dashboard must be permission-scoped.

2. **Tutor-first workflow**
   - The tutor manages availability, lesson delivery, follow-up, and billing.
   - The system should reduce admin work, not add it.

3. **Smart automation**
   - Detect missed sessions.
   - Suggest reschedules.
   - Prepare invoices automatically.
   - Flag conflicts and unpaid items.

4. **AI as an assistant**
   - AI should help plan and summarize.
   - AI should not replace the underlying business rules.

## Core Modules

### 1) Internal Scheduler

Purpose: manage all client sessions, availability, and scheduling conflicts.

Capabilities:
- weekly planner
- calendar sync
- availability blocks
- conflict detection
- free-slot discovery
- reschedule suggestions
- buffer rules between sessions
- holiday and blackout dates

### 2) Per-Client Work Log

Purpose: maintain a private record for each client.

Capabilities:
- session history
- attendance status
- lesson notes
- homework or feedback
- payment rules
- lesson frequency
- reschedule history
- progress snapshots

### 3) Private Invoice Export

Purpose: generate invoices for one client only.

Capabilities:
- per-client rate handling
- monthly invoice generation
- session inclusion rules
- missed-session adjustments
- export to Excel first, PDF later
- automatic naming

Important:
- no cross-client data
- no visible tutor roster
- no hidden references to other clients

### 4) Optional Admin-Only Dashboard

Purpose: give the tutor a higher-level operational view.

Capabilities:
- all clients at a glance
- weekly workload
- billing status
- upcoming sessions
- no-show summary
- reschedule backlog
- AI-generated priorities

### 5) Optional Client Dashboard

Purpose: let clients view only their own data.

Capabilities:
- upcoming lessons
- attendance history
- invoice history
- reschedule requests
- notes or lesson summaries
- rating and feedback

## Screens

### Public / Entry
- Landing page
- Sign in / sign up
- role selection if needed

### Tutor / Admin
- Dashboard
- Clients list
- Client detail page
- Weekly planner
- Session log
- Invoice builder
- Availability manager
- AI assistant panel
- Settings

### Client
- Client dashboard
- Upcoming lessons
- Session history
- Invoice history
- Feedback / rating
- Reschedule request form

## Data Model

### Client
- id
- full_name
- email
- phone
- display_name
- billing_name
- rate
- currency
- timezone
- meeting_frequency
- preferred_days
- preferred_times
- notes
- status

### Session
- id
- client_id
- start_time
- end_time
- duration
- status: planned, completed, missed, partial, rescheduled, cancelled
- attendance_mark
- billing_flag
- feedback_status
- source: manual, calendar, imported

### Availability
- id
- tutor_id
- day_of_week
- start_time
- end_time
- buffer_before
- buffer_after
- recurring
- exceptions

### Invoice
- id
- client_id
- invoice_month
- invoice_date
- line_items
- subtotal
- adjustments
- total
- export_filename
- exported_at
- status

### Review / Rating
- id
- client_id
- tutor_id
- session_id
- stars
- title
- comment
- visible
- moderated_status
- created_at

### Calendar Event
- id
- source_calendar
- google_event_id
- client_id
- title
- start_time
- end_time
- linked_session_id
- sync_status

## Rating System

The product should support an Upwork-like tutor rating system, but with guardrails.

### What clients can rate
- punctuality
- clarity
- communication
- professionalism
- lesson value

### Rating format
- 1 to 5 stars
- short written review
- optional tags such as:
  - helpful
  - punctual
  - well prepared
  - needs follow-up

### Important rules
- only verified session participants can rate
- one rating per completed session or per month, depending on the final design
- ratings can be private, public, or tutor-only
- abuse should be moderated
- tutor can respond to reviews if desired

### Recommendation
Use a blended score:
- average stars
- recent ratings weight more
- attendance reliability
- response speed

This gives a better result than a simple public star count.

## AI / Agent Features

### Scheduler Agent
- suggests reschedule slots
- spots conflicts
- checks tutor availability
- highlights clients who need attention

### Billing Agent
- drafts invoice line items
- checks session counts
- applies per-client rules
- flags missing billing data

### Ops Agent
- summarizes the day
- identifies missed sessions
- reminds about feedback
- suggests next actions

### Client Support Agent
- drafts reschedule messages
- suggests polite replies
- helps with common client questions

## Suggested Workflow

1. Tutor signs in.
2. Dashboard shows today’s priorities.
3. Scheduler syncs calendar events.
4. Work logs update automatically.
5. Missed or partial sessions are flagged.
6. AI suggests reschedules.
7. Invoice builder prepares the monthly invoice.
8. Tutor reviews and exports the invoice.
9. Client dashboard updates only that client’s view.

## MVP Scope

The first version should include:
- tutor dashboard
- client profiles
- weekly planner
- Google Calendar sync
- private work logs
- missed session detection
- invoice export
- rating system
- basic AI suggestions

## Phase 2

- client portal
- tutor profile pages
- notifications
- payment tracking
- review moderation
- analytics
- mobile improvements

## Phase 3

- multi-tutor support
- team management
- public marketplace features
- PWA install support
- advanced AI assistant
- automated onboarding

## Naming Direction

Best options:
- **MegaStar Tutoring** - clean, modern, scalable
- **MegaStar Tuition** - slightly more traditional

Recommendation:
- use **MegaStar Tutoring** as the product name
- keep “tuition” as brand language if needed

## Final Recommendation

Build this as a private tutor platform first, then grow it into a client-facing product.

The winning formula is:
- internal scheduler
- per-client work logs
- private invoices
- optional client portal
- Upwork-like tutor ratings
- AI-driven workflow assistance

That combination is strong enough to stand out.
