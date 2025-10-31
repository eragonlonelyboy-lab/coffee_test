# LoyalBrew Application

**Purpose:** A full-stack web application for a modern coffee shop, featuring customer authentication, online ordering, and a comprehensive loyalty and rewards program.

**Tech Stack:**
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Prisma ORM
- **Testing:** Jest, Supertest

---

## Getting Started

Follow these instructions to get the application running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/)
- A running [PostgreSQL](https://www.postgresql.org/) database instance

### 1. Clone & Install Dependencies

First, clone the repository to your local machine and install all the required npm packages.

```bash
git clone <repository_url>
cd loyalbrew-app
npm install
```

### 2. Environment Setup

The application requires environment variables for the database connection and security keys.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open the new `.env` file and update the variables:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `JWT_SECRET`: A long, random, and secret string for signing authentication tokens.

### 3. Database Setup

With your environment configured, you can now set up the database schema and populate it with mock data using our convenient setup script.

```bash
# This command runs migrations and then seeds the database.
npm run setup
```

### 4. Run Development Servers

The application has separate development servers for the frontend and backend. Run each in a separate terminal window.

- **Frontend (Vite):**
  ```bash
  npm run dev
  ```
  This will start the React frontend, typically available at `http://localhost:5173`.

- **Backend (Express):**
  ```bash
  npm run dev:server
  ```
  This will start the backend API server, typically available at `http://localhost:4000`.

### 5. Running Tests

To run the backend integration test suite, use the following command:

```bash
npm run test
```
