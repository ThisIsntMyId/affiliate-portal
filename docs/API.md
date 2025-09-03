# API Reference

This document provides a comprehensive reference for the Affiliate Portal API endpoints.

## Overview

The API follows RESTful conventions and uses JSON for data exchange. All endpoints return standardized response formats.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

### JWT Token
Most endpoints require authentication via JWT token:

```http
Authorization: Bearer <jwt_token>
```

### Cookie Authentication
For browser-based requests, authentication is handled via secure httpOnly cookies.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional error details
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

## Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "brand" // or "affiliate", "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "userType": "brand",
      "name": "Brand Name"
    },
    "token": "jwt_token_here"
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Brands

#### Get All Brands
```http
GET /api/brands
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `search` (optional): Search term for filtering

**Response:**
```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": "brand_123",
        "name": "Brand Name",
        "email": "brand@example.com",
        "website": "https://brand.com",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Get Brand by ID
```http
GET /api/brands/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brand_123",
    "name": "Brand Name",
    "email": "brand@example.com",
    "website": "https://brand.com",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "stats": {
      "totalAffiliates": 15,
      "totalRevenue": 12500.00,
      "conversionRate": 3.2
    }
  }
}
```

#### Create Brand
```http
POST /api/brands
```

**Request Body:**
```json
{
  "name": "Brand Name",
  "email": "brand@example.com",
  "website": "https://brand.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brand_123",
    "name": "Brand Name",
    "email": "brand@example.com",
    "website": "https://brand.com",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Brand
```http
PUT /api/brands/{id}
```

**Request Body:**
```json
{
  "name": "Updated Brand Name",
  "website": "https://updated-brand.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brand_123",
    "name": "Updated Brand Name",
    "email": "brand@example.com",
    "website": "https://updated-brand.com",
    "status": "active",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

#### Delete Brand
```http
DELETE /api/brands/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Brand deleted successfully"
}
```

### Affiliates

#### Get All Affiliates
```http
GET /api/affiliates
```

**Query Parameters:**
- `brandId` (optional): Filter by brand ID
- `status` (optional): Filter by status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "affiliates": [
      {
        "id": "affiliate_123",
        "name": "Affiliate Name",
        "email": "affiliate@example.com",
        "brandId": "brand_123",
        "status": "active",
        "commissionRate": 0.05,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### Create Affiliate
```http
POST /api/affiliates
```

**Request Body:**
```json
{
  "name": "Affiliate Name",
  "email": "affiliate@example.com",
  "brandId": "brand_123",
  "commissionRate": 0.05
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "affiliate_123",
    "name": "Affiliate Name",
    "email": "affiliate@example.com",
    "brandId": "brand_123",
    "status": "pending",
    "commissionRate": 0.05,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Referrals

#### Get Referral by Code
```http
GET /api/referral/{code}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "ref_123456",
    "affiliateId": "affiliate_123",
    "brandId": "brand_123",
    "targetUrl": "https://brand.com/special-offer",
    "isActive": true,
    "clickCount": 25,
    "conversionCount": 3
  }
}
```

#### Track Referral Click
```http
POST /api/referral/{code}/click
```

**Request Body:**
```json
{
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://brand.com/special-offer?ref=ref_123456",
    "trackingId": "track_789"
  }
}
```

### Analytics

#### Get Brand Analytics
```http
GET /api/analytics/brand/{brandId}
```

**Query Parameters:**
- `startDate` (optional): Start date for analytics (ISO 8601)
- `endDate` (optional): End date for analytics (ISO 8601)
- `granularity` (optional): Data granularity (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "brandId": "brand_123",
    "period": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z"
    },
    "metrics": {
      "totalClicks": 1250,
      "totalConversions": 45,
      "conversionRate": 3.6,
      "totalRevenue": 12500.00,
      "totalCommissions": 625.00
    },
    "trends": [
      {
        "date": "2024-01-01",
        "clicks": 45,
        "conversions": 2,
        "revenue": 500.00
      }
    ]
  }
}
```

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "name": ["Name is required"]
  }
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Analytics endpoints**: 20 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## SDKs and Libraries

### JavaScript/TypeScript
```typescript
// Example usage with fetch
const response = await fetch('/api/brands', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### cURL Examples
```bash
# Get all brands
curl -X GET "http://localhost:3000/api/brands" \
  -H "Authorization: Bearer your_jwt_token"

# Create a brand
curl -X POST "http://localhost:3000/api/brands" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Brand Name","email":"brand@example.com"}'
```

## Webhooks

### Referral Conversion Webhook
```http
POST /api/webhooks/referral-conversion
```

**Payload:**
```json
{
  "event": "referral.conversion",
  "data": {
    "referralCode": "ref_123456",
    "affiliateId": "affiliate_123",
    "brandId": "brand_123",
    "conversionValue": 100.00,
    "commission": 5.00,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Support

For API support:
- Check the [Architecture Documentation](./ARCHITECTURE.md)
- Open an [issue](https://github.com/your-org/affiliate-portal/issues)
- Contact the development team
