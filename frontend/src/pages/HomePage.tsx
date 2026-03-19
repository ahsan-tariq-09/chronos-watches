import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import type { FiltersState, Watch } from '../types/watch';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

interface Props {
  watches: Watch[];
  loading: boolean;
  error: string | null;
  filters: FiltersState;
  filteredWatches: Watch[];
  onFilterChange: (filters: FiltersState) => void;
  onViewDetails: (watch: Watch) => void;
  onAddToCart: (watch: Watch) => void;
  onOpenCart: () => void;
}

export default function HomePage({ watches, loading, error, filters, filteredWatches, onFilterChange, onViewDetails, onAddToCart, onOpenCart }: Props) {
  return (
    <Box component="main" sx={{ py: 5 }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4} gap={2}>
          <div>
            <Typography variant="overline" color="secondary.main">Luxury watch catalogue</Typography>
            <Typography variant="h3" component="h1" gutterBottom>Curated watches for collectors and modern explorers</Typography>
            <Typography color="text.secondary">{filteredWatches.length} products found with responsive filtering, accessible modals, and live inventory controls.</Typography>
          </div>
          <Button startIcon={<ShoppingBagOutlinedIcon />} variant="contained" onClick={onOpenCart}>Open cart</Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 3 }}>
          <FilterPanel watches={watches} filters={filters} onChange={onFilterChange} />
          <Box>
            {loading ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} />)}
              </Box>
            ) : filteredWatches.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #9fb3c8', borderRadius: 2, bgcolor: 'white' }}>
                <Typography variant="h5" gutterBottom>No watches match the selected filters.</Typography>
                <Typography color="text.secondary">Try resetting the filters or broadening the price range.</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {filteredWatches.map((watch) => (
                  <ProductCard key={watch.id} watch={watch} onViewDetails={onViewDetails} onAddToCart={onAddToCart} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
