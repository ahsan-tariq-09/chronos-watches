import { expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { watchesApi } from './api/watches';

vi.mock('./api/watches', () => ({
  watchesApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}));

const sampleWatch = {
  id: 1,
  name: 'Classic Chronograph',
  brand: 'Aurelius Geneva',
  price: 3490,
  style: 'Dress',
  movement: 'Automatic',
  stock: 6,
  imageUrl: 'https://example.com/watch.jpg',
  description: 'A polished chronograph with a strap.',
  material: 'Stainless steel',
  strap: 'Leather strap',
  waterResistance: '50m',
  featured: true,
  altText: 'Classic chronograph watch with black dial and leather strap'
};

test('loads watches and supports opening cart', async () => {
  vi.mocked(watchesApi.getAll).mockResolvedValue([sampleWatch]);
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);

  await waitFor(() => expect(screen.getByText(/classic chronograph/i)).toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: /open cart/i }));
  expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
});
