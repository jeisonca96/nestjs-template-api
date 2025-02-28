# API Pagination & Filtering System

A complete system for advanced pagination and filtering in NestJS APIs, compatible with MongoDB.

## 📋 Table of Contents
- [Query Parameters](#-query-parameters)
- [Basic Examples](#-basic-examples)
- [Advanced Examples](#-advanced-examples)
- [Available Operators](#-available-operators)
- [Error Handling](#-error-handling)
- [Best Practices](#-best-practices)
- [Real-World Examples](#-real-world-examples)

---

## 🎯 Query Parameters

### Pagination
| Parameter   | Description                        | Default Value |
|------------|----------------------------------|--------------|
| `page`     | Page number                      | 1            |
| `limit`    | Items per page                   | 10           |
| `sortBy`   | Sorting field                    | createdAt    |
| `sortOrder` | Sorting direction (asc/desc)    | desc         |

### Filtering
```http
GET /v1/resource?filters={"field":{"operator":"value"}}
```

## 🧩 Basic Examples

1. Simple Filter
```http
GET /v1/users?filters={"email":{"eq":"user@domain.com"}}
```

2. Pagination with Sorting
```http
GET /v1/products?page=3&limit=20&sortBy=price&sortOrder=asc
```

3. Multiple Conditions
```http
GET /v1/orders?filters={
  "status":{"in":["shipped","delivered"]},
  "total":{"gt":100000}
}
```

4. Text Search
```http
GET /v1/articles?filters={
  "title":{"contains":"emergency"}
}
```

## 🚀 Advanced Examples

1. Nested Filter (3 levels)
```http
GET /v1/enterprises?filters={
  "and": [
    {"address.city":{"eq":"Bogotá"}},
    {
      "or": [
        {"employees":{"gte":100}},
        {
          "and": [
            {"category":{"in":["tech","finance"]}},
            {"funding":{"exists":true}}
          ]
        }
      ]
    }
  ]
}
```

2. Filtering in Object Arrays
```http
GET /v1/projects?filters={
  "team":{
    "elem_match":{
      "role":"developer",
      "experience":{"gte":3}
    }
  }
}
```

3. Complex Date Query
```http
GET /v1/logs?filters={
  "and":[
    {"timestamp":{"between":["2025-03-01T00:00:00Z","2025-03-15T23:59:59Z"]}},
    {
      "or":[
        {"severity":{"eq":"high"}},
        {"message":{"regex":"^CRITICAL:"}}
      ]
    }
  ]
}
```

## 🔧 Available Operators

| Operator     | Description                          | Example                           |
|-------------|----------------------------------|---------------------------------|
| `eq`        | Exact equality                    | `{ "age": { "eq": 25 } }` |
| `ne`        | Not equal                         | `{ "status": { "ne": "pending" } }` |
| `gt/gte`    | Greater than / greater or equal  | `{ "rating": { "gt": 4.5 } }` |
| `lt/lte`    | Less than / less or equal        | `{ "stock": { "lte": 50 } }` |
| `in/nin`    | In / Not in list                 | `{ "role": { "in": ["admin", "user"] } }` |
| `contains`  | Text contains (case insensitive) | `{ "title": { "contains": "urgent" } }` |
| `between`   | Range between values             | `{ "price": { "between": [10,100] } }` |
| `exists`    | Field existence                  | `{ "deletedAt": { "exists": false } }` |
| `array_contains` | Array contains element       | `{ "tags": { "array_contains": "sale" } }` |
| `elem_match` | Matches element in object array | `{ "comments": { "elem_match": { "user": "abc" } } }` |

## ⚠️ Error Handling

### Common Errors
```json
{
  "message": "operator must be one of...",
  "error": "Bad Request",
  "statusCode": 400
}
```
### Common Causes
- Unsupported operator: Use `like` instead of `contains`
- Incorrect data type: Send string for numerical operators
- Malformed JSON: Missing quotes or braces
- Excessive nesting: More than 5 levels deep

### Solution
```javascript
// Example of a valid filter
const filters = {
  or: [
    { "email": { "eq": "user@domain.com" } },
    { "phone": { "exists": true } }
  ]
};

// Correct encoding
const encoded = encodeURIComponent(JSON.stringify(filters));
```

## 🏆 Best Practices

### 1. Performance Indexing
```javascript
// MongoDB
 db.collection.createIndex({ "address.city": 1, "status": 1 });
```

### 2. Security
```typescript
// Filter sensitive fields
buildQuery(criteria, ['password', 'creditCard']);
```

### 3. Input Validation
```typescript
class Criterion {
  @IsEnum(FilterOperator)
  operator!: FilterOperator;
}
```

### 4. Comprehensive Testing
```bash
# Testing complex filters with curl
curl -G "http://api.domain.com/v1/data" \
--data-urlencode "filters=$(cat complex_filter.json | jq -c)"
```

## 🌍 Real-World Examples

### 1. E-commerce
```http
GET /v1/products?filters={
  "and":[
    {"price":{"between":[50000,200000]}},
    {"stock":{"gt":0}},
    {
      "or":[
        {"category":"electronics"},
        {"tags":{"array_contains":"promo"}}
      ]
    }
  ]
}&sortBy=rating&sortOrder=desc&page=1&limit=24
```

### 2. Ticketing System
```http
GET /v1/tickets?filters={
  "and":[
    {"status":{"nin":["closed","archived"]}},
    {
      "or":[
        {"priority":"high"},
        {"createdAt":{"gte":"2025-03-01"}}
      ]
    }
  ]
}&sortBy=createdAt&sortOrder=asc
```

## 📄 Response Structure
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 3,
    "perPage": 25,
    "totalPages": 6,
    "nextPage": 4,
    "prevPage": 2
  }
}
```

⬆️ [Back to top](#-table-of-contents)
