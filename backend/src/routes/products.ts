import { Router, Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  validateProductData,
} from '../db/products';
import { ApiResponse, Product, CreateProductDTO, UpdateProductDTO } from '../types/index';

const router = Router();

// GET /products - List all products with pagination and search
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;

    const result = await getAllProducts(limit, offset, search);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch products',
    };
    res.status(500).json(response);
  }
});

// GET /products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid product ID',
      };
      return res.status(400).json(response);
    }

    const product = await getProductById(id);

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch product',
    };
    res.status(500).json(response);
  }
});

// POST /products - Create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, stock } = req.body as CreateProductDTO;

    const validation = validateProductData({ name, price, stock });
    if (!validation.valid) {
      const response: ApiResponse<null> = {
        success: false,
        error: validation.errors.join('; '),
      };
      return res.status(400).json(response);
    }

    const product = await createProduct({ name, price, stock });

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
      message: 'Product created successfully',
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create product',
    };
    res.status(500).json(response);
  }
});

// PUT /products/:id - Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid product ID',
      };
      return res.status(400).json(response);
    }

    const updateData: UpdateProductDTO = req.body;

    const validation = validateProductData(updateData);
    if (!validation.valid) {
      const response: ApiResponse<null> = {
        success: false,
        error: validation.errors.join('; '),
      };
      return res.status(400).json(response);
    }

    const product = await updateProduct(id, updateData);

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
      message: 'Product updated successfully',
    };
    res.json(response);
  } catch (error) {
    console.error('Error updating product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update product',
    };
    res.status(500).json(response);
  }
});

// DELETE /products/:id - Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid product ID',
      };
      return res.status(400).json(response);
    }

    const success = await deleteProduct(id);

    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Product deleted successfully',
    };
    res.json(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete product',
    };
    res.status(500).json(response);
  }
});

export default router;
