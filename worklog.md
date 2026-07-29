---
Task ID: 1
Agent: Main Agent
Task: Auto-notify management committee when a lot is reserved or purchased

Work Log:
- Analyzed full reservation/purchase flow (UI → API → MongoDB)
- Analyzed management committee structure (User.role = 'MANAGEMENT_COMMITTEE')
- Analyzed existing notification system (only congratulation notifications exist)
- Created Notification Mongoose model at src/lib/models/Notification.ts
- Registered Notification in src/lib/models/index.ts and src/lib/db.ts
- Created API routes:
  - GET /api/committee-notifications?userId=xxx&unreadOnly=true
  - PATCH /api/committee-notifications/[id] (mark as read)
  - DELETE /api/committee-notifications/[id]
  - POST /api/committee-notifications/mark-all
- Modified POST /api/reservations to auto-notify all committee members and admins
- Also sends a chat message to ADMIN user for immediate visibility
- Created CommitteeNotificationBell component with:
  - Bell icon + unread count badge
  - Popover with notification list
  - Mark all as read / mark individual as read
  - Auto-refresh every 15 seconds
  - French text, dark mode support
- Integrated bell in AdminScreen header (page.tsx)
- Integrated bell in ManagementCommitteeManagement page
- Integrated bell in AdminChatPage header
- All changes pass ESLint (no new errors)
- Page loads successfully (HTTP 200)

Stage Summary:
- Backend notification system fully implemented
- Committee members and admins automatically notified on reservation/purchase
- Chat message also sent to ADMIN for immediate visibility
- Notification bell visible in Admin panel, Committee page, and Admin Chat
---
Task ID: 1
Agent: Main Agent
Task: Create public "Avancement des travaux" section + subscriber tracking dashboard

Work Log:
- Created ProgressUpdate MongoDB model (title, description, category, images, videos, date, isPinned)
- Added ProgressUpdate to models/index.ts and db.ts exports
- Created API routes: GET/POST /api/progress-updates, DELETE/PATCH /api/progress-updates/[id]
- Created API route: GET /api/admin/subscriber-tracking (detailed subscriber data with lot details)
- Created PublicProgressSection component (category filters, card gallery, image/video detail modal)
- Created ProgressUpdatesAdmin component (create/pin/delete publications, image/video upload)
- Created SubscriberTrackingPanel component (search, filter, expandable lot details, detail modal, chat shortcut)
- Added PublicProgressSection to PersuasiveLandingPage between "Pourquoi choisir" and "Final CTA"
- Added 2 new admin cards: "Avancement Travaux" and "Suivi Souscripteurs"
- Added adminView handlers for 'progress-updates' and 'subscriber-tracking'

Stage Summary:
- Public progress section verified working on landing page with category filters and empty state
- Admin panel has new cards for managing publications and tracking subscribers
- Subscriber tracking provides detailed info: lots reserved/purchased, payment progress, lot status
- All components integrated into page.tsx with proper navigation
