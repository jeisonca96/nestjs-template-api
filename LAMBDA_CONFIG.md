# AWS Lambda Configuration Best Practices

This document outlines best practices for configuring your NestJS application on AWS Lambda.

## MongoDB Connection Optimization

### Connection Pooling

For Lambda, configure MongoDB connection pooling:

```typescript
// In app.module.ts
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('DATABASES_MONGO_URL'),
    // Lambda-optimized connection pool settings
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    // Important for Lambda: reuse connections
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  }),
  inject: [ConfigService],
}),
```

### MongoDB Atlas Configuration

1. **Whitelist AWS Lambda IPs** (or use VPC)
2. **Enable Connection Pooling**
3. **Use same region** as Lambda for low latency
4. **Connection string format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&maxPoolSize=10
   ```

## Environment Variables Management

### Using AWS Systems Manager Parameter Store

```bash
# Store secrets
aws ssm put-parameter \
  --name /nestjs-api/prod/JWT_SECRET \
  --value "your-secret" \
  --type SecureString \
  --region us-east-1

aws ssm put-parameter \
  --name /nestjs-api/prod/DATABASES_MONGO_URL \
  --value "mongodb+srv://..." \
  --type SecureString \
  --region us-east-1
```

Update `serverless.yml`:

```yaml
provider:
  environment:
    JWT_SECRET: ${ssm:/nestjs-api/${self:provider.stage}/JWT_SECRET~true}
    DATABASES_MONGO_URL: ${ssm:/nestjs-api/${self:provider.stage}/DATABASES_MONGO_URL~true}
```

### Using AWS Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name nestjs-api/prod/app-secrets \
  --secret-string '{
    "JWT_SECRET": "your-secret",
    "DATABASES_MONGO_URL": "mongodb+srv://...",
    "API_KEY": "your-api-key"
  }' \
  --region us-east-1
```

Access in application:

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function getSecrets() {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "nestjs-api/prod/app-secrets" })
  );
  return JSON.parse(response.SecretString);
}
```

## Memory and Timeout Configuration

### Finding Optimal Memory

1. Start with 512MB
2. Monitor CloudWatch metrics
3. Increase if seeing memory issues
4. Note: More memory = more CPU

```yaml
provider:
  memorySize: 512  # Start here
  timeout: 30      # Adjust based on longest operation
```

### Memory vs Cost

| Memory | CPU Equivalent | Use Case |
|--------|---------------|----------|
| 512 MB | ~0.5 vCPU | Light API operations |
| 1024 MB | ~1 vCPU | Standard operations |
| 2048 MB | ~2 vCPU | Heavy processing |
| 3008 MB | ~2 vCPU | Maximum performance |

## Cold Start Optimization

### 1. Minimize Dependencies

Remove unused dependencies:

```bash
npm uninstall <unused-package>
```

### 2. Use Provisioned Concurrency

For production endpoints:

```yaml
functions:
  main:
    provisionedConcurrency: 2  # Keep 2 warm instances
```

### 3. Lambda SnapStart (Future)

Currently Java only, but watch for Node.js support.

### 4. Code Splitting

Split large modules:

```yaml
functions:
  api:
    handler: dist/lambda.handler
  worker:
    handler: dist/worker.handler
```

## Rate Limiting in Lambda

### Option 1: API Gateway Throttling

```yaml
provider:
  apiGateway:
    usagePlan:
      quota:
        limit: 5000
        period: MONTH
      throttle:
        burstLimit: 200
        rateLimit: 100
```

### Option 2: DynamoDB-based Rate Limiting

Create DynamoDB table in `serverless.yml`:

```yaml
resources:
  Resources:
    RateLimitTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-rate-limit-${self:provider.stage}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
        TimeToLiveSpecification:
          AttributeName: ttl
          Enabled: true
```

## Logging Best Practices

### Structured Logging

```typescript
const logger = new Logger('LambdaHandler');

logger.log({
  message: 'Processing request',
  requestId: context.requestId,
  method: event.httpMethod,
  path: event.path,
});
```

### Log Levels

Set appropriate log level:

```yaml
provider:
  environment:
    LOG_LEVEL: ${self:custom.logLevel.${self:provider.stage}}

custom:
  logLevel:
    dev: debug
    staging: info
    prod: warn
```

### CloudWatch Log Retention

```yaml
resources:
  Resources:
    MainLogGroup:
      Type: AWS::Logs::LogGroup
      Properties:
        LogGroupName: /aws/lambda/${self:service}-${self:provider.stage}-main
        RetentionInDays: 14  # Adjust based on needs
```

## VPC Configuration

### When to Use VPC

- Database in private subnet
- Access to internal services
- Compliance requirements

### VPC Considerations

- **Increased cold start time** (~10 seconds)
- **NAT Gateway costs** (if accessing internet)
- **ENI limits** per region

### Configuration

```yaml
provider:
  vpc:
    securityGroupIds:
      - sg-xxxxxxxxx
    subnetIds:
      - subnet-xxxxxxxxx  # Private subnet with NAT
      - subnet-yyyyyyyyy  # Private subnet with NAT
```

## Cost Optimization Strategies

### 1. Right-size Memory

Monitor and adjust:

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=nestjs-template-api-dev-main \
  --statistics Average \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600
```

### 2. Use ARM64

Already configured:

```yaml
provider:
  architecture: arm64  # ~20% cost savings
```

### 3. Enable Compute Optimizer

```bash
aws compute-optimizer get-lambda-function-recommendations \
  --function-arn arn:aws:lambda:region:account:function:name
```

### 4. Set Reserved Concurrency

Prevent unexpected costs:

```yaml
functions:
  main:
    reservedConcurrency: 10  # Max concurrent executions
```

### 5. Monitor with AWS Cost Explorer

- Enable Cost Allocation Tags
- Set up billing alerts
- Review monthly usage

## Security Best Practices

### 1. Least Privilege IAM

```yaml
provider:
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - s3:GetObject
            - s3:PutObject
          Resource: "arn:aws:s3:::${env:S3_BUCKET_NAME}/*"
        # Only grant what's needed
```

### 2. Environment Variable Encryption

```yaml
provider:
  environment:
    JWT_SECRET: ${ssm:/path/to/secret~true}  # Encrypted
```

### 3. API Gateway Authorization

```yaml
functions:
  main:
    events:
      - http:
          authorizer:
            type: COGNITO_USER_POOLS
            authorizerId: !Ref ApiGatewayAuthorizer
```

### 4. Enable AWS WAF

Protect API Gateway from common attacks:

```yaml
resources:
  Resources:
    WebACL:
      Type: AWS::WAFv2::WebACL
      Properties:
        Scope: REGIONAL
        DefaultAction:
          Allow: {}
        Rules:
          - Name: RateLimitRule
            Priority: 1
            Action:
              Block: {}
            Statement:
              RateBasedStatement:
                Limit: 2000
                AggregateKeyType: IP
```

## Performance Monitoring

### X-Ray Tracing

```yaml
provider:
  tracing:
    lambda: true
    apiGateway: true
```

### CloudWatch Alarms

```yaml
resources:
  Resources:
    ErrorAlarm:
      Type: AWS::CloudWatch::Alarm
      Properties:
        AlarmName: ${self:service}-${self:provider.stage}-errors
        MetricName: Errors
        Namespace: AWS/Lambda
        Statistic: Sum
        Period: 300
        EvaluationPeriods: 1
        Threshold: 10
        ComparisonOperator: GreaterThanThreshold
```

## Multi-Region Deployment

Deploy to multiple regions:

```bash
# Deploy to multiple regions
serverless deploy --stage prod --region us-east-1
serverless deploy --stage prod --region eu-west-1
serverless deploy --stage prod --region ap-southeast-1
```

Configure Route53 for geo-routing.

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy to Lambda

on:
  push:
    branches: [lambda]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lambda:deploy:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Disaster Recovery

### Backup Lambda Functions

```bash
# Download function code
aws lambda get-function \
  --function-name nestjs-template-api-prod-main \
  --query 'Code.Location' \
  --output text | xargs curl -o function.zip
```

### Version Control

Enable versioning:

```yaml
functions:
  main:
    versionFunctions: true
```

### Rollback

```bash
# Rollback to previous version
serverless rollback --timestamp <timestamp>
```
