# Complete Setup and Installation Guide

Complete step-by-step guide to set up and run the entire Product Management System.

## Prerequisites Check

Before starting, verify you have:

### 1. Node.js and npm
```bash
node --version    # Should be v16 or higher
npm --version     # Should be v7 or higher

# If not installed, download from https://nodejs.org/
```

### 2. PostgreSQL
```bash
psql --version    # Should be v12 or higher

# If not installed:
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql
```

### 3. Git (optional)
```bash
git --version     # For version control
```

## Step 1: PostgreSQL Database Setup (5-10 minutes)

### 1.1 Start PostgreSQL Service
```bash
# Windows
# PostgreSQL should start automatically, or:
# Open Services and start "postgresql-x64-14" (or your version)

# Mac
brew services start postgresql

# Linux
sudo service postgresql start
psql --version
```

### 1.2 Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt (psql=#):
CREATE DATABASE product_management;
CREATE USER pma_user WITH PASSWORD 'pma_password';
GRANT ALL PRIVILEGES ON DATABASE product_management TO pma_user;
\q

# Verify database created
psql -U pma_user -d product_management -c "\dt"
```

### 1.3 Load Database Schema

```bash
# Navigate to project directory
cd d:/MEC

# Load schema into database
psql -U pma_user -d product_management -f database/schema.sql

# Verify tables and sample data
psql -U pma_user -d product_management -c "SELECT COUNT(*) FROM products;"
# Should show: 8 (sample products)
```

## Step 2: Backend Setup (5-10 minutes)

### 2.1 Install Backend Dependencies

```bash
# Navigate to backend directory
cd d:/MEC/backend

# Install npm packages
npm install

# Verify installation
npm list | head -20  # Show first 20 packages
```

### 2.2 Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env file with your database credentials
# Open in VS Code or notepad:
# DATABASE_URL=postgres://pma_user:pma_password@localhost:5432/product_management
# PORT=5000
# NODE_ENV=development
```

**Windows: Create .env file manually**
```bash
# If cp doesn't work on Windows
echo DATABASE_URL=postgres://pma_user:pma_password@localhost:5432/product_management > .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
```

### 2.3 Test Backend Connection

```bash
# Try to start backend
npm run dev

# You should see:
# Server running on http://localhost:5000
# ^C to stop
```

**Troubleshooting Backend:**
```bash
# If "port already in use"
# Change PORT in .env (use 5001, 5002, etc.)

# If "database connection error"
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# Verify database exists: psql -l

# If "module not found"
# Delete node_modules: rm -rf node_modules
# Reinstall: npm install
```

## Step 3: Frontend Setup (5-10 minutes)

### 3.1 Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd d:/MEC/frontend

# Install npm packages
npm install
```

### 3.2 Check Vite Configuration

The frontend is configured to proxy API requests to backend:
- Development: `http://localhost:5000`
- Production: Update API_BASE_URL in src/services/productService.ts

### 3.3 Test Frontend

```bash
# Start development server
npm run dev

# You should see:
# VITE v4.x.x ready in xxx ms
# http://localhost:3000
```

## Step 4: Full System Test

### 4.1 Terminal Setup

You'll need 3 terminal windows:

**Terminal 1 - PostgreSQL**
```bash
# Verify PostgreSQL is running (Windows Service)
psql -U pma_user -d product_management -c "SELECT COUNT(*) FROM products;"
# Should return: 8
```

**Terminal 2 - Backend**
```bash
cd d:/MEC/backend
npm run dev
# Should show: Server running on http://localhost:5000
```

**Terminal 3 - Frontend**
```bash
cd d:/MEC/frontend
npm run dev
# Should show: http://localhost:3000
```

### 4.2 Manual Testing

**In Browser (http://localhost:3000):**

1. ✅ Navigate to http://localhost:3000
2. ✅ You should see 8 sample products in a table
3. ✅ Click "Add Product" button
4. ✅ Fill form:
   - Name: "Test Product"
   - Price: 99.99
   - Stock: 5
5. ✅ Click "Create Product"
6. ✅ Product appears in table
7. ✅ Click "Edit" on any product
8. ✅ Change price and click "Update Product"
9. ✅ Click "Delete" confirmation
10. ✅ Product removed from table

### 4.3 API Testing with cURL

Open Terminal 4 and test API directly:

```bash
# Test 1: List products
curl http://localhost:5000/api/products

# Test 2: Search products
curl "http://localhost:5000/api/products?search=laptop"

# Test 3: Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"price\":19.99,\"stock\":10}"

# Test 4: Update product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d "{\"price\":29.99}"

# Test 5: Delete product
curl -X DELETE http://localhost:5000/api/products/1
```

## Step 5: Production Build

### 5.1 Backend Build

```bash
cd d:/MEC/backend

# Compile TypeScript to JavaScript
npm run build

# Run compiled backend
npm start

# Should show: Server running on http://localhost:5000
```

### 5.2 Frontend Build

```bash
cd d:/MEC/frontend

# Build for production
npm run build

# Creates optimized build in dist/
# Preview production build
npm run preview

# Opens http://localhost:4173 (preview)
```

## Common Issues and Solutions

### Issue 1: PostgreSQL Service Not Running

**Windows:**
```bash
# Check if running
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-14

# Or use Services app (services.msc)
```

**Mac:**
```bash
brew services list
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Issue 2: Cannot Connect to Database

```bash
# Test connection
psql -U pma_user -d product_management -c "SELECT 1"

# If "role pma_user does not exist":
psql -U postgres
CREATE USER pma_user WITH PASSWORD 'pma_password';
ALTER ROLE pma_user WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE product_management TO pma_user;

# If "database does not exist":
psql -U postgres
CREATE DATABASE product_management;
GRANT ALL PRIVILEGES ON DATABASE product_management TO pma_user;
```

### Issue 3: Port Already in Use (Backend)

```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port
# Edit backend/.env: PORT=5001
```

### Issue 4: npm Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Verify
npm list
```

### Issue 5: Frontend Can't Reach Backend

**Check:**
1. Backend is running on http://localhost:5000
2. Check browser DevTools Network tab
3. Verify vite.config.ts proxy settings
4. Check frontend/src/services/productService.ts API_BASE_URL

**Solutions:**
```bash
# Update productService.ts
# Change: const API_BASE_URL = '/api';
# To: const API_BASE_URL = 'http://localhost:5000/api';
```

## Performance Verification

### Measure Single Page Load

**Backend:**
```bash
# Should respond in < 100ms
time curl http://localhost:5000/api/products
```

**Frontend:**
```bash
# In browser DevTools:
# Performance > Record > Do action > Stop
# Should load in < 2 seconds
```

## Security Checklist for Production

- [ ] Change PostgreSQL password
- [ ] Use strong environment variables
- [ ] Enable HTTPS (SSL certificates)
- [ ] Add authentication
- [ ] Add rate limiting
- [ ] Set up logging
- [ ] Configure CORS properly
- [ ] Use environment-specific configs
- [ ] Enable database backups
- [ ] Set up monitoring

## Deployment Checklist

### Backend to Heroku
```bash
# 1. Create Heroku account and install CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=<provided by Heroku>

# 6. Build and deploy
npm run build
git push heroku main

# 7. View logs
heroku logs --tail
```

### Frontend to Vercel
```bash
# 1. Create Vercel account
# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
vercel

# 4. Update API endpoint
# Set VITE_API_URL environment variable in Vercel
```

## Quick Reference Commands

### Backend
```bash
# Development
cd backend && npm run dev

# Build
cd backend && npm run build

# Production
cd backend && npm start

# Watch mode
cd backend && npm run watch
```

### Frontend
```bash
# Development
cd frontend && npm run dev

# Build
cd frontend && npm run build

# Preview
cd frontend && npm run preview

# Lint
cd frontend && npm run lint
```

### Database
```bash
# Connect
psql -U pma_user -d product_management

# Run schema
psql -U pma_user -d product_management -f database/schema.sql

# Backup
pg_dump -U pma_user -d product_management -f backup.sql

# Restore
psql -U pma_user -d product_management -f backup.sql
```

## Verification Checklist

After installation, verify:

- [ ] PostgreSQL running and database created
- [ ] Backend starts on http://localhost:5000
- [ ] Frontend starts on http://localhost:3000
- [ ] Can see 8 products in the table
- [ ] Search works
- [ ] Can create a product
- [ ] Can edit a product
- [ ] Can delete a product
- [ ] Pagination works
- [ ] No console errors in browser
- [ ] No errors in backend terminal

## Documentation Files

Reference these files for detailed information:

| File | Purpose |
|------|---------|
| README.md | Project overview and features |
| QUICKSTART.md | Quick setup guide (this is shorter) |
| API_DOCUMENTATION.md | Complete API endpoint reference |
| BACKEND_GUIDE.md | Backend architecture and development |
| FRONTEND_GUIDE.md | Frontend architecture and development |
| DATABASE_SETUP.md | This file - complete installation guide |

## Getting Help

### Check Logs
```bash
# Backend logs (terminal where backend runs)
# Frontend logs (browser DevTools Console)
# Database logs (see PostgreSQL logs directory)
```

### Useful Debugging Commands
```bash
# Test backend
curl http://localhost:5000/api/products

# Test database
psql -U pma_user -d product_management -c "SELECT * FROM products LIMIT 1;"

# Check ports
netstat -plant | grep :5000
netstat -plant | grep :3000

# Check environment
echo $DATABASE_URL
echo $PORT
echo $NODE_ENV
```

## Next Steps After Setup

1. ✅ Familiarize yourself with the codebase
2. ✅ Read the BACKEND_GUIDE.md
3. ✅ Read the FRONTEND_GUIDE.md
4. ✅ Explore the code in src/ folders
5. ✅ Try modifying styles in App.css
6. ✅ Add new features (sorting, filtering, etc.)
7. ✅ Write unit tests
8. ✅ Deploy to production

## Summary

**Time to complete setup: 30-45 minutes**

After completing all steps:
- ✅ PostgreSQL database with 8 sample products
- ✅ Express.js backend API on port 5000
- ✅ React frontend on port 3000
- ✅ Full CRUD operations working
- ✅ Production build ready

Enjoy building! 🚀
