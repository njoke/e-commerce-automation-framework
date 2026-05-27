import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import type { CartItem } from '../types';

interface Props {
  items: CartItem[];
}

export default function OrderSummary({ items }: Props) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      {items.map(item => (
        <Box key={item.itemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2">{item.name} × {item.quantity}</Typography>
          <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">Subtotal</Typography>
        <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">Tax (10%)</Typography>
        <Typography variant="body2">${tax.toFixed(2)}</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
        <Typography variant="subtitle1" fontWeight="bold">${total.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
}
