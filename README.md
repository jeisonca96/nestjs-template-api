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

### 📊 Database & Storage
- MongoDB integration with Mongoose
- Cloud storage support (AWS S3)
- Database health checks

### 🔧 Core Services
- **Filtering System**: Advanced query filtering and pagination
- **Notifications**: Email and WhatsApp notifications
- **OTP Service**: One-time password generation and validation
- **Logger**: Custom logging with trace ID support
- **Alerts**: Configurable alert system

### 📚 Documentation & Development
- Swagger/OpenAPI documentation
- Comprehensive error handling
- Custom validation pipes
- Health check endpoints
- Docker support with docker-compose

### 🧪 Testing & Quality
- Unit tests with Jest
- E2E testing setup
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
│   └── otp/           # OTP service
├── example-module/     # Example module template
└── health/            # Health check endpoints
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

# 5. Access your API
open http://localhost:3000/api-docs
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

## Troubleshooting

### Common Issues

**MongoDB Connection Issues**
```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

**Port Already in Use**
```bash
# Check what's using port 3000
lsof -i :3000

# Use a different port
echo "API_PORT=3001" >> .env
```

**Module Not Found Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Issues**
```bash
# Clean build directory
npm run prebuild
npm run build
```

### Environment Issues

Make sure all required environment variables are set:
- `AUTH_SECRET_KEY` should be a strong, unique secret
- `DATABASES_MONGO_URL` should point to a running MongoDB instance
- Email configuration is required for password reset functionality

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
