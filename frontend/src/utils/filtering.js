export function applyCatalogFilters(products, filters) {
  const searchTerm = filters.search.trim().toLowerCase();

  return products
    .filter((product) => {
      const inPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const inStyle = !filters.styles.length || filters.styles.includes(product.style);
      const inBrand = !filters.brands.length || filters.brands.includes(product.brand);
      const inMovement = !filters.movements.length || filters.movements.includes(product.movement);
      const inSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);

      return inPrice && inStyle && inBrand && inMovement && inSearch;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
}
