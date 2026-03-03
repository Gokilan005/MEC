# Frontend Development Guide

Complete guide for the React + TypeScript frontend application.

## Project Overview

The Product Management System frontend is a single-page application (SPA) built with:
- **React 18**: UI framework
- **TypeScript**: Type safety and better DX
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API communication

## Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ProductForm.tsx      # Add/Edit product form
│   │   ├── ProductList.tsx      # Products table with pagination
│   │   └── ProductTableRow.tsx  # Single row component
│   ├── services/
│   │   └── productService.ts    # API communication layer
│   ├── hooks/
│   │   └── useAsync.ts          # Custom async hook
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── helpers.ts           # Utility functions
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App styling
│   ├── index.css                # Global styling
│   └── main.tsx                 # Entry point
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

## Component Architecture

### App.tsx (Main Component)

**Responsibilities:**
- Managing global state (products, pagination, search, etc.)
- Coordinating API calls through the service layer
- Handling user interactions (add, edit, delete)
- Rendering main layout and child components

**Key State:**
```typescript
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
}
```

**Key Functions:**
```typescript
fetchProducts()          // Load products with pagination
handleSearch()           // Search functionality
handleAddProduct()       // Create new product
handleEditProduct()      // Update existing product
handleDeleteProduct()    // Delete with confirmation
handlePageChange()       // Pagination
```

### ProductList.tsx

**Responsibilities:**
- Displaying the product table
- Showing pagination controls
- Rendering empty state
- Loading indicator

**Props:**
```typescript
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
```

### ProductForm.tsx

**Responsibilities:**
- Form for creating/editing products
- Input validation
- Error display
- Submit handling

**Props:**
```typescript
interface ProductFormProps {
  product: Product | null;  // null for create, Product for edit
  onSubmit: (data: DTO, id?: number) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}
```

**Validation Rules:**
- Name: Required, non-empty string
- Price: Required, positive number
- Stock: Required, non-negative integer

### ProductTableRow.tsx

**Responsibilities:**
- Single product row rendering
- Action buttons (Edit, Delete)
- Stock level display with color coding

**Props:**
```typescript
interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}
```

## Service Layer (productService.ts)

Encapsulates all API communication with proper error handling:

```typescript
class ProductService {
  async getProducts(limit, offset, search?: string)
  async getProductById(id: number)
  async createProduct(product: CreateProductDTO)
  async updateProduct(id: number, product: UpdateProductDTO)
  async deleteProduct(id: number)
}
```

**Benefits:**
- Centralized API logic
- Easy to mock for testing
- Consistent error handling
- Type-safe requests and responses

## TypeScript Types

### Core Types (src/types/index.ts)

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: string;
}

interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
}

interface UpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
```

## Utility Functions (src/utils/helpers.ts)

```typescript
debounce(func, delay)       // Debounce function calls
formatPrice(price)           // Format as currency ($XXX.XX)
formatDate(date)             // Format date for display
```

## Custom Hooks (src/hooks/useAsync.ts)

**useAsync Hook:**
Manages async operations with states:

```typescript
const { execute, status, value, error } = useAsync(asyncFunction);

// status: 'idle' | 'pending' | 'success' | 'error'
```

## Styling System

### Color Scheme
```css
Primary: #667eea (purple)
Secondary: #764ba2 (dark purple)
Success: #28a745 (green)
Danger: #dc3545 (red)
Warning: #ffc107 (yellow)
Information: #17a2b8 (teal)
```

### CSS Classes

**Layout:**
- `.app`: Main container
- `.app-header`: Header section
- `.app-main`: Main content area

**Components:**
- `.btn`: Button styles
- `.form-overlay`: Modal overlay
- `.form-container`: Form wrapper
- `.product-list`: Product list container
- `.pagination`: Pagination controls

**States:**
- `.loading-container`: Loading state
- `.empty-state`: Empty result state
- `.error-banner`: Error message
- `.input-error`: Invalid input field

**Utilities:**
- `.table-container`: Scrollable table
- `.page-indicator`: Pagination info
- `.stock-badge`: Stock level indicator

## State Management Flow

```
App Component
├── State: products, loading, error, pagination, search
├── useEffect: Initial load on mount
├── fetchProducts(): API call
│   └── productService.getProducts()
├── handleSearch(): Search with debounce
├── handleAddProduct(): Create new product
├── handleEditProduct(): Update product
├── handleDeleteProduct(): Delete with confirmation
├── handlePageChange(): Navigate pages
└── Render Child Components
    ├── Controls: SearchBox, AddButton
    ├── ProductForm: Modal form
    └── ProductList: Table + Pagination
```

## API Integration

### Error Handling Strategy

```typescript
try {
  setState(prev => ({ ...prev, loading: true, error: null }));
  const result = await productService.getProducts(...);
  setState(prev => ({ ...prev, ...result, loading: false }));
} catch (err) {
  setState(prev => ({
    ...prev,
    error: err.message || 'Default error',
    loading: false
  }));
}
```

### Request Flow
1. User action (click, submit, etc.)
2. Handler function in App.tsx
3. Set loading state
4. Call service method
5. Update state with result or error
6. Component re-renders

## Performance Optimization

### Current Optimizations
1. **Debounced search**: Reduces API calls while typing
2. **Pagination**: Loads 10 items per page instead of all
3. **Component splitting**: Separate components for reusability
4. **Memoized callbacks**: useCallback prevents unnecessary re-renders

### Future Optimization Opportunities
1. Add `useMemo` for expensive calculations
2. Implement React.memo for pure components
3. Use virtualization for large lists
4. Add request caching layer
5. Implement pagination infinite scroll

## Development Workflow

### 1. Adding a New Feature

```typescript
// 1. Define types
interface NewFeature {
  // ...
}

// 2. Add service method
class ProductService {
  async newFeatureMethod() { }
}

// 3. Create component
function NewComponent() { }

// 4. Integrate in App.tsx
// 5. Add styling in App.css
// 6. Test thoroughly
```

### 2. Debugging

**Browser DevTools:**
- Network tab: Monitor API calls
- Console: Check for errors and logs
- React DevTools: Inspect component state and props
- Application tab: Check localStorage/sessionStorage

**VS Code Debugging:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

### 3. Testing Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('ProductForm', () => {
  test('renders form inputs', () => {
    render(<ProductForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  test('validates empty name', async () => {
    const { getByText } = render(<ProductForm />);
    fireEvent.click(getByText(/submit/i));
    // Check validation error
  });
});
```

## Environment Configuration

**Development:**
- API base URL: `http://localhost:5000/api`
- Set in vite.config.ts proxy

**Production:**
- Update API endpoint in productService
- Build with: `npm run build`
- Deploy dist folder

## Common Issues and Solutions

### CORS Error
**Problem:** API requests blocked
**Solution:** Ensure backend CORS is enabled

### Form Validation Not Working
**Problem:** Empty state not showing errors
**Solution:** Check validation logic and error state updates

### Pagination Reset on Search
**Problem:** Going to page 2, then searching shows page 1
**Solution:** This is by design - search resets to page 1, update if needed

### Slow API Calls
**Problem:** API responses take >1 second
**Solution:** 
- Check database indexes
- Implement request caching
- Optimize backend queries

## Build and Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Minified JavaScript
- Optimized assets
- Source maps for debugging

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## Essential VS Code Extensions

- ES7+ React/Redux/React Snippets
- Prettier - Code formatter
- Thunder Client or REST Client (for API testing)
- TypeScript Vue Plugin (if using Vue later)

## Next Steps

1. ✅ Understand component hierarchy
2. ✅ Review state management flow
3. ✅ Examine service layer
4. ✅ Study TypeScript types
5. ✅ Experiment with styling
6. ✅ Add new features (sorting, filtering, etc.)
7. ✅ Write unit tests
8. ✅ Deploy to production

Happy coding! 🚀
