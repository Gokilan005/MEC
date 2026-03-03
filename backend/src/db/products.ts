import { query } from '../db/connection';
import { Product, CreateProductDTO, UpdateProductDTO, PaginatedResponse } from '../types/index';

export const validateProductData = (
  data: CreateProductDTO | UpdateProductDTO
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
    errors.push('Name is required and cannot be empty');
  }

  if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
    errors.push('Price must be a positive number');
  }

  if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0 || !Number.isInteger(data.stock))) {
    errors.push('Stock must be a non-negative integer');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const getAllProducts = async (
  limit: number = 10,
  offset: number = 0,
  search?: string
): Promise<PaginatedResponse<Product>> => {
  let whereClause = '';
  const params: any[] = [];

  if (search) {
    whereClause = 'WHERE name ILIKE $1';
    params.push(`%${search}%`);
  }

  const countResult = await query(`SELECT COUNT(*) as total FROM products ${whereClause}`, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const queryText = `
    SELECT id, name, price, stock, created_at 
    FROM products 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const result = await query(queryText, [...params, limit, offset]);

  return {
    data: result.rows,
    total,
    limit,
    offset,
  };
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createProduct = async (product: CreateProductDTO): Promise<Product> => {
  const { name, price, stock } = product;
  const result = await query(
    'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
    [name, price, stock]
  );
  return result.rows[0];
};

export const updateProduct = async (id: number, product: UpdateProductDTO): Promise<Product | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (product.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(product.name);
  }

  if (product.price !== undefined) {
    fields.push(`price = $${paramIndex++}`);
    values.push(product.price);
  }

  if (product.stock !== undefined) {
    fields.push(`stock = $${paramIndex++}`);
    values.push(product.stock);
  }

  if (fields.length === 0) {
    return getProductById(id);
  }

  values.push(id);

  const result = await query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM products WHERE id = $1', [id]);
  return result.rowCount! > 0;
};
