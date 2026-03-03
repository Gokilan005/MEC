# Backend Development Guide

Complete guide for the Node.js + TypeScript backend application.

## Project Overview

The Product Management System backend is built with:
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: Database
- **Node.js**: Runtime environment

## Directory Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── connection.ts        # Database connection pool
│   │   └── products.ts          # Product queries and validation
│   ├── routes/
│   │   └── products.ts          # Product endpoints
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── index.ts                 # Express app setup
├── dist/                        # Compiled JavaScript (generated)
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── .env.example                 # Environment variables template
```

## Core Modules

### 1. Database Connection (db/connection.ts)

**Responsibilities:**
- Create PostgreSQL connection pool
- Export query interface for making queries
- Handle connection errors

**Key Functions:**
```typescript
query(text: string, params?: any[])  // Execute SQL query
getClient()                           // Get client connection
```

**Features:**
- Connection pooling for performance
- Error handling on idle client
- Reusable query function

### 2. Product Models (db/products.ts)

**Core Functions:**

```typescript
validateProductData(data)
// Validates create/update product data
// Returns: { valid: boolean, errors: string[] }

getAllProducts(limit, offset, search?)
// Fetch products with pagination and search
// Returns: PaginatedResponse<Product>

getProductById(id)
// Get single product
// Returns: Product | null

createProduct(product)
// Insert new product
// Returns: Product

updateProduct(id, product)
// Update product fields
// Returns: Product | null

deleteProduct(id)
// Delete product by ID
// Returns: boolean (success)
```

**Validation Rules:**
```typescript
// Name: Required, non-empty string
if (!data.name || data.name.trim() === '') 
  → Error: "Name is required and cannot be empty"

// Price: Required, non-negative number
if (typeof data.price !== 'number' || data.price < 0)
  → Error: "Price must be a positive number"

// Stock: Required, non-negative integer
if (typeof data.stock !== 'number' || 
    data.stock < 0 || 
    !Number.isInteger(data.stock))
  → Error: "Stock must be a non-negative integer"
```

### 3. Route Handlers (routes/products.ts)

Implements REST API endpoints:

```typescript
router.get('/')              // List products
router.get('/:id')           // Get single product
router.post('/')             // Create product
router.put('/:id')           // Update product
router.delete('/:id')        // Delete product
```

**Error Handling Flow:**
1. Validate request parameters
2. Call database function
3. Check for errors
4. Return appropriate HTTP status code
5. Include error message if failed

### 4. Express App (index.ts)

**Setup:**
- CORS middleware
- JSON body parser
- Route registration
- Error handling middleware
- 404 handler

**Middleware Stack:**
```
Request → CORS → JSON Parser → Routes → 404 Handler → Error Handler → Response
```

## TypeScript Types (src/types/index.ts)

```typescript
// Domain model
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
}

// Request DTOs
interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
}

interface UpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
}

// API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination wrapper
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
```

## Database Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INT NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_name ON products USING GIN (to_tsvector('english', name));
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

**Column Constraints:**
- `id`: Auto-incrementing primary key
- `name`: Required text
- `price`: Required, non-negative decimal
- `stock`: Required, non-negative integer
- `created_at`: Auto-populated
- `updated_at`: Auto-populated

## Environment Configuration

### .env File
```env
DATABASE_URL=postgres://user:password@localhost:5432/product_management
PORT=5000
NODE_ENV=development
```

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment type (development/production)

## Request/Response Examples

### Create Product
**Request:**
```http
POST /api/products
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "price": 29.99,
  "stock": 100
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Wireless Mouse",
    "price": 29.99,
    "stock": 100,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Product created successfully"
}
```

### List Products with Search
**Request:**
```http
GET /api/products?limit=10&offset=0&search=laptop
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Laptop Pro",
        "price": 1299.99,
        "stock": 15,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### Update Product
**Request:**
```http
PUT /api/products/1
Content-Type: application/json

{
  "price": 1399.99
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro",
    "price": 1399.99,
    "stock": 15,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Product updated successfully"
}
```

### Error Response
**Request:**
```http
POST /api/products
Content-Type: application/json

{
  "name": "",
  "price": -100,
  "stock": "invalid"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Name is required and cannot be empty; Price must be a positive number; Stock must be a non-negative integer"
}
```

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | GET, PUT, DELETE successful |
| 201 | Created | POST successful |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database or server error |

## Development Workflow

### Running the Server

**Development Mode:**
```bash
npm run dev
# Uses ts-node for direct TypeScript execution
# Auto-reloads on file changes (if configured)
```

**Production Mode:**
```bash
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled JavaScript
```

### Adding a New Endpoint

**1. Add type definitions** (src/types/index.ts)
```typescript
interface NewResource {
  id: number;
  // fields...
}
```

**2. Add database functions** (src/db/newResource.ts)
```typescript
export const getNewResources = async () => {
  const result = await query('SELECT * FROM new_resources');
  return result.rows;
};
```

**3. Create routes** (src/routes/newResource.ts)
```typescript
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const result = await getNewResources();
  res.json({ success: true, data: result });
});

export default router;
```

**4. Register routes** (src/index.ts)
```typescript
import newResourceRouter from './routes/newResource';
app.use('/api/new-resources', newResourceRouter);
```

## Database Operations

### Connection Pool

The pg library creates a connection pool:
```typescript
const pool = new Pool({ connectionString });

// Query reuses connections from pool
const result = await pool.query('SELECT * FROM products');

// Automatically released back to pool
```

### Parameterized Queries

All queries use parameterized queries to prevent SQL injection:
```typescript
// ✅ SAFE - parameters are escaped
query('SELECT * FROM products WHERE id = $1', [id])

// ❌ UNSAFE - string concatenation
query(`SELECT * FROM products WHERE id = ${id}`)
```

### Transaction Support

For multiple operations that should succeed or fail together:
```typescript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // Multiple queries
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Error Handling Strategy

### Validation Layer
```typescript
const validation = validateProductData(data);
if (!validation.valid) {
  return res.status(400).json({
    success: false,
    error: validation.errors.join('; ')
  });
}
```

### Database Layer
```typescript
try {
  const result = await query(...);
  return result.rows[0] || null;
} catch (error) {
  console.error('Database error:', error);
  throw new Error('Database operation failed');
}
```

### Route Handler Layer
```typescript
try {
  const product = await getProductById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  res.json({ success: true, data: product });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Failed to fetch product'
  });
}
```

## Performance Optimization

### Current Optimizations
1. **Connection pooling**: Reuses database connections
2. **Database indexes**: Full-text search and creation date sorting
3. **Pagination**: Limits query results
4. **Query optimization**: Selects only needed columns
5. **Error logging**: Helps identify issues

### Future Optimizations
1. Add caching layer (Redis)
2. Implement query result caching
3. Add request logging and monitoring
4. Implement database query optimization
5. Add compression middleware

## Testing

### Manual Testing with cURL

```bash
# Server running on localhost:5000

# Health check
curl http://localhost:5000/api/health

# List products
curl http://localhost:5000/api/products

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":9.99,"stock":5}'

# Update product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":19.99}'

# Delete product
curl -X DELETE http://localhost:5000/api/products/1
```

### Automated Testing (Jest)

```bash
npm install --save-dev jest @types/jest ts-jest
```

```typescript
// products.test.ts
describe('Product Service', () => {
  test('validates product data', () => {
    const result = validateProductData({
      name: '',
      price: -100,
      stock: 'invalid'
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

## Logging

### Current Logging
- Console.error for errors
- Console.log for server startup

### Production Logging
```typescript
// Using winston or pino
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Server started');
logger.error('Database connection failed');
```

## Security Considerations

### Current Security
1. ✅ Parameterized queries (SQL injection prevention)
2. ✅ Input validation
3. ✅ CORS enabled
4. ✅ Data constraints at DB level

### Additional Security Measures
1. Add authentication (JWT)
2. Rate limiting
3. Input sanitization
4. HTTPS in production
5. Security headers (Helmet.js)
6. Request validation (express-validator)
7. Audit logging
8. Environment variable validation

## Deployment

### Heroku Deployment

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy backend
git push heroku main

# View logs
heroku logs --tail
```

### Environment Setup
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgres://user:pass@postgres:5432/db
    depends_on:
      - postgres
  postgres:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
```

## Monitoring and Debugging

### VS Code Debugging

**.vscode/launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### Health Endpoints

```typescript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Common Issues and Solutions

### Database Connection Failed
**Cause:** PostgreSQL not running or wrong connection string
**Solution:** 
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Create database if missing

### Port Already in Use
**Cause:** Another process using port 5000
**Solution:**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill`

### Slow Queries
**Cause:** Missing indexes or large result sets
**Solution:**
- Add indexes for searched columns
- Implement pagination
- Optimize database queries

### Memory Leaks
**Cause:** Database connections not released
**Solution:**
- Ensure connections are released
- Use connection pooling
- Monitor memory usage

## Performance Monitoring

```typescript
// Middleware to log request duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

## Next Steps

1. ✅ Understand project structure
2. ✅ Review database schema
3. ✅ Study route handlers
4. ✅ Examine validation logic
5. ✅ Test endpoints with cURL
6. ✅ Add authentication
7. ✅ Implement caching
8. ✅ Deploy to production

Happy coding! 🚀
