import { Button, Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material';
import type { Watch } from '../types/watch';

interface Props {
  watch: Watch;
  onViewDetails: (watch: Watch) => void;
  onAddToCart: (watch: Watch) => void;
}

export default function ProductCard({ watch, onViewDetails, onAddToCart }: Props) {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" height="240" image={watch.imageUrl} alt={watch.altText} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <div>
              <Typography variant="h6">{watch.name}</Typography>
              <Typography color="text.secondary">{watch.brand}</Typography>
            </div>
            {watch.featured && <Chip color="secondary" label="Featured" />}
          </Stack>
          <Typography variant="body2">{watch.style} · {watch.movement}</Typography>
          <Typography variant="body2">{watch.material} · {watch.strap}</Typography>
          <Typography variant="h6">${watch.price.toLocaleString()}</Typography>
          <Chip
            label={watch.stock > 0 ? `${watch.stock} in stock` : 'Out of stock'}
            color={watch.stock > 0 ? 'success' : 'default'}
            variant={watch.stock > 0 ? 'filled' : 'outlined'}
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button onClick={() => onViewDetails(watch)} variant="outlined">View details</Button>
        <Button onClick={() => onAddToCart(watch)} variant="contained" disabled={watch.stock === 0}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
