# Authentication API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. Login with Mobile Number
**POST** `/auth/login`

Initiates login process. Creates user if doesn't exist, generates OTP and sends it.

**Request Body:**
```json
{
  "mobile": "1234567890"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "mobile": "1234567890",
  "requiresProfileCompletion": false
}
```

---

### 2. Sign Up
**POST** `/auth/signup`

Creates a new user account with full details and sends OTP.

**Request Body:**
```json
{
  "mobile": "1234567890",
  "name": "John Doe",
  "language": "en",
  "address": "123 Main St, City, State"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created. OTP sent successfully",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "mobile": "1234567890",
  "name": "John Doe",
  "language": "en",
  "address": "123 Main St, City, State"
}
```

**Error Responses:**
- **400 Bad Request:** Missing required fields
- **500 Internal Server Error:** User already exists

---

### 3. Verify OTP
**POST** `/auth/verify-otp`

Verifies the OTP and completes authentication.

**Request Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "base64encodedtoken",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "mobile": "1234567890",
    "language": "en",
    "address": "123 Main St, City, State",
    "createdAt": "2026-02-28T10:00:00.000Z"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Missing required fields
- **500 Internal Server Error:** Invalid OTP, OTP expired, or already verified

---

### 4. Resend OTP
**POST** `/auth/resend-otp`

Resends OTP to the registered mobile number.

**Request Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "mobile": "1234567890"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Missing required fields
- **500 Internal Server Error:** User not found

---

## Users Endpoints

### 5. Get All Users
**GET** `/users`

Retrieves all users.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "mobile": "1234567890",
      "language": "en",
      "address": "123 Main St",
      "createdAt": "2026-02-28T10:00:00.000Z"
    }
  ]
}
```

---

### 6. Get User by ID
**GET** `/users/:id`

Retrieves a specific user by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "mobil"550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "mobile": "1234567890",
    "language": "en",
    "address": "123 Main St",
    "createdA
}
```

---

### 7. Create User
**POST** `/users`

Creates a new user directly (without OTP).

**Request Body:**
```json
{
  "mobile": "1234567890",
  "name": "John Doe",
  "name": "John Doe",
  "mobile": "1234567890",
  "language": "en",
  "address": "123 Main St"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "mobile": "1234567890",
    "language": "en",
    "address": "123 Main St",
    "createdAt": "2026-02-28T10:00:00.000Z
```

---

### 8. Update User
**PUT** `/users/:id`

Updates an existing user.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "mobile": "1234567890",
  "language": "es",
  "address": "456 New St"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe Updated",
    "mobile": "1234567890",
    "language": "es",
    "address": "456 New St",
    "createdAt": "2026-02-28T10:00:00.000Z"
  }
}
```

---

### 9. Delete User
**DELETE** `/users/:id`

Deletes a user.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {}
}
```

---

## Complaints Endpoints

### 10. Submit Complaint
**POST** `/complaints`

Submit a new complaint.

**Request Body:**
```json
{
  "apmc": "Mumbai APMC",
  "subject": "Price Issues",
  "description": "The prices are not fair and need to be reviewed",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "apmc": "Mumbai APMC",
    "subject": "Price Issues",
    "description": "The prices are not fair and need to be reviewed",
    "status": "PENDING",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-02-28T10:00:00.000Z",
    "updatedAt": "2026-02-28T10:00:00.000Z"
  }
}
```

---

### 11. Fetch User Complaints
**GET** `/complaints/user/:userId`

Get all complaints for a specific user.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "apmc": "Mumbai APMC",
      "subject": "Price Issues",
      "description": "The prices are not fair and need to be reviewed",
      "status": "PENDING",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-28T10:00:00.000Z",
      "updatedAt": "2026-02-28T10:00:00.000Z"
    }
  ]
}
```

---

### 12. Get All Complaints
**GET** `/complaints?status=PENDING`

Get all complaints with optional status filter (PENDING, IN_PROGRESS, RESOLVED, REJECTED).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "apmc": "Mumbai APMC",
      "subject": "Price Issues",
      "description": "The prices are not fair and need to be reviewed",
      "status": "PENDING",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "userName": "John Doe",
      "userMobile": "1234567890",
      "createdAt": "2026-02-28T10:00:00.000Z",
      "updatedAt": "2026-02-28T10:00:00.000Z"
    }
  ]
}
```

---

### 13. Get Complaint by ID
**GET** `/complaints/:id`

Get a specific complaint by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "apmc": "Mumbai APMC",
    "subject": "Price Issues",
    "description": "The prices are not fair and need to be reviewed",
    "status": "PENDING",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "John Doe",
    "userMobile": "1234567890",
    "createdAt": "2026-02-28T10:00:00.000Z",
    "updatedAt": "2026-02-28T10:00:00.000Z"
  }
}
```

---

### 14. Update Complaint Status
**PUT** `/complaints/:id/status`

Update the status of a complaint (Admin only).

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Valid statuses:** PENDING, IN_PROGRESS, RESOLVED, REJECTED

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Complaint status updated successfully",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "apmc": "Mumbai APMC",
    "subject": "Price Issues",
    "description": "The prices are not fair and need to be reviewed",
    "status": "IN_PROGRESS",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-02-28T10:00:00.000Z",
    "updatedAt": "2026-02-28T10:05:00.000Z"
  }
}
```

---

### 15. Get APMC Options
**GET** `/complaints/apmc/options`

Get list of all available APMC options.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440001",
      "name": "Mumbai APMC"
    },
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "name": "Pune APMC"
    },
    {
      "id": "750e8400-e29b-41d4-a716-446655440003",
      "name": "Nashik APMC"
    }
  ]
}
```

---

### 16. Get Subject Options
**GET** `/complaints/subject/options`

Get list of all available complaint subject options.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440001",
      "name": "Price Issues"
    },
    {
      "id": "850e8400-e29b-41d4-a716-446655440002",
      "name": "Quality of Produce"
    },
    {
      "id": "850e8400-e29b-41d4-a716-446655440003",
      "name": "Weighing Scale Problems"
    }
  ]
}
```

---

## News Articles Endpoints

### 17. Fetch News Articles
**GET** `/news?page=1&pageSize=10&search=farming&category=Technology`

Get news articles with pagination and optional filters.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 10)
- `search` (optional) - Search query for title, description, or content
- `category` (optional) - Filter by category

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440001",
      "title": "New Government Scheme for Farmers",
      "description": "Government announces new subsidy scheme to support small farmers",
      "content": "The government has announced a comprehensive support scheme...",
      "imageUrl": "https://example.com/image.jpg",
      "source": "Agriculture India",
      "author": "Rajesh Kumar",
      "publishedAt": "2026-02-28T10:00:00.000Z",
      "url": "https://example.com/news/government-scheme",
      "category": "Government Schemes",
      "tags": ["subsidy", "farmers", "government", "agriculture"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalItems": 50,
    "hasMore": true
  }
}
```

---

### 18. Search News Articles
**GET** `/news/search?q=organic&page=1&pageSize=10`

Search news articles by query.

**Query Parameters:**
- `q` (required) - Search query
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440002",
      "title": "Organic Farming: The Future of Agriculture",
      "description": "More farmers are switching to organic farming methods",
      "content": "Organic farming is gaining popularity...",
      "imageUrl": "https://example.com/organic.jpg",
      "source": "Farm Today",
      "author": "Priya Sharma",
      "publishedAt": "2026-02-27T10:00:00.000Z",
      "url": "https://example.com/news/organic-farming",
      "category": "Farming Techniques",
      "tags": ["organic", "sustainable", "farming"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalPages": 2,
    "totalItems": 15,
    "hasMore": true
  }
}
```

---

### 19. Fetch News by Category
**GET** `/news/category/Technology?page=1&pageSize=10`

Get news articles filtered by category.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440003",
      "title": "Technology in Agriculture: AI and IoT Solutions",
      "description": "How technology is transforming traditional farming",
      "content": "Artificial Intelligence and Internet of Things...",
      "imageUrl": "https://example.com/tech.jpg",
      "source": "Tech Farmer Magazine",
      "author": "Amit Patel",
      "publishedAt": "2026-02-26T10:00:00.000Z",
      "url": "https://example.com/news/agritech",
      "category": "Technology",
      "tags": ["technology", "AI", "IoT", "innovation"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "totalItems": 8,
    "hasMore": false
  }
}
```

---

### 20. Get News Article by ID
**GET** `/news/:id`

Get a specific news article by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440001",
    "title": "New Government Scheme for Farmers",
    "description": "Government announces new subsidy scheme to support small farmers",
    "content": "The government has announced a comprehensive support scheme for small and marginal farmers...",
    "imageUrl": "https://example.com/image.jpg",
    "source": "Agriculture India",
    "author": "Rajesh Kumar",
    "publishedAt": "2026-02-28T10:00:00.000Z",
    "url": "https://example.com/news/government-scheme",
    "category": "Government Schemes",
    "tags": ["subsidy", "farmers", "government", "agriculture"]
  }
}
```

---

### 21. Create News Article
**POST** `/news`

Create a new news article (Admin only).

**Request Body:**
```json
{
  "title": "Breaking: New Policy for Agricultural Exports",
  "description": "Government unveils new export policy to boost agricultural trade",
  "content": "In a major announcement today, the government has introduced a new policy aimed at boosting agricultural exports...",
  "imageUrl": "https://example.com/export-policy.jpg",
  "source": "Economic Times Agriculture",
  "author": "Vijay Singh",
  "url": "https://example.com/news/export-policy",
  "category": "Policy",
  "tags": ["export", "policy", "trade", "government"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "News article created successfully",
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440010",
    "title": "Breaking: New Policy for Agricultural Exports",
    "description": "Government unveils new export policy to boost agricultural trade",
    "content": "In a major announcement today...",
    "imageUrl": "https://example.com/export-policy.jpg",
    "source": "Economic Times Agriculture",
    "author": "Vijay Singh",
    "publishedAt": "2026-02-28T11:00:00.000Z",
    "url": "https://example.com/news/export-policy",
    "category": "Policy",
    "tags": ["export", "policy", "trade", "government"]
  }
}
```

---

### 22. Update News Article
**PUT** `/news/:id`

Update an existing news article (Admin only).

**Request Body:**
```json
{
  "title": "Updated: New Policy for Agricultural Exports",
  "description": "Government unveils revised export policy",
  "content": "Updated content...",
  "imageUrl": "https://example.com/updated-image.jpg",
  "source": "Economic Times Agriculture",
  "author": "Vijay Singh",
  "url": "https://example.com/news/export-policy-updated",
  "category": "Policy",
  "tags": ["export", "policy", "trade", "government", "updated"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "News article updated successfully",
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440010",
    "title": "Updated: New Policy for Agricultural Exports",
    "description": "Government unveils revised export policy",
    "content": "Updated content...",
    "imageUrl": "https://example.com/updated-image.jpg",
    "source": "Economic Times Agriculture",
    "author": "Vijay Singh",
    "publishedAt": "2026-02-28T11:00:00.000Z",
    "url": "https://example.com/news/export-policy-updated",
    "category": "Policy",
    "tags": ["export", "policy", "trade", "government", "updated"]
  }
}
```

---

### 23. Delete News Article
**DELETE** `/news/:id`

Delete a news article (Admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "News article deleted successfully",
  "data": {}
}
```

---

### 24. Get Available Categories
**GET** `/news/meta/categories`

Get list of all available news categories.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    "Farming Techniques",
    "Government Schemes",
    "Market News",
    "Policy",
    "Technology"
  ]
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Notes

1. **OTP in Development:** Currently, OTPs are logged to console. In production, integrate with an SMS service (Twilio, AWS SNS, etc.)

2. **Token Authentication:** The current implementation uses a simple base64 token. In production, use JWT (JSON Web Tokens) with proper expiration and refresh token mechanisms.

3. **OTP Expiry:** OTPs expire after 10 minutes.
 (UUID string), name, mobile (unique), language, address, created_at
   - OTP verifications table stores: user_id, mobile, otp, expires_at, is_verified, created_at
   - User ID is a UUID string format (e.g., "550e8400-e29b-41d4-a716-446655440000")
   - Users table stores: id, mobile (unique), name, email (unique), address, is_verified, timestamps
   - OTP verifications table stores: user_id, mobile, otp, expires_at, is_verified, created_at

5. **Complaint Status Values:**
   - `PENDING` - Initial status when complaint is submitted
   - `IN_PROGRESS` - Complaint is being worked on
   - `RESOLVED` - Complaint has been resolved
   - `REJECTED` - Complaint was rejected

6. **News Articles:**
   - Full-text search enabled on title, description, and content
   - Pagination support with customizable page size
   - Filter by category and search query
   - Tags stored as PostgreSQL array
   - Sorted by publishedAt in descending order (newest first)

7. **Security Considerations:**
   - Implement rate limiting for OTP requests
   - Add captcha for signup/login
   - Use HTTPS in production
   - Implement proper JWT authentication
   - Hash sensitive data
   - Add request validation middleware
