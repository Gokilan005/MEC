import axios, { AxiosInstance } from 'axios';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  PaginatedResponse,
  ApiResponse,
} from '../types/index';

const API_BASE_URL = '/api';

class ProductService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Get all products with pagination and search
  async getProducts(
    limit: number = 10,
    offset: number = 0,
    search?: string
  ): Promise<PaginatedResponse<Product>> {
    const params: Record<string, any> = { limit, offset };
    if (search) {
      params.search = search;
    }

    const response = await this.api.get<ApiResponse<PaginatedResponse<Product>>>(
      '/products',
      { params }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch products');
    }

    return response.data.data!;
  }

  // Get single product
  async getProductById(id: number): Promise<Product> {
    const response = await this.api.get<ApiResponse<Product>>(`/products/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch product');
    }

    return response.data.data!;
  }

  // Create new product
  async createProduct(product: CreateProductDTO): Promise<Product> {
    const response = await this.api.post<ApiResponse<Product>>('/products', product);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create product');
    }

    return response.data.data!;
  }

  // Update product
  async updateProduct(id: number, product: UpdateProductDTO): Promise<Product> {
    const response = await this.api.put<ApiResponse<Product>>(`/products/${id}`, product);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update product');
    }

    return response.data.data!;
  }

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    const response = await this.api.delete<ApiResponse<null>>(`/products/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete product');
    }
  }
}

export default new ProductService();
