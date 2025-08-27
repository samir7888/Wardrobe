# Wardrobe API Usage Guide

## Authentication

### Register

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Profile (Protected)

```bash
GET /auth/me
Authorization: Bearer <access_token>
```

### Refresh Token

```bash
POST /auth/refresh
# Refresh token is automatically sent via httpOnly cookie
```

## Items Management (All endpoints require authentication)

### Create Item

```bash
POST /items
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- title: "Blue Jeans"
- category: "BOTTOM"
- color: "Blue"
- season: "all"
- notes: "Comfortable everyday jeans"
- image: <file>
```

### Get All Items (with pagination and filters)

```bash
GET /items?page=1&limit=20&category=TOP&color=blue&season=summer&search=shirt
Authorization: Bearer <access_token>
```

### Get Item by ID

```bash
GET /items/:id
Authorization: Bearer <access_token>
```

### Get Items by Category

```bash
GET /items/category/TOP
Authorization: Bearer <access_token>
```

### Update Item

```bash
PATCH /items/:id
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- title: "Updated Title" (optional)
- category: "TOP" (optional)
- color: "Red" (optional)
- season: "winter" (optional)
- notes: "Updated notes" (optional)
- image: <file> (optional)
```

### Delete Item

```bash
DELETE /items/:id
Authorization: Bearer <access_token>
```

## Categories

- TOP
- BOTTOM
- OUTERWEAR
- FOOTWEAR
- ACCESSORY

## Seasons

- summer
- winter
- all

## File Upload Constraints

- Max file size: 5MB
- Allowed formats: JPEG, JPG, PNG, WebP
- Images are automatically optimized and converted to WebP format
- Thumbnails are generated automatically (300x300px)

## Response Examples

### Item Response

```json
{
  "id": "clx123...",
  "userId": "clx456...",
  "title": "Blue Jeans",
  "category": "BOTTOM",
  "color": "Blue",
  "season": "all",
  "notes": "Comfortable everyday jeans",
  "imageUrl": "https://res.cloudinary.com/...",
  "thumbnailUrl": "https://res.cloudinary.com/.../w_300,h_300,c_fill",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Items Response

```json
{
  "items": [...],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```
