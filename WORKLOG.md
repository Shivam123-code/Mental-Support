# Work Log — 14 August 2026

12 commits. Most of the app was fake before today. Now it is real.

## Fixed things that were broken

- **SOS now works for guests.** Before, if you were not logged in, the SOS box said "Connecting…" forever and you never got any updates. Now anyone can use it.
- **Maps and video were blocked.** Addresses would not load and the help video would not play. Both work now.
- **Vendor jobs vanished on refresh.** A vendor in the middle of a job lost the whole screen if they reloaded. Fixed.
- **Login lockout turned off on your own computer.** Typing a password wrong a few times while testing no longer locks you out. It still protects the live site.
- **Fixed a security hole** in the chat server that let anyone crash it.
- **Fixed a loop** that hit the database every few seconds forever when a login expired.

## Made fake things real

Before, the screens showed made-up people like "Rahul S." and "Priya M." who did not exist.

- **Sessions** — a person can book a professional, and the professional really sees it, confirms it, and finishes it.
- **Chat** — clients and professionals can message each other. Only people who have a session together can talk.
- **Video calls** — sessions now have a real video room. The link is secret so strangers cannot join.
- **Resources** — professionals can share real files. Clients see them.
- **Circles / groups** — professionals open real groups. Clients really join. The count is real.
- **Notifications** — real alerts instead of made-up ones.
- **Professional settings** — price, languages and skills now save properly and show to clients.

## Turned off things that were lying

- **AI insights** were showing made-up health notes about made-up clients, with a button to act on them. Now switched off and says so.
- **A privacy "Delete my data" button** did nothing at all. Now it says so instead of pretending.
- **Admin history** used to disappear when you refreshed the page. Now it is saved forever.

## Made it ready for many users

- The chat server can now run on **more than one machine**. Before, adding a second one would have quietly lost messages.
- **Admins can now claim an alert.** Before, all admins got every alert and nobody knew who was handling what. Now one person takes it and it leaves everyone else's screen.
- Admin lists were showing only the **first 100** people and not telling you. Now they say "100 of 1432".

## Test accounts

| Panel | Email | Password |
|---|---|---|
| User | paneluser@kleverklues.com | Panel@1234 |
| Professional | panelpro@kleverklues.com | Panel@1234 |
| Enterprise | panelenterprise@kleverklues.com | Panel@1234 |
| Vendor | panelvendor@kleverklues.com | Panel@1234 |
| Admin | admin@kleverklues.com | Admin@123 |

## Payments and auto-match

Auto Match is now a paid feature, and it works end to end today with a **test
payment**. No real money moves yet.

How it goes:

1. You answer the quiz and press **Find My Match**.
2. It asks for ₹499 and sends you to a checkout page.
3. You press **Pay** (or **Simulate a declined card**, to see that path).
4. You come back to your answers — you do not fill the quiz in again.
5. You see your ranked matches and **choose one person**.
6. You can message that person straight away, before booking anything.

Important bits:

- **The browser can never mark itself paid.** Only the payment gateway can, and
  it does it with a signed message to our server. The test gateway sends that
  same signed message, so nothing changes when the real one is plugged in.
- **Paying twice is not possible.** Gateways send the same message over and
  over; the second one does nothing.
- **One payment buys one match**, even if you click twice at the same time.
- **Re-running the quiz is free.** You pay for the person, not the list.
- **Emergency SOS stays free and always will.** It is not behind any payment.

To go live, someone swaps one file (the gateway adapter) and puts the real keys
in. Nothing else changes. Session payments are built and tested the same way,
just not shown on screen yet.

## Reviews

Nobody could leave a review before, so every professional showed 0 stars — and
the match ranking sorts on that number, so it was sorting on nothing.

Now: after a professional marks a session **complete**, the client sees a
**Rate session** button next to it. Five stars, an optional comment, and a
tick-box to post without their name.

- You can only review a session **you were actually on**, and only **once**.
- The professional's average is worked out from the real reviews every time, so
  it can never drift away from what people actually said.
- Reviews show on the professional's own dashboard, replacing the fake "4.9 over
  42 reviews" and the two invented testimonials that were there.
- Their dashboard also stopped saying "Verified Specialist" to everyone — it now
  says what their account actually is.

## Still to do

- A few user screens still show sample numbers: Programs, Progress Tracker, My Care Journey, Impact & Gratitude, Reminders.
- **Enterprise screen** is still fake (we agreed to do it later).
- The public professionals list still shows 8 made-up professionals rather than
  real accounts.
- Real gateway keys (Razorpay or similar) when you are ready.

## Checks

14 test files, all passing. They run against the real app and clean up after
themselves. The payments one alone checks 41 things, including forged payment
messages, tampered amounts, and two people clicking at the same moment.
