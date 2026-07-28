---
Task ID: 1
Agent: Main Agent
Task: Add "Je veux faire partie des experts partenaires" feature with full application flow

Work Log:
- Read ExpertDetailPanel.tsx (889 lines) to understand 3-level navigation (categories → list → detail)
- Read ServiceApresVenteScreen.tsx to understand how ExpertDetailPanel is integrated
- Read page.tsx to understand admin panel structure
- Read prisma/schema.prisma and discovered the project uses a MongoDB/Mongoose wrapper (not Prisma directly)
- Updated prisma/schema.prisma with ExpertApplication model (fullName, phone, whatsapp, categoryId, specialty, experience, location, certifications, bio, availability, status, rejectReason, reviewedBy, reviewedAt)
- Ran `npx prisma db push` to sync schema with SQLite database
- Created 4 API routes:
  - POST /api/expert-applications (public - submit application)
  - GET /api/expert-applications (admin - list applications with status filter)
  - PATCH /api/expert-applications/[id] (admin - approve or reject with reason)
  - GET /api/approved-experts (public - get approved experts to merge with static list)
- Discovered the project uses MongoDB wrapper in src/lib/db.ts (not Prisma), fixed API routes to use PrismaClient directly
- Created PartnerExpertApplicationForm.tsx (~350 lines) with:
  - Category dropdown (8 métiers du bâtiment)
  - Personal info fields (name, phone, WhatsApp)
  - Professional fields (specialty, experience, location, availability, certifications with add/remove)
  - Bio textarea
  - Success confirmation view after submission
- Updated ExpertDetailPanel.tsx:
  - Added PanelView type for 4-level navigation (categories, categoryExperts, expertDetail, applicationForm)
  - Added useEffect to fetch approved experts from DB and merge with static EXPERT_CATEGORIES
  - Added "Je veux faire partie des experts partenaires" CTA card with dashed emerald border and "Postuler maintenant" button
  - Added applicationForm view that renders PartnerExpertApplicationForm
- Created ExpertApplicationsAdmin.tsx (~400 lines) for committee management:
  - Stats bar (pending/approved/rejected counts)
  - Status filter dropdown
  - Expandable application cards with full details
  - Approve/Reject actions with rejection reason required
- Added "Candidatures Experts" card to admin panel grid in page.tsx
- Added adminView === 'expert-applications' section rendering ExpertApplicationsAdmin
- Full API test: POST creates application ✅, GET lists ✅, PATCH approves ✅, GET approved-experts returns ✅
- Browser verification: Expert panel loads with categories ✅, "Postuler maintenant" button visible ✅, Form with all fields visible ✅

Stage Summary:
- Complete expert application flow implemented end-to-end
- Prisma schema updated with ExpertApplication model
- 4 API routes created and tested (using Prisma directly, not MongoDB wrapper)
- Application form with 8-category dropdown and all professional/personal fields
- Admin committee panel for approve/reject with reasons
- Approved experts dynamically merge into the expert categories list
- All code compiles without new lint errors

---
Task ID: 2
Agent: Main Agent
Task: Convert expert application form to Dialog with mandatory profile photo

Work Log:
- Read all existing files (ExpertDetailPanel.tsx, PartnerExpertApplicationForm.tsx, API routes, ExpertApplicationsAdmin.tsx, prisma schema)
- Added `profileImage` field to ExpertApplication model in prisma/schema.prisma
- Ran `npx prisma db push` to sync the new field
- Rewrote POST /api/expert-applications route to accept FormData (multipart) instead of JSON:
  - Validates image type (JPEG, PNG, WebP, GIF) and size (max 5MB)
  - Saves profile image to public/uploads/expert-photos/ with unique filename
  - Stores relative path in database profileImage field
- Updated GET /api/approved-experts to return profileImage in expert data
- Rewrote PartnerExpertApplicationForm.tsx as a Dialog component:
  - Changed props from { onBack, onSubmitted } to { open, onOpenChange }
  - Uses shadcn Dialog component with full-screen overlay
  - Mandatory photo upload section with camera icon, dashed border upload area
  - Client-side image validation (type, size)
  - Image preview with remove button
  - All form fields preserved (category, name, phone, whatsapp, specialty, experience, location, availability, certifications, bio)
  - FormData submission instead of JSON
  - Success confirmation view with "Fermer" button
  - Form resets when dialog closes
- Updated ExpertDetailPanel.tsx:
  - Removed `applicationForm` from PanelView type (back to 3 views)
  - Added `showApplicationDialog` state
  - Changed "Postuler maintenant" button to set `setShowApplicationDialog(true)`
  - Renders PartnerExpertApplicationForm as Dialog at the end of the categories list
  - Uses React Fragment to wrap both the categories div and the Dialog
- Updated ExpertApplicationsAdmin.tsx:
  - Added `profileImage` field to ExpertApplication interface
  - Shows profile photo in summary row (instead of category icon)
  - Shows larger profile photo in expanded details view
  - Fallback to initials avatar if no photo
- Verified with agent-browser and VLM: Dialog opens as overlay ✅, Photo upload area visible ✅, Mandatory warning shown ✅, Category dropdown visible ✅

Stage Summary:
- Form now opens as a Dialog/modal popup instead of inline navigation
- Profile photo is mandatory with clear validation messaging
- Image upload saves to public/uploads/expert-photos/
- Approved experts show their profile photos in the expert categories list
- Admin panel shows applicant photos in both summary and expanded views
- All existing functionality preserved (form fields, validation, submission, admin review)
