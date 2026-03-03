export interface StockHistory {
  id: number;
  product_id: number;
  old_stock: number;
  new_stock: number;
  change_reason: string;
  changed_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
  stock_history?: StockHistory[];
}

export interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
