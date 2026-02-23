# TaskTracker: February 21st Ideation Summary 🧠

This document organizes the key features and logic enhancements discussed on February 21, 2026. The focus is on moving from a static calendar to an **Adaptive, Intelligent Scheduling Assistant**.

## 1. Smart Scheduling Engine (The "Brain")

### Seasonality & Duration Scaling
- **Flag-based Multipliers**: Implementation of **Normal (N)**, **Peak (P)**, and **Slow (S)** monthly statuses.
- **Dynamic Adjustments**: Tasks in Peak months (e.g., March/April for taxes) automatically scale to 1.5x or 2.0x duration.
- **Adaptive Duration (Learning)**: A feedback loop where the system compares "Predicted Time" vs. "Actual Time Spent." It uses an Exponential Moving Average to adjust future predictions based on your actual habits.

### 🆕 Dynamic Task Reorganization (Self-Healing Schedule)
- **Concept**: If a meeting, class, or task is cancelled, the day shouldn't feel "ruined."
- **Logic**: The system detects newly available "Gaps" and automatically:
    1. **Pull-Forward**: Moves high-priority tasks from later in the week into the gap.
    2. **De-fragment**: Re-bundles small tasks together to create larger blocks of focused time.
    3. **Stress-Reduction**: Redistributes over-filled days into the newly opened space.

### Easy Task Adding
- **Quick Add**: Allows user to click the day and add task to that day and the task will be added to the task list, the week view row will show the time from 12 am to 11 pm, and the columns are the days of the week.

---

## 2. Advanced Task & Recurrence Logic

### Complex Patterns
- **Alternating Schedules**: Support for bi-weekly rotations (e.g., Wed/Thu every 2nd week).
- **Ordinal Days**: Specific occurrences like "3rd and 10th of the month" or "Every 3 months on the first Friday."
- **Holiday Integration**: Smart shifting/skipping of tasks based on personal or business holiday categories.

### Hierarchical (Grouped) Tasks
- **Composite Tasks**: Ability to group sub-tasks under a parent (e.g., "Mornining Routine" includes Brush Teeth, Shower, etc.).
- **Global Actions**: Completing or delaying a parent applies logic to all children.

---

## 3. UI/UX & Gamification

### The Interaction Layer
- **Interactive Progress**: A Duolingo-style "Interaction Bar" or experience level that rewards task completion.
- **Floating Dashboard**: A mini-metrics widget that floats over the Week view, updating dynamically as you navigate.
- **Smart Filtering**: Toggles for Work/Personal/Health categories.
- **Priority Depth**: Automatic hiding of routine tasks (e.g., Brush Teeth) in Monthly/Yearly views to keep high-level overviews clean.

### High-Level Visualization
- **Peak Highlights**: Year view highlights "Peak" months and conflicts in red.
- **Incremental Deadlines**: Helping users tackle large projects in small increments to avoid "piling up" near deadlines.

---

## 4. Systems & Portability
- **Data Import**: Full support for CSV and ICS (iCalendar) imports to ease migration from other platforms.
- **Data Export**: Ability to take your optimized schedule elsewhere.



Rough notes

Adding holiday calculation, adding date occurence choice, adding normal, slow, peak time and priority and seasonality



so like tasks that happen in a time period like march and april, its peak season so the originally inputted time it would be adjusted to be longer or double the time



after task was completed by user, the backend background will calculate how long it takes to finish the task that the user did (predicted time vs actual time) and the schedule will adjust)



attach dashboard floating to the week view, and also the dashboard should dynamically update to the week the user is at



toggle on off the task category (work/ personal/ health)



grouped task logic like "getting ready" = brush teeth, shower, bring gift/ items, 







add check off tasks/ complete tasks and keep the task there, make some type of interactive level or interaction bar like duo lingo 



add priority view in monthly (dont show stuff like brush teeth in the montly and yearly view)



logic needs to be adaptive and encompass task recurrence like (bi weekly on wednesdays and thursdays alternating) or (this happens on the 3rd and 10th of the month every months or every 2 months)



add import csv/ ics 





year view shows peak and conflict, like the end of the month will have to do billing for personal business and work tasks and also bills, and also this year view can offset and help the user avoid piling up tasks and overlap/ peak areas.