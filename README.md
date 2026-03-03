# Product Management System - Full Stack

A complete full-stack Product Management System built with React + TypeScript (Frontend), Node.js + TypeScript (Backend), and PostgreSQL (Database).

## 📋 Project Structure

```
MEC/
├── frontend/          # React + TypeScript frontend application
├── backend/           # Node.js + TypeScript backend API
└── database/          # PostgreSQL database schema
```

## 🚀 Features

### Frontend Features
- ✅ Product List with pagination (10 items per page)
- ✅ Search products by name (case-insensitive)
- ✅ Add new products with form validation
- ✅ Edit existing products
- ✅ Delete products with confirmation popup
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states
- ✅ Error handling and display
- ✅ Stock level indicators (low/normal)
- ✅ Price formatting
- ✅ Modern UI with smooth transitions

### Backend Features
- ✅ RESTful API endpoints for CRUD operations
- ✅ PostgreSQL database with indexing
- ✅ Input validation on all endpoints
- ✅ Pagination with limit and offset
- ✅ Full-text search support
- ✅ Error handling and proper HTTP status codes
- ✅ CORS enabled
- ✅ TypeScript for type safety

### Database Features
- ✅ Products table with proper constraints
- ✅ Indexes for performance
- ✅ Timestamp tracking (created_at, updated_at)
- ✅ Data validation (CHECK constraints)

## 📊 Database Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INT NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create a new product |
| GET | `/api/products` | List products (pagination + search) |
| GET | `/api/products/:id` | Get a single product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Query Parameters
- `limit`: Number of products per page (default: 10, max: 100)
- `offset`: Number of products to skip (default: 0)
- `search`: Search term for product name (optional)

### Example Requests

```bash
# Get products with pagination
curl http://localhost:5000/api/products?limit=10&offset=0

# Search products
curl http://localhost:5000/api/products?search=laptop&limit=10

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"stock":5}'
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Database Setup

```bash
# Create database
createdb product_management

# Run schema
psql -U your_username -d product_management -f database/schema.sql

# Verify tables
psql -U your_username -d product_management -c "\dt"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update DATABASE_URL in .env
# Example: DATABASE_URL=postgres://user:password@localhost:5432/product_management

# Run in development
npm run dev

# Or build and run
npm run build
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
```

Frontend will run on `http://localhost:3000`

## 📱 Usage

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **View Products**: The product list loads automatically on page load
3. **Search**: Use the search box to find products by name (auto-debounced)
4. **Add Product**: Click "+ Add Product" and fill in the form
5. **Edit Product**: Click the "✎ Edit" button on any product row
6. **Delete Product**: Click the "🗑 Delete" button and confirm
7. **Pagination**: Use Previous/Next buttons to navigate pages

## 🔒 Form Validation

The application validates the following:
- **Product Name**: Required, cannot be empty
- **Price**: Required, must be a positive number, decimal allowed
- **Stock**: Required, must be a non-negative integer

## 🎨 UI/UX Features

- Modern gradient design with purple theme
- Smooth animations and transitions
- Loading spinners during API calls
- Error banners with dismissible option
- Stock level color coding (yellow for low < 10, green for normal)
- Responsive table with mobile optimization
- Modal form overlay for add/edit operations
- Disabled buttons during loading states

## 📦 Dependencies

### Frontend
- `react`: UI library
- `react-dom`: React DOM rendering
- `axios`: HTTP client
- `typescript`: Type safety
- `vite`: Build tool

### Backend
- `express`: Web framework
- `pg`: PostgreSQL driver
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `typescript`: Type safety
- `ts-node`: TypeScript execution

## 🚀 Production Deployment

### Backend Deployment (Example: Heroku)
```bash
# Build
npm run build

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
# Build
npm run build

# Deploy
vercel
```

Set the API endpoint in the frontend to your backend URL.

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgres://user:password@localhost:5432/product_management
PORT=5000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify database exists: `psql -l`

### CORS Errors
- Ensure backend CORS is enabled
- Check frontend API endpoint matches backend URL

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.ts

## 📚 Code Structure

### Frontend
```
src/
├── components/       # React components
├── services/        # API service layer
├── types/          # TypeScript interfaces
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

### Backend
```
src/
├── routes/         # API route handlers
├── db/            # Database connection and queries
├── types/         # TypeScript interfaces
└── index.ts       # Express app setup
```

## 🎯 Future Enhancements

- ✨ User authentication
- ✨ Product categories
- ✨ Image uploads
- ✨ Advanced filtering and sorting
- ✨ Export to CSV
- ✨ Bulk operations
- ✨ Real-time updates with WebSockets
- ✨ Product ratings and reviews
- ✨ Inventory history tracking

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Created as a full-stack learning project demonstrating:
- React + TypeScript frontend best practices
- Node.js + TypeScript backend architecture
- PostgreSQL database design
- RESTful API design
- Form validation and error handling
- Responsive UI design
