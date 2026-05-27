import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CartItem as CartItemType } from '../types';

interface Props {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <Box
      data-testid="cart-item"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ${item.price.toFixed(2)} each
        </Typography>
      </Box>
      <TextField
        type="number"
        value={item.quantity}
        size="small"
        sx={{ width: 80 }}
        inputProps={{
          min: 1,
          'data-testid': 'cart-item-quantity',
          'aria-label': `Quantity for ${item.name}`,
        }}
        onChange={e => {
          const q = parseInt(e.target.value, 10);
          if (q >= 1) onUpdateQuantity(item.itemId, q);
        }}
      />
      <Typography variant="subtitle1" sx={{ minWidth: 70, textAlign: 'right' }}>
        ${(item.price * item.quantity).toFixed(2)}
      </Typography>
      <IconButton
        aria-label={`Remove ${item.name}`}
        data-testid="cart-item-remove-button"
        color="error"
        onClick={() => onRemove(item.itemId)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
