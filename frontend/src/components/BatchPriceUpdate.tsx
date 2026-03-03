import { useState } from 'react';
import { Product } from '../types/index';

interface BatchPriceUpdateProps {
  products: Product[];
  onApply: (updates: {category?: string; adjustmentPercent: number; adjustmentType: 'multiply' | 'add'}) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function BatchPriceUpdate({ products, onApply, onCancel, isLoading }: BatchPriceUpdateProps) {
  const [adjustmentType, setAdjustmentType] = useState<'multiply' | 'add'>('multiply');
  const [adjustment, setAdjustment] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [errors, setErrors] = useState<string>('');

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const calculatePreview = () => {
    const adjustmentNum = parseFloat(adjustment);
    if (!adjustment || isNaN(adjustmentNum)) return null;

    const filtered = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    return filtered.map(p => ({
      name: p.name,
      oldPrice: p.price,
      newPrice: adjustmentType === 'multiply' 
        ? p.price * (adjustmentNum / 100)
        : p.price + adjustmentNum
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');

    if (!adjustment || isNaN(parseFloat(adjustment))) {
      setErrors('Please enter a valid adjustment value');
      return;
    }

    if (adjustmentType === 'multiply' && parseFloat(adjustment) <= 0) {
      setErrors('Multiplier percentage must be greater than 0');
      return;
    }

    try {
      await onApply({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        adjustmentPercent: parseFloat(adjustment),
        adjustmentType
      });
      setAdjustment('');
      setSelectedCategory('all');
    } catch (error) {
      setErrors('Error applying batch update');
    }
  };

  const preview = calculatePreview();
  const affectedCount = selectedCategory === 'all' 
    ? products.length 
    : products.filter(p => p.category === selectedCategory).length;

  return (
    <div className="form-overlay">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2>📊 Batch Price Update</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid var(--border-secondary)', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                background: 'var(--bg-tertiary)', 
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Products' : cat}
                </option>
              ))}
            </select>
            <small style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
              This will affect {affectedCount} product{affectedCount !== 1 ? 's' : ''}
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adjustmentType">Adjustment Type *</label>
              <select
                id="adjustmentType"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as 'multiply' | 'add')}
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '2px solid var(--border-secondary)', 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  background: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="multiply">% of Current Price</option>
                <option value="add">$ Fixed Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="adjustment">Value *</label>
              <input
                type="number"
                id="adjustment"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                placeholder={adjustmentType === 'multiply' ? '100' : '10.00'}
                step={adjustmentType === 'multiply' ? '1' : '0.01'}
                disabled={isLoading}
              />
            </div>
          </div>

          {errors && <div style={{ color: '#dc3545', marginBottom: '1rem', fontSize: '0.9rem' }}>{errors}</div>}

          {preview && preview.length > 0 && (
            <div style={{ 
              background: 'var(--bg-tertiary)', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--text-primary)' }}>
                Preview ({preview.length} products):
              </p>
              {preview.slice(0, 5).map((p, i) => (
                <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  <strong>{p.name}:</strong> ${p.oldPrice.toFixed(2)} → ${Math.max(0, p.newPrice).toFixed(2)}
                </div>
              ))}
              {preview.length > 5 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  ... and {preview.length - 5} more
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !adjustment || affectedCount === 0}
            >
              {isLoading ? 'Processing...' : `Update ${affectedCount} Product${affectedCount !== 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BatchPriceUpdate;
