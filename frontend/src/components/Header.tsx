import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/products')}
        >
          Amplifii Electronics
        </Typography>
        {user && (
          <>
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              aria-label="Shopping cart"
            >
              <Badge badgeContent={itemCount} color="secondary" data-testid="cart-icon-badge">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Button
              color="inherit"
              onClick={handleLogout}
              data-testid="header-logout-button"
              aria-label="Logout"
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
