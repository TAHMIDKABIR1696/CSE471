# HealthConnect Server

Express + TypeScript backend for triage and doctor recommendations.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set `DATABASE_URL`. If you want LLM triage, set `OPENAI_API_KEY`.

3. Generate Prisma client and push schema:

```bash
npm run prisma:generate
npm run prisma:push
```

4. Optional seed data:

```bash
npm run seed
```

5. Import Kaggle doctor CSVs (from `backend/data`):

```bash
# Recommended: processed dataset
npm run import:doctors -- --file data/doctors_processed_data.csv --truncate --only-dhaka

# Alternative datasets
npm run import:doctors -- --file data/doctors_combined_data.csv --truncate
npm run import:doctors -- --file data/Doctor_Directory.csv --truncate
```

5. Start the server:

```bash
npm run dev
```

The API listens on `http://localhost:5000` by default.

## Endpoints

- `POST /api/triage` with `{ "symptoms": "..." }` -> `{ specialization, urgency }`
- `GET /api/doctors?specialization=CARDIOLOGIST` -> list of doctors

## Notes

- If `OPENAI_API_KEY` is not set, the triage endpoint falls back to a simple rules-based classifier.
- Store doctor `specialization` values in uppercase to match the triage output.
- The importer derives a placeholder `rating` from years of experience when ratings are not available in the CSV.
