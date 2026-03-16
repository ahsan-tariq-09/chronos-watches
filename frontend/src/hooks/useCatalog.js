import { useMemo, useState } from "react";
import { applyCatalogFilters } from "../utils/filtering";

export function useCatalog(products) {
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 5000), [products]);

  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    styles: [],
    brands: [],
    movements: [],
    search: "",
    sortBy: "featured"
  });

  const effectiveFilters = useMemo(() => ({ ...filters, priceRange: [0, Math.min(filters.priceRange[1], maxPrice)] }), [filters, maxPrice]);
  const filteredProducts = useMemo(() => applyCatalogFilters(products, effectiveFilters), [products, effectiveFilters]);

  return { filters: effectiveFilters, setFilters, maxPrice, filteredProducts };
}
