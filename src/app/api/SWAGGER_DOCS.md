# Wardrobe API Documentation

## Overview

The Wardrobe API provides endpoints for managing wardrobe items and user authentication. The API uses JWT tokens for authentication and supports image uploads for wardrobe items.

## Base URL

- Development: `http://localhost:3001`
- Swagger Documentation: `http://localhost:3001/api/docs`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Authentication Flow

1. Register or login to get an access token
2. Include the token in the Authorization header: `Bearer <your-token>`
3. Refresh tokens are stored as httpOnly cookies for security

## API Endpoints

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful"
}
```

#### POST /auth/login

Login with existing credentials.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### POST /auth/refresh

Refresh access token using the refresh token cookie.

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Tokens refreshed"
}
```

#### POST /auth/logout

Logout and clear refresh token cookie.

**Response:**

```json
{
  "message": "Logout successful"
}
```

#### GET /auth/me

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <your-token>
```

**Response:**

```json
{
  "user": {
    "id": "clm123456789",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Item Endpoints

All item endpoints require authentication.

#### POST /items

Create a new wardrobe item with image upload.

**Headers:**

```
Authorization: Bearer <your-token>
Content-Type: multipart/form-data
```

**Form Data:**

- `title` (required): Item name
- `category` (required): One of TOPS, BOTTOMS, SHOES, ACCESSORIES, OUTERWEAR
- `color` (optional): Item color
- `season` (optional): Season when item is worn
- `notes` (optional): Additional notes
- `image` (required): Image file (max 5MB, jpeg/jpg/png/webp)

**Response:**

```json
{
  "id": "clm123456789",
  "title": "Blue Cotton Shirt",
  "category": "TOPS",
  "color": "blue",
  "season": "summer",
  "notes": "Comfortable for casual wear",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/v123456789/item.jpg",
  "userId": "clm123456789",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /items

Get all items with optional filtering and pagination.

**Headers:**

```
Authorization: Bearer <your-token>
```

**Query Parameters:**

- `category` (optional): Filter by category
- `color` (optional): Filter by color
- `season` (optional): Filter by season
- `search` (optional): Search in title and notes
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "items": [
    {
      "id": "clm123456789",
      "title": "Blue Cotton Shirt",
      "category": "TOPS",
      "color": "blue",
      "season": "summer",
      "notes": "Comfortable for casual wear",
      "imageUrl": "https://res.cloudinary.com/example/image/upload/v123456789/item.jpg",
      "userId": "clm123456789",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

#### GET /items/category/:category

Get items by specific category.

**Headers:**

```
Authorization: Bearer <your-token>
```

**Parameters:**

- `category`: One of TOPS, BOTTOMS, SHOES, ACCESSORIES, OUTERWEAR

**Response:**

```json
[
  {
    "id": "clm123456789",
    "title": "Blue Cotton Shirt",
    "category": "TOPS",
    "color": "blue",
    "season": "summer",
    "notes": "Comfortable for casual wear",
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v123456789/item.jpg",
    "userId": "clm123456789",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /items/:id

Get a specific item by ID.

**Headers:**

```
Authorization: Bearer <your-token>
```

**Parameters:**

- `id`: Item ID

**Response:**

```json
{
  "id": "clm123456789",
  "title": "Blue Cotton Shirt",
  "category": "TOPS",
  "color": "blue",
  "season": "summer",
  "notes": "Comfortable for casual wear",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/v123456789/item.jpg",
  "userId": "clm123456789",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PATCH /items/:id

Update an existing item.

**Headers:**

```
Authorization: Bearer <your-token>
Content-Type: multipart/form-data
```

**Parameters:**

- `id`: Item ID

**Form Data (all optional):**

- `title`: Item name
- `category`: One of TOPS, BOTTOMS, SHOES, ACCESSORIES, OUTERWEAR
- `color`: Item color
- `season`: Season when item is worn
- `notes`: Additional notes
- `image`: New image file (max 5MB, jpeg/jpg/png/webp)

**Response:**

```json
{
  "id": "clm123456789",
  "title": "Updated Blue Cotton Shirt",
  "category": "TOPS",
  "color": "blue",
  "season": "summer",
  "notes": "Updated notes",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/v123456789/updated-item.jpg",
  "userId": "clm123456789",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### DELETE /items/:id

Delete an item.

**Headers:**

```
Authorization: Bearer <your-token>
```

**Parameters:**

- `id`: Item ID

**Response:**

```json
{
  "message": "Item deleted successfully"
}
```

## Error Responses

The API returns standard HTTP status codes and error messages:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Item not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "User already exists",
  "error": "Conflict"
}
```

## Data Models

### User

```typescript
{
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Item

```typescript
{
  id: string;
  title: string;
  category: 'TOPS' | 'BOTTOMS' | 'SHOES' | 'ACCESSORIES' | 'OUTERWEAR';
  color: string | null;
  season: string | null;
  notes: string | null;
  imageUrl: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AuthTokens

```typescript
{
  accessToken: string;
  refreshToken: string;
}
```

## File Upload Requirements

### Image Upload

- **Maximum file size**: 5MB
- **Supported formats**: JPEG, JPG, PNG, WebP
- **Field name**: `image`
- **Content-Type**: `multipart/form-data`

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended to implement it in production.

## CORS

CORS is enabled for the frontend URL specified in the environment variables.

## Environment Variables

Make sure to set the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `FRONTEND_URL`: Frontend application URL (for CORS)
- `PORT`: Server port (default: 3001)
