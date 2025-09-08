# API Reference

This document provides a comprehensive reference for the Affiliate Portal API endpoints.

## Overview

The API follows RESTful conventions and uses JSON for data exchange. All endpoints return standardized response formats.

**Note**: User authentication is handled via **Server Actions**, not API routes. API routes are only used for external access with API keys.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

### API Key Authentication
All API endpoints require authentication via API key:

```http
x-api-key: ak_1234567890abcdef
```

### User Authentication (Server Actions)
User authentication is handled via **Server Actions**, not API routes:

- **Login**: `POST /actions/auth/login`
- **Register**: `POST /actions/auth/register`  
- **Logout**: `POST /actions/auth/logout`
- **Stop Impersonation**: `POST /actions/auth/stop-impersonation`

See [Authentication Documentation](./AUTHENTICATION.md) for details.

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

### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "name": ["Name is required"]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

## Endpoints

### Referral Management

#### Get Referral Links
```http
GET /api/referral/links
```

**Headers:**
```http
x-api-key: ak_1234567890abcdef
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10, max: 100)
- `status` (optional): Filter by status (`active`, `inactive`, `expired`)
- `campaignId` (optional): Filter by campaign ID

**Response:**
```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": "link_123",
        "code": "abc123",
        "campaignId": "campaign_456",
        "targetUrl": "https://brand.com/special-offer",
        "status": "active",
        "clickCount": 25,
        "conversionCount": 3,
        "createdAt": "2024-01-15T10:30:00Z",
        "expiresAt": "2024-02-15T10:30:00Z"
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

#### Get Referral Link by ID
```http
GET /api/referral/links/{id}
```

**Headers:**
```http
x-api-key: ak_1234567890abcdef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "link_123",
    "code": "abc123",
    "campaignId": "campaign_456",
    "targetUrl": "https://brand.com/special-offer",
    "status": "active",
    "clickCount": 25,
    "conversionCount": 3,
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-02-15T10:30:00Z",
    "campaign": {
      "id": "campaign_456",
      "name": "Summer Sale",
      "description": "Summer promotion campaign"
    }
  }
}
```

#### Generate Referral Link
```http
POST /api/referral/generate
```

**Headers:**
```http
x-api-key: ak_1234567890abcdef
Content-Type: application/json
```

**Request Body:**
```json
{
  "campaignId": "campaign_456",
  "targetUrl": "https://brand.com/special-offer",
  "expiresAt": "2024-02-15T10:30:00Z",
  "metadata": {
    "source": "email_campaign",
    "affiliateId": "affiliate_789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "link_123",
    "code": "abc123",
    "url": "https://yourapp.com/link/abc123",
    "campaignId": "campaign_456",
    "targetUrl": "https://brand.com/special-offer",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-02-15T10:30:00Z"
  }
}
```

#### Track Referral Click
```http
POST /api/referral/track
```

**Headers:**
```http
x-api-key: ak_1234567890abcdef
Content-Type: application/json
```

**Request Body:**
```json
{
  "linkCode": "abc123",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com",
  "subIds": {
    "utm_source": "email",
    "utm_campaign": "summer_sale"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://brand.com/special-offer?ref=abc123",
    "trackingId": "track_789",
    "clickId": "click_456"
  }
}
```

#### Get Referral Statistics
```http
GET /api/referral/stats
```

**Headers:**
```http
x-api-key: ak_1234567890abcdef
```

**Query Parameters:**
- `startDate` (optional): Start date for statistics (ISO 8601)
- `endDate` (optional): End date for statistics (ISO 8601)
- `granularity` (optional): Data granularity (`day`, `week`, `month`)
- `campaignId` (optional): Filter by campaign ID

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z"
    },
    "summary": {
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
        "revenue": 500.00,
        "commission": 25.00
      }
    ],
    "topLinks": [
      {
        "linkId": "link_123",
        "code": "abc123",
        "clicks": 150,
        "conversions": 8,
        "revenue": 1200.00
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
- `401` - Unauthorized (Invalid API key)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Common Error Responses

#### Invalid API Key
```json
{
  "success": false,
  "error": "Invalid API key",
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

#### Missing API Key
```json
{
  "success": false,
  "error": "API key required",
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

#### Rate Limited
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "details": {
    "limit": 100,
    "remaining": 0,
    "resetTime": "2024-01-15T11:00:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Referral endpoints**: 100 requests per minute
- **Statistics endpoints**: 20 requests per minute
- **Link generation**: 10 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Usage Examples

### JavaScript/TypeScript
```typescript
// Example usage with fetch
const response = await fetch('/api/referral/links', {
  method: 'GET',
  headers: {
    'x-api-key': 'ak_1234567890abcdef',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### cURL Examples
```bash
# Get referral links
curl -X GET "http://localhost:3000/api/referral/links" \
  -H "x-api-key: ak_1234567890abcdef"

# Generate referral link
curl -X POST "http://localhost:3000/api/referral/generate" \
  -H "x-api-key: ak_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"campaign_456","targetUrl":"https://brand.com/offer"}'

# Track referral click
curl -X POST "http://localhost:3000/api/referral/track" \
  -H "x-api-key: ak_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"linkCode":"abc123","userAgent":"Mozilla/5.0...","ipAddress":"192.168.1.1"}'
```

## API Key Management

### Generating API Keys
API keys are generated through the brand dashboard and stored in the brands table:

```typescript
// API key format
ak_1234567890abcdef

// Generated via brand dashboard
const apiKey = await generateApiKey(brandId)
```

### API Key Security
- **Store securely**: API keys should be stored securely and not exposed in client-side code
- **Rotate regularly**: Consider rotating API keys periodically
- **Monitor usage**: Track API key usage for security and billing purposes

## Support

For API support:
- Check the [Architecture Documentation](./ARCHITECTURE.md)
- Check the [Authentication Documentation](./AUTHENTICATION.md)
- Open an [issue](https://github.com/your-org/affiliate-portal/issues)
- Contact the development team
