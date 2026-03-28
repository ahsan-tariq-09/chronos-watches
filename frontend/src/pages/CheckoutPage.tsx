import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { CheckoutContent } from '../types/siteContent';
import type { CartItem } from '../components/CartModal';

interface Props {
  items: CartItem[];
  content: CheckoutContent | null;
  onRemove: (watchId: number) => void;
}

export default function CheckoutPage({ items, content, onRemove }: Props) {
  const [notes, setNotes] = useState('');

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.watch.price * item.quantity, 0),
    [items]
  );

  const shipping = content?.shippingCost ?? 0;
  const taxRate = content?.taxRate ?? 0;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <Box component="main" sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {content?.title ?? 'Checkout'}
            </Typography>
            <Typography color="text.secondary">
              {content?.subtitle ?? 'Review your items before submitting your order request.'}
            </Typography>
          </Box>

          <Alert severity="info">
            {content?.notice ??
              'This demo does not process card payments. Submit your order request and complete payment through an approved provider later.'}
          </Alert>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr' },
              gap: 3
            }}
          >
            <Card elevation={0} sx={{ border: '1px solid #d9e2ec' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Order items
                </Typography>

                {items.length === 0 ? (
                  <Typography color="text.secondary">
                    Your cart is empty. Add products before checkout.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {items.map((item) => (
                      <Box key={item.watch.id}>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          spacing={1}
                        >
                          <Box>
                            <Typography variant="h6">{item.watch.name}</Typography>
                            <Typography color="text.secondary">
                              Qty: {item.quantity} × ${item.watch.price.toLocaleString()}
                            </Typography>
                          </Box>
                          <Button color="error" onClick={() => onRemove(item.watch.id)}>
                            Remove
                          </Button>
                        </Stack>
                        <Divider sx={{ mt: 2 }} />
                      </Box>
                    ))}
                  </Stack>
                )}

                {content?.allowOrderNotes ? (
                  <TextField
                    sx={{ mt: 3 }}
                    label="Order notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                ) : null}
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid #d9e2ec', height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Summary
                </Typography>

                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{content?.shippingLabel ?? 'Shipping'}</Typography>
                    <Typography>${shipping.toFixed(2)}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Estimated tax</Typography>
                    <Typography>${tax.toFixed(2)}</Typography>
                  </Stack>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </Stack>
                </Stack>

                <Button
                  sx={{ mt: 3 }}
                  variant="contained"
                  fullWidth
                  disabled={items.length === 0}
                  href={`mailto:${content?.supportEmail ?? 'support@example.com'}?subject=Chronos%20Order%20Request`}
                >
                  Submit order request
                </Button>

                <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
                  Support: {content?.supportEmail ?? 'support@example.com'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}