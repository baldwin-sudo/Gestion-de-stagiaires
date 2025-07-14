# Internship Project Tech Stack & Setup Guide

## 🛠️ Tech Stack Overview

### Backend (Go)
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL
- **ORM**: GORM
- **Authentication**: JWT tokens
- **Validation**: Go Playground Validator
- **Environment**: GoDotEnv

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **UI Components**: Shadcn/ui

### Additional Tools
- **API Documentation**: Swagger with Swaggo
- **CORS**: Gin CORS middleware
- **Database Migration**: GORM Auto-migrate

## 📚 Documentation Links

### Backend (Go)
- [Gin Framework](https://gin-gonic.com/docs/) - Main web framework
- [GORM](https://gorm.io/docs/) - ORM for database operations
- [PostgreSQL Driver](https://github.com/lib/pq) - Database driver
- [JWT Go](https://github.com/golang-jwt/jwt) - JWT authentication
- [Go Playground Validator](https://github.com/go-playground/validator) - Request validation
- [GoDotEnv](https://github.com/joho/godotenv) - Environment variables
- [Swaggo](https://github.com/swaggo/swag) - API documentation

### Frontend (Next.js)
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [Axios](https://axios-http.com/docs/intro) - HTTP client
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

### Database
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Database

## 🚀 Go Project Setup

### 1. Initialize Go Project
Create project directory and initialize Go module

### 2. Install Dependencies
Use `go get` to install all required packages:
- gin-gonic/gin
- gorm.io/gorm and gorm.io/driver/postgres
- golang-jwt/jwt/v5
- go-playground/validator/v10
- joho/godotenv
- gin-contrib/cors
- swaggo packages for documentation

### 3. Project Structure
```
internship-project/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── user.go
│   ├── models/
│   │   └── user.go
│   ├── middleware/
│   │   └── auth.go
│   └── database/
│       └── connection.go
├── docs/           # Swagger docs
├── .env
├── go.mod
└── go.sum
```

### 4. Basic Setup Files
- Create `cmd/main.go` with basic Gin server setup
- Configure environment variables in `.env` file
- Set up database connection in `internal/database/connection.go`

## 🏁 Quick Start Steps

1. **Create project directory** and initialize Go module
2. **Install all dependencies** using go get commands
3. **Create .env file** with your database credentials
4. **Set up project structure** as shown above
5. **Configure database connection** and basic server setup
6. **Run the project** with `go run cmd/main.go`

## 🔥 Next Steps

1. **Set up PostgreSQL database** locally or use a cloud service
2. **Create your models** in `internal/models/`
3. **Implement handlers** in `internal/handlers/`
4. **Add JWT authentication** middleware
5. **Set up your Next.js frontend** in a separate directory
6. **Connect frontend to backend** using Axios

## 📝 Development Tips

- Use `air` for hot reloading during development: `go install github.com/cosmtrek/air@latest`
- Use `make` files for common commands
- Write tests alongside your code
- Use Swagger for API documentation from the start
- Keep your handlers thin - business logic should be in separate services

---

This setup gives you a solid foundation for a production-ready CRUD application with modern Go practices!