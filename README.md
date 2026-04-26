# Release Checklist

A simple application to track and manage software release steps.

## Project Structure

- `backend/`: Node.js/Express API with PostgreSQL.
- `frontend/`: React application built with Vite.

## Database Schema

The application uses a PostgreSQL database with a `releases` table.

```sql
CREATE TABLE releases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    additional_info TEXT DEFAULT '',
    steps JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Default Steps (JSONB)
Each release is initialized with the following steps:
- Code Freeze (boolean)
- QA Testing (boolean)
- Security Review (boolean)
- Backup Database (boolean)
- Deploy Staging (boolean)
- Smoke Test (boolean)
- Production Deploy (boolean)
- Monitor Logs (boolean)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/releases` | Fetch all releases sorted by creation date. |
| POST | `/api/releases` | Create a new release. Requires `name` and `date`. |
| PATCH | `/api/releases/:id/steps` | Update a specific step's status. Requires `stepName` and `value`. |
| PATCH | `/api/releases/:id/info` | Update additional information for a release. |
| DELETE | `/api/releases/:id` | Delete a specific release. |

## Local Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your configuration:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually at `http://localhost:5173`).
