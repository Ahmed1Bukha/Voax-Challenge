# Voax Challenge - Blob Storage API

A flexible Node.js/TypeScript API for blob storage with support for multiple storage backends including AWS S3, MongoDB database, and local file system storage.

## 🚀 Features

- **Multi-Storage Support**: Choose between AWS S3, MongoDB, or local file system storage
- **User Authentication**: Secure user registration and login with session management
- **Blob Management**: Create, retrieve, and manage binary data (blobs)
- **Activity Tracking**: Monitor blob operations and metadata
- **Type Safety**: Built with TypeScript for robust type checking
- **Input Validation**: Zod schema validation for all endpoints
- **Security**: Helmet for security headers, bcrypt for password hashing
- **Session Management**: Express sessions with MongoDB store

## 🏗️ Architecture

The project follows a clean, modular architecture:

```
src/
├── app.ts                 # Main application entry point
├── config/               # Configuration files
│   ├── config.ts         # Environment configuration
│   ├── database.ts       # MongoDB connection
│   └── passport.ts       # Passport.js authentication setup
├── controllers/          # Request handlers
│   ├── authController.ts # Authentication logic
│   ├── blobController.ts # Blob storage operations
│   └── activityController.ts # Activity tracking
├── middleware/           # Custom middleware
│   └── authMiddleware.ts # Authentication & validation
├── models/              # Data models (Zod schemas)
├── routes/v1/           # API routes
├── schema/              # Mongoose schemas
├── services/            # Business logic services
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with local strategy
- **Storage**: AWS S3, MongoDB, or Local File System
- **Validation**: Zod for schema validation
- **Security**: Helmet, bcrypt, express-session
- **Development**: Nodemon, ts-node

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- AWS S3 bucket (if using S3 storage)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Voax-Challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3000

   # Database
   MONGODB_URI=mongodb://localhost:27017/voax-challenge

   # Session
   SESSION_SECRET=your-super-secret-session-key

   # Storage Configuration
   STORAGE_TYPE=database  # Options: 'database', 's3', 'local'
   BUCKET=your-s3-bucket-name  # Required for S3 storage

   # AWS Configuration (Required for S3 storage)
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication Endpoints

#### Register User

```http
POST /v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout User

```http
POST /v1/auth/logout
```

### Blob Storage Endpoints

The blob endpoints change based on the configured storage type:

#### For Database Storage (`STORAGE_TYPE=database`)

**Create Blob**

```http
POST /v1/blobs
Content-Type: application/json

{
  "id": "unique-blob-id",
  "data": "base64-encoded-data"
}
```

**Get Blob**

```http
GET /v1/blobs/{id}
```

#### For S3 Storage (`STORAGE_TYPE=s3`)

**Create Blob**

```http
POST /v1/blobs
Content-Type: application/json

{
  "id": "unique-blob-id",
  "data": "base64-encoded-data"
}
```

**Get Blob**

```http
GET /v1/blobs/{id}
```

#### For Local Storage (`STORAGE_TYPE=local`)

**Create Blob**

```http
POST /v1/blobs?path=/custom/path
Content-Type: application/json

{
  "id": "unique-blob-id",
  "data": "base64-encoded-data"
}
```

**Get Blob**

```http
GET /v1/blobs/{id}?path=/custom/path
```

### Activity Endpoints

#### Get Blob Activity

```http
GET /v1/activity
```

## 🔧 Configuration

### Storage Types

The API supports three storage backends configured via the `STORAGE_TYPE` environment variable:

1. **Database** (`database`): Stores blobs directly in MongoDB
2. **S3** (`s3`): Stores blobs in AWS S3 bucket
3. **Local** (`local`): Stores blobs in the local file system

### Environment Variables

| Variable                | Description               | Required | Default   |
| ----------------------- | ------------------------- | -------- | --------- |
| `PORT`                  | Server port               | No       | 3000      |
| `MONGODB_URI`           | MongoDB connection string | Yes      | -         |
| `SESSION_SECRET`        | Session secret key        | Yes      | -         |
| `STORAGE_TYPE`          | Storage backend type      | Yes      | -         |
| `BUCKET`                | S3 bucket name            | For S3   | -         |
| `AWS_ACCESS_KEY_ID`     | AWS access key            | For S3   | -         |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key            | For S3   | -         |
| `AWS_REGION`            | AWS region                | For S3   | us-east-1 |

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Express sessions with MongoDB store
- **Input Validation**: Zod schema validation for all inputs
- **Security Headers**: Helmet middleware for security headers
- **Authentication Middleware**: Protected routes require authentication
- **CORS**: Cross-origin resource sharing configuration

## 🧪 Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Project Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and external service integrations
- **Models**: Zod schemas for data validation
- **Routes**: API endpoint definitions
- **Middleware**: Custom middleware for authentication and validation
- **Utils**: Helper functions and utilities

## 📝 Data Models

### User Model

```typescript
{
  email: string;
  password: string;
}
```

### Blob Model

```typescript
{
  id: string;
  data: string; // base64 encoded
  createdAt: Date;
  size?: number;
}
```

### Blob Metadata Model

```typescript
{
  id: string;
  storageType: "local" | "database" | "s3";
  metadata: {
    size: number;
    createdAt: Date;
  }
}
```

## 🚨 Error Handling

The API uses a centralized error handling system with consistent response formats:

```typescript
// Success Response
{
  success: true,
  data: any,
  message: string
}

// Error Response
{
  success: false,
  error: string,
  message: string,
  details?: any
}
```

## 🔄 Session Management

- Sessions are stored in MongoDB using `connect-mongo`
- Session duration: 24 hours
- Automatic session cleanup after 24 hours of inactivity
- Secure cookie configuration

## 📊 Monitoring

The application includes activity tracking for blob operations, allowing you to monitor:

- Blob creation and retrieval
- Storage type used
- Timestamps and metadata
- User activity patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This API is designed for development and testing purposes. For production use, ensure proper security configurations, environment variable management, and monitoring are in place.
