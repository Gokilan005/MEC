import { Product } from '../types/index';
import { formatPrice, formatDate } from '../utils/helpers';

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

function ProductTableRow({ product, onEdit, onDelete, isLoading }: ProductTableRowProps) {
  return (
    <tr>
      <td className="cell-name"><strong>{product.name}</strong></td>
      <td className="cell-category" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.category}</td>
      <td className="cell-price">{formatPrice(product.price)}</td>
      <td className="cell-stock">
        <span className={`stock-badge ${product.stock <= 10 ? 'low' : 'normal'}`}>
          {product.stock} units
        </span>
      </td>
      <td className="cell-date">{formatDate(product.created_at)}</td>
      <td className="cell-actions">
        <button
          className="btn btn-sm btn-edit"
          onClick={() => onEdit(product)}
          disabled={isLoading}
          title="Edit product"
        >
          ✎ Edit
        </button>
        <button
          className="btn btn-sm btn-delete"
          onClick={() => onDelete(product.id)}
          disabled={isLoading}
          title="Delete product"
        >
          🗑 Delete
        </button>
      </td>
    </tr>
  );
}

export default ProductTableRow;
