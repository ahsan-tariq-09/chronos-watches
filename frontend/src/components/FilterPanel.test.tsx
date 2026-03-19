import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from './FilterPanel';
import type { FiltersState, Watch } from '../types/watch';

const watches: Watch[] = [
  {
    id: 1,
    name: 'Classic',
    brand: 'Brand A',
    price: 1000,
    style: 'Dress',
    movement: 'Automatic',
    stock: 3,
    imageUrl: 'https://example.com/1.jpg',
    description: 'Dress watch',
    material: 'Steel',
    strap: 'Leather strap',
    waterResistance: '50m',
    featured: false,
    altText: 'Dress watch with leather strap'
  }
];

const filters: FiltersState = {
  brands: [],
  styles: [],
  movements: [],
  materials: [],
  straps: [],
  maxPrice: 1000,
  inStockOnly: false,
  search: ''
};

test('reset button clears active filters', async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();

  render(<FilterPanel watches={watches} filters={{ ...filters, search: 'classic', inStockOnly: true }} onChange={handleChange} />);

  await user.click(screen.getByRole('button', { name: /reset/i }));
  expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ search: '', inStockOnly: false }));
});
