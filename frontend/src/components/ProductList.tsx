import { Product } from '../types/index';
import ProductTableRow from './ProductTableRow';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

function ProductList({
  products,
  loading,
  currentPage,
  totalPages,
  total,
  onPageChange,
  onEdit,
  onDelete,
}: ProductListProps) {
  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found. Create one to get started!</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isLoading={loading}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="pagination-info">
              <p>
                Showing {products.length} of {total} products
              </p>
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="btn btn-secondary"
              >
                ← Previous
              </button>
              <span className="page-indicator">
                Page {currentPage + 1} of {totalPages || 1}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="btn btn-secondary"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
