# BERWA HOSPITALS

A complete hospital management system built with React + Vite frontend and Node.js + Express backend using SQLite. Features a public patient-facing website and an internal staff dashboard for Berwa HMS.

## Project structure

- `backend/` - Express API, SQLite database, authentication, patients, appointments, lab, pharmacy, billing, reports, and audit routes.
- `frontend/` - React + Vite application with public website, role-based dashboard layout, login, patient management, triage, consultation, lab requests, pharmacy, billing, reports, and admin views.

## Install dependencies

From the backend folder:

```powershell
cd C:\Users\sabin\MediCoreHMS\backend
npm install
```

From the frontend folder:

```powershell
cd C:\Users\sabin\MediCoreHMS\frontend
npm install
```

## Run the backend

```powershell
cd C:\Users\sabin\MediCoreHMS\backend
cp .env.example .env
npm run seed
npm run dev
```

## Run the frontend

```powershell
cd C:\Users\sabin\MediCoreHMS\frontend
npm run dev
```

## Demo login credentials (Berwa HMS Staff Portal)

- Super Admin: `admin@berwa.com` / `Admin123!`
- Hospital Admin: `hospital@berwa.com` / `Hospital123!`
- Receptionist: `reception@berwa.com` / `Reception123!`
- Doctor: `doctor@berwa.com` / `Doctor123!`
- Nurse: `nurse@berwa.com` / `Nurse123!`
- Laboratory Staff: `lab@berwa.com` / `Lab123!`
- Pharmacist: `pharma@berwa.com` / `Pharma123!`
- Cashier: `cashier@berwa.com` / `Cashier123!`

## Public website routes (demo)

- Home / Public landing: `/public`
- Doctor directory: `/public/doctors`
- Doctor profile: `/public/doctors/:id`
- Public appointment booking: `/public/appointments`
- Blog list: `/public/blog` (API: `/api/public/blog`)

## Internal dashboard routes (demo)

- Protected dashboard root: `/` (requires login)
- Patients: `/patients`
- Register patient: `/patients/new`
- Appointments: `/appointments`
- Triage: `/triage`
- Consultation: `/consultation`
- Lab requests: `/labs`
- Pharmacy: `/pharmacy`
- Billing: `/billing`
- Reports: `/reports`
- User management: `/users`
- Audit logs: `/audit`

## Notes about running locally

- This workspace requires Node.js and npm installed locally. The current environment where I ran commands does not have `node`/`npm` available, so I could not execute `npm install` or run the servers here. Install Node.js (v16+) and npm, then run the commands above.

### Quick run commands (PowerShell)

```powershell
# Backend
cd C:\Users\sabin\MediCoreHMS\backend
copy .env.example .env
npm install
npm run seed
npm run dev

# Frontend
cd C:\Users\sabin\MediCoreHMS\frontend
npm install
npm run dev
```

## Demo data included

- 8 demo doctors, 12 departments, 4 locations, 20 patients, 10 public appointments
- 5 online consultation requests, 5 second-opinion requests, 6 health packages
- 8 lab requests, 8 prescriptions, 5 invoices, 5 blog posts

## Security & production

- Passwords are hashed in the seed data.
- For production: move to PostgreSQL, add HTTPS, use secure JWT secret and rotate keys, enable rate limiting, CSRF protections, input sanitization, and audit monitoring.

## Next improvements

- Add real role-specific UI filtering and protected route logic for each module.
- Complete frontend forms for lab, pharmacy, billing, and consultations with backend integration.
- Add patient profile and history pages.
- Enhance validation, error handling, and UI polish.
- Add PostgreSQL support and migrations for production.
