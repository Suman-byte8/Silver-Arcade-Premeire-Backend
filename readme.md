# Silver Arcade Premiere Backend

## User Registration API Documentation

### POST /api/users/register
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