import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getProductById, addToCart } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import type { Product } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorAlert from '../components/ErrorAlert';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setItemCount } = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((data: Product) => {
        if (data.error) setError(data.error);
        else setProduct(data);
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user || !product) return;
    const updated = await addToCart(user.id, product.id, 1);
    if (Array.isArray(updated)) {
      const count = updated.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
      setItemCount(count);
      setSnack(true);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return (
    <Container sx={{ py: 4 }}>
      <ErrorAlert message={error} />
      <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>Back to Products</Button>
    </Container>
  );
  if (!product) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/products')} sx={{ mb: 2 }}>
        ← Back to Products
      </Button>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '0 0 300px' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Rating: ⭐ {product.rating}/5
          </Typography>
          {product.inStock
            ? <Chip label="In Stock" color="success" sx={{ mb: 2 }} />
            : <Chip label="Out of Stock" color="error" sx={{ mb: 2 }} />
          }
          <Box>
            <Button
              variant="contained"
              size="large"
              disabled={!product.inStock}
              data-testid="product-add-to-cart-button"
              aria-label={`Add ${product.name} to cart`}
              onClick={handleAddToCart}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)}>
        <Alert severity="success">Item added to cart!</Alert>
      </Snackbar>
    </Container>
  );
}
