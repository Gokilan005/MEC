import './App.css';
import { useState, useCallback, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ThemeToggle from './components/ThemeToggle';
import BatchPriceUpdate from './components/BatchPriceUpdate';
import productService from './services/productService';
import { exportToCSV } from './utils/helpers';
import { Product, CreateProductDTO, UpdateProductDTO } from './types/index';

interface AppState {
  products: Product[];
  total: number;
  currentPage: number;
  limit: number;
  search: string;
  loading: boolean;
  error: string | null;
  showForm: boolean;
  editingProduct: Product | null;
  showBatchPriceUpdate: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    products: [],
    total: 0,
    currentPage: 0,
    limit: 10,
    search: '',
    loading: false,
    error: null,
    showForm: false,
    editingProduct: null,
    showBatchPriceUpdate: false,
  });

  // Fetch products
  const fetchProducts = useCallback(async (page: number = 0, search: string = '') => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const offset = page * state.limit;
      const result = await productService.getProducts(state.limit, offset, search);
      setState((prev) => ({
        ...prev,
        products: result.data,
        total: result.total,
        currentPage: page,
        loading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load products',
        loading: false,
      }));
    }
  }, [state.limit]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search with debounce
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setState((prev) => ({ ...prev, search: searchTerm }));
      fetchProducts(0, searchTerm);
    },
    [fetchProducts]
  );

  // Handle add product
  const handleAddProduct = async (data: CreateProductDTO) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await productService.createProduct(data);
      setState((prev) => ({ ...prev, showForm: false, loading: false }));
      await fetchProducts(state.currentPage, state.search);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to add product',
        loading: false,
      }));
    }
  };

  // Handle edit product
  const handleEditProduct = async (id: number, data: UpdateProductDTO) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await productService.updateProduct(id, data);
      setState((prev) => ({ ...prev, editingProduct: null, loading: false }));
      await fetchProducts(state.currentPage, state.search);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to update product',
        loading: false,
      }));
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true }));
      await productService.deleteProduct(id);
      setState((prev) => ({ ...prev, loading: false }));
      await fetchProducts(state.currentPage, state.search);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to delete product',
        loading: false,
      }));
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, state.search);
  };

  // Close form
  const handleCloseForm = () => {
    setState((prev) => ({ ...prev, showForm: false, editingProduct: null }));
  };

  // Open form for editing
  const handleOpenEditForm = (product: Product) => {
    setState((prev) => ({ ...prev, showForm: true, editingProduct: product }));
  };

  // Handle batch price update
  const handleBatchPriceUpdate = async (options: {
    category?: string;
    adjustmentPercent: number;
    adjustmentType: 'multiply' | 'add';
  }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const updates: UpdateProductDTO[] = [];
      
      state.products.forEach((product) => {
        if (options.category && product.category !== options.category) return;
        
        let newPrice = product.price;
        if (options.adjustmentType === 'multiply') {
          newPrice = product.price * (options.adjustmentPercent / 100);
        } else {
          newPrice = product.price + options.adjustmentPercent;
        }
        
        updates.push({
          price: Math.max(0, newPrice),
        });
      });

      // Apply updates sequentially
      const filteredProducts = options.category
        ? state.products.filter(p => p.category === options.category)
        : state.products;

      for (let i = 0; i < filteredProducts.length; i++) {
        await productService.updateProduct(filteredProducts[i].id, updates[i] || {});
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        showBatchPriceUpdate: false,
      }));
      await fetchProducts(state.currentPage, state.search);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to update prices',
        loading: false,
      }));
    }
  };

  const totalPages = Math.ceil(state.total / state.limit);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 Product Management System</h1>
        <ThemeToggle />
      </header>

      <main className="app-main">
        {state.error && (
          <div className="error-banner">
            <span>{state.error}</span>
            <button onClick={() => setState((prev) => ({ ...prev, error: null }))}>×</button>
          </div>
        )}

        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products by name..."
              value={state.search}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={state.loading}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setState((prev) => ({ ...prev, showForm: true }))}
            disabled={state.loading}
          >
            + Add Product
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => exportToCSV(state.products, `products_${new Date().toISOString().split('T')[0]}.csv`)}
            disabled={state.loading || state.products.length === 0}
            title="Export all products to CSV"
          >
            📥 Export CSV
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setState((prev) => ({ ...prev, showBatchPriceUpdate: true }))}
            disabled={state.loading || state.products.length === 0}
            title="Batch update product prices"
          >
            🏷️ Batch Prices
          </button>
        </div>

        {state.showForm && (
          <ProductForm
            product={state.editingProduct}
            onSubmit={(data: CreateProductDTO | UpdateProductDTO, id?: number) => {
              if (state.editingProduct && id) {
                return handleEditProduct(id, data as UpdateProductDTO);
              }
              return handleAddProduct(data as CreateProductDTO);
            }}
            onCancel={handleCloseForm}
            isLoading={state.loading}
          />
        )}

        {state.showBatchPriceUpdate && (
          <BatchPriceUpdate
            products={state.products}
            onApply={handleBatchPriceUpdate}
            onCancel={() => setState((prev) => ({ ...prev, showBatchPriceUpdate: false }))}
            isLoading={state.loading}
          />
        )}

        <ProductList
          products={state.products}
          loading={state.loading}
          currentPage={state.currentPage}
          totalPages={totalPages}
          total={state.total}
          onPageChange={handlePageChange}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteProduct}
        />
      </main>
    </div>
  );
}

export default App;
