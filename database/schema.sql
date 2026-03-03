-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INT NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Insert sample data (optional)
INSERT INTO products (name, price, stock) VALUES
('Laptop Pro', 1299.99, 15),
('Wireless Mouse', 29.99, 150),
('USB-C Cable', 12.99, 300),
('Mechanical Keyboard', 89.99, 45),
('4K Monitor', 349.99, 8),
('Webcam HD', 49.99, 60),
('HDMI Cable', 9.99, 200),
('Gaming Headset', 119.99, 30)
ON CONFLICT DO NOTHING;
