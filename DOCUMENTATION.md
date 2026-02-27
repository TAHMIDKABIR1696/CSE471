# HealthConnect — Technical Documentation

> A comprehensive guide to how the AI-powered healthcare web application works under the hood.

---

## Table of Contents

1. [End-to-End User Journey](#1-end-to-end-user-journey)
2. [Project Overview](#2-project-overview)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Backend — How It Works](#5-backend--how-it-works)
   - [Server Initialization](#51-server-initialization)
   - [Configuration & Environment](#52-configuration--environment)
   - [Database (Prisma + MongoDB)](#53-database-prisma--mongodb)
   - [API Routes](#54-api-routes)
   - [Triage Flow (Symptom Analysis)](#55-triage-flow-symptom-analysis)
   - [Doctor Recommendation Logic](#56-doctor-recommendation-logic)
   - [Input Validation](#57-input-validation)
6. [Frontend — How It Works](#6-frontend--how-it-works)
   - [Application Structure (MVC Pattern)](#61-application-structure-mvc-pattern)
   - [Routing](#62-routing)
   - [Consultation Flow](#63-consultation-flow)
   - [Components Breakdown](#64-components-breakdown)
   - [HTTP Client & Services](#65-http-client--services)
7. [AI Strategy — OpenAI Integration](#7-ai-strategy--openai-integration)
   - [System Prompt](#71-system-prompt)
   - [Structured JSON Output](#72-structured-json-output)
   - [Backend Safety Validation](#73-backend-safety-validation)
   - [Rule-Based Fallback](#74-rule-based-fallback)
8. [Database Population from CSV Files](#8-database-population-from-csv-files)
   - [CSV Files Overview](#81-csv-files-overview)
   - [Import Script Walkthrough](#82-import-script-walkthrough)
   - [Data Transformation Pipeline](#83-data-transformation-pipeline)
   - [How to Run the Import](#84-how-to-run-the-import)
9. [How to Run the Project](#9-how-to-run-the-project)

---

## 1. End-to-End User Journey

This section walks through **exactly what happens**, step by step, from the moment a user opens the website to when they see doctor recommendations. Every file, function, and data transformation is explained in order.

---

### Step 1: User Opens the Website

The user navigates to `http://localhost:5173` in their browser.

**What happens behind the scenes:**

1. The browser requests `index.html` from the **Vite dev server** (port 5173).
2. Vite serves `frontend/index.html`, which loads the Inter font from Google Fonts and includes a `<div id="root">` container.
3. Vite injects the JavaScript bundle starting from `frontend/src/main.tsx`.
4. `main.tsx` calls `ReactDOM.createRoot()` and renders the `<App />` component inside `<BrowserRouter>`.
5. **`App.tsx`** renders the page layout:
   - `<Navbar />` — Fixed top navigation bar with logo, "Home" link, and "Get Started" link (points to `/consult`)
   - `<Routes>` — React Router checks the current URL path
   - `<Footer />` — Footer with brand info and emergency contact (999)
6. Since the URL is `/`, React Router renders **`<HomePageView />`**.
7. The homepage displays four sections: `<Hero />` (landing banner with CTA buttons), `<Features />` (6-feature grid), `<HowItWorks />` (3-step process), and `<Disclaimer />` (medical disclaimer).

**Files involved:** `index.html` → `main.tsx` → `App.tsx` → `HomePageView.tsx` → `Hero.tsx`, `Features.tsx`, `HowItWorks.tsx`, `Disclaimer.tsx`

---

### Step 2: User Navigates to the Consultation Page

The user clicks **"Get Started"** or **"Start Consultation"** on the homepage, which navigates to `/consult`.

**What happens:**

1. React Router matches `/consult` and renders **`<ConsultPageView />`**.
2. Inside `ConsultPageView`, the **`useConsultController()`** hook is called. This is the central state manager.
3. The hook initializes state:
   ```typescript
   {
     step: 'input',           // Show the ChatBox
     isLoading: false,         // Not loading yet
     triageData: null,         // No AI result yet
     doctors: [],              // No doctors yet
     error: null,              // No errors
     userSymptoms: '',         // Empty input
     selectedArea: '',         // No area filter
     availableAreas: []        // Will be populated
   }
   ```
4. The hook's `useEffect` fires on mount and calls **`getLocations()`** from `doctors.service.ts`.
5. `getLocations()` calls the generic **`requestJson()`** in `http.client.ts`, which makes a `GET` fetch request to `/api/locations`.
6. **Vite's dev proxy** intercepts the `/api` prefix and forwards the request to `http://localhost:5000/api/locations`.
7. **On the backend**, Express matches the route `GET /api/locations` → `getLocationsController()`.
8. The controller calls **`getAvailableAreas()`** in `doctor.model.ts`, which:
   - Queries MongoDB for all doctors (just `address`, `hospital`, `chamber` fields)
   - Scans each doctor's location text against 21 known Dhaka area names
   - Counts how many doctors are in each area
   - Returns areas sorted by doctor count (e.g., Dhanmondi: 625, Uttara: 298, Mirpur: 264, ...)
9. The response (a JSON array of area strings) flows back: backend → Vite proxy → `requestJson()` → `getLocations()` → `useEffect` → `setState({ availableAreas: [...] })`.
10. Since `step` is `'input'`, the page renders the **`<ChatBox />`** component — a textarea where the user can type symptoms.

**Files involved:** `ConsultPageView.tsx` → `useConsultController.ts` → `doctors.service.ts` → `http.client.ts` → (Vite proxy) → `doctors.routes.ts` → `doctors.controller.ts` → `doctor.model.ts` → (MongoDB)

---

### Step 3: User Types Their Symptoms

The user types into the ChatBox, for example: *"I feel chest pressure and sweating after walking"*

**What happens in the ChatBox component:**

1. Every keystroke updates the local `symptoms` state via `setSymptoms(e.target.value)`.
2. A character counter shows `52/1000` at the bottom-right of the textarea.
3. Below the textarea, a validation message shows:
   - Less than 5 characters → *"Please enter at least 5 characters"*
   - 5+ characters → *"✓ Ready to analyze"*
4. The "Analyze Symptoms" button becomes enabled (no longer grayed out).
5. The user can also click one of the **5 example prompts** below the textarea to auto-fill it:
   - *"I have been having chest pain and shortness of breath for 2 days"*
   - *"My child has a high fever and rash on the body"*
   - *"I feel anxious all the time and cannot sleep properly"*
   - *"I have severe lower back pain that gets worse when I bend"*
   - *"I have been having stomach pain and acid reflux after eating"*

**Files involved:** `ChatBox.tsx` (local React state only, no API calls yet)

---

### Step 4: User Clicks "Analyze Symptoms"

The user clicks the **"Analyze Symptoms"** button.

**What happens in the frontend:**

1. `ChatBox` calls `onSubmit(symptoms.trim())`, which triggers `handleSubmit` in **`useConsultController`**.
2. The controller sets state: `isLoading: true`, `error: null`, `userSymptoms: "I feel chest pressure..."`.
3. The ChatBox button changes to show a **spinning loader** and the text "Analyzing...".
4. The controller calls **`classifySymptoms(symptoms)`** from `triage.service.ts`.

**What happens in the triage service:**

5. `classifySymptoms()` calls `requestJson()` which makes a **`POST /api/triage`** request with body:
   ```json
   { "symptoms": "I feel chest pressure and sweating after walking" }
   ```
6. Vite proxy forwards to `http://localhost:5000/api/triage`.

**What happens on the backend:**

7. Express matches `POST /api/triage` → **`triageController()`** in `triage.controller.ts`.

8. **Validation**: The controller parses the request body using Zod:
   ```typescript
   triageRequestSchema.safeParse(req.body)
   // Checks: { symptoms: string, min 3 characters }
   ```
   If validation fails → returns `400` with error messages. In our case, it passes (52 chars).

9. The controller calls **`classifySymptoms("I feel chest pressure and sweating after walking")`** from `triage.service.ts`.

10. **OpenAI attempt**: `classifyWithOpenAI()` runs:
    - Checks if `OPENAI_API_KEY` is set → YES
    - Creates an OpenAI client (singleton, reused across requests)
    - Sends a request to the OpenAI API:
      ```
      Model: gpt-5.2
      Temperature: 0.1 (near-deterministic)
      System prompt: [The strict triage classification prompt]
      User message: "I feel chest pressure and sweating after walking"
      Response format: json_schema (enforced enum values)
      ```
    - **If OpenAI succeeds**: The API returns:
      ```json
      { "specialization": "CARDIOLOGIST", "urgency": "EMERGENCY" }
      ```
      The response is parsed, extracted from any wrapping text, and validated.

    - **If OpenAI fails** (e.g., quota exceeded, network error): The `try/catch` block catches the error, logs a warning, and **falls back to `classifyRuleBased()`**.

11. **Rule-based fallback** (if OpenAI is unavailable):
    - Converts symptoms to lowercase: `"i feel chest pressure and sweating after walking"`
    - **Urgency scan**: Finds `"chest"` + `"sweating"` together → sets urgency to `EMERGENCY`
    - **Specialization scan**: Finds `"chest pressure"` → sets specialization to `CARDIOLOGIST`
    - Returns `{ specialization: "CARDIOLOGIST", urgency: "EMERGENCY" }`

12. **Normalization** (always runs): The result passes through `normalizeResult()` which double-checks that both values are in the allowed lists. If not, defaults to `GENERAL_PHYSICIAN` / `MEDIUM`.

13. The controller returns the JSON response:
    ```json
    { "specialization": "CARDIOLOGIST", "urgency": "EMERGENCY" }
    ```

**Back in the frontend:**

14. `classifySymptoms()` resolves with `{ specialization: "CARDIOLOGIST", urgency: "EMERGENCY" }`.
15. The controller stores this as `triageData`.

**Files involved:** `ChatBox.tsx` → `useConsultController.ts` → `triage.service.ts` → `http.client.ts` → (Vite proxy) → `triage.routes.ts` → `triage.controller.ts` → `triage.validator.ts` → `triage.service.ts` → (OpenAI API or rule-based) → `triage.types.ts`

---

### Step 5: Frontend Fetches Matching Doctors

Immediately after receiving the triage result, the controller fetches doctors.

**What happens:**

1. The controller calls **`fetchDoctors("CARDIOLOGIST", "")`** (empty area = all Dhaka).
2. This calls `getDoctorsBySpecialization("CARDIOLOGIST")` from `doctors.service.ts`.
3. The service makes a `GET /api/doctors?specialization=CARDIOLOGIST` request.
4. Vite proxy forwards to the backend.

**On the backend:**

5. Express matches `GET /api/doctors` → **`getDoctorsController()`**.
6. The controller:
   - Extracts `specialization=CARDIOLOGIST` from query params and uppercases it
   - Validates it's one of the 8 allowed values → ✓
   - No `area` param provided, so `areaQuery = undefined`
   - No `limit` param provided, so `limit = undefined` (return all)
7. Calls **`findRecommendedDoctors({ specialization: "CARDIOLOGIST", area: undefined, limit: undefined })`**.
8. The model function:
   - **Queries MongoDB**: `prisma.doctor.findMany({ where: { specialization: "CARDIOLOGIST" }, orderBy: [credibilityScore desc, rating desc, name asc] })`
   - **Filters to Dhaka**: Keeps only doctors whose `address + hospital + chamber` text contains `"dhaka"` (case-insensitive)
   - **No area filter applied** (area is undefined)
   - **No limit applied** (limit is undefined) → returns ALL matching Dhaka cardiologists
9. Returns an array of doctor objects, each containing: `id`, `name`, `specialization`, `experience`, `hospital`, `chamber`, `helpline`, `address`, `mapsLink`, `city`, `rating`, `credibilityScore`, etc.

**Back in the frontend:**

10. The controller receives the doctors array.
11. Sets state:
    ```typescript
    {
      isLoading: false,
      triageData: { specialization: "CARDIOLOGIST", urgency: "EMERGENCY" },
      doctors: [/* array of cardiologists */],
      step: 'result'      // Switch to results view
    }
    ```
12. Calls `window.scrollTo({ top: 0, behavior: 'smooth' })` to scroll to the top.

**Files involved:** `useConsultController.ts` → `doctors.service.ts` → `http.client.ts` → (Vite proxy) → `doctors.routes.ts` → `doctors.controller.ts` → `doctor.model.ts` → (MongoDB via Prisma)

---

### Step 6: Results Page Renders

The `step` is now `'result'`, so `ConsultPageView` renders the results UI.

**What the user sees (top to bottom):**

1. **Page header**: *"Your Results"* with subtitle *"Based on your symptoms, here are our recommendations."*

2. **User's input summary**: A glass card showing 💬 *"Your symptoms"* → *"I feel chest pressure and sweating after walking"* — so the user can see what they typed.

3. **Triage result** (`<TriageResult />`):
   - A specialization badge: `❤️ CARDIOLOGIST` (styled as a pill with blue background)
   - An urgency badge: `EMERGENCY` (red background with pulse animation)

4. **Emergency banner** (because urgency = EMERGENCY):
   - A prominent red card with ⚠️ warning icon
   - Text: *"Immediate Medical Attention Required — Your symptoms may indicate a life-threatening condition."*
   - A red button: **📞 Call 999 Now** (links to `tel:999`)

5. **Doctor recommendations section**:
   - Header: *"👨‍⚕️ Recommended Doctors in Dhaka (X found)"*
   - **Location filter** (`<LocationFilter />`): A row of pill buttons — "All Dhaka" (active), "Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", etc.
   - **Doctor cards grid**: 2-column grid on desktop, 1-column on mobile. Each card shows:
     - Doctor avatar (icon), name, specialization, years of experience
     - Rating badge (star icon + number)
     - Hospital name
     - Chamber address
     - Helpline number (clickable `tel:` link)
     - "Get Directions on Google Maps" button

6. **"New Consultation" button**: Resets the entire flow back to Step 2.

7. **Disclaimer**: *"This is an AI-assisted recommendation and does not replace professional medical advice."*

**Files involved:** `ConsultPageView.tsx` → `TriageResult.tsx`, `LocationFilter.tsx`, `DoctorCard.tsx`

---

### Step 7: User Filters by Area

The user clicks **"Dhanmondi"** in the location filter.

**What happens:**

1. `LocationFilter` calls `onChange("Dhanmondi")` → triggers `handleAreaChange("Dhanmondi")` in the controller.
2. The controller sets `selectedArea: "Dhanmondi"` and `isLoading: true`.
3. Since `triageData` already exists (CARDIOLOGIST), the controller calls `fetchDoctors("CARDIOLOGIST", "Dhanmondi")`.
4. This makes a `GET /api/doctors?specialization=CARDIOLOGIST&area=Dhanmondi` request.
5. On the backend, `findRecommendedDoctors()`:
   - Queries all cardiologists from MongoDB (same as before)
   - Filters to Dhaka
   - **Additionally filters** to only doctors whose `address + hospital + chamber` contains `"dhanmondi"` (case-insensitive)
   - Returns the filtered list
6. The frontend receives fewer doctors (only Dhanmondi cardiologists) and updates the grid.
7. The "Dhanmondi" pill button is now highlighted in blue; "All Dhaka" is gray.
8. If no doctors are found in that area, a message shows: *"No doctors found in Dhanmondi. Try selecting a different area or 'All Dhaka'."*

**Key detail**: The triage analysis is **NOT re-run** — only the doctor query is re-executed. This saves an OpenAI API call.

**Files involved:** `LocationFilter.tsx` → `useConsultController.ts` → `doctors.service.ts` → backend (same flow as Step 5)

---

### Step 8: User Clicks a Doctor Card

The user clicks on a doctor card to see full details.

**What happens:**

1. `DoctorCard` calls `onSelect(doctor)` → triggers `setSelectedDoctor(doctor)` in `ConsultPageView`.
2. Since `selectedDoctor` is now non-null, the **`<DoctorDetailModal />`** component renders.

**Modal rendering:**

3. A **backdrop overlay** covers the entire screen (semi-transparent black with blur).
4. `document.body.style.overflow = 'hidden'` is set to **lock page scrolling**.
5. An `Escape` key listener is registered to close the modal.
6. The modal content slides up with the `animate-slide-up` animation.

**What the modal shows:**

7. **Header section**:
   - Large avatar icon
   - Doctor's full name (e.g., *"Prof. Dr. Manzoor Hossain"*)
   - Specialization with emoji (e.g., *"❤️ Cardiologist"*)

8. **Stats row** (3 equal columns):
   - ⭐ **Rating**: `5.0` — *"Excellent"*
   - 🕐 **Experience**: `40` — *"Years Exp."*
   - 🏆 **Credibility**: `100%` — *"Highly Reputed"*

9. **Detail cards** (each in a rounded box with icon):
   - 🩺 **Specialization**: Cardiologist
   - 🏥 **Hospital / Clinic**: Apollo Clinic Dhanmondi & JMI Specialized Hospital
   - 📍 **Chamber Address**: Dhanmondi, Dhaka-1209, Dhaka
   - 📞 **Helpline / Contact**: (clickable phone link)
   - 📊 **Reputation Score**: Animated gradient progress bar showing the percentage, with label (e.g., *"100% — Highly Reputed"*)

10. **Action buttons**:
    - 🗺️ **"Get Directions on Google Maps"** — Opens a new tab with `https://maps.google.com/?q=Dhaka-1209`
    - 📞 **"Call Helpline"** — Only shown if helpline is not "N/A"; triggers a phone call via `tel:` link

**Credibility label logic:**
- ≥ 85% → "Highly Reputed" (green text)
- ≥ 70% → "Well Reputed" (blue text)
- ≥ 50% → "Reputed" (yellow text)
- < 50% → "Emerging" (gray text)

**Closing the modal:**
- Click the ✕ button in the top-right corner
- Click the dark backdrop area outside the modal
- Press the `Escape` key
- All three methods call `onClose()` → `setSelectedDoctor(null)` → modal unmounts → body scroll is restored.

**Files involved:** `DoctorCard.tsx` → `ConsultPageView.tsx` (state) → `DoctorDetailModal.tsx`

---

### Step 9: User Starts a New Consultation

The user clicks **"New Consultation"** at the bottom of the results page.

**What happens:**

1. Triggers `handleReset()` in the controller.
2. The state resets to initial values **except `availableAreas`** (which is preserved so we don't re-fetch it):
   ```typescript
   { step: 'input', isLoading: false, triageData: null, doctors: [],
     error: null, userSymptoms: '', selectedArea: '',
     availableAreas: [/* kept from before */] }
   ```
3. `window.scrollTo({ top: 0 })` scrolls to the top.
4. The page re-renders showing the `<ChatBox />` again, ready for new symptoms.
5. The entire cycle repeats from **Step 3**.

**Files involved:** `ConsultPageView.tsx` → `useConsultController.ts`

---

### Complete Request Flow Summary

```
User types symptoms → clicks "Analyze"
  │
  ▼
[ChatBox.tsx] onSubmit(symptoms)
  │
  ▼
[useConsultController.ts] handleSubmit(symptoms)
  │
  ├──► POST /api/triage { symptoms }
  │      │
  │      ▼  (Vite proxy → Express)
  │    [triage.routes.ts] → [triage.controller.ts]
  │      │
  │      ▼  (Zod validation)
  │    [triage.validator.ts] ✓ valid
  │      │
  │      ▼
  │    [triage.service.ts] classifySymptoms()
  │      │
  │      ├──► [OpenAI API] gpt-5.2 with system prompt
  │      │     Returns: { specialization, urgency }
  │      │     OR (if fails)
  │      └──► [Rule-based] keyword matching
  │            Returns: { specialization, urgency }
  │      │
  │      ▼  (normalizeResult — safety check)
  │    Response: { "specialization": "CARDIOLOGIST", "urgency": "EMERGENCY" }
  │
  ├──► GET /api/doctors?specialization=CARDIOLOGIST
  │      │
  │      ▼  (Vite proxy → Express)
  │    [doctors.routes.ts] → [doctors.controller.ts]
  │      │
  │      ▼
  │    [doctor.model.ts] findRecommendedDoctors()
  │      │
  │      ▼  (Prisma → MongoDB)
  │    Query: find all CARDIOLOGIST, order by credibilityScore desc
  │    Filter: address contains "dhaka"
  │      │
  │      ▼
  │    Response: [ { id, name, hospital, rating, ... }, ... ]
  │
  ▼
[useConsultController.ts] setState → step: 'result'
  │
  ▼
[ConsultPageView.tsx] renders:
  ├── TriageResult (specialization + urgency badges)
  ├── Emergency Banner (if EMERGENCY)
  ├── LocationFilter (area pills)
  └── DoctorCard[] (clickable grid)
         │
         ▼ (on click)
      DoctorDetailModal (full details + maps + call)
```

---

## 2. Project Overview

HealthConnect is a MERN-stack (MongoDB, Express, React, Node.js) web application that helps users in Dhaka, Bangladesh find the right medical specialist by describing their symptoms in natural language.

**What it does:**
- User types symptoms like *"I feel chest pressure and sweating after walking"*
- The AI analyzes the symptoms and determines: **Specialization** (e.g., Cardiologist) + **Urgency** (e.g., EMERGENCY)
- The system queries MongoDB and returns **top-rated doctors in Dhaka** matching that specialization
- Users can **filter by area** (Dhanmondi, Gulshan, Mirpur, etc.) and **click any doctor card** to see full details

**What it does NOT do:**
- It does NOT diagnose diseases
- It does NOT prescribe medications
- It does NOT replace professional medical advice

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
│                     http://localhost:5173                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    Vite Dev Proxy
                    /api/* → :5000
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   FRONTEND (React + TypeScript)                  │
│                                                                  │
│  Views/Pages ──► Controllers (Hooks) ──► Services (HTTP calls)  │
│  Components        State mgmt              API requests          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                     HTTP REST API
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                BACKEND (Express + TypeScript)                     │
│                                                                  │
│  Routes ──► Controllers ──► Services ──► Models ──► Prisma ORM  │
│                   │                                              │
│                   ▼                                              │
│           OpenAI API (gpt-5.2)                                   │
│           (symptom classification)                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                     Prisma Client
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│              MongoDB Atlas (Cloud Database)                       │
│                                                                  │
│  Collections: doctors, triage_requests, triage_recommendations  │
│  6,719 doctor records imported from CSV files                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, TypeScript, Tailwind CSS | UI components and styling |
| Build Tool | Vite 5 | Fast dev server with HMR and proxy |
| Icons | Lucide React | Consistent icon system |
| Routing | React Router DOM v6 | Client-side page navigation |
| Backend | Node.js, Express 4, TypeScript | REST API server |
| ORM | Prisma 6 | Type-safe database access |
| Database | MongoDB Atlas | Cloud-hosted document database |
| AI | OpenAI API (gpt-5.2) | Symptom classification |
| Validation | Zod | Request payload validation |
| CSV Parsing | csv-parse | Doctor data import from CSV files |

---

## 5. Backend — How It Works

### 8.1 Server Initialization

**File: `backend/src/index.ts`**

The entry point creates an HTTP server on the configured port (default 5000). It includes:
- **Graceful shutdown**: On `SIGINT` or `SIGTERM`, it disconnects Prisma and closes the server cleanly
- **Port conflict detection**: If port 5000 is already in use, it logs an error and exits

**File: `backend/src/app.ts`**

The Express application is configured with:
- `cors()` — Allows cross-origin requests from the frontend (port 5173)
- `express.json({ limit: '1mb' })` — Parses JSON request bodies
- `GET /health` — Health check endpoint returning `{ status: 'ok' }`
- `app.use('/api', apiRouter)` — All API routes are mounted under `/api`

### 8.2 Configuration & Environment

**File: `backend/src/config/env.ts`**

Loads environment variables from `.env`:

| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | Server port | `5000` |
| `OPENAI_API_KEY` | OpenAI authentication | (empty, disables AI) |
| `OPENAI_MODEL` | Which GPT model to use | `gpt-5.2` |
| `DATABASE_URL` | MongoDB Atlas connection string | (required) |

### 8.3 Database (Prisma + MongoDB)

**File: `backend/prisma/schema.prisma`**

The database has **3 models**:

#### Doctor Model
Stores all doctor information. Each record contains:
```
- id               → MongoDB ObjectId (auto-generated)
- name             → Full name (e.g., "Prof. Dr. Manzoor Hossain")
- specialization   → Enum: CARDIOLOGIST | NEUROLOGIST | DERMATOLOGIST | ORTHOPEDIC | GASTROENTEROLOGIST | PEDIATRICIAN | PSYCHIATRIST | GENERAL_PHYSICIAN
- experience       → Years of experience (nullable, integer)
- hospital         → Hospital or clinic name
- chamber          → Chamber/room details
- helpline         → Contact number
- address          → Full address
- mapsLink         → Google Maps URL for directions
- city             → City name (default: "Dhaka")
- rating           → Numeric rating 0–5 (derived from experience)
- credibilityScore → Reputation score 0–1 (weighted combination of rating + experience)
- isActive         → Whether the doctor is currently active
- metadata         → Optional JSON for extra data
- createdAt        → Timestamp
- updatedAt        → Timestamp
```

**Indexes** are defined on: `specialization`, `city`, `rating`, `credibilityScore`, `isActive` — for fast query performance.

#### TriageRequest Model
Logs every symptom analysis request for audit/analytics:
```
- symptoms, specialization, urgency, source (OPENAI or RULE_BASED), modelName, etc.
```

#### TriageRecommendation Model
Links triage requests to recommended doctors with ranking scores.

**File: `backend/src/config/database.ts`**

Simply instantiates the Prisma client:
```typescript
export const prisma = new PrismaClient()
```

### 8.4 API Routes

**File: `backend/src/routes/index.ts`**

The API router mounts two sub-routers:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/triage` | Analyze symptoms → returns specialization + urgency |
| `GET` | `/api/doctors` | Get doctors, optionally filtered by `?specialization=` and `?area=` |
| `GET` | `/api/locations` | Get list of available Dhaka areas with doctors |

### 8.5 Triage Flow (Symptom Analysis)

This is the core intelligence of the application.

**Step 1 — Validation** (`backend/src/validators/triage.validator.ts`)

The request body is validated using Zod:
```typescript
const triageRequestSchema = z.object({
  symptoms: z.string().min(3, 'Symptoms must be at least 3 characters.')
})
```
If validation fails, a `400` error is returned with specific issue messages.

**Step 2 — Controller** (`backend/src/controllers/triage.controller.ts`)

The controller:
1. Validates the request using the Zod schema
2. Calls `classifySymptoms(symptoms)` from the triage service
3. Returns the JSON result: `{ specialization, urgency }`

**Step 3 — Service** (`backend/src/services/triage.service.ts`)

The `classifySymptoms()` function has a **two-tier classification strategy**:

```
User Symptoms
     │
     ▼
 OpenAI Available?
     │
  ┌──┴──┐
 YES    NO
  │      │
  ▼      ▼
OpenAI  Rule-Based
 API    Classifier
  │      │
  ▼      ▼
Parse   Keyword
JSON    Matching
  │      │
  ▼      ▼
Normalize Result
(safety validation)
  │
  ▼
{ specialization, urgency }
```

**Tier 1: OpenAI Classification** — Sends the symptoms to the OpenAI API with a strict system prompt and `response_format: json_schema` to enforce structured output. If the API call fails (quota exceeded, network error, etc.), it **automatically falls back to Tier 2**.

**Tier 2: Rule-Based Classification** — A keyword-matching engine that scans the symptom text:

- **Urgency detection**: Keywords like "chest pain", "unconscious", "seizure", "suicidal" → `EMERGENCY`; "severe", "intense" → `HIGH`; "mild", "slight" → `LOW`; default → `MEDIUM`
- **Specialization detection**: "heart", "chest pressure" → `CARDIOLOGIST`; "skin", "rash" → `DERMATOLOGIST`; "anxious", "depressed", "can't sleep" → `PSYCHIATRIST`; etc.

**Step 4 — Normalization** (safety layer)

After classification (either by OpenAI or rule-based), the result is **always validated**:
```typescript
function normalizeResult(result) {
  const specialization = allowedSpecializations.includes(result.specialization)
    ? result.specialization
    : 'GENERAL_PHYSICIAN'  // Safe default

  const urgency = allowedUrgencies.includes(result.urgency)
    ? result.urgency
    : 'MEDIUM'  // Safe default

  return { specialization, urgency }
}
```
This ensures the system **never returns an invalid specialization or urgency**, even if the AI hallucinates.

### 8.6 Doctor Recommendation Logic

**File: `backend/src/models/doctor.model.ts`**

#### `findRecommendedDoctors({ specialization, area, limit })`

This function:
1. **Queries MongoDB** for all doctors matching the specialization
2. **Orders by**: `credibilityScore` (descending) → `rating` (descending) → `name` (ascending)
3. **Filters to Dhaka**: Only returns doctors whose address, hospital, or chamber contains "dhaka"
4. **Filters by area** (optional): If the user selected an area like "Dhanmondi", further filters doctors whose location text contains that area name
5. **Returns all matching doctors** (no artificial limit unless explicitly set via query param)

#### `getAvailableAreas()`

Scans all doctor records and returns a list of known Dhaka areas that have at least one doctor. Areas are sorted by doctor count (most doctors first). The known areas list includes: Dhanmondi, Gulshan, Banani, Mirpur, Uttara, Mohakhali, Motijheel, Panthapath, Shyamoli, Bashundhara, Farmgate, Mohammadpur, Tejgaon, Lalmatia, Shahbag, Green Road, Badda, Rampura, Khilgaon, Malibagh, Mogbazar.

### 8.7 Input Validation

**File: `backend/src/controllers/doctors.controller.ts`**

The doctors endpoint validates:
- `specialization` must be one of the 8 allowed values (or omitted for all doctors)
- `area` is a free-text string, trimmed and passed to the model
- `limit` (optional) must be a positive integer

Invalid specialization values return a `400` error.

---

## 6. Frontend — How It Works

### 8.1 Application Structure (MVC Pattern)

The frontend follows a clean **Model–View–Controller** architecture:

```
frontend/src/
├── models/           → TypeScript interfaces (data shapes)
│   └── consult.model.ts
├── views/            → UI components (what the user sees)
│   ├── pages/
│   │   ├── HomePageView.tsx
│   │   └── ConsultPageView.tsx
│   └── components/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── Disclaimer.tsx
│       ├── ChatBox.tsx
│       ├── TriageResult.tsx
│       ├── DoctorCard.tsx
│       ├── DoctorDetailModal.tsx
│       └── LocationFilter.tsx
├── controllers/      → State management (React hooks)
│   └── useConsultController.ts
└── services/         → API communication
    ├── http.client.ts
    ├── triage.service.ts
    └── doctors.service.ts
```

### 8.2 Routing

**File: `frontend/src/App.tsx`**

Uses React Router v6:
- `/` → `HomePageView` (landing page with Hero, Features, HowItWorks, Disclaimer)
- `/consult` → `ConsultPageView` (the AI consultation interface)

The `Navbar` and `Footer` components are rendered on every page.

### 8.3 Consultation Flow

**File: `frontend/src/controllers/useConsultController.ts`**

This is the brain of the frontend. It's a React custom hook that manages the entire consultation lifecycle:

```
State Machine:
─────────────

  ┌────────────────────────────────────────────────────────┐
  │                    'input' step                         │
  │  User types symptoms in ChatBox                        │
  │  ──► Clicks "Analyze Symptoms"                         │
  │      ──► isLoading = true                              │
  │      ──► POST /api/triage { symptoms }                 │
  │      ──► GET /api/doctors?specialization=X&area=Y      │
  │      ──► isLoading = false                             │
  │      ──► step = 'result'                               │
  └──────────────────────┬─────────────────────────────────┘
                         │
  ┌──────────────────────▼─────────────────────────────────┐
  │                    'result' step                        │
  │  Shows: TriageResult + DoctorCards + LocationFilter     │
  │  User can:                                             │
  │    • Click area filter → re-fetches doctors             │
  │    • Click doctor card → opens DoctorDetailModal        │
  │    • Click "New Consultation" → resets to 'input'       │
  └────────────────────────────────────────────────────────┘
```

**State shape:**
```typescript
interface ConsultState {
    step: 'input' | 'result'     // Current UI step
    isLoading: boolean            // API calls in progress
    triageData: TriageData | null // { specialization, urgency }
    doctors: Doctor[]             // List of recommended doctors
    error: string | null          // Error message to display
    userSymptoms: string          // What the user typed
    selectedArea: string          // Current area filter (empty = all Dhaka)
    availableAreas: string[]      // List of filterable areas
}
```

**On mount**: The controller calls `GET /api/locations` to pre-fetch the available area list.

**On area change**: If the user changes the area filter while viewing results, the controller immediately re-fetches doctors with the new area parameter without re-doing the triage analysis.

### 8.4 Components Breakdown

#### ChatBox
- Textarea with 1000 character limit and counter
- 5 example prompts that auto-fill the textarea when clicked
- Minimum 5 characters required to submit
- Shows loading spinner during analysis

#### TriageResult
- Displays the detected specialization as a badge
- Shows urgency level with color-coded styling:
  - `LOW` → green
  - `MEDIUM` → yellow
  - `HIGH` → orange
  - `EMERGENCY` → red with pulse animation

#### Emergency Banner
- If urgency is `EMERGENCY`, a prominent red banner appears with a "Call 999 Now" button

#### DoctorCard
- Compact card showing: name, specialization, experience, hospital, chamber, helpline, rating
- Clickable — opens the DoctorDetailModal

#### DoctorDetailModal
- Full-screen overlay (closes on backdrop click, Escape key, or X button)
- Body scroll is locked while open
- Shows a **stats row** with 3 metrics: Rating (with label), Experience (years), Credibility Score (percentage)
- Detailed sections with icons for: Specialization, Hospital, Chamber Address, Helpline, Reputation Score (with animated progress bar)
- Action buttons: "Get Directions on Google Maps" + "Call Helpline"
- Credibility labels: ≥85% = "Highly Reputed", ≥70% = "Well Reputed", ≥50% = "Reputed", <50% = "Emerging"

#### LocationFilter
- Pill-style buttons for each Dhaka area
- "All Dhaka" button to clear the filter
- Active filter highlighted with blue styling
- Disabled state during loading

### 8.5 HTTP Client & Services

**File: `frontend/src/services/http.client.ts`**

A generic fetch wrapper `requestJson<T>()` that:
1. Makes a fetch call to the API (proxied via Vite in development)
2. On non-OK response, extracts the error message from the JSON body
3. Returns typed JSON data on success

**File: `frontend/vite.config.ts`**

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the frontend can call `/api/triage` without CORS issues during development.

---

## 7. AI Strategy — OpenAI Integration

### 8.1 System Prompt

**File: `backend/src/prompts/triage.prompt.ts`**

The system prompt is carefully engineered to make the AI behave as a **restricted medical triage classification engine**:

- **ONLY function**: Classify symptoms into one specialization + one urgency level
- **NOT allowed to**: Diagnose, give medical advice, suggest treatments, name doctors/hospitals, or add commentary
- **Output format**: Strictly JSON with no extra text
- **Safety-first**: If symptoms are unclear → defaults to `GENERAL_PHYSICIAN` + `MEDIUM`
- **Emergency detection**: Chest pain + sweating, stroke symptoms, suicidal ideation, severe breathing difficulty → `EMERGENCY`

### 8.2 Structured JSON Output

The OpenAI API call uses `response_format: json_schema` to enforce the exact output structure:

```json
{
  "specialization": "CARDIOLOGIST",
  "urgency": "EMERGENCY"
}
```

The schema restricts:
- `specialization` to exactly 8 allowed values (enum)
- `urgency` to exactly 4 allowed values (enum)
- `additionalProperties: false` prevents any extra fields
- `temperature: 0.1` ensures deterministic, consistent results

### 8.3 Backend Safety Validation

Even after OpenAI returns its response, the backend applies a **final safety layer**:

```typescript
if (!allowedSpecializations.includes(result.specialization)) {
  result.specialization = 'GENERAL_PHYSICIAN'
}
if (!allowedUrgencies.includes(result.urgency)) {
  result.urgency = 'MEDIUM'
}
```

This protects against:
- AI hallucinations
- Unexpected API response formats
- Prompt injection attacks

### 8.4 Rule-Based Fallback

If OpenAI is unavailable (API key missing, quota exceeded, network error), the system falls back to keyword matching:

| Keywords in Symptoms | Specialization |
|---------------------|---------------|
| heart, chest pain, chest pressure, palpitations | CARDIOLOGIST |
| stroke, seizure, numbness, weakness, migraine | NEUROLOGIST |
| rash, skin, itch, acne | DERMATOLOGIST |
| bone, joint, fracture, back pain, sprain | ORTHOPEDIC |
| stomach, abdomen, nausea, vomiting, diarrhea | GASTROENTEROLOGIST |
| child, baby, infant, toddler | PEDIATRICIAN |
| anxious, depressed, panic, insomnia, can't sleep, suicidal | PSYCHIATRIST |
| (default) | GENERAL_PHYSICIAN |

| Keywords | Urgency |
|----------|---------|
| chest pain, unconscious, seizure, stroke, suicidal, can't breathe, chest+sweating | EMERGENCY |
| severe, intense, worsening | HIGH |
| mild, slight | LOW |
| (default) | MEDIUM |

---

## 8. Database Population from CSV Files

### 8.1 CSV Files Overview

There are **3 CSV files** in `backend/data/`:

#### 1. `doctors_combined_data.csv` — **Primary Source** (6,520 valid records)

This is the richest dataset with private-sector doctors mostly from Dhaka.

| Column | Example | Usage |
|--------|---------|-------|
| `Doctor Name` | `Prof. Dr. Manzoor Hossain` | → `name` |
| `Education` | `MBBS,D-CARD,PHD` | Not stored (used for reference) |
| `Speciality` | `Cardiologist` | → mapped to `specialization` enum |
| `Experience` | `16.0` | → `experience` (integer), used to derive `rating` + `credibilityScore` |
| `Chamber` | `Aalok Healthcare Ltd. \| Mirpur 10` | → split into `hospital` + `chamber` |
| `Location` | `Dhaka-1216` | → `address` |
| `Concentration` | `Cardiac Medicine,Cardiac MRI,...` | Not stored (used for reference) |

#### 2. `Doctor_Directory.csv` — **Secondary Source** (199 valid records)

Government-sector doctor directory with a different column structure.

| Column | Example | Usage |
|--------|---------|-------|
| `Provider` | `Dr. Mahboob Jahan Ahmed` | → `name` |
| `Post` | `Sr. Consultant(Eye)` | → mapped to `specialization` enum |
| `ProfessionalDis` | `Ophthalmology` | → fallback for specialization |
| `facility` | `Chapai Nababganj District Hospital` | → `hospital` + `chamber` |
| `ContactNo` | `1712290927` | → `helpline` |
| `Address` | `Adhunik Sadar Hospital, Chapainawabganj` | → `address` |
| `Division/District/Upazila` | `Rajshahi / Chapai Nawabganj / Sadar` | → fallback address |

#### 3. `doctors_processed_data.csv` — **Not imported separately** (6,733 rows)

This is a pre-processed version of the combined data with extra binary columns (MBBS=0/1, FCPS=0/1, Cardiac Medicine=0/1, etc.). **All doctor names in this file already exist in `doctors_combined_data.csv`**, so importing it would only create duplicates. The extra binary columns are not used in the current schema.

### 8.2 Import Script Walkthrough

**File: `backend/scripts/import-doctors.ts`**

This is a CLI script that reads a CSV file, transforms each row into a Doctor record, and bulk-inserts into MongoDB via Prisma.

#### Command-line options:
```bash
npx tsx scripts/import-doctors.ts [options]

--file <path>    # CSV file to import (default: data/doctors_combined_data.csv)
--truncate       # Delete all existing doctors before importing
--only-dhaka     # Only import doctors with "dhaka" in their address
```

#### Execution flow:

```
1. Parse CLI arguments
2. Read CSV file from disk
3. Parse CSV into row objects (using csv-parse)
4. For each row:
   a. Extract doctor name (skip if missing)
   b. Map specialization string → enum value
   c. Parse chamber string → hospital + chamber
   d. Build address from available fields
   e. Parse experience → integer
   f. Derive rating from experience
   g. Compute credibility score
   h. Generate Google Maps link
5. Optionally filter to Dhaka-only doctors
6. Optionally truncate existing data
7. Bulk insert in chunks of 500
8. Log result count
```

### 8.3 Data Transformation Pipeline

#### Specialization Mapping

The `mapSpecialization()` function converts free-text speciality strings to the 8 allowed enum values:

```
"Cardiologist"           → CARDIOLOGIST      (matches "cardio")
"Neurologist"            → NEUROLOGIST       (matches "neuro")
"Dermatologist"          → DERMATOLOGIST     (matches "derma" or "skin")
"Orthopedic Surgeon"     → ORTHOPEDIC        (matches "ortho")
"Gastroenterologist"     → GASTROENTEROLOGIST (matches "gastro", "liver", "hepat")
"Pediatrician"           → PEDIATRICIAN      (matches "pedia" or "child")
"Psychiatrist"           → PSYCHIATRIST      (matches "psych" or "mental")
"Medicine Specialist"    → GENERAL_PHYSICIAN  (matches "general" or "medicine")
"Nutritionist"           → GENERAL_PHYSICIAN  (no match → default)
```

#### Chamber Splitting

The Chamber field in the combined CSV often uses `|` as a separator:
```
Input:  "Aalok Healthcare Ltd. | Mirpur 10"
Output: hospital = "Aalok Healthcare Ltd."
        chamber  = "Mirpur 10"
```

If no `|` separator exists, both hospital and chamber get the full value.

#### Rating Derivation

Rating (0–5) is derived from years of experience:
```typescript
function deriveRating(experience: number | null): number {
  if (experience === null) return 4.0  // Default for unknown
  const normalized = Math.min(20, Math.max(0, experience))  // Cap at 20 years
  const rating = 3.0 + normalized / 10  // 3.0 to 5.0 range
  return Math.round(Math.min(5, rating) * 10) / 10
}
```

Examples:
- 0 years → 3.0
- 10 years → 4.0
- 20+ years → 5.0
- Unknown → 4.0

#### Credibility Score Derivation

Credibility score (0–1) combines rating and experience with equal weighting:
```typescript
function deriveCredibility(rating: number, experience: number | null): number {
  const expScore = experience !== null ? Math.min(30, experience) / 30 : 0.4
  const score = (rating / 5) * 0.5 + expScore * 0.5
  return Math.round(score * 100) / 100
}
```

- 50% weight on rating (normalized to 0–1 from 0–5 scale)
- 50% weight on experience (normalized to 0–1, capped at 30 years)
- Unknown experience defaults to 0.4

Examples:
- Rating 5.0, 30 years → 1.0
- Rating 4.0, 10 years → 0.57
- Rating 4.0, unknown → 0.60

#### Google Maps Link

A Google Maps direction link is generated from the address:
```typescript
const mapsQuery = encodeURIComponent(address || chamber || hospital)
const mapsLink = `https://maps.google.com/?q=${mapsQuery}`
```

### 8.4 How to Run the Import

#### Step 1: Ensure MongoDB is accessible
The `DATABASE_URL` in `backend/.env` must point to a valid MongoDB Atlas cluster.

#### Step 2: Generate Prisma client
```bash
cd backend
npx prisma generate
npx prisma db push    # Sync schema to MongoDB
```

#### Step 3: Import the primary dataset (6,520 doctors)
```bash
npx tsx scripts/import-doctors.ts --truncate
```
This reads `data/doctors_combined_data.csv` (the default), deletes all existing doctors (`--truncate`), and imports all valid records.

#### Step 4: Import the government directory (199 doctors)
```bash
npx tsx scripts/import-doctors.ts --file data/Doctor_Directory.csv
```
This appends the government doctor records without truncating.

#### Final result:
```
Total doctors in MongoDB: 6,719
├── From doctors_combined_data.csv: 6,520
└── From Doctor_Directory.csv:        199
```

The `doctors_processed_data.csv` is **not imported** because all its doctors are already present in the combined data (0 unique names). Importing it would create duplicates.

---

## 9. How to Run the Project

### Prerequisites
- Node.js 18+
- npm
- A MongoDB Atlas account (connection string in `.env`)
- (Optional) An OpenAI API key with billing credits

### Start the Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev          # Starts on http://localhost:5000
```

### Start the Frontend
```bash
cd frontend
npm install
npm run dev          # Starts on http://localhost:5173
```

### Access the Application
Open **http://localhost:5173** in your browser.

---

*This documentation covers the complete HealthConnect system as of February 2026.*
