import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import type { Watch } from '../types/watch';

interface Props {
  watch: Watch | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (watch: Watch) => void;
}

export default function ProductModal({ watch, open, onClose, onAddToCart }: Props) {
  if (!watch) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="product-modal-title" role="dialog">
      <DialogTitle id="product-modal-title">{watch.name}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <img src={watch.imageUrl} alt={watch.altText} style={{ width: '100%', borderRadius: 12, maxHeight: 420, objectFit: 'cover' }} />
          <Typography>{watch.description}</Typography>
          <Typography><strong>Brand:</strong> {watch.brand}</Typography>
          <Typography><strong>Movement:</strong> {watch.movement}</Typography>
          <Typography><strong>Style:</strong> {watch.style}</Typography>
          <Typography><strong>Material:</strong> {watch.material}</Typography>
          <Typography><strong>Strap:</strong> {watch.strap}</Typography>
          <Typography><strong>Water resistance:</strong> {watch.waterResistance}</Typography>
          <Typography><strong>Price:</strong> ${watch.price.toLocaleString()}</Typography>
          <Typography><strong>Stock:</strong> {watch.stock}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => onAddToCart(watch)} variant="contained" disabled={watch.stock === 0}>Add to cart</Button>
      </DialogActions>
    </Dialog>
  );
}
