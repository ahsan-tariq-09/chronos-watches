import { useMemo, useState } from "react";
import { applyCatalogFilters } from "../utils/filtering";

const DEFAULT_FILTERS = {
  priceRange: [0, 5000],
  styles: [],
  brands: [],
  movements: [],
  search: "",
  sortBy: "featured"
};

export function useCatalog(products) {
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 5000), [products]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      priceRange: [filters.priceRange[0], Math.min(filters.priceRange[1], maxPrice)]
    }),
    [filters, maxPrice]
  );

  const filteredProducts = useMemo(() => applyCatalogFilters(products, effectiveFilters), [products, effectiveFilters]);

  const resetFilters = () => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, priceRange: [0, maxPrice], search: prev.search }));
  };

  return { filters: effectiveFilters, setFilters, maxPrice, filteredProducts, resetFilters };
}
