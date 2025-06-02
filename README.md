# NestJS Template API

A comprehensive and production-ready NestJS template for building scalable APIs. This template is built with NestJS 11 and includes essential features like authentication, database integration, file storage, notifications, and more.

## Features

This NestJS template comes with the following features out of the box:

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- API key authentication
- Refresh token support
- Password reset functionality

### 🛡️ Security Features
- Multi-tier rate limiting and DDoS protection
- Comprehensive security headers (Helmet middleware)
- Input validation and sanitization with custom decorators
- CORS protection and environment-based security configuration
- **For detailed security information, see [SECURITY.md](SECURITY.md)**

### 📊 Database & Storage
- MongoDB integration with Mongoose
- Cloud storage support (AWS S3)
- Comprehensive database health monitoring

### 🔧 Core Services
- **Filtering System**: Advanced query filtering and pagination
- **Notifications**: Email and WhatsApp notifications
- **OTP Service**: One-time password generation and validation
- **Logger**: Custom logging with trace ID support
- **Alerts**: Configurable alert system
- **Validation & Sanitization**: Custom decorators for validation and automatic request sanitization

### 🏥 Health Monitoring
- **Basic Health Check**: Simple endpoint for load balancers (`/v1/health`)
- **Detailed Health Check**: Comprehensive system status with memory, disk, and service checks (`/v1/health/detailed`)
- **Liveness Probe**: Kubernetes-ready endpoint for container health (`/v1/health/liveness`)
- **Readiness Probe**: Service readiness validation including external dependencies (`/v1/health/readiness`)
- **System Monitoring**: Memory usage (90% threshold), disk space, external service connectivity

### 📚 Documentation & Development
- Swagger/OpenAPI documentation
- Comprehensive error handling
- Production-ready validation pipeline
- Multiple health check endpoints
- Docker support with docker-compose
- Security documentation (SECURITY.md)

### 🧪 Testing & Quality
- Unit tests with Jest
- E2E testing setup
- **Security Testing**: Automated security test suite (`npm run test:security`)
- Code coverage reports
- ESLint and Prettier configuration

## Architecture

```
src/
├── auth/                 # Authentication module
├── config/              # Application configuration
├── core-services/       # Reusable core services
│   ├── alerts/         # Alert system
│   ├── cloud-storage/  # File storage
│   ├── filtering-system/ # Query filtering
│   ├── logger/         # Custom logging
│   ├── notifications/  # Email/SMS notifications
│   ├── otp/           # OTP service
│   └── validation/    # Validation & sanitization decorators
├── example-module/     # Example module template
└── health/            # Comprehensive health monitoring
```

## Quick Start

Get up and running in minutes:

```bash
# 1. Clone the repository
git clone https://github.com/jeisonca96/nestjs-template-api.git
cd nestjs-template-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Start with Docker (includes MongoDB)
docker-compose up -d

# 5. Run security tests (optional)
npm run test:security

# 6. Access your API
open http://localhost:3000/api-docs

# 7. Check system health
open http://localhost:3000/v1/health/detailed
```

## Getting Started

- Node 18+
- Npm 9+
- Docker 20.10+

### Installing

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeisonca96/nestjs-template-api.git
   cd nestjs-template-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the application:**
   ```bash
   # Development mode
   npm run dev
   
   # Production build
   npm run build
   npm run prod
   ```

### Docker Setup

You can run the entire application stack with Docker:

```bash
# Start MongoDB and API
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The Docker setup includes:
- **MongoDB**: Database service on port 27017
- **API**: NestJS application on port 3000

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start in development mode with hot reload |
| `npm run start` | Start in production mode |
| `npm run build` | Build the application for production |
| `npm run prod` | Run the built application |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:security` | Run automated security tests |
| `npm run security:check` | Check for security vulnerabilities |
| `npm run security:audit` | Audit dependencies for security issues |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |

## Environment Configuration

The application uses environment variables for configuration. Copy the `.env.example` file to `.env` and configure the variables according to your environment.

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `NODE_ENV` | Application environment | Yes | `dev` | `dev`, `prod`, `test` |
| `APP_NAME` | Application name | Yes | `Nest Template` | `My API` |
| `BASE_URL` | Base URL of the application | Yes | `http://localhost:3000` | `https://api.example.com` |
| `API_PORT` | Port where the API will run | Yes | `3000` | `8080` |
| `DATABASES_MONGO_URL` | MongoDB connection string | Yes | - | `mongodb://user:pass@localhost:27017/dbname` |

#### Authentication
| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `AUTH_SECRET_KEY` | JWT secret key | Yes | - | `your-super-secret-key` |
| `AUTH_TOKEN_EXPIRES_IN` | JWT token expiration | Yes | `1d` | `24h`, `7d` |
| `AUTH_REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration | Yes | `7d` | `30d` |

#### Email Configuration
| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `EMAIL_HOST` | SMTP server host | No | - | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | No | `587` | `465`, `25` |
| `EMAIL_USER` | SMTP username | No | - | `user@example.com` |
| `EMAIL_PASSWORD` | SMTP password | No | - | `app-password` |
| `EMAIL_FROM` | Default sender address | No | - | `"API <noreply@example.com>"` |

#### WhatsApp/Twilio (Optional)
| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `WHATSAPP_ACCOUNT_SID` | Twilio Account SID | No | - | `ACxxxxxxxxxxxxxxxx` |
| `WHATSAPP_AUTH_TOKEN` | Twilio Auth Token | No | - | `your_auth_token` |
| `WHATSAPP_PHONE_NUMBER` | WhatsApp phone number | No | - | `+1234567890` |

#### Security Configuration
| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | No | `*` | `http://localhost:3000,https://app.example.com` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window in milliseconds | No | `900000` | `600000` (10 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | `100` | `50` |
| `HELMET_CSP_SCRIPT_SRC` | Content Security Policy script sources | No | `'self'` | `'self' 'unsafe-inline'` |
| `SECURITY_ENABLE_HELMET` | Enable helmet security middleware | No | `true` | `false` |

### Environment Files

Create your `.env` file based on `.env.example`:

```bash
NODE_ENV=dev
APP_NAME=Nest Template
BASE_URL=http://localhost:3000
API_PORT=3000
DATABASES_MONGO_URL="mongodb://dev:test@localhost:27017/nest-template?authSource=admin"

AUTH_SECRET_KEY=YOUR_SECRET_KEY
AUTH_TOKEN_EXPIRES_IN=1d
AUTH_REFRESH_TOKEN_EXPIRES_IN=7d

# Security Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_CSP_SCRIPT_SRC='self'
SECURITY_ENABLE_HELMET=true

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="No Reply <noreply@example.com>"

# WhatsApp/Twilio (Optional)
WHATSAPP_ACCOUNT_SID=ACyour_account_sid
WHATSAPP_AUTH_TOKEN=your_auth_token
WHATSAPP_PHONE_NUMBER=+1234567890
```

## Development

### Development Mode

Start the application in development mode with hot reload:

```bash
npm run dev
```

This will:
- Copy email templates to the build directory
- Start the application with file watching
- Automatically restart on code changes

### Debugging

To debug the application:

```bash
npm run debug
```

The debugger will be available on the default Node.js debug port (9229).

### Code Quality

Maintain code quality with the provided tools:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run all tests
npm test

# Watch tests during development
npm run test:watch
```

## Testing

The template includes comprehensive testing setup:

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:cov
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e
```

### Test Configuration

- **Unit tests**: Located in `src/` alongside source files (`.spec.ts`)
- **E2E tests**: Located in `test/` directory
- **Security tests**: Automated security test suite in `scripts/test-security.sh`
- **Coverage reports**: Generated in `coverage/` directory
- **Jest configuration**: `package.json` and `test/jest-e2e.json`

## Security Features

This template includes comprehensive security features to protect your API. For detailed security documentation, configuration options, and best practices, see **[SECURITY.md](SECURITY.md)**.

## Health Monitoring

The application provides comprehensive health monitoring endpoints for different use cases:

### Available Health Endpoints

| Endpoint | Purpose | Response Time | Use Case |
|----------|---------|---------------|----------|
| `GET /v1/health` | Basic health check | ~1ms | Load balancers, simple monitoring |
| `GET /v1/health/detailed` | Comprehensive system status | ~100ms | Detailed monitoring, dashboards |
| `GET /v1/health/liveness` | Container/process health | ~1ms | Kubernetes liveness probes |
| `GET /v1/health/readiness` | Service readiness | ~100ms | Kubernetes readiness probes |

### Health Check Features

**Basic Health Check** (`/v1/health`)
- Simple "OK" response for quick availability checks
- Minimal resource usage
- Perfect for load balancer health checks

**Detailed Health Check** (`/v1/health/detailed`)
- **Database**: MongoDB connection and query performance
- **Memory**: Current usage vs. 90% threshold warning
- **Disk Space**: Available storage monitoring
- **External Services**: Connectivity to external APIs
- **Environment**: Critical environment variable validation

**Liveness Probe** (`/v1/health/liveness`)
- Confirms the application process is running
- Kubernetes-ready endpoint
- Fast response for container orchestration

**Readiness Probe** (`/v1/health/readiness`)
- Validates all dependencies are available
- Checks database connectivity
- Verifies external service availability
- Used by Kubernetes for traffic routing decisions

### Health Response Format

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": { "status": "up", "responseTime": 5 },
    "memory": { "status": "ok", "usage": "45%", "threshold": "90%" },
    "disk": { "status": "ok", "available": "85%" },
    "external_services": { "status": "up", "services": ["api.example.com"] }
  }
}
```

### Monitoring Integration

The health endpoints are designed to integrate with:
- **Kubernetes**: Liveness and readiness probes
- **Docker**: HEALTHCHECK instructions
- **Load Balancers**: Health check configurations
- **Monitoring Tools**: Prometheus, DataDog, New Relic
- **Alerting Systems**: PagerDuty, OpsGenie

### Test Configuration

- **Unit tests**: Located in `src/` alongside source files (`.spec.ts`)
- **E2E tests**: Located in `test/` directory
- **Coverage reports**: Generated in `coverage/` directory
- **Jest configuration**: `package.json` and `test/jest-e2e.json`

## API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at:

```
http://localhost:3000/api-docs
```

### Accessing Documentation

1. **Local Development**: `http://localhost:3000/api-docs`
2. **Production**: `{BASE_URL}/api-docs`

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Try-it-out functionality

### Customizing Documentation

API documentation is configured in:
- `src/apidocs.ts` - Main documentation setup
- Individual modules include their own documentation in `apidocs/` folders

## Production Deployment

This template is production-ready with comprehensive security and monitoring features.

### Security Checklist

Before deploying to production:
- [ ] Set strong `AUTH_SECRET_KEY` (min 32 characters)
- [ ] Configure `NODE_ENV=production`
- [ ] Set proper `CORS_ORIGINS` for your domains
- [ ] Configure rate limiting for your traffic patterns
- [ ] Enable security headers (`SECURITY_ENABLE_HELMET=true`)
- [ ] Set up email configuration for notifications

**For complete security configuration, see [SECURITY.md](SECURITY.md)**

## Contributing

We welcome contributions from the community! This NestJS template aims to provide a solid foundation for building scalable APIs, and your contributions help make it better for everyone.

### How to Contribute

1. **Fork the repository** and create your feature branch from `main`
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/nestjs-template-api.git
   cd nestjs-template-api
   ```
3. **Install dependencies** and set up your development environment:
   ```bash
   npm install
   ```
4. **Make your changes** - whether it's fixing bugs, adding features, or improving documentation
5. **Run tests** to ensure everything works correctly:
   ```bash
   npm run test
   npm run test:cov
   npm run test:security  # Test security features
   ```
6. **Commit your changes** with descriptive commit messages
7. **Push to your fork** and submit a pull request

### What We're Looking For

- 🐛 **Bug fixes** - Help us identify and fix issues
- ✨ **New features** - Add functionality that benefits the community
- 📚 **Documentation improvements** - Better docs help everyone
- 🧪 **Tests** - Improve test coverage and quality
- 🎨 **Code quality** - Refactoring, performance improvements, and best practices
- 🔧 **DevOps improvements** - Docker, CI/CD, deployment enhancements
- 🛡️ **Security enhancements** - Additional security features and best practices
- 🏥 **Monitoring improvements** - Enhanced health checks and observability features
- 🔍 **Validation decorators** - New custom validation and sanitization decorators

### Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

### Questions or Ideas?

Feel free to open an issue to:
- Report bugs
- Suggest new features
- Ask questions about the codebase
- Discuss potential improvements

Thank you for contributing to make this NestJS template better! 🚀
