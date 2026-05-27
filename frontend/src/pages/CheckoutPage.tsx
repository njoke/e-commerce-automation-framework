import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CheckoutForm, { type FormData } from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import ErrorAlert from '../components/ErrorAlert';
import { useCart } from '../hooks/useCart';
import { checkout } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const EMPTY_FORM: FormData = {
  firstName: '', lastName: '', email: '',
  address: '', city: '', state: '', zip: '',
  cardNumber: '',
};

export default function CheckoutPage() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setItemCount } = useContext(CartContext);
  const { cartItems } = useCart();

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    const required: Array<keyof FormData> = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'cardNumber'];
    required.forEach(f => {
      if (!formData[f].trim()) errs[f] = 'This field is required';
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    if (!user) return;
    if (cartItems.length === 0) {
      setApiError('Your cart is empty. Add items before checking out.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await checkout(user.id, {
        ...formData,
        userId: user.id,
        items: cartItems,
      });
      if (order.error) {
        setApiError(order.error);
      } else {
        setItemCount(0);
        navigate('/confirmation', { state: { order } });
      }
    } catch {
      setApiError('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      {apiError && <Box sx={{ mb: 2 }}><ErrorAlert message={apiError} /></Box>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Shipping Information</Typography>
              <CheckoutForm data={formData} errors={errors} onChange={handleChange} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <OrderSummary items={cartItems} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting}
              data-testid="checkout-submit-button"
              sx={{ mt: 2 }}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
