export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
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
