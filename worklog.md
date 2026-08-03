---
Task ID: 1
Agent: Main
Task: Fix 'currentUser is not defined' error in AdminScreen when logging in as administrator

Work Log:
- Analyzed user's screenshot showing Runtime ReferenceError: 'currentUser is not defined' at page.tsx:1764 in AdminScreen
- Identified that AdminScreen component (line 1558) used `currentUser` on line 1764 but didn't receive it as a prop or access it from the store
- Added `currentUser={currentUser}` prop to AdminScreen JSX call (line 452-458)
- Added `currentUser` to AdminScreen's destructured props: `function AdminScreen({ ..., currentUser }: any)`
- Verified ChatPage.tsx and AdminChatPage.tsx were not broken (only color/style changes from prior session, no logic changes)
- Killed stale dev server processes and restarted clean instance
- Tested with Agent Browser: admin dashboard renders correctly with all management cards
- Tested registration flow: auth choice screen and account creation form render correctly
- Tested login flow: navigation works correctly

Stage Summary:
- Fixed the critical ReferenceError that prevented admin login by adding `currentUser` as a prop to `AdminScreen`
- The fix was a 2-line change: pass prop in parent + destructure in child
- All core functionality verified: login, registration, admin dashboard

---
Task ID: 2
Agent: Main
Task: Restore missing admin buttons + uniform size + Espace CGL for committee members

Work Log:
- Added 'AdminHeroImage' import and 'Image as ImageIcon' to lucide-react imports in page.tsx
- Added 'Image de Fond' button (pink ImageIcon, adminView='hero-image') to admin grid
- Added 'Gestion du Comité' button (purple Shield icon, navigates to management-committee screen) to admin grid
- Added adminView='hero-image' render case for AdminHeroImage component
- Made ALL admin buttons uniform size with h-[100px] and flex centering (removed col-span-2 from Gérer Fichiers)
- Shortened 'Gérer Fichiers (Plan du village)' to 'Gérer Fichiers' to fit uniform cards
- Modified ModernSideMenu.tsx: added role-refresh mechanism via /api/user/role endpoint when menu opens
- Added 'Espace CGL' menu item (Crown icon) visible only for MANAGEMENT_COMMITTEE role
- Created /api/user/role endpoint for lightweight role checking
- Welcome message already implemented in /api/admin/management-committee POST route

Stage Summary:
- 14 uniform admin buttons in 2-column grid (was 12 + 1 wide)
- Committee members see 'Espace CGL' with Crown icon in their side menu
- Role refresh on menu open ensures immediate visibility when admin promotes a user
- Regular users see neither 'Espace CGL' nor 'Administration'
