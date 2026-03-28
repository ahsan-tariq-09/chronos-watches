import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import type { FiltersState, Watch } from '../types/watch';
import type { HomepageContent } from '../types/siteContent';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

interface Props {
  watches: Watch[];
  loading: boolean;
  error: string | null;
  filters: FiltersState;
  filteredWatches: Watch[];
  content: HomepageContent | null;
  onFilterChange: (filters: FiltersState) => void;
  onViewDetails: (watch: Watch) => void;
  onAddToCart: (watch: Watch) => void;
  onOpenCart: () => void;
}

export default function HomePage({
  watches,
  loading,
  error,
  filters,
  filteredWatches,
  content,
  onFilterChange,
  onViewDetails,
  onAddToCart,
  onOpenCart
}: Props) {
  const featuredWatches = watches.filter((watch) => watch.featured).slice(0, 3);

  return (
    <Box component="main">
      <Box sx={{ bgcolor: '#f6f9fc', py: 8, borderBottom: '1px solid #d9e2ec' }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={3}
          >
            <Box maxWidth={760}>
              <Typography variant="overline" color="secondary.main">
                {content?.hero.eyebrow ?? 'Luxury watch catalogue'}
              </Typography>
              <Typography variant="h2" component="h1" gutterBottom>
                {content?.hero.title ?? 'Timeless watches for collectors and modern explorers'}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                {content?.hero.subtitle ??
                  'Browse curated timepieces, compare details, and build your cart with live inventory from the catalog.'}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  onClick={onOpenCart}
                >
                  {content?.hero.primaryCtaLabel ?? 'Shop collection'}
                </Button>
                <Button variant="outlined" href="#featured-watches">
                  {content?.hero.secondaryCtaLabel ?? 'View featured'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        {content?.highlights?.length ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 5
            }}
          >
            {content.highlights.map((item) => (
              <Card key={item.id} elevation={0} sx={{ border: '1px solid #d9e2ec' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : null}

        <Box id="featured-watches" sx={{ mb: 5 }}>
          <Typography variant="h4" gutterBottom>
            {content?.featuredSectionTitle ?? 'Featured watches'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3
            }}
          >
            {featuredWatches.map((watch) => (
              <ProductCard
                key={watch.id}
                watch={watch}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Typography variant="h4" gutterBottom>
          {content?.catalogSectionTitle ?? 'Full collection'}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
            gap: 3
          }}
        >
          <FilterPanel watches={watches} filters={filters} onChange={onFilterChange} />
          <Box>
            {loading ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: 3
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))}
              </Box>
            ) : filteredWatches.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '1px dashed #9fb3c8',
                  borderRadius: 2,
                  bgcolor: 'white'
                }}
              >
                <Typography variant="h5" gutterBottom>
                  No watches match the selected filters.
                </Typography>
                <Typography color="text.secondary">
                  Try resetting the filters or broadening the price range.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: 3
                }}
              >
                {filteredWatches.map((watch) => (
                  <ProductCard
                    key={watch.id}
                    watch={watch}
                    onViewDetails={onViewDetails}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
