export interface WatchCreate {
  name: string;
  brand: string;
  price: number;
  style: string;
  movement: string;
  stock: number;
  imageUrl: string;
  description: string;
  material: string;
  strap: string;
  waterResistance: string;
  featured: boolean;
  altText: string;
}

export interface Watch extends WatchCreate {
  id: number;
}

export interface FiltersState {
  brands: string[];
  styles: string[];
  movements: string[];
  materials: string[];
  straps: string[];
  maxPrice: number;
  inStockOnly: boolean;
  search: string;
}
