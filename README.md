# HealthConnect

This repository is organized into separate frontend and backend applications.

## Complete Folder Structure

```text
CSE471/
├── .gitignore
├── README.md
├── projectIdea.txt
├── backend/
│   ├── .env
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── data/
│   │   ├── Doctor_Directory.csv
│   │   ├── doctors_combined_data.csv
│   │   └── doctors_processed_data.csv
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── README.md
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── scripts/
│   │   └── import-doctors.ts
│   └── src/
│       ├── app.ts
│       ├── index.ts
│       ├── config/
│       │   ├── database.ts
│       │   └── env.ts
│       ├── controllers/
│       │   ├── doctors.controller.ts
│       │   └── triage.controller.ts
│       ├── models/
│       │   └── doctor.model.ts
│       ├── prompts/
│       │   └── triage.prompt.ts
│       ├── routes/
│       │   ├── doctors.routes.ts
│       │   ├── index.ts
│       │   └── triage.routes.ts
│       ├── services/
│       │   └── triage.service.ts
│       ├── types/
│       │   └── triage.types.ts
│       └── validators/
│           └── triage.validator.ts
└── frontend/
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── App.tsx
        ├── index.css
        ├── main.tsx
        ├── vite-env.d.ts
        ├── controllers/
        │   └── useConsultController.ts
        ├── models/
        │   └── consult.model.ts
        ├── services/
        │   ├── doctors.service.ts
        │   ├── http.client.ts
        │   └── triage.service.ts
        └── views/
            ├── components/
            │   ├── ChatBox.tsx
            │   ├── Disclaimer.tsx
            │   ├── DoctorCard.tsx
            │   ├── Features.tsx
            │   ├── Footer.tsx
            │   ├── Hero.tsx
            │   ├── HowItWorks.tsx
            │   ├── Navbar.tsx
            │   └── TriageResult.tsx
            └── pages/
                ├── ConsultPageView.tsx
                └── HomePageView.tsx
```

## Frontend MVC Mapping

- `frontend/src/models`: data models and state contracts.
- `frontend/src/services`: API/data access services.
- `frontend/src/controllers`: UI controllers (state + orchestration hooks).
- `frontend/src/views`: pages and components.

## Backend MVC Mapping

- `backend/src/models`: database-facing model operations.
- `backend/src/controllers`: request handlers.
- `backend/src/routes`: route definitions.
- `backend/src/services`: business/service logic.

## Run

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```
