import { useState, useContext } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ProductGrid from '../components/ProductGrid';
import LoadingState from '../components/LoadingState';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../hooks/useProducts';
import { addToCart } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [snack, setSnack] = useState(false);
  const { user } = useContext(AuthContext);
  const { setItemCount } = useContext(CartContext);

  const { products, loading, error } = useProducts({ search, category, sort });

  const handleAddToCart = async (productId: string) => {
    if (!user) return;
    const updated = await addToCart(user.id, productId, 1);
    if (Array.isArray(updated)) {
      const count = updated.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
      setItemCount(count);
      setSnack(true);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <SearchBar onSearch={setSearch} />
        <FilterPanel
          category={category}
          sort={sort}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />
      </Box>

      {loading && <LoadingState />}
      {error && <ErrorAlert message={error} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products found." testId="empty-products-message" />
      )}
      {!loading && !error && products.length > 0 && (
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      )}

      <Snackbar
        open={snack}
        autoHideDuration={2000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnack(false)}>
          Item added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
}
