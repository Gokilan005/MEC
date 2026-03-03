import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (mock database)
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: Date;
}

let products: Product[] = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, stock: 15, category: 'Electronics', created_at: new Date('2024-01-15') },
  { id: 2, name: 'Wireless Mouse', price: 29.99, stock: 150, category: 'Accessories', created_at: new Date('2024-01-14') },
  { id: 3, name: 'USB-C Cable', price: 12.99, stock: 300, category: 'Cables', created_at: new Date('2024-01-13') },
  { id: 4, name: 'Mechanical Keyboard', price: 89.99, stock: 45, category: 'Accessories', created_at: new Date('2024-01-12') },
  { id: 5, name: '4K Monitor', price: 349.99, stock: 8, category: 'Electronics', created_at: new Date('2024-01-11') },
  { id: 6, name: 'Webcam HD', price: 49.99, stock: 60, category: 'Electronics', created_at: new Date('2024-01-10') },
  { id: 7, name: 'HDMI Cable', price: 9.99, stock: 200, category: 'Cables', created_at: new Date('2024-01-09') },
  { id: 8, name: 'Gaming Headset', price: 119.99, stock: 30, category: 'Accessories', created_at: new Date('2024-01-08') },
];

let nextId = 9;

// Routes

// GET /products - List all products with pagination and search
app.get('/api/products', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;

    let filtered = products;
    if (search) {
      filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filtered.length;
    const data = filtered
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(offset, offset + limit);

    res.json({
      success: true,
      data: {
        data,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

// GET /products/:id - Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
});

// POST /products - Create new product
app.post('/api/products', (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const errors: string[] = [];

    if (!name || name.toString().trim() === '') {
      errors.push('Name is required and cannot be empty');
    }

    if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a positive number');
    }

    if (
      typeof stock !== 'number' ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      errors.push('Stock must be a non-negative integer');
    }

    if (!category || category.toString().trim() === '') {
      errors.push('Category is required and cannot be empty');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors.join('; '),
      });
    }

    const newProduct: Product = {
      id: nextId++,
      name,
      price,
      stock,
      category,
      created_at: new Date(),
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
});

// PUT /products/:id - Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const { name, price, stock, category } = req.body;
    const errors: string[] = [];

    if (name !== undefined && (!name || name.toString().trim() === '')) {
      errors.push('Name is required and cannot be empty');
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      errors.push('Price must be a positive number');
    }

    if (
      stock !== undefined &&
      (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))
    ) {
      errors.push('Stock must be a non-negative integer');
    }

    if (category !== undefined && (!category || category.toString().trim() === '')) {
      errors.push('Category is required and cannot be empty');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors.join('; '),
      });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
});

// DELETE /products/:id - Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    products.splice(index, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Using mock data (no database required)`);
});
