# MatCron

MatCron is a comprehensive mattress tracking and management system designed to streamline operations for organizations. The application is split into two main components:

- **Backend**: An ASP.NET Core 8.0 Web API that provides secure and scalable endpoints for managing mattress inventory, user authentication, and organizational data.
- **Frontend**: A React.js-based web admin dashboard that offers an intuitive interface for administrators to interact with the system.

---

## 🚀 Project Structure

The repository is organized into the following directories:

- `Backend/` – Contains the ASP.NET Core Web API project.
- `web-app/` – Contains the React.js frontend admin dashboard.

Each directory includes its own `README.md` with setup and usage instructions.

---

## 🛠 Prerequisites

To run this project locally, you will need:

- [.NET SDK 8.0 or later](https://dotnet.microsoft.com/)
- [Node.js (v16 or higher)](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- MySQL Server
- Visual Studio 2022 or Visual Studio Code (recommended)

---

## 📦 Getting Started

### Backend

1. Navigate to the `Backend/` directory.
2. Follow the instructions in its `README.md` to:
   - Configure database connection
   - Run EF Core migrations
   - Start the API using:
     ```bash
     dotnet run
     ```

### Frontend

1. Navigate to the `web-app/` directory.
2. Follow the instructions in its `README.md` to:
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set environment variables in a `.env` file:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```
   - Start the app:
     ```bash
     npm start
     ```

---

## 🐳 Docker Deployment

To deploy using Docker:

1. Ensure Docker and Docker Compose are installed.
2. In the root directory, run:
   ```bash
   docker-compose up --build
