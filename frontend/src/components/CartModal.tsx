import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Watch } from '../types/watch';

export interface CartItem {
  watch: Watch;
  quantity: number;
}

interface Props {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (watchId: number) => void;
  onCheckout: () => void;
}

export default function CartModal({ open, items, onClose, onRemove, onCheckout }: Props) {
  const total = items.reduce((sum, item) => sum + item.watch.price * item.quantity, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="cart-modal-title"
    >
      <DialogTitle id="cart-modal-title">Shopping cart</DialogTitle>

      <DialogContent dividers>
        {items.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem
                key={item.watch.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`Remove ${item.watch.name} from cart`}
                    onClick={() => onRemove(item.watch.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${item.watch.name} × ${item.quantity}`}
                  secondary={`$${(item.watch.price * item.quantity).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Typography fontWeight={700}>Total</Typography>
          <Typography fontWeight={700}>${total.toLocaleString()}</Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Continue shopping</Button>
        <Button
          variant="contained"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
}