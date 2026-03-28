import { Alert, AppBar, Box, Button, Container, Snackbar, Stack, Toolbar, Typography } from '@mui/material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import ProductModal from './components/ProductModal';
import CartModal, { type CartItem } from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import { watchesApi } from './api/watches';
import { siteContentApi } from './api/siteContent';
import type { Watch, WatchCreate } from './types/watch';
import type { SiteContent } from './types/siteContent';
import { applyFilters, createDefaultFilters } from './utils/filtering';

const adminToken = import.meta.env.VITE_ADMIN_TOKEN || 'chronos-admin';

export default function App() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [filters, setFilters] = useState(createDefaultFilters(20000));
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [watchData, contentData] = await Promise.all([
        watchesApi.getAll(),
        siteContentApi.get()
      ]);

      setWatches(watchData);
      setSiteContent(contentData);

      const maxPrice = Math.max(...watchData.map((watch) => watch.price), 0);
      setFilters((current) => ({
        ...current,
        maxPrice: current.maxPrice > maxPrice ? maxPrice : current.maxPrice || maxPrice
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load site data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  useEffect(() => {
    if (watches.length > 0 && filters.maxPrice === 20000) {
      setFilters(createDefaultFilters(Math.max(...watches.map((watch) => watch.price), 0)));
    }
  }, [watches, filters.maxPrice]);

  const filteredWatches = useMemo(() => applyFilters(watches, filters), [watches, filters]);

  const addToCart = (watch: Watch) => {
    if (watch.stock === 0) return;

    setCart((current) => {
      const existing = current.find((item) => item.watch.id === watch.id);
      if (existing) {
        return current.map((item) =>
          item.watch.id === watch.id
            ? { ...item, quantity: Math.min(item.quantity + 1, watch.stock) }
            : item
        );
      }
      return [...current, { watch, quantity: 1 }];
    });

    setSnackbar(`${watch.name} added to cart.`);
  };

  const removeFromCart = (watchId: number) => {
    setCart((current) => current.filter((item) => item.watch.id !== watchId));
  };

  const saveWatch = async (payload: WatchCreate) => {
    await watchesApi.create(payload);
    await fetchData();
  };

  const updateWatch = async (watchId: number, payload: WatchCreate) => {
    await watchesApi.update(watchId, payload);
    await fetchData();
  };

  const deleteWatch = async (watchId: number) => {
    await watchesApi.remove(watchId);
    await fetchData();
  };

  const adminAllowed = new URLSearchParams(location.search).get('token') === adminToken;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
            <WatchOutlinedIcon color="primary" />
            <Typography variant="h6">Chronos Watches</Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
            <Button color="inherit" onClick={() => navigate('/checkout')}>Checkout</Button>
            <Button
              color="inherit"
              startIcon={<AdminPanelSettingsOutlinedIcon />}
              onClick={() => navigate('/admin')}
            >
              Admin
            </Button>
            <Button
              color="inherit"
              startIcon={<ShoppingCartOutlinedIcon />}
              onClick={() => setCartOpen(true)}
            >
              Cart ({cartCount})
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              watches={watches}
              loading={loading}
              error={error}
              filters={filters}
              filteredWatches={filteredWatches}
              content={siteContent?.homepage ?? null}
              onFilterChange={setFilters}
              onViewDetails={setSelectedWatch}
              onAddToCart={addToCart}
              onOpenCart={() => setCartOpen(true)}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              items={cart}
              content={siteContent?.checkout ?? null}
              onRemove={removeFromCart}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <Container maxWidth="lg" sx={{ py: 5 }}>
              {adminAllowed ? (
                <AdminPanel
                  watches={watches}
                  onCreate={saveWatch}
                  onUpdate={updateWatch}
                  onDelete={deleteWatch}
                />
              ) : (
                <Alert severity="warning">
                  Admin access is restricted. Add the correct <code>?token=...</code> query string
                  to open the inventory tools.
                </Alert>
              )}
            </Container>
          }
        />
      </Routes>

      <ProductModal
        watch={selectedWatch}
        open={Boolean(selectedWatch)}
        onClose={() => setSelectedWatch(null)}
        onAddToCart={addToCart}
      />

      <CartModal
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onCheckout={() => {
        setCartOpen(false);
        navigate('/checkout');
         }}
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={2500} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar}</Alert>
      </Snackbar>

      <Box component="footer" sx={{ py: 4, bgcolor: '#102a43', color: 'white', mt: 5 }}>
        <Container>
         <Typography>
          Accessible luxury watch catalogue built with FastAPI and React + TypeScript.
         </Typography>
         <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Created by Ahsan Tariq
         </Typography>
        </Container>
      </Box>
    </>
  );
}