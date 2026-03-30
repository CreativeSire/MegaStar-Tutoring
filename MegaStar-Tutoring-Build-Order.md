# MegaStar Tutoring Build Order

## Goal

Build a Vercel-hosted tutoring platform that supports:

- tutor/admin operations
- private client dashboards
- scheduling and rescheduling
- per-client work logs
- invoice generation
- tutor ratings
- AI-assisted planning

The first release should feel polished, private, and useful for a real tutor handling multiple clients.

## Recommended Stack

- **Frontend:** Next.js on Vercel
- **Styling:** Tailwind CSS or CSS modules
- **Auth:** Supabase Auth, Clerk, or NextAuth
- **Database:** Postgres
- **File storage:** Vercel Blob, Supabase Storage, or S3
- **Calendar sync:** Google Calendar API
- **AI layer:** OpenAI API for summaries, suggestions, and planning help

## Product Structure

### Public Area

Used for marketing and onboarding.

- landing page
- pricing page
- sign in / sign up
- contact page
- privacy policy
- terms

### Tutor/Admin Area

Used by the tutor or platform admin.

- dashboard
- client list
- client profile
- weekly planner
- session log
- invoice builder
- ratings and reviews
- AI assistant panel
- settings

### Client Area

Used by a client or student.

- client dashboard
- upcoming lessons
- session history
- invoice history
- request reschedule
- leave rating
- view feedback

## Exact Pages

### Public Pages

- `/`
  - hero section
  - value proposition
  - screenshots
  - sign in button
- `/pricing`
  - plans or service tiers
- `/contact`
  - support form
- `/auth/sign-in`
- `/auth/sign-up`

### Tutor/Admin Pages

- `/app`
  - overview dashboard
- `/app/clients`
  - client directory
- `/app/clients/[clientId]`
  - private client profile
- `/app/calendar`
  - weekly schedule and availability
- `/app/sessions`
  - attendance and work logs
- `/app/invoices`
  - invoice list
- `/app/invoices/new`
  - invoice builder
- `/app/ratings`
  - tutor feedback and reviews
- `/app/ai`
  - assistant workspace
- `/app/settings`
  - calendar, billing, and account settings

### Client Pages

- `/dashboard`
  - private client overview
- `/dashboard/sessions`
  - session timeline
- `/dashboard/invoices`
  - invoice history
- `/dashboard/reschedule`
  - reschedule request form
- `/dashboard/review`
  - leave a rating after a session

## Core Components

### Layout Components

- `AppShell`
- `TopNav`
- `SideNav`
- `PageHeader`
- `SectionCard`
- `StatCard`
- `EmptyState`

### Scheduler Components

- `WeeklyCalendar`
- `DayColumn`
- `TimeSlot`
- `AvailabilityGrid`
- `ConflictBanner`
- `ReschedulePicker`
- `GoogleCalendarSyncPanel`

### Client Components

- `ClientTable`
- `ClientSummaryCard`
- `ClientProfileForm`
- `ClientStatusBadge`
- `ClientNotesPanel`

### Session Components

- `SessionTable`
- `SessionTimeline`
- `SessionStatusPill`
- `SessionDetailDrawer`
- `AttendanceToggle`
- `FeedbackPanel`

### Invoice Components

- `InvoiceBuilder`
- `InvoicePreview`
- `InvoiceLineItems`
- `InvoiceTotals`
- `InvoiceExportButton`
- `InvoiceHistoryTable`

### Rating Components

- `TutorRatingCard`
- `StarRatingInput`
- `ReviewList`
- `ReviewModerationPanel`
- `VerifiedReviewBadge`

### AI Components

- `AIAssistantPanel`
- `SuggestedActionsList`
- `SessionSummaryCard`
- `RescheduleSuggestionCard`
- `BillingSuggestionCard`

## Database Tables

### users

- `id`
- `name`
- `email`
- `role` - tutor, admin, client
- `avatar_url`
- `created_at`

### tutor_profiles

- `id`
- `user_id`
- `display_name`
- `bio`
- `timezone`
- `rating_average`
- `rating_count`
- `created_at`

### client_profiles

- `id`
- `owner_tutor_id`
- `user_id` nullable
- `full_name`
- `billing_name`
- `email`
- `phone`
- `rate`
- `currency`
- `meeting_frequency`
- `preferred_days`
- `preferred_times`
- `notes`
- `status`
- `created_at`

### availability_blocks

- `id`
- `tutor_id`
- `day_of_week`
- `start_time`
- `end_time`
- `buffer_before_minutes`
- `buffer_after_minutes`
- `is_recurring`
- `created_at`

### calendar_connections

- `id`
- `tutor_id`
- `provider`
- `calendar_id`
- `access_token_encrypted`
- `refresh_token_encrypted`
- `sync_status`
- `last_synced_at`

### sessions

- `id`
- `client_id`
- `tutor_id`
- `title`
- `start_time`
- `end_time`
- `duration_minutes`
- `status` - planned, completed, missed, partial, cancelled, rescheduled
- `billing_status`
- `feedback_status`
- `source`
- `notes`
- `created_at`

### session_feedback

- `id`
- `session_id`
- `client_id`
- `tutor_id`
- `stars`
- `communication_score`
- `clarity_score`
- `punctuality_score`
- `comment`
- `visibility`
- `created_at`

### invoices

- `id`
- `client_id`
- `tutor_id`
- `invoice_number`
- `invoice_month`
- `issue_date`
- `subtotal`
- `adjustments`
- `total`
- `currency`
- `status`
- `export_filename`
- `created_at`

### invoice_items

- `id`
- `invoice_id`
- `session_id`
- `description`
- `quantity`
- `unit_price`
- `amount`

### reschedule_requests

- `id`
- `client_id`
- `tutor_id`
- `requested_from_session_id`
- `preferred_slots`
- `reason`
- `status`
- `resolved_slot_start`
- `resolved_slot_end`
- `created_at`

### ai_actions

- `id`
- `tutor_id`
- `client_id` nullable
- `action_type`
- `input_context`
- `output_summary`
- `status`
- `created_at`

## Key Workflows

### 1) Tutor onboarding

1. Tutor signs in.
2. Sets timezone, availability, and billing defaults.
3. Connects Google Calendar.
4. Adds first clients.

### 2) Client setup

1. Tutor creates a client profile.
2. Adds billing name, rate, and schedule preferences.
3. Adds lesson frequency and notes.
4. Saves client to the scheduler.

### 3) Weekly scheduling

1. Calendar sync imports lessons.
2. System matches events to clients.
3. Conflicts are flagged.
4. Free slots are suggested.
5. Tutor confirms or adjusts.

### 4) Session tracking

1. Lesson is marked completed, missed, partial, or cancelled.
2. Feedback can be added.
3. Billing rules are applied.
4. Client work log updates automatically.

### 5) Private invoice export

1. Tutor chooses one client and a month.
2. System pulls only that client’s sessions.
3. Totals are calculated.
4. Invoice is exported privately.

### 6) Tutor ratings

1. Client leaves a verified review after a real session.
2. Rating is stored against the tutor and session.
3. Tutor averages and review history update.

## Rating System

Use a private-but-structured Upwork-like rating model.

### Fields

- stars
- punctuality
- communication
- clarity
- professionalism
- comment
- verified session flag

### Rules

- only completed or verified sessions can be rated
- one review per session or one review per billing cycle
- moderation controls for abuse
- optional private reviews for internal use
- optional public tutor score later

### Better than simple stars

Show:

- average stars
- recent feedback trend
- punctuality score
- response score

That gives a more useful tutor profile than a single number.

## AI Features

### Scheduler Agent

- suggests the best reschedule slot
- spots conflicts
- looks for missed lessons
- helps keep the schedule full

### Billing Agent

- drafts invoices
- checks session totals
- flags unusual gaps
- applies client-specific rules

### Ops Agent

- tells the tutor what needs attention today
- points out unpaid or unreviewed sessions
- summarises workload

### Client Support Agent

- drafts polite reschedule messages
- suggests follow-up wording
- helps answer common client questions

## MVP Build Order

### Phase 1 - Foundation

- project setup on Vercel
- auth and roles
- database schema
- public landing page
- tutor dashboard shell
- client list
- client profile pages

### Phase 2 - Scheduler

- weekly planner
- availability manager
- Google Calendar sync
- conflict detection
- reschedule suggestions

### Phase 3 - Billing

- session logs
- invoice builder
- invoice export
- private work logs
- monthly summaries

### Phase 4 - Ratings and AI

- tutor rating system
- review capture
- moderation
- AI assistant panel
- suggested actions

### Phase 5 - Client Portal

- client dashboard
- invoice history
- reschedule requests
- feedback and ratings

## What Makes It Stand Out

- tutor-first, not generic booking software
- private client separation
- AI that helps with actual work
- clean invoice exports
- Upwork-like tutor ratings
- strong calendar + scheduling intelligence

## Recommendation

Start with:

1. tutor dashboard
2. client profiles
3. calendar sync
4. session tracking
5. private invoice export
6. rating system

Then add:

- client portal
- AI assistant
- analytics
- public polish

That gives you a real product, not just a page.
