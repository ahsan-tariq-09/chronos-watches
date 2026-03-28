import type { FiltersState, Watch } from '../types/watch';

export const createDefaultFilters = (maxPrice: number): FiltersState => ({
  brands: [],
  styles: [],
  movements: [],
  materials: [],
  straps: [],
  maxPrice,
  inStockOnly: false,
  search: ''
});

export const applyFilters = (watches: Watch[], filters: FiltersState): Watch[] => {
  const search = filters.search.trim().toLowerCase();

  return watches.filter((watch) => {
    const searchMatch =
      !search ||
      [watch.name, watch.brand, watch.description, watch.style, watch.movement]
        .join(' ')
        .toLowerCase()
        .includes(search);

    const matchSet = (selected: string[], value: string) => selected.length === 0 || selected.includes(value);

    return (
      searchMatch &&
      matchSet(filters.brands, watch.brand) &&
      matchSet(filters.styles, watch.style) &&
      matchSet(filters.movements, watch.movement) &&
      matchSet(filters.materials, watch.material) &&
      matchSet(filters.straps, watch.strap) &&
      watch.price <= filters.maxPrice &&
      (!filters.inStockOnly || watch.stock > 0)
    );
  });
};
