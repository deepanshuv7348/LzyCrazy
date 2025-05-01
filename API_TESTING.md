# API Testing Guide

This document provides detailed instructions and examples for testing all API endpoints of the Ad Platform Backend.

## Prerequisites

- Running backend server (default: http://localhost:5000)
- MongoDB connection

## Authentication

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Expected Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Expected Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Social Login

#### Google Login
```http
GET /api/auth/google
```
- This will redirect to Google OAuth page
- After successful authentication, you'll be redirected to the callback URL with a token

#### Facebook Login
```http
GET /api/auth/facebook
```
- This will redirect to Facebook OAuth page
- After successful authentication, you'll be redirected to the callback URL with a token

### Password Reset

#### Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

Expected Response (200):
```json
{
  "message": "Reset email sent"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "newpassword123"
}
```

Expected Response (200):
```json
{
  "message": "Password reset successful"
}
```

## Ads

### Create Ad
```http
POST /api/ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Test Ad",
  "description": "This is a test advertisement",
  "price": 100,
  "category": "Electronics",
  "location": "New York",
  "images": ["image1.jpg", "image2.jpg"]
}
```

Expected Response (201):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Test Ad",
  "description": "This is a test advertisement",
  "price": 100,
  "category": "Electronics",
  "location": "New York",
  "images": ["image1.jpg", "image2.jpg"],
  "user": "507f1f77bcf86cd799439012",
  "status": "active",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Get All Ads
```http
GET /api/ads
```

Query Parameters:
- `category`: Filter by category
- `location`: Filter by location
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `search`: Search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Example:
```http
GET /api/ads?category=Electronics&location=New%20York&minPrice=50&maxPrice=200&search=test&page=1&limit=10
```

### Get User's Ads
```http
GET /api/ads/my-ads
Authorization: Bearer <token>
```

### Get Single Ad
```http
GET /api/ads/:id
```

### Update Ad
```http
PUT /api/ads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Ad Title",
  "price": 150
}
```

### Delete Ad
```http
DELETE /api/ads/:id
Authorization: Bearer <token>
```

### Block/Unblock Ad (Admin Only)
```http
PATCH /api/ads/:id/block
Authorization: Bearer <admin_token>
```

## Admin

### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

### Block/Unblock User (Admin Only)
```http
PATCH /api/admin/users/:id/block
Authorization: Bearer <admin_token>
```

### Delete User (Admin Only)
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin_token>
```

### Get Platform Statistics (Admin Only)
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

Expected Response (200):
```json
{
  "totalUsers": 100,
  "activeUsers": 90,
  "blockedUsers": 10,
  "admins": 2
}
```

## Search

### Advanced Search
```http
GET /api/search
```

Query Parameters:
- `query`: Search term
- `category`: Filter by category
- `location`: Filter by location
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `sortBy`: Field to sort by
- `sortOrder`: Sort order (asc/desc)
- `page`: Page number
- `limit`: Items per page

Example:
```http
GET /api/search?query=test&category=Electronics&location=New%20York&minPrice=50&maxPrice=200&sortBy=price&sortOrder=desc&page=1&limit=10
```

### Get Search Suggestions
```http
GET /api/search/suggestions?query=test
```

### Get Search Filters
```http
GET /api/search/filters
```

Expected Response (200):
```json
{
  "categories": ["Electronics", "Furniture", "Vehicles"],
  "locations": ["New York", "Los Angeles", "Chicago"]
}
```

## Testing Tips

1. **Authentication**
   - Save the JWT token after login/signup
   - Use the token in the Authorization header for protected routes
   - Format: `Authorization: Bearer <token>`

2. **Error Handling**
   - Test invalid inputs
   - Test unauthorized access
   - Test expired tokens
   - Test blocked users

3. **Pagination**
   - Test different page sizes
   - Test out-of-range pages
   - Test sorting with different fields

4. **File Uploads**
   - Test image uploads for ads
   - Test file size limits
   - Test file type restrictions

5. **Rate Limiting**
   - Test multiple requests in quick succession
   - Test rate limit headers

## Common Response Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Testing Tools

1. **Postman Collection**
   - Import the Postman collection provided in the repository
   - Set up environment variables for tokens and base URL

2. **Automated Testing**
   - Run the test suite: `npm test`
   - View test coverage: `npm run test:coverage`

3. **Load Testing**
   - Use tools like Apache JMeter or Artillery
   - Test concurrent users and response times
   - Monitor server performance

## Troubleshooting

1. **Authentication Issues**
   - Check token expiration
   - Verify token format
   - Ensure proper header format

2. **Database Issues**
   - Check MongoDB connection
   - Verify database indexes
   - Check for duplicate entries

3. **File Upload Issues**
   - Check file size limits
   - Verify file types
   - Check storage permissions

4. **Rate Limiting Issues**
   - Check rate limit headers
   - Monitor request counts
   - Adjust rate limits if needed 