# Backend API Documentation

Complete API documentation for the Product Management System backend.

## Base URL
```
http://localhost:5000/api
```

## Response Format

All responses follow this format:

```json
{
  "success": true|false,
  "data": {...},
  "error": "error message if success is false",
  "message": "optional success message"
}
```

## Endpoints

### 1. GET /products
List products with pagination and optional search.

**Query Parameters:**
```
- limit: number (default: 10, max: 100) - Items per page
- offset: number (default: 0) - Number of items to skip
- search: string (optional) - Search by product name (case-insensitive)
```

**Example:**
```bash
GET /products?limit=10&offset=0
GET /products?limit=10&offset=20&search=laptop
```

**Response:**
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
    "total": 8,
    "limit": 10,
    "offset": 0
  }
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### 2. GET /products/:id
Get a single product by ID.

**Parameters:**
```
- id: number (required, path parameter)
```

**Example:**
```bash
GET /products/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro",
    "price": 1299.99,
    "stock": 15,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid product ID format
- `404`: Product not found
- `500`: Server error

---

### 3. POST /products
Create a new product.

**Request Body:**
```json
{
  "name": "string (required, non-empty)",
  "price": "number (required, >= 0)",
  "stock": "integer (required, >= 0)"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mechanical Keyboard",
    "price": 89.99,
    "stock": 25
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Mechanical Keyboard",
    "price": 89.99,
    "stock": 25,
    "created_at": "2024-01-15T14:20:00Z"
  },
  "message": "Product created successfully"
}
```

**Status Codes:**
- `201`: Created
- `400`: Validation error
- `500`: Server error

**Validation Errors:**
```
- Name: Required and cannot be empty
- Price: Must be a positive number
- Stock: Must be a non-negative integer
```

---

### 4. PUT /products/:id
Update an existing product.

**Parameters:**
```
- id: number (required, path parameter)
```

**Request Body (all fields optional):**
```json
{
  "name": "string (optional)",
  "price": "number (optional, >= 0)",
  "stock": "integer (optional, >= 0)"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro Max",
    "price": 1499.99
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro Max",
    "price": 1499.99,
    "stock": 15,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Product updated successfully"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid product ID or validation error
- `404`: Product not found
- `500`: Server error

---

### 5. DELETE /products/:id
Delete a product.

**Parameters:**
```
- id: number (required, path parameter)
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid product ID
- `404`: Product not found
- `500`: Server error

---

## Error Handling

### Common Error Responses

**Validation Error:**
```json
{
  "success": false,
  "error": "Name is required and cannot be empty; Price must be a positive number"
}
```

**Not Found:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**Server Error:**
```json
{
  "success": false,
  "error": "Failed to fetch products"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. In production, consider:
- Implementing request throttling
- Adding API key authentication
- Using services like AWS API Gateway

---

## Search Functionality

The search feature uses PostgreSQL's ILIKE operator for case-insensitive searching:

```sql
SELECT * FROM products WHERE name ILIKE '%search_term%'
```

- Case-insensitive
- Partial matching
- Searches entire name field

---

## Pagination Examples

**First page (10 items):**
```bash
GET /products?limit=10&offset=0
```

**Second page (10 items):**
```bash
GET /products?limit=10&offset=10
```

**Different page size (20 items):**
```bash
GET /products?limit=20&offset=0
```

**For calculating pagination:**
```
- Current Page: offset / limit + 1
- Total Pages: Math.ceil(total / limit)
- Has Next: offset + limit < total
- Has Previous: offset > 0
```

---

## Database Constraints

All data is validated at the database level:

```sql
-- Name: NOT NULL
-- Price: NOT NULL, CHECK (price >= 0)
-- Stock: NOT NULL, CHECK (stock >= 0)
```

---

## Performance

### Indexes
Database has the following indexes for optimization:

```sql
-- Full-text search on name
CREATE INDEX idx_products_name ON products USING GIN (to_tsvector('english', name));

-- Sorting by creation date
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

### Typical Response Times
- List products: 5-50ms
- Search products: 10-100ms
- Create product: 10-50ms
- Update product: 10-50ms
- Delete product: 10-50ms

---

## Testing the API

### Using Postman
1. Create a new collection
2. Add requests for each endpoint
3. Use variables for base_url: `{{base_url}}/api`
4. Set `base_url` to `http://localhost:5000`

### Using cURL Scripts
```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# List products
curl -s "$BASE_URL/products?limit=10" | jq .

# Search products
curl -s "$BASE_URL/products?search=laptop" | jq .

# Create product
curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"stock":5}' | jq .

# Update product
curl -s -X PUT "$BASE_URL/products/1" \
  -H "Content-Type: application/json" \
  -d '{"price":129.99}' | jq .

# Delete product
curl -s -X DELETE "$BASE_URL/products/1" | jq .
```

### Using Node.js/Fetch
```javascript
const API_URL = 'http://localhost:5000/api';

// List products
async function listProducts() {
  const response = await fetch(`${API_URL}/products?limit=10`);
  const data = await response.json();
  console.log(data);
}

// Create product
async function createProduct(name, price, stock) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, stock })
  });
  const data = await response.json();
  console.log(data);
}
```

---

## Best Practices

1. **Always validate input** on the client before sending
2. **Use appropriate HTTP methods**: GET (read), POST (create), PUT (update), DELETE (delete)
3. **Handle errors gracefully** - check `success` field in response
4. **Implement pagination** for large datasets
5. **Use search** instead of fetching all data
6. **Cache responses** when appropriate on the client
7. **Set timeouts** on API requests (5-10 seconds)

---

## Environment Variables

Required for backend operation:

```
DATABASE_URL=postgres://user:password@localhost:5432/product_management
PORT=5000
NODE_ENV=development|production
```

---

## Version

API Version: 1.0.0
Last Updated: January 2024
