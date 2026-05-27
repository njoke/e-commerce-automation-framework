import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CartItemComponent from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { useCart } from '../hooks/useCart';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, loading, updateItem, removeItem, total } = useCart();
  const { setItemCount } = useContext(CartContext);

  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  }, [cartItems, setItemCount]);

  if (loading) return <LoadingState />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <EmptyState
          message="Your cart is empty."
          testId="empty-cart-message"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      ) : (
        <Box>
          <Paper variant="outlined">
            {cartItems.map(item => (
              <CartItemComponent
                key={item.itemId}
                item={item}
                onUpdateQuantity={updateItem}
                onRemove={removeItem}
              />
            ))}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2, alignItems: 'center' }}>
            <Typography variant="h6" data-testid="cart-total-amount">
              Total: ${total.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              size="large"
              data-testid="cart-checkout-button"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
