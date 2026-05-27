import Grid from '@mui/material/Grid';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

export default function ProductGrid({ products, onAddToCart }: Props) {
  return (
    <Grid container spacing={3}>
      {products.map(product => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </Grid>
      ))}
    </Grid>
  );
}
