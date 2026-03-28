import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import type { Watch, WatchCreate } from '../types/watch';
import { watchFormSchema, type WatchFormValues } from '../utils/watchFormSchema';

interface Props {
  watches: Watch[];
  onCreate: (data: WatchCreate) => Promise<void>;
  onUpdate: (id: number, data: WatchCreate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const movementOptions = ['Automatic', 'Mechanical', 'Quartz'];
const styleOptions = ['Dress', 'Sport', 'Complication', 'Minimalist', 'Travel', 'Haute Horlogerie'];
const materialOptions = ['Stainless steel', 'Titanium', 'Rose gold', 'Platinum'];
const strapOptions = ['Leather strap', 'Rubber strap', 'Milanese bracelet', 'Canvas strap', 'Alligator leather'];

const defaultValues: WatchFormValues = {
  name: '',
  brand: '',
  price: 0,
  style: '',
  movement: '',
  stock: 0,
  imageUrl: '',
  description: '',
  material: '',
  strap: '',
  waterResistance: '',
  featured: false,
  altText: ''
};

export default function AdminPanel({ watches, onCreate, onUpdate, onDelete }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [stockOnly, setStockOnly] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<WatchFormValues>({
    resolver: zodResolver(watchFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const visibleWatches = useMemo(() => watches.filter((watch) => {
    const searchMatch = `${watch.name} ${watch.brand}`.toLowerCase().includes(search.toLowerCase());
    return searchMatch && (!stockOnly || watch.stock > 0);
  }), [search, stockOnly, watches]);

  const onSubmit = async (values: WatchFormValues) => {
    setStatusMessage(null);
    if (selectedId) {
      await onUpdate(selectedId, values);
      setStatusMessage('Watch updated successfully.');
    } else {
      await onCreate(values);
      setStatusMessage('Watch added successfully.');
    }
    setSelectedId(null);
    reset(defaultValues);
  };

  const startEdit = (watch: Watch) => {
    setSelectedId(watch.id);
    reset(watch);
  };

  const renderField = (field: { name: keyof WatchFormValues; label: string; helper: string; type?: string }) => (
    <TextField
      fullWidth
      label={field.label}
      type={field.type}
      {...register(field.name, field.type === 'number' ? { valueAsNumber: true } : undefined)}
      helperText={errors[field.name]?.message ?? field.helper}
      error={Boolean(errors[field.name])}
      aria-invalid={Boolean(errors[field.name])}
    />
  );

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>{selectedId ? 'Edit watch' : 'Add a new watch'}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>All form fields include inline guidance, keyboard focus states, and accessible error messages.</Typography>
        {statusMessage && <Alert severity="success" sx={{ mb: 2 }}>{statusMessage}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            {renderField({ name: 'name', label: 'Watch name', helper: 'Use the retail product name.' })}
            {renderField({ name: 'brand', label: 'Brand', helper: 'Enter the brand or maison.' })}
            {renderField({ name: 'price', label: 'Price', helper: 'Enter the price in USD.', type: 'number' })}
            {renderField({ name: 'stock', label: 'Stock', helper: 'Enter available units.', type: 'number' })}
            {renderField({ name: 'imageUrl', label: 'Image URL', helper: 'Link to a product image.' })}
            {renderField({ name: 'waterResistance', label: 'Water resistance', helper: 'Example: 100m.' })}
            {renderField({ name: 'altText', label: 'Image alt text', helper: 'Describe the watch image clearly.' })}
            <TextField select fullWidth label="Style" {...register('style')} helperText={errors.style?.message ?? 'Choose a catalogue category.'} error={Boolean(errors.style)}>
              {styleOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Movement" {...register('movement')} helperText={errors.movement?.message ?? 'Choose the movement type.'} error={Boolean(errors.movement)}>
              {movementOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Material" {...register('material')} helperText={errors.material?.message ?? 'Choose the case material.'} error={Boolean(errors.material)}>
              {materialOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Strap" {...register('strap')} helperText={errors.strap?.message ?? 'Choose the bracelet or strap.'} error={Boolean(errors.strap)}>
              {strapOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            sx={{ mt: 2 }}
            {...register('description')}
            helperText={errors.description?.message ?? 'Summarize standout complications, finishing, and intended wear.'}
            error={Boolean(errors.description)}
            aria-invalid={Boolean(errors.description)}
          />
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <FormControlLabel sx={{ mt: 2 }} control={<Switch checked={field.value} onChange={field.onChange} />} label="Highlight this watch as featured" />
            )}
          />
          <Stack direction="row" gap={2} mt={3}>
            <Button variant="contained" type="submit" disabled={isSubmitting}>{selectedId ? 'Save changes' : 'Add watch'}</Button>
            <Button variant="outlined" onClick={() => { setSelectedId(null); reset(defaultValues); }}>Clear form</Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={2}>
          <TextField label="Search inventory" value={search} onChange={(event) => setSearch(event.target.value)} />
          <FormControlLabel control={<Switch checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} />} label="Only show items in stock" />
        </Stack>
        <Table aria-label="Inventory list">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleWatches.map((watch) => (
              <TableRow key={watch.id}>
                <TableCell>{watch.name}</TableCell>
                <TableCell>{watch.brand}</TableCell>
                <TableCell>{watch.stock}</TableCell>
                <TableCell>${watch.price.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end" gap={1}>
                    <Button size="small" onClick={() => startEdit(watch)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => onDelete(watch.id)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
