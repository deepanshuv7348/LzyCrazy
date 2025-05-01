# Ad Platform Backend API

A complete backend API for an advertisement platform built with Express, Node.js, and MongoDB.

## Features

- User Authentication (Signup, Login, Password Reset)
- Social Authentication (Google, Facebook)
- Admin Panel (User Management, Block/Unblock Users)
- Ad Management (Create, Edit, Delete, Block Ads)
- Advanced Search Functionality
- Email Notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Google OAuth credentials
- Facebook OAuth credentials

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/ad_platform
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   CLIENT_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Facebook OAuth
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Login with Google
- `GET /api/auth/facebook` - Login with Facebook
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Ads

- `GET /api/ads` - Get all ads (with filters)
- `GET /api/ads/my-ads` - Get user's ads
- `GET /api/ads/:id` - Get single ad
- `POST /api/ads` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad
- `PATCH /api/ads/:id/block` - Block/unblock ad (admin only)

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/block` - Block/unblock user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

### Search

- `GET /api/search` - Advanced search with filters
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/filters` - Get available search filters

## Social Authentication Setup

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)
7. Copy the Client ID and Client Secret to your `.env` file

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add Facebook Login product
4. Configure OAuth settings:
   - Add Valid OAuth Redirect URIs:
     - `http://localhost:5000/api/auth/facebook/callback` (development)
     - `https://your-domain.com/api/auth/facebook/callback` (production)
5. Copy the App ID and App Secret to your `.env` file

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS enabled
- Rate limiting (to be implemented)
- OAuth 2.0 for social authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 