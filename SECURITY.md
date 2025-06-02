# Security and Validation Features

This document describes the enhanced security and validation features implemented in the NestJS Template API.

## 🔒 Security Enhancements

### 1. Helmet Security Headers
- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing

### 2. Rate Limiting
The application implements multiple layers of rate limiting:

#### Express Rate Limiting
- **Window**: 15 minutes (configurable via `RATE_LIMIT_WINDOW`)
- **Max Requests**: 100 per window (configurable via `RATE_LIMIT_MAX`)
- **Response**: Returns 429 status with structured error message

#### NestJS Throttler
Multiple throttling configurations:
- **Short**: 3 requests per second
- **Medium**: 20 requests per 10 seconds  
- **Long**: 100 requests per minute

### 3. CORS Configuration
- **Origins**: Configurable via `CORS_ORIGINS` environment variable
- **Methods**: GET, HEAD, PUT, PATCH, POST, DELETE
- **Headers**: Content-Type, Authorization
- **Credentials**: Enabled for authentication

### 4. Enhanced Validation Pipeline
- **Whitelist**: Only allows properties defined in DTOs
- **Transform**: Automatically transforms input data
- **Forbid Non-Whitelisted**: Rejects unknown properties
- **Disable Error Messages**: Hides validation details in production

## 🛡️ Validation & Sanitization

### Custom Validation Decorators

#### `@IsStrongPassword()`
Validates password strength:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

```typescript
@IsStrongPassword()
password: string;
```

#### `@IsValidObjectId()`
Validates MongoDB ObjectId format:

```typescript
@IsValidObjectId()
userId: string;
```

#### `@IsSafeFilename()`
Prevents directory traversal and unsafe filename patterns:

```typescript
@IsSafeFilename()
filename: string;
```

#### `@IsSecureUrl(allowedProtocols)`
Validates URLs with allowed protocols:

```typescript
@IsSecureUrl(['https'])
website: string;
```

### Sanitization Decorators

#### `@SanitizeHtml()`
Escapes HTML characters to prevent XSS:

```typescript
@SanitizeHtml()
description: string;
```

#### `@Trim()`
Removes leading and trailing whitespace:

```typescript
@Trim()
name: string;
```

#### `@NormalizeEmail()`
Normalizes email addresses:

```typescript
@NormalizeEmail()
email: string;
```

### Global Sanitization Interceptor

The `SanitizationInterceptor` automatically sanitizes:
- Request body
- Query parameters
- Route parameters

Applied globally to all routes for comprehensive protection.

## 🏥 Enhanced Health Checks

### Basic Health Check
**Endpoint**: `GET /health`

Includes:
- MongoDB connection check
- Application status
- Database connectivity
- Environment validation

### Detailed Health Check
**Endpoint**: `GET /health/detailed`

Comprehensive monitoring:
- **MongoDB**: Connection and ping test
- **Disk**: Storage usage and accessibility
- **Memory**: Heap and RSS memory usage
- **Application**: Version and environment info
- **External Services**: API and service dependencies
- **Environment**: Required environment variables

### Liveness Probe
**Endpoint**: `GET /health/liveness`

Kubernetes-compatible liveness check for basic application functionality.

### Readiness Probe
**Endpoint**: `GET /health/readiness`

Kubernetes-compatible readiness check ensuring:
- Database connectivity
- Required environment variables
- External dependencies

### Health Check Responses

#### Success Response (200)
```json
{
  "status": "ok",
  "info": {
    "mongodb": {
      "status": "up",
      "message": "Connection successful"
    },
    "application": {
      "status": "up", 
      "version": "1.0.0",
      "environment": "development"
    }
  },
  "error": {},
  "details": {
    "mongodb": {
      "status": "up",
      "message": "Connection successful"
    },
    "application": {
      "status": "up",
      "version": "1.0.0", 
      "environment": "development"
    }
  }
}
```

#### Error Response (503)
```json
{
  "status": "error",
  "info": {},
  "error": {
    "mongodb": {
      "status": "down",
      "message": "Connection failed"
    }
  },
  "details": {
    "mongodb": {
      "status": "down",
      "message": "Connection failed"
    }
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `*` | `http://localhost:3000,https://app.example.com` |
| `RATE_LIMIT_WINDOW` | Rate limit window in milliseconds | `900000` | `900000` (15 minutes) |
| `RATE_LIMIT_MAX` | Maximum requests per window | `100` | `100` |
| `BODY_LIMIT` | Maximum request body size | `2mb` | `10mb` |

### Security Headers

The application automatically configures these security headers:

- `Content-Security-Policy`: Restricts resource loading
- `Strict-Transport-Security`: Forces HTTPS
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `X-Frame-Options: DENY`: Prevents embedding in frames
- `X-XSS-Protection: 1; mode=block`: Enables XSS filtering

## 📝 Usage Examples

### Using Validation Decorators

```typescript
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  IsStrongPassword,
  SanitizeHtml,
  Trim,
  NormalizeEmail,
} from '../validation/validation.utils';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Trim()
  @SanitizeHtml()
  name: string;

  @IsEmail()
  @NormalizeEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
```

### Applying Rate Limiting to Specific Routes

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('api')
export class ApiController {
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('sensitive-endpoint')
  async sensitiveOperation() {
    // This endpoint allows only 5 requests per minute
  }
}
```

### Custom Health Checks

```typescript
// In your service
async checkExternalAPI() {
  const indicator = this.healthIndicatorService.check('external-api');
  try {
    const response = await this.httpService.get('https://api.example.com/health').toPromise();
    return indicator.up({ status: response.status });
  } catch (error) {
    return indicator.down({ error: error.message });
  }
}
```

## 🚨 Security Best Practices

1. **Always validate input**: Use DTOs with validation decorators
2. **Sanitize user data**: Apply sanitization decorators to prevent XSS
3. **Use HTTPS in production**: Configure proper SSL certificates
4. **Monitor rate limits**: Set appropriate limits based on your use case
5. **Regular security audits**: Run `npm audit` regularly
6. **Environment variables**: Never commit sensitive data to version control
7. **Health monitoring**: Use health checks for monitoring and alerting

## 🧪 Testing Security Features

### Testing Rate Limiting
```bash
# Test rate limiting
for i in {1..101}; do
  curl -X GET http://localhost:3000/health
done
```

### Testing Validation
```bash
# Test password validation
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "weak"}'
```

### Testing Health Checks
```bash
# Basic health check
curl http://localhost:3000/health

# Detailed health check  
curl http://localhost:3000/health/detailed

# Liveness probe
curl http://localhost:3000/health/liveness

# Readiness probe
curl http://localhost:3000/health/readiness
```

## 📊 Monitoring and Alerts

The enhanced health checks provide comprehensive monitoring data that can be integrated with:

- **Kubernetes**: Use liveness and readiness probes
- **Docker**: Health check commands in Dockerfile
- **Monitoring Tools**: Prometheus, Grafana, DataDog
- **Alerting**: Set up alerts based on health check failures

This comprehensive security and validation implementation provides enterprise-grade protection while maintaining developer productivity and system observability.
