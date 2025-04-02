# News Impact Platform API Documentation

This document provides detailed information about the API endpoints available in the News Impact Platform.

## Base URL

All API routes are prefixed with `/api`.

## Authentication

All protected routes require a JWT token to be included in the request headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Register a New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "setupCompleted": false,
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    },
    "token": "jwt-token-string"
  }
}
```

### User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "setupCompleted": true,
      "businessDetails": {
        "industry": "Technology",
        "location": "New York"
      },
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    },
    "token": "jwt-token-string"
  }
}
```

### Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "setupCompleted": true,
    "businessDetails": {
      "industry": "Technology",
      "location": "New York"
    },
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

## User Management

### Update User Profile

**Endpoint:** `PUT /api/users/profile`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "password": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "setupCompleted": true,
    "businessDetails": {
      "industry": "Technology",
      "location": "New York"
    },
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T13:00:00Z"
  }
}
```

### Update Business Details

**Endpoint:** `PATCH /api/users/business-details`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "industry": "Healthcare",
  "location": "Boston"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "setupCompleted": true,
    "businessDetails": {
      "industry": "Healthcare",
      "location": "Boston"
    },
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T14:00:00Z"
  }
}
```

## News

### Get Curated News Feed

**Endpoint:** `GET /api/news`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `limit` (optional): Number of news articles to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "id": "news-uuid-1",
      "title": "News Article Title",
      "description": "Short description of the news article",
      "content": "Full content of the news article...",
      "sourceName": "News Source",
      "author": "Author Name",
      "url": "https://news-source.com/article",
      "urlToImage": "https://news-source.com/article/image.jpg",
      "publishedAt": "2023-05-01T10:00:00Z",
      "relevanceCategories": ["Technology", "Finance"],
      "impactScore": 75,
      "sentimentAnalysis": {
        "overall": "positive",
        "score": 0.8
      },
      "keywords": ["keyword1", "keyword2"],
      "createdAt": "2023-05-01T11:00:00Z"
    },
    {
      "id": "news-uuid-2",
      "title": "Another News Article",
      "description": "Short description...",
      "content": "Full content...",
      "sourceName": "Another Source",
      "author": "Another Author",
      "url": "https://another-source.com/article",
      "urlToImage": "https://another-source.com/article/image.jpg",
      "publishedAt": "2023-05-01T09:00:00Z",
      "relevanceCategories": ["Healthcare"],
      "impactScore": -25,
      "sentimentAnalysis": {
        "overall": "negative",
        "score": -0.3
      },
      "keywords": ["keyword3", "keyword4"],
      "createdAt": "2023-05-01T10:30:00Z"
    }
  ]
}
```

### Get News Article by ID

**Endpoint:** `GET /api/news/:id`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
- `id`: ID of the news article

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "news-uuid-1",
    "title": "News Article Title",
    "description": "Short description of the news article",
    "content": "Full content of the news article...",
    "sourceName": "News Source",
    "author": "Author Name",
    "url": "https://news-source.com/article",
    "urlToImage": "https://news-source.com/article/image.jpg",
    "publishedAt": "2023-05-01T10:00:00Z",
    "relevanceCategories": ["Technology", "Finance"],
    "impactScore": 75,
    "sentimentAnalysis": {
      "overall": "positive",
      "score": 0.8
    },
    "keywords": ["keyword1", "keyword2"],
    "createdAt": "2023-05-01T11:00:00Z"
  }
}
```

## Predictions

### Get Prediction for News Article

**Endpoint:** `GET /api/predictions/:newsId`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
- `newsId`: ID of the news article

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prediction-uuid",
    "newsArticleId": "news-uuid",
    "userId": "user-uuid",
    "industry": "Technology",
    "location": "New York",
    "overallImpact": "positive",
    "impactAreas": {
      "revenue": {
        "impact": "positive",
        "score": 8,
        "description": "Likely to increase revenue due to..."
      },
      "operations": {
        "impact": "neutral",
        "score": 0,
        "description": "No significant impact on operations"
      },
      "regulations": {
        "impact": "negative",
        "score": -3,
        "description": "Might face regulatory challenges..."
      }
    },
    "timeframes": {
      "shortTerm": {
        "impact": "positive",
        "score": 5,
        "description": "Immediate positive effects..."
      },
      "mediumTerm": {
        "impact": "positive",
        "score": 8,
        "description": "Growing impact over 3-6 months..."
      },
      "longTerm": {
        "impact": "positive",
        "score": 6,
        "description": "Sustained but diminishing returns..."
      }
    },
    "confidenceLevel": 85,
    "recommendations": [
      "Consider increasing investment in related technologies",
      "Prepare for potential regulatory changes",
      "Monitor competitor responses to this news"
    ],
    "createdAt": "2023-05-01T15:00:00Z"
  }
}
```

### Get Prediction History

**Endpoint:** `GET /api/predictions/history`

**Headers:** 
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `limit` (optional): Number of predictions to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "prediction-uuid-1",
      "newsArticleId": "news-uuid-1",
      "newsTitle": "News Article Title",
      "overallImpact": "positive",
      "industry": "Technology",
      "location": "New York",
      "confidenceLevel": 85,
      "createdAt": "2023-05-01T15:00:00Z"
    },
    {
      "id": "prediction-uuid-2",
      "newsArticleId": "news-uuid-2",
      "newsTitle": "Another News Article",
      "overallImpact": "negative",
      "industry": "Technology",
      "location": "New York",
      "confidenceLevel": 70,
      "createdAt": "2023-05-01T14:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (available in development mode)"
}
```

Common error status codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `404`: Not Found - Resource not found
- `500`: Server Error - Something went wrong on the server 