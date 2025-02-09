## Getting Started

NestJS Template API (Version 11)

NestJS 11 introduces several improvements, including enhanced performance, better modularization, and new features for dependency injection.

### Prerequisites

- Node 18+
- Npm 9+
- Docker 20.10+

### Installing

Start by cloning.

```
$ git clone https://github.com/jeisonca96/nestjs-template-api
```

The next thing will be to install all the dependencies of the project.

```
npm i
npm run start
```

Run with docker.

```
docker-compose up -d
```

## Environment configuration

The application uses environment variables. You have an option to configure your environment variables for local development:

### env files:

Use the `.env` file with the following variables:

```
BASE_URL=http://localhost:3000
API_PORT=3000
DATABASES_MONGO_URL="mongodb://dev:test@localhost:27017/nest-template?authSource=admin"
AUTH_SECRET_KEY=YOUR_SECRET_KEY
AUTH_TOKEN_EXPIRES_IN=1d
AUTH_REFRESH_TOKEN_EXPIRES_IN=7d
```

## Port Configuration

By default, the app runs on this port:

| App     | Port variable name | Default port |
| ------- | ------------------ | ------------ |
| **api** | `API_PORT`         | 3000         |

If you want to run on a different port, modify the port variable in your `.env` file.

## Running tests

Running unit tests and calculating code coverage:

```
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## API Documentation

The API documentation is generated automatically and available at:

```
BASE_URL/api-docs
```
