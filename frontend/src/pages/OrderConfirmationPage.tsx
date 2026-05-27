import { useLocation, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Order } from '../types';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>No order found.</Typography>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main' }} />
        <Typography variant="h4" component="h1" data-testid="order-confirmation-heading" sx={{ mt: 2 }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thank you for your purchase.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
        <Typography variant="h6" data-testid="order-confirmation-order-id">
          {order.orderId}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {order.items.map(item => (
            <Box key={item.itemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography>{item.name} × {item.quantity}</Typography>
              <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Subtotal</Typography>
            <Typography>${order.subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Tax</Typography>
            <Typography>${order.tax.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">${order.total.toFixed(2)}</Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={() => navigate('/orders')}>
          View Order History
        </Button>
        <Button variant="contained" fullWidth onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}
