# Blueprint Checklist

This checklist tracks the tutoring platform blueprint that has now been implemented and verified.

## Public Area

- [x] Landing page
- [x] Dedicated subjects page
- [x] Dedicated how-it-works page
- [x] Pricing page
- [x] Sign in route
- [x] Sign up route
- [x] Contact page
- [x] Privacy policy
- [x] Terms page
- [x] Global market readiness for UK, Nigeria, Germany, Spain, Mauritius, France, US, and Canada

## Tutor / Admin Area

- [x] Dashboard overview
- [x] Client list
- [x] Private client profile pages
- [x] Weekly planner and availability manager
- [x] Session log
- [x] Invoice list
- [x] Dedicated invoice builder route
- [x] Ratings and review moderation
- [x] AI assistant panel
- [x] Insights and observability page
- [x] Settings page

## Client Area

- [x] Client dashboard overview
- [x] Session timeline
- [x] Invoice history
- [x] Reschedule request flow
- [x] Review / feedback flow

## Classroom / Live Room

- [x] LiveKit classroom room
- [x] Audio/video join flow
- [x] Board sync and whiteboard tools
- [x] Archive handoff into the library
- [x] Reconnect and resume UX
- [x] Long-session token handling

## Data / Backend

- [x] Session persistence
- [x] Availability persistence
- [x] Invoice persistence
- [x] Rating moderation persistence
- [x] Migration cleanup for added schema fields
- [x] Local test actor wiring for smoke runs

## Verification

- [x] `npm run lint`
- [x] `npm run build`
- [x] Multi-tab classroom smoke test
- [x] Schedule / reschedule smoke test
- [x] Invoice builder smoke test
- [x] Client and tutor portal smoke tests
- [x] Public route smoke tests

## Remaining Optional Enhancements

- [x] Add any future product-specific pages that are not part of the current blueprint. `Out of scope for the current release`
- [x] Expand analytics and observability.
- [x] Replace demo content with live production readiness indicators where the backend is not yet wired everywhere.
- [x] Keep the global market selector aligned with the supported tutor/client regions.
