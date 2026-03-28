import { z } from 'zod';

export const watchFormSchema = z.object({
  name: z.string().min(2, 'Enter a watch name.'),
  brand: z.string().min(2, 'Enter a brand.'),
  price: z.coerce.number().positive('Price must be greater than zero.'),
  style: z.string().min(2, 'Select a style.'),
  movement: z.string().min(2, 'Select a movement.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  imageUrl: z.url('Enter a valid image URL.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  material: z.string().min(2, 'Select a material.'),
  strap: z.string().min(2, 'Select a strap.'),
  waterResistance: z.string().min(2, 'Add the water resistance.'),
  featured: z.boolean(),
  altText: z.string().min(10, 'Provide descriptive alt text.')
});

export type WatchFormValues = z.infer<typeof watchFormSchema>;
