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

## Still to do

- **Payments and auto-match** — the plan is ready and everything under it is built.
- A few user screens still show sample numbers: Programs, Progress Tracker, My Care Journey, Impact & Gratitude, Reminders.
- **Enterprise screen** is still fake (we agreed to do it later).
- Nobody can leave a **review** yet, so every professional shows 0 stars.

## Checks

12 test files, all passing. They run against the real app and clean up after themselves.
