# QUICK START GUIDE

Follow these steps to get the application running locally:

## Step 1: PostgreSQL Setup (5 minutes)

```bash
# Create the database
createdb product_management

# Connect and run schema
psql -U your_username -d product_management -f schema.sql

# Verify (should show "products" table)
psql -U your_username -d product_management -c "\dt"
```

## Step 2: Backend Setup (3 minutes)

```bash
cd backend/

# Install dependencies
npm install

# Create .env file and update DATABASE_URL
cp .env.example .env
# Edit .env and set: DATABASE_URL=postgres://username:password@localhost:5432/product_management

# Start backend
npm run dev
# Should see: "Server running on http://localhost:5000"
```

## Step 3: Frontend Setup (3 minutes)

```bash
cd frontend/

# Install dependencies
npm install

# Start frontend
npm run dev
# Should see: "VITE vx.x.x ready in xxx ms"
# Open http://localhost:3000
```

## Step 4: Verify Everything Works

1. Open http://localhost:3000 in your browser
2. You should see the Product Management System with sample data
3. Try searching, adding, editing, or deleting a product
4. Check pagination controls at the bottom

## Troubleshooting

**Backend won't start:**
- Ensure PostgreSQL is running: `psql -U your_username -d postgres`
- Check DATABASE_URL in backend/.env
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Frontend won't load:**
- Ensure backend is running on port 5000
- Check browser console for errors (F12)
- Clear cache: Ctrl+Shift+Delete in Chrome

**Database connection error:**
- Verify PostgreSQL is running
- Check credentials in DATABASE_URL
- Create database if it doesn't exist: `createdb product_management`

## Commands Reference

### Backend
```bash
npm run dev      # Development mode (auto-reload)
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled code
npm run watch    # Watch TypeScript changes
```

### Frontend
```bash
npm run dev      # Development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## File Structure at a Glance

```
MEC/
├── backend/
│   ├── src/
│   │   ├── db/       (database queries)
│   │   ├── routes/   (API endpoints)
│   │   └── types/    (TypeScript types)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
└── database/
    └── schema.sql
```

## API Testing with cURL

```bash
# List all products
curl http://localhost:5000/api/products

# Search for products
curl "http://localhost:5000/api/products?search=laptop"

# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product","price":29.99,"stock":10}'

# Update a product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","price":39.99}'

# Delete a product
curl -X DELETE http://localhost:5000/api/products/1
```

## Sample Data

After running schema.sql, the database includes:
- Laptop Pro ($1,299.99) - 15 units
- Wireless Mouse ($29.99) - 150 units
- USB-C Cable ($12.99) - 300 units
- Mechanical Keyboard ($89.99) - 45 units
- 4K Monitor ($349.99) - 8 units
- Webcam HD ($49.99) - 60 units
- HDMI Cable ($9.99) - 200 units
- Gaming Headset ($119.99) - 30 units

## Next Steps

1. ✅ Explore the UI - try all CRUD operations
2. ✅ Check the browser DevTools Network tab to see API calls
3. ✅ Modify the styling in frontend/src/App.css
4. ✅ Add more features or customize the code
5. ✅ Read README.md for detailed documentation

Enjoy! 🚀
