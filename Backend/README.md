# MatCron Backend

MatCron Backend is a robust .NET-based API service that powers the MatCron mattress tracking system. Built with .NET 8.0, it provides a secure and scalable backend infrastructure for managing mattress inventory, user authentication, and organization management.

## Features

- **Secure Authentication**: JWT-based authentication system
- **Database Support**: 
  - MySQL database integration
  - Entity Framework Core ORM
- **Docker Support**: 
  - Multi-platform deployment support (Windows, Mac, Linux, Raspberry Pi)
  - Containerized database and API services
- **API Documentation**: 
  - Swagger/OpenAPI integration for API documentation and testing
- **Repository Pattern**: Clean architecture with separated business logic

## Prerequisites

- .NET SDK 8.0 or later
- Docker and Docker Compose
- MySQL Server (if running without Docker)
- Visual Studio 2022 or VS Code (for development)

## Getting Started

### Docker Deployment

1. Clone the repository:

bash
git clone https://github.com/your-username/matcron.git
cd matcron/Backend

2. Choose the appropriate docker-compose file for your platform:

- For Windows/Linux: `docker-compose.yml`
- For MacOS: `docker-compose-mac.yml`
- For Raspberry Pi: `docker-compose-pi.yml`

3. Run the application:

bash
docker-compose -f <chosen-compose-file>.yml up -d
```

The API will be available at:
- API: `http://localhost:8082`
- Swagger Documentation: `http://localhost:8082/swagger`

### Local Development

1. Update the connection string in `appsettings.json`
2. Install dependencies and run migrations:
```bash
dotnet restore
dotnet ef database update
```

3. Run the application:
```bash
dotnet run
```

## Project Structure

- `Controllers/`: API endpoints
- `Entities/`: Database models
- `Repositories/`: Data access layer
- `Common/`: Shared utilities and helpers
- `Middlewares/`: Custom middleware components

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
