# Silver Arcade Premiere Backend

## API Documentation

### 1. User Registration

#### POST /api/users/register
Register a new user in the system.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe123",
  "memberShipType": "premium",
  "memberShipStartDate": "2025-07-28",
  "memberShipEndDate": "2026-07-28",
  "phoneNumber": "9876543210",
  "whatsAppNumber": "9876543210",
  "email": "john.doe@example.com",
  "address": "123 Main Street, City, Country - 123456",
  "alternateNumber": "8765432109",
  "password": "Password123!"
}
```

#### Success Response (201 Created)
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "68878f18b7f869bdbe0acda9",
        "username": "johndoe123",
        "email": "john.doe@example.com",
        "role": "user"
    }
}
```

#### Error Response (400 Bad Request)
```json
{
    "message": "User already exists"
}
```

### Required Fields
- firstName: String
- lastName: String
- username: String (unique)
- memberShipType: String
- memberShipStartDate: Date (YYYY-MM-DD)
- memberShipEndDate: Date (YYYY-MM-DD)
- phoneNumber: String
- whatsAppNumber: String
- email: String (unique)
- address: String
- alternateNumber: String
- password: String

### Notes
- All fields are required
- Email must be unique and valid
- Username must be unique
- Passwords are securely hashed before storage

### 2. User Login

#### POST /api/users/login
Authenticate a user and receive a JWT token.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

#### Success Response (200 OK)
```json
{
    "message": "User logged in successfully",
    "user": {
        "id": "68878f18b7f869bdbe0acda9",
        "username": "johndoe123",
        "email": "john.doe@example.com",
        "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODc4ZjE4YjdmODY5YmRiZTBhY2RhOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUzNzE3MDIyLCJleHAiOjE3NTYzMDkwMjJ9.KcEjpCzZbr1miO9taJO6OzKC2slfmCFm7ozCyddc5aA"
}
```

#### Error Response (400 Bad Request)
```json
{
    "message": "Invalid credentials"
}
```

#### Required Fields
- email: String (valid email format)
- password: String

#### Notes
- Email must be registered in the system
- Password must match the stored hashed password
- Successful login returns a JWT token for authentication
- Token should be included in subsequent requests as Bearer token
- Token expires after 30 days

#### Example Usage
```bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email": "john.doe@example.com", "password": "Password123!"}'
```

### 3. Get User Profile

#### GET /api/users/profile/:userId
Get detailed user profile information. Requires authentication.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200 OK)
```json
{
    "success": true,
    "user": {
        "id": "68878f18b7f869bdbe0acda9",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe123",
        "email": "john.doe@example.com",
        "role": "user",
        "memberShipType": "premium",
        "memberShipStartDate": "2025-07-28T00:00:00.000Z",
        "memberShipEndDate": "2026-07-28T00:00:00.000Z",
        "phoneNumber": "9876543210",
        "whatsAppNumber": "9876543210",
        "address": "123 Main Street, City, Country - 123456",
        "alternateNumber": "8765432109"
    }
}
```

#### Error Response (404 Not Found)
```json
{
    "message": "User not found"
}
```

#### Error Response (401 Unauthorized)
```json
{
    "message": "Not authorized to access this route"
}
```

#### Notes
- Requires valid JWT token in Authorization header
- Returns all user fields except password
- User ID must match authenticated user's ID
- Dates are returned in ISO 8601 format

#### Example Usage
```bash
curl -X GET http://localhost:3000/api/users/profile/68878f18b7f869bdbe0acda9 \
-H "Authorization: Bearer <your_jwt_token>"
```