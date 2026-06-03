# Implementation Plan - Redesign Professional/Consultant Dashboard

Redesign the Professional/Consultant Dashboard into a premium, calm, trustworthy, and emotionally intelligent wellbeing practice workspace. It will move away from generic CRM/hospital software layout and use soft gradients, rounded cards, organic typography, and supportive microcopy.

## User Review Required

> [!IMPORTANT]
> The redesigned dashboard will be completely interactive on the client side. We will build comprehensive tabs covering all 14 sidebar items and 19 flow modules.
> We will also implement a mock toggle for "Verification Status" (VERIFIED vs. PENDING) to allow the user or reviewer to experience the "Verification Pending" state visual design.

## Proposed Changes

### Professional Dashboard Page

#### [MODIFY] [page.tsx](file:///C:/Users/Administrator/Desktop/KLEVERKLUES/frontend/src/app/dashboard/professional/page.tsx)
- Completely rebuild the page to implement:
  - **Verification Detection & Flow**: Check verification status (`user.profile.verificationStatus` or mock state). If PENDING, show a premium "Verification Pending" screen with calm, pulsing progress indicator and next steps.
  - **Responsive Layout**: Collapsible sidebar navigation list containing: Overview, My Sessions, Clients, Programs, Community, Schedule & Availability, Assessments Insights, Resources, Earnings, Reviews & Ratings, AI Assistant, Trust & Verification, Notifications, Settings.
  - **Overview (Home)**: Top hero welcome greeting, emotional contribution tracking (e.g., "Dr. Sarah, you supported 12 people this week 💚"), daily focus items, today's schedule panel with client initials and priority indicators, and client wellbeing trends widget.
  - **My Sessions Tab**: View upcoming/past sessions, session notes editor, recommended next steps, and "Join Session" / reschedule options.
  - **Clients Tab**: Privacy-first list of active clients showing stress trends, burnout risks, and program completion rates with safe, minimal data exposure.
  - **Programs Tab**: Active recovery program monitoring showingCompletion rates, mood stability trends, and journaling consistency.
  - **Community Tab**: Leadership panel to host/manage Support Circles and Workshops (e.g., Anxiety Support Circle, Student Burnout Workshop).
  - **Schedule & Availability Tab**: Slot configurations, timezone selection, online/offline status toggle, and emergency SOS backup settings.
  - **Assessments Insights Tab**: Non-clinical summary of anxiety levels, emotional pattern detections, and burnout recovery indicators.
  - **Resources Tab**: Manage worksheets, upload clinical guides, and recommend exercises to specific client groups.
  - **Earnings Tab**: Respectful contribution panel displaying "Human Impact Score" (e.g., helped 24 individuals), session earnings, and workshops revenue.
  - **Reviews & Ratings Tab**: Professional verification badges and credentials verified checkmark along with client testimonials.
  - **AI Assistant Tab**: Draft follow-up suggestions, session summarization assistance, and burnout pattern alerts.
  - **Trust & Safety Panel**: Embedded child safety policies, crisis escalation guidelines, and AI transparency disclosures.
  - **Notifications Center**: Real-time alerts for incoming session bookings, follow-ups, and crisis support triggers.
  - **Settings Tab**: Configuration of specialization areas, session pricing, language preferences, and notification channels.

## Verification Plan

### Manual Verification
- Deploy and run the dev server.
- Log in as a professional user (role: `PROFESSIONAL`).
- Navigate to `/dashboard/professional`.
- Verify the responsive sidebar layout on laptop, tablet, and mobile views.
- Test the Interactive Verification toggle to transition between "Verification Pending" and the full "Consultant Workspace".
- Cycle through all 14 sidebar tabs to verify completeness, premium aesthetics, soft gradients, and interactive features (e.g. adding session notes, toggling availability, drafting AI follow-up suggestions).
