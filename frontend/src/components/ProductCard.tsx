import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const navigate = useNavigate();

  return (
    <Card data-testid="product-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(`/products/${product.id}`)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          data-testid="product-card-name"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" data-testid="product-card-price">
          ${product.price.toFixed(2)}
        </Typography>
        {!product.inStock && (
          <Chip label="Out of Stock" color="error" size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          disabled={!product.inStock}
          data-testid="product-add-to-cart-button"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAddToCart(product.id)}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
}
