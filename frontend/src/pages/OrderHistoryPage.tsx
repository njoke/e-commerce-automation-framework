import { useState, useEffect, useContext } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getOrders } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import type { Order } from '../types';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function OrderHistoryPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrders(user.id)
      .then((data: Order[]) => setOrders(data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <EmptyState
          message="You have no orders yet."
          testId="empty-orders-message"
          actionLabel="Start Shopping"
          onAction={() => navigate('/products')}
        />
      ) : (
        <Box data-testid="order-history-list">
          {orders.map(order => (
            <Accordion key={order.orderId} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="bold">{order.orderId}</Typography>
                  <Typography color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()} — ${order.total.toFixed(2)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {order.items.map(item => (
                  <Box key={item.itemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography>{item.name} × {item.quantity}</Typography>
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 1, borderTop: '1px solid', borderColor: 'divider', pt: 1 }}>
                  <Typography variant="body2">Tax: ${order.tax.toFixed(2)}</Typography>
                  <Typography fontWeight="bold">Total: ${order.total.toFixed(2)}</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
}
