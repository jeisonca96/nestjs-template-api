[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

## Getting Started

NestJS Template API

### Prerequisites

- Node 16+
- Npm 8+
- Docker 17.12.0+

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

The application uses environment variables.
You have a option to configure your environment variables for local development:
### env files:

Use the `.env` file 

## Port Configuration

By default apps run in these ports:

| App                    | Port variable name           | Default port |
| ---------------------- | ---------------------------- | ------------ |
| **api**                | `API_PORT`                   | 3000         |

if you want to run in a different port you can modify the port variable in your env file.

## Running tests

Running unit test and calculating code coverage

```
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Running docs

Running build docs (folder '/apidocs')

```
# build docs
$ npm run prebuild:doc
$ npm run build:doc
```
