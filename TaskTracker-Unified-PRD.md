# Task Tracker - Unified Product Requirements Document

**Version:** 2.0 (Merged Full-Stack)  
**Date:** February 20, 2026  
**Author:** Development Team  
**Status:** Ready for Implementation  

---

## TABLE OF CONTENTS

1. Executive Summary
2. Product Overview & Migration Path
3. Success Metrics
4. Current System Analysis (Google Sheets)
5. Full-Stack Requirements & Features
6. Data Models & Domain Entities
7. Frontend Architecture
8. Backend Architecture
9. Database Schema
10. Recurrence Expansion Engine
11. Real-Time Synchronization
12. Security & Authentication
13. Testing Strategy
14. Deployment & DevOps
15. Implementation Roadmap
16. Phase-by-Phase Breakdown
17. Known Limitations & Out-of-Scope Items

---

## 1. EXECUTIVE SUMMARY

### Overview

Transform an existing Google Sheets task manager into a production-grade, full-stack web application enabling users to manage recurring personal and professional tasks across week/month/year views with real-time synchronization, multi-user support, and scalable architecture.

### Current State

- Google Sheets-based system with 6 interconnected sheets
- 12 holidays, 4 active tasks, 100+ future instances
- Manual expansion, no real-time sync, single user
- Data: January-September 2026 calendar
- Limited to Sheets performance and collaboration constraints

### Target State

- Production web application (React + TypeScript, FastAPI, PostgreSQL)
- Multi-user with JWT authentication
- Real-time WebSocket synchronization
- Unlimited task instances & concurrent users
- Mobile responsive (iOS 12+, Android 5+)
- 99.9% uptime SLA
- Comprehensive analytics and reporting
- Export to iCal, CSV, JSON

### Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Task creation time | < 30 seconds | User experience |
| Calendar render time | < 1 second | Perceived responsiveness |
| Real-time update latency | < 500ms | Seamless synchronization |
| System uptime | 99.9% | Production reliability |
| Test coverage | > 90% | Code quality |
| Max instances per user | 1000+ | Scalability |
| Concurrent users (MVP) | 100 | Load testing target |

---

## 2. PRODUCT OVERVIEW & MIGRATION PATH

### Sheets Architecture (Legacy)

The current system consists of six interdependent Google Sheets:

1. **SET UP**: Configuration hub for holidays/special events
2. **JOB TASKS**: Master task definitions with recurrence rules
3. **FUTURE TASK DATA**: Pre-expanded task occurrences (flattened view)
4. **WEEK**: Weekly calendar view with aggregations
5. **MONTH**: Monthly calendar grid view
6. **YEAR**: Planned yearly overview (stub, not yet implemented)

### Data Flow

```
JOB TASKS (Master Rules)
    | Recurrence Engine
    v
FUTURE TASK DATA (Expanded Instances)
    |
    +--- WEEK Sheet (Weekly View)
    +--- MONTH Sheet (Monthly View)
    +--- YEAR Sheet (Yearly View - planned)

SET UP (Holidays)
    |
    v
FUTURE TASK DATA (Holiday inclusion)
    |
    v
All Calendar Views
```

### Migration Strategy (Phase 1)

1. **Data Import**: Load existing Sheets data into PostgreSQL
2. **Recurrence Rebuild**: Implement recurrence engine on backend
3. **Parallel Running**: Maintain Sheets as read-only archive during transition
4. **Cutover**: Migrate to web app once feature parity achieved
5. **Archive**: Store Sheets for historical reference

---

## 3. SUCCESS METRICS

| Category | Metric | Target |
|----------|--------|--------|
| **Performance** | Page load time | < 1 sec |
| | Calendar render | < 500ms |
| | Real-time sync | < 300ms |
| **Reliability** | Uptime | 99.9% |
| | Error rate | < 0.1% |
| **Quality** | Test coverage | > 90% |
| | Browser support | Chrome, Firefox, Safari, Edge (latest 2) |
| **Scalability** | Concurrent users | 100+ (MVP), 1000+ (Production) |
| | Instances per user | 1000+ |
| **Security** | Authentication | JWT + HTTPS |
| | Data retention | 7 years minimum |
| **UX** | Mobile support | iOS 12+, Android 5+ |
| | Accessibility | WCAG 2.1 Level AA |

---

## 4. CURRENT SYSTEM ANALYSIS (Google Sheets)

### 4.1 SET UP Sheet (Holidays Configuration)

**Purpose**: Stores holiday and special event metadata used across all calendar views.

**Columns** (35 total: A-AH):

- **A: Holiday Name** (string) - Name of the holiday (e.g., "New Year's Day")
- **B: Date** (date, MM/DD/YYYY) - Calendar date of the holiday
- **C: ID** (integer) - Unique identifier (1-12+)
- **D: Category** (enum: Personal/Business) - Categorization
- **E: Shift** (enum: Morning/Evening) - Time period designation
- **F-G: Start/End Time** (HH:MM AM/PM) - Time bounds
- **H-I: TTL Hours/Days** (decimal) - Calculated total duration
- **J-P: Days of Week** (MON-SUN, X or blank) - Which days of week apply
- **Q-R: Fiscal Year Boundaries** (dates) - Fiscal period alignment
- **S-V: Quarterly Columns** (Q1-Q4) - Quarterly mapping
- **W-AH: Monthly Status** (JAN-DEC, N/P/S) - Monthly status flags
  - N = Normal
  - P = Peak
  - S = Slow

**Current Data** (12 holidays):
- New Year's Day (Jan 1, fully configured)
- Family Day (Feb 17, fully configured)
- Good Friday (Apr 18, fully configured)
- Victoria Day (May 19, fully configured)
- Canada Day, B.C. Day, Labour Day, Truth and Reconciliation, Thanksgiving, Remembrance Day, Christmas (names/dates only)

**Validation Rules**:
- Holiday Name: required, non-empty
- Date: required, unique, valid MM/DD/YYYY format
- Category: must be Personal or Business
- Times: HH:MM format, Start < End
- Days: X or blank only
- Monthly Status: N, P, S, or blank

---

### 4.2 JOB TASKS Sheet (Master Task Definitions)

**Purpose**: Central repository of task definitions with recurrence rules, time allocations, and scheduling parameters.

**Current Active Tasks**:

| ID | Name | Category | Period | Occurrence | Frequency |
|----|------|----------|--------|------------|-----------|
| T001 | Brush Teeth | Health | Weekly | Mon,Wed,Fri | 3 |
| T002 | Pay Rent | Bills | Monthly | 1 | 1 |
| T003 | Pay Tax Installment | Taxes | Quarterly | Mar 1 | 1 |
| T004 | Complete Taxes | Taxes | Yearly | Apr 30 | 1 |

**Occurrence Format Specifications**:

- **Weekly**: Comma-separated day abbreviations (Mon,Wed,Fri)
- **Monthly**: Numeric day (1-31) or date string (Apr 30)
  - For day-end edge cases (e.g., 31st in Feb): Behavior TBD - move to last day of month, skip, or error
- **Quarterly**: Dates aligned to fiscal quarter start (Mar 1, Jun 1, Sep 1, Dec 1)
- **Yearly**: Annual date (Apr 30, Dec 25)

---

## 5. FULL-STACK REQUIREMENTS & FEATURES

### 5.1 Functional Requirements

#### Core Task Management

**Task Creation**:
- Input: Name, Category, Recurrence Rule, Duration
- Output: Task with auto-generated Task ID (T###)
- Validation: All fields required except Group Name, Notes
- UI: Modal form with auto-complete for recurrence patterns

**Task Editing**:
- Allow modification of all fields except Task ID
- On recurrence change: Re-expand future instances (Pending only)
- Show affected future occurrences preview
- Warn if future instances already completed

**Task Deletion**:
- Soft delete: Mark as Archived (preserve history)
- Hard delete: Remove all future Pending instances with confirmation dialog
- Audit trail: Log all deletions with timestamp and user

**Task Completion**:
- Mark single occurrence complete with timestamp
- Option: Mark all future occurrences complete
- Track actual time spent vs. estimated
- Add optional completion notes

#### Recurrence Management

**Supported Recurrence Types**:
- **Weekly**: Specific days (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- **Monthly**: Specific day of month (1-31) or date (Apr 30)
- **Quarterly**: Fixed dates per quarter
- **Yearly**: Annual date
- **One-time**: Single occurrence

#### Holiday Management

**Holiday Creation**: Input name, date, category, time shift, duration

**Holiday Editing**: Modify and update references

**Holiday Deletion**: Remove from database and associated instances

#### Analytics & Metrics

**Daily Metrics**:
- Total tasks scheduled
- Tasks completed / completion rate (%)
- Total time scheduled (hours)
- Work vs. Personal time breakdown
- Busiest day of period

---

## 6. DATA MODELS & DOMAIN ENTITIES

### 6.1 User

```python
class User(BaseModel):
    id: UUID
    email: str
    hashed_password: str
    timezone: str = "UTC"
    week_start_day: Literal["Sunday", "Monday"] = "Sunday"
    created_at: datetime
    updated_at: datetime
```

### 6.2 Holiday

```python
class Holiday(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    holiday_date: date
    category: Literal["Personal", "Business"]
    created_at: datetime
    updated_at: datetime
```

### 6.3 Task

```python
class Task(BaseModel):
    id: UUID
    user_id: UUID
    task_id: str
    name: str
    category: Literal["Health", "Bills", "Taxes", "Work", "Personal"]
    period: Literal["Weekly", "Monthly", "Quarterly", "Yearly", "OneTime"]
    occurrence: str
    base_time_minutes: int
    status: Literal["Active", "Inactive", "Archived"]
    created_at: datetime
    updated_at: datetime
```

### 6.4 TaskInstance

```python
class TaskInstance(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    occurrence_date: date
    status: Literal["Pending", "Completed", "Skipped", "Cancelled"]
    completed_at: Optional[datetime] = None
    created_at: datetime
```

---

## 7. FRONTEND ARCHITECTURE

### 7.1 Tech Stack

```
React 18+ with TypeScript
- React Router v6
- TanStack Query
- Zustand
- Tailwind CSS
- shadcn/ui
- recharts
- date-fns
- WebSocket
```

### 7.2 Key Components

- **Week View**: 7-day calendar grid with task placement
- **Month View**: Full month calendar with task counts
- **Task Form Modal**: Create/edit with recurrence picker
- **Dashboard**: Metrics cards and analytics charts
- **Sidebar**: Filters and navigation

---

## 8. BACKEND ARCHITECTURE

### 8.1 Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL 13+ with SQLAlchemy ORM
- **Authentication**: JWT
- **Real-time**: FastAPI WebSocket
- **Task scheduling**: APScheduler

### 8.2 Core API Endpoints

**Authentication**:
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

**Tasks**:
```
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/{id}
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

**Calendar**:
```
GET    /api/calendar/week/{date}
GET    /api/calendar/month/{date}
GET    /api/calendar/year/{year}
```

**Metrics**:
```
GET    /api/dashboard/metrics
```

**WebSocket**:
```
WS     /ws/{user_id}
```

---

## 9. DATABASE SCHEMA

### 9.1 PostgreSQL Tables

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  period VARCHAR(50) NOT NULL,
  occurrence VARCHAR(255) NOT NULL,
  base_time_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

CREATE TABLE task_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occurrence_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_date (user_id, occurrence_date)
);

CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  holiday_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, holiday_date)
);
```

---

## 10. RECURRENCE EXPANSION ENGINE

### 10.1 Algorithm Overview

The recurrence engine transforms task definitions with recurrence rules into individual task instances.

**Input**: Task with period, occurrence, frequency  
**Processing**: Parse occurrence string, generate dates matching rule  
**Output**: List of TaskInstance objects  
**Horizon**: Default 12 months forward

### 10.2 Key Logic

```python
class RecurrenceExpander:
    def expand_task(self, task: Task, start_date: date, end_date: date):
        if task.period == "Weekly":
            return self._expand_weekly(task, start_date, end_date)
        elif task.period == "Monthly":
            return self._expand_monthly(task, start_date, end_date)
        elif task.period == "Quarterly":
            return self._expand_quarterly(task, start_date, end_date)
        elif task.period == "Yearly":
            return self._expand_yearly(task, start_date, end_date)
```

---

## 11. REAL-TIME SYNCHRONIZATION

### 11.1 WebSocket Events

| Type                 | Description                   |
| -------------------- | ----------------------------- |
| `task_created`       | New task created              |
| `task_updated`       | Task modified                 |
| `task_deleted`       | Task deleted/archived         |
| `instance_completed` | Task instance marked complete |
| `metrics_updated`    | Dashboard metrics refreshed   |

### 11.2 Backend Connection Manager

```python
class ConnectionManager:
    async def broadcast_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
```

### 11.3 Frontend Integration

```typescript
export function useWebSocket() {
  const ws = new WebSocket(`wss://api.yourdomain.com/ws/${user.id}`);
  
  ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);
    // Update UI based on event type
  };
}
```

---

## 12. SECURITY & AUTHENTICATION

### 12.1 Authentication Flow

- **Signup**: Email + password -> Hash with bcrypt -> Create user -> Return JWT tokens
- **Login**: Email + password -> Verify -> Return access (15 min) + refresh (7 day) tokens
- **Refresh**: Use refresh token to get new access token
- **Logout**: Invalidate refresh token

### 12.2 Multi-Tenant Isolation

Every query filters by user_id:

```python
tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
```

### 12.3 Authorization

- Users can CRUD only their own tasks
- Phase 2+: Implement shared task permissions (Viewer, Editor, Owner)

---

## 13. TESTING STRATEGY

### 13.1 Coverage Targets

- **Unit Tests**: 80% of business logic
- **Integration Tests**: 60% of API endpoints
- **E2E Tests**: 40% of critical flows
- **Overall Target**: > 90% code coverage

### 13.2 Key Test Areas

**Recurrence Engine**:
- Weekly, monthly, quarterly, yearly expansion
- Edge cases (Feb 31st, year boundaries)
- Recurrence rule changes

**API Endpoints**:
- Authentication (signup, login, token refresh)
- Task CRUD (create, read, update, delete, soft delete)
- Calendar generation (performance under load)
- Metrics calculation accuracy

**WebSocket**:
- Connection management
- Event broadcasting
- Multi-client synchronization

---

## 14. DEPLOYMENT & DEVOPS

### 14.1 Infrastructure

- **Frontend**: Vercel (automatic from GitHub)
- **Backend**: Railway or Render
- **Database**: PostgreSQL managed service with automated backups
- **Caching**: Redis (optional)

### 14.2 Environments

- **Development**: Local Docker Compose
- **Staging**: Deploy from staging branch
- **Production**: Deploy from main branch with migrations

### 14.3 Monitoring

- API response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- WebSocket connection count
- Database query latency
- System uptime (target 99.9%)

---

## 15. IMPLEMENTATION ROADMAP

### Phase 1: MVP (Weeks 1-3)

**Authentication & Foundation**:
- JWT authentication (signup, login, logout)
- PostgreSQL schema setup with Alembic migrations
- Task CRUD endpoints (POST, GET, PUT, DELETE)
- React frontend scaffold with routing
- Basic task list and form components
- Deploy to Vercel + Railway

**Week/Month Calendar** (Static):
- Week and month view endpoints
- React calendar components
- Date navigation
- Load testing (target 100 concurrent users)

### Phase 2: Recurrence & Analytics (Weeks 4-6)

**Recurrence Engine**:
- RecurrenceExpander implementation (weekly, monthly, quarterly, yearly)
- TaskInstance model and database
- Expand on task creation
- Comprehensive tests for all recurrence types

**Dynamic Calendar**:
- Nightly scheduled job to regenerate instances
- Dynamic week/month endpoints
- Task aggregation and filtering
- Performance optimization

**Analytics**:
- Metrics calculation (completion rate, time breakdown)
- DailyMetrics table and caching
- Dashboard page with metric cards
- Trend analysis endpoint

### Phase 3: Real-Time & Polish (Weeks 7-8)

**WebSocket**:
- WebSocket endpoint and connection manager
- Real-time broadcasts on task mutations
- Frontend WebSocket hook integration
- Zustand store updates

**UX & Accessibility**:
- Mobile responsive design (Tailwind)
- Dark mode toggle
- Keyboard navigation (calendar grid)
- WCAG 2.1 Level AA compliance
- E2E tests with Playwright or Cypress

### Phase 4: Advanced Features (Weeks 9+)

- Year view implementation
- Export to iCal, CSV, JSON
- Google Calendar integration (OAuth2)
- Shared tasks and permissions model
- Email/in-app notifications
- Advanced analytics (burndown, trends)
- **Adaptive Duration Scaling**: Machine-learning style feedback loop where future task durations adjust based on actual time spent.
- **Seasonality Engine**: Duration multipliers (1.5x Peak, 0.7x Slow) tied to Monthly Status (N/P/S).
- **Composite/Grouped Tasks**: Hierarchical tasking (e.g., "Mornining Routine" contains sub-tasks).
- **Gamification Layer**: Progress bars and interaction rewards (Duolingo style).
- **Smart Filtering**: Automatic hiding of low-priority routine tasks in higher-level (Monthly/Yearly) views.
- **Advanced Recurrence**: Alternating weeks, specific ordinal days (3rd Wed), and holiday-aware shifting.
- **Data Portability**: CSV/ICS import and export.
- **Dynamic Task Reorganization**: "Self-healing" schedule that automatically optimizes Gaps created by cancellations (e.g., Pull-forward, De-fragmentation).

---

## 16. KEY DECISIONS & OPEN QUESTIONS

### Data Model Choices (Decision Required)

1. **Task Timing Representation**:
   - **Option A**: Single start_time/end_time per task (current design)
   - **Option B**: Per-day times dict (day_times: {"Monday": "08:30", ...})
   - **Decision**: TBD - affects schema and expansion logic

2. **Month-End Edge Cases** (Decision Required):
   - **Option A**: Move to last day of month (Feb 31 -> Feb 28/29)
   - **Option B**: Skip that month occurrence
   - **Option C**: Raise validation error
   - **Decision**: TBD - affects recurrence expansion

3. **Holiday Conflict Behavior** (Decision Required):
   - **Option A**: Block all tasks on holiday date
   - **Option B**: Block only Business/Work category tasks
   - **Option C**: Flag tasks as conflicted without blocking
   - **Decision**: TBD - affects calendar generation

---

## 17. KNOWN LIMITATIONS & OUT-OF-SCOPE (MVP)

| Feature | Phase | Rationale |
|---------|-------|-----------|
| Year view | Phase 2+ | Planned; lower priority |
| Google Calendar sync | Phase 2+ | Requires OAuth2 setup |
| Shared tasks | Phase 2+ | Complicates auth/permissions |
| Notifications | Phase 2+ | Not critical for MVP |
| Exports (iCal/CSV) | Phase 2+ | Build after core features |
| Drag-and-drop | Phase 2+ | Nice-to-have UX enhancement |
| Recurring holidays | Phase 2+ | Can enhance post-MVP |
| Task templates | Phase 2+ | Bulk creation helper |
| Timezone handling | Phase 2+ | Assume UTC initially |

---

## APPENDIX: GLOSSARY

| Term | Definition |
|------|-----------|
| **Task** | Master definition with recurrence rules |
| **TaskInstance** | Individual occurrence on a specific date |
| **Holiday** | Special event that may affect scheduling |
| **Recurrence** | Rule defining repetition (weekly, monthly, etc.) |
| **Expansion** | Process of converting task into instances |
| **Completion Rate** | Percentage of completed instances |
| **WebSocket** | Real-time bidirectional communication |
| **JWT** | JSON Web Token for authentication |
| **Multi-tenant** | System serving multiple users with data isolation |
| **Soft delete** | Marking as deleted without removing (Archived status) |

---

**Version Control**:
- v1.0: Original Google Sheets PRD
- v2.0: Merged Full-Stack PRD (this document)

**Next Steps**:
1. Review and approve merged document
2. Resolve open questions and decisions (timing, month-end, holidays)
3. Finalize data model specifications
4. Begin Phase 1 implementation
5. Set up development environment (Docker, GitHub, CI/CD)
