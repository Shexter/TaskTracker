# TaskTracker — Frontend Design Reference (21st.dev Inspiration)

> This document catalogs the 21st.dev community components we are using as design inspiration for the TaskTracker frontend. Each entry includes the component name, author, 21st.dev URL, installation command, and how we plan to use it in our app.

---

## 📅 Calendar / Scheduling

### 1. Gantt Chart — by Hayden Bleasel ⭐ (User-Selected)
- **URL**: https://21st.dev/community/components/haydenbleasel/gantt/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/haydenbleasel/gantt`
- **Description**: A timeline-based Gantt view with task groups, duration bars, and month/week columns. Color-coded status dots (green = active, orange = in progress, grey = inactive).
- **Use in TaskTracker**: Inspiration for our **Month View** or a future **Timeline View**. The grouped rows by project/category and horizontal duration bars map perfectly to task categories and recurrence periods.

### 2. Calendar — by Ali Imam
- **URL**: https://21st.dev/community/components/aliimam/calendar/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/aliimam/calendar`
- **Description**: A clean month-grid calendar with highlighted available dates (blue circles). 7-column Sun–Sat layout with clear date numbers.
- **Use in TaskTracker**: Inspiration for our **Month View** date picker and mini-calendar sidebar widget. The dot highlights can represent days with scheduled tasks.

### 3. Origin UI — Calendar (React Day Picker) — by Origin UI
- **URL**: https://21st.dev/community/components/origin-ui/calendar-react-day-picker/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/origin-ui/calendar-react-day-picker`
- **Description**: A polished calendar using react-day-picker. Multiple variants including date range selection.
- **Use in TaskTracker**: For our **date range selector** when filtering tasks or picking recurrence start/end dates.

### 4. Fullscreen Calendar — by Ahmed Mayara
- **URL**: https://21st.dev/community/components/ahmed-mayara/fullscreen-calendar/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/ahmed-mayara/fullscreen-calendar`
- **Description**: A full-page, spacious month calendar that displays events directly in the grid cells.
- **Use in TaskTracker**: Primary inspiration for our **Calendar Page** layout — large, spacious cells with task cards placed inside each day.

---

## ✅ Task Management

### 5. Task List — by Ravi Katiyar ⭐ (User-Selected)
- **URL**: https://21st.dev/community/components/ravikatiyar/task-list/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/ravikatiyar/task-list`
- **Description**: A table-format task list with columns: No, Task, Category, Status (color-coded badges: Completed=green, In Progress=orange, Pending=grey), Due Date. Features staggered animation for list items.
- **Use in TaskTracker**: Direct inspiration for our **Tasks Page**. We will adapt the column structure to match our schema (Task ID, Name, Category, Period, Occurrence, Status, Base Time).

---

## 🤖 AI Chat

### 6. Chat Input — by simple-ai
- **URL**: https://21st.dev/community/components/simple-ai/chat-input/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/simple-ai/chat-input`
- **Description**: A streamlined input box designed for AI chat conversations.
- **Use in TaskTracker**: For the text input of our **AI Chat Panel**.

### 7. AI Input with Suggestions — by Kokonut UI
- **URL**: https://21st.dev/community/components/kokonut-ui/ai-input-with-suggestions/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/kokonut-ui/ai-input-with-suggestions`
- **Description**: An intelligence input field with preset suggestion chips (e.g., "How busy am I this week?", "Show my overdue tasks").
- **Use in TaskTracker**: Inspiration for adding **quick prompt suggestions** to our AI Chat Panel.

### 8. Text Generate Effect — by Aceternity UI
- **URL**: https://21st.dev/community/components/aceternity-ui/text-generate-effect/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/aceternity-ui/text-generate-effect`
- **Description**: Aesthetic character-by-character text reveal animation.
- **Use in TaskTracker**: For the AI response rendering to create a smooth "typing" effect when displaying chatbot replies.

---

## 📐 Layout & Navigation

### 9. Sidebar — by shadcn ⭐
- **URL**: https://21st.dev/community/components/shadcn/sidebar/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/shadcn/sidebar`
- **Description**: The official shadcn sidebar with collapsible groups, icon menu items (Home, Inbox, Calendar, Search, Settings), and a user profile footer. Clean, minimal design with smooth transitions.
- **Use in TaskTracker**: Our **primary app navigation**. Menu items: Dashboard, Calendar, Tasks, Chat, Settings. User profile at the bottom.

### 10. Sidebar — by Aceternity UI
- **URL**: https://21st.dev/community/components/aceternity-ui/sidebar/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/aceternity-ui/sidebar`
- **Description**: A sleek sidebar with hover animations and dynamic transitions.
- **Use in TaskTracker**: Alternative inspiration for a more animated sidebar, especially for the collapsed/icon-only mode.

---

## 📊 Dashboard / Cards

### 11. Feature Section with Bento Grid — by Tommy Jepsen
- **URL**: https://21st.dev/community/components/tommy-jepsen/feature-section-with-bento-grid/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/tommy-jepsen/feature-section-with-bento-grid`
- **Description**: A modern bento-style grid layout with cards of varying sizes.
- **Use in TaskTracker**: Inspiration for our **Dashboard Page** layout — metric cards arranged in a responsive bento grid (Total Tasks, Completion Rate, Time Scheduled, Busiest Day).

### 12. Hover Detail Card — by Isaiah
- **URL**: https://21st.dev/community/components/isaiah/hover-detail-card/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/isaiah/hover-detail-card`
- **Description**: A card that reveals extra information on hover.
- **Use in TaskTracker**: For the **task cards in the calendar grid** — hovering over a task shows its full details (time, category, status) without cluttering the view.

### 13. Card Stack — by Ankit Verma
- **URL**: https://21st.dev/community/components/ankit-verma/card-stack/default
- **Install**: `npx shadcn@latest add https://21st.dev/r/ankit-verma/card-stack`
- **Description**: An interactive stack of overlapping cards.
- **Use in TaskTracker**: Could be used for a "Today's Tasks" or "Overdue" widget on the Dashboard.

---

# 🌐 Alternative UI Platforms (Beyond 21st.dev)

The user requested we research alternative platforms for design inspiration. Below are the findings from each platform, with components relevant to the TaskTracker app.

| Platform | Type | Best For | Cost |
|----------|------|----------|------|
| **Aceternity UI** | Component library | Animations, Bento Grids, Cards | Free (All-Access paid) |
| **HeroUI** | React UI library | Accessible calendars, date pickers | Free / Open source |
| **Pagedone** | Design system | Calendar blocks, full-page layouts | Free (Pro paid) |
| **v0.dev** | AI code generator | Rapid prototyping custom layouts | Free tier available |
| **Tailgrids** | Tailwind components | Calendar views (D/W/M/Y) | Free / Pro |
| **Subframe** | Visual design-to-code | Design iteration, export React | Free tier available |
| **Uiverse.io** | CSS micro-elements | Buttons, checkboxes, loaders | Free / Community |

---

## Aceternity UI — `ui.aceternity.com`
> 200+ free React/Next.js components built with **Tailwind CSS + Framer Motion**. Shadcn CLI compatible.

### 14. Bento Grid
- **URL**: https://ui.aceternity.com/components/bento-grid
- **Install**: `npx shadcn@latest add @aceternity/bento-grid` (or copy from site)
- **Description**: A skewed grid layout with title, description, and header for each cell. Perfect for dashboards.
- **Use in TaskTracker**: **Dashboard Page** — arrange metrics (Total Tasks, Completion Rate, Hours, Busiest Day) in a visually appealing asymmetric grid.

![Aceternity Bento Grid](/Users/timothylauw/.gemini/antigravity/brain/c9bd6592-01dd-4e1e-9e70-52ab657807fe/aceternity_bento_grid_1771646174212.png)

### 15. Floating Dock
- **URL**: https://ui.aceternity.com/components/floating-dock
- **Description**: A macOS-style floating navigation dock with hover animations. Icons scale up with spring physics on hover.
- **Use in TaskTracker**: Could serve as an **alternative bottom navigation** (mobile-first) or a quick-access toolbar for switching between Dashboard/Calendar/Tasks.

### 16. Expandable Cards
- **URL**: https://ui.aceternity.com/components/expandable-card
- **Install**: `npx shadcn@latest add @aceternity/expandable-card`
- **Description**: Cards that expand on click to show additional information, with smooth Framer Motion animations.
- **Use in TaskTracker**: For **task detail expansion** in the Calendar view — click a task card to expand it and see full details (category, duration, status, notes) without navigating away.

![Aceternity Expandable Cards](/Users/timothylauw/.gemini/antigravity/brain/c9bd6592-01dd-4e1e-9e70-52ab657807fe/aceternity_expandable_card_1771646189429.png)

### 17. Sidebar (Aceternity)
- **URL**: https://ui.aceternity.com/components/sidebar
- **Description**: An animated sidebar with dark mode support, logo, navigation links, and user profile section. Smooth open/close transitions.
- **Use in TaskTracker**: Alternative to shadcn sidebar if we want more pronounced animations.

### 18. Card Spotlight
- **URL**: https://ui.aceternity.com/components/card-spotlight
- **Description**: A card with a radial gradient spotlight that follows the cursor.
- **Use in TaskTracker**: For **Dashboard metric cards** — the spotlight effect draws attention to the card being hovered.

---

## HeroUI — `heroui.com` (Previously NextUI)
> Beautiful, fast React UI library with built-in accessibility via React Aria.

### 19. Calendar (HeroUI)
- **URL**: https://www.heroui.com/docs/components/calendar
- **Install**: `npm install @heroui/calendar`
- **Description**: A fully accessible calendar component supporting multiple date selection, unavailable dates, international calendars, visible months, and custom first day of week. Built on React Aria.
- **Use in TaskTracker**: Reference for **accessibility patterns** in our calendar — keyboard navigation, ARIA labels, and screen reader support. Also useful for the mini-calendar date picker in the sidebar.

---

## Pagedone — `pagedone.io`
> A design system with 1000+ Tailwind CSS UI components and Figma files.

### 20. Month View Calendar (Pagedone) ⭐
- **URL**: https://pagedone.io/blocks/application/calendar
- **Description**: A full-featured **Month View Calendar** with: "Today" button, previous/next navigation arrows, Day/Week/Month view toggle tabs, 7-column grid (Sun–Sat), events displayed inside day cells.
- **Use in TaskTracker**: **Primary inspiration for the Calendar Page layout**. The Day/Week/Month toggle, Today button, and events-inside-cells pattern are exactly what we want.

![Pagedone Month View Calendar](/Users/timothylauw/.gemini/antigravity/brain/c9bd6592-01dd-4e1e-9e70-52ab657807fe/pagedone_calendar_1771646322807.png)

---

## v0.dev — `v0.dev` (by Vercel)
> AI-generated React + Tailwind UI components.

### 21. Calendar Component (v0)
- **URL**: https://v0.dev (generate via prompt)
- **Description**: v0 generates custom calendar components on-the-fly from natural language prompts. A "Tailwind calendar component" template exists with week + month views.
- **Use in TaskTracker**: We can use v0 to **rapidly prototype** specific calendar variations and iterate on the week view layout before finalizing our custom implementation.

---

## Tailgrids — `tailgrids.com`
> Flexible Tailwind CSS components with monthly, weekly, daily, and yearly calendar views.

### 22. Calendar Views (Tailgrids)
- **URL**: https://tailgrids.com/components/calendar
- **Description**: Pre-built calendar components supporting **all four views** (daily, weekly, monthly, yearly). Designed for event planning and schedule management.
- **Use in TaskTracker**: Reference for the **weekly grid layout** — column widths, time slots, and event card placement within the grid.

---

## Subframe — `subframe.com`
> Visual design-to-code tool that exports production-ready React code. Uses Radix for interactive behavior.

### 23. Dashboard & Calendar Templates (Subframe)
- **URL**: https://subframe.com
- **Description**: Visual builder where you design screens (dashboards, calendar views, task lists) and export as React + Tailwind code. Includes calendar view design examples for task management and HR dashboards.
- **Use in TaskTracker**: As a **design prototyping tool** if we want to visually iterate on layouts before coding them manually.

---

## Uiverse.io — `uiverse.io`
> 4000+ community-built HTML/CSS UI elements (buttons, inputs, loaders, toggles).

### 24. UI Elements (Uiverse.io)
- **URL**: https://uiverse.io
- **Description**: Large collection of micro-UI elements with unique styles — buttons, checkboxes, toggle switches, loaders, and input fields. All pure HTML/CSS.
- **Use in TaskTracker**: For finding **unique micro-interactions** — custom checkbox animations for marking tasks complete, creative loading spinners, or distinctive toggle styles for the sidebar.

---

## 🎨 Design Principles (Derived from Research)

| Principle | Implementation |
|-----------|---------------|
| **Dark mode first** | Use shadcn's built-in dark mode with Tailwind `dark:` classes |
| **Color-coded categories** | Health=emerald, Bills=blue, Taxes=amber, Work=violet, Personal=rose |
| **Status badges** | Completed=green, Pending=gray, In Progress=orange, Skipped=red |
| **Staggered animations** | Use Framer Motion for list item and card entrance animations |
| **Glassmorphism accents** | Subtle frosted-glass effect on floating panels (Chat Panel, modals) |
| **Inter font** | Use Google Fonts Inter for a clean, modern typography |

---

## 🔧 Installation Commands Log

```bash
# After frontend is initialized, install these 21st.dev components:
npx shadcn@latest add https://21st.dev/r/shadcn/sidebar
npx shadcn@latest add https://21st.dev/r/ravikatiyar/task-list
npx shadcn@latest add https://21st.dev/r/haydenbleasel/gantt
npx shadcn@latest add https://21st.dev/r/aliimam/calendar
npx shadcn@latest add https://21st.dev/r/kokonut-ui/ai-input-with-suggestions
npx shadcn@latest add https://21st.dev/r/aceternity-ui/text-generate-effect
npx shadcn@latest add https://21st.dev/r/tommy-jepsen/feature-section-with-bento-grid
```

---

*This document will be updated as we discover and integrate additional 21st.dev components during development.*
