import AdminPanel from "../components/AdminPanel";
import EmptyState from "../components/EmptyState";
import FilterPanel from "../components/FilterPanel";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ProductCard from "../components/ProductCard";

function getActiveFilterCount(filters) {
  return filters.styles.length + filters.brands.length + filters.movements.length + (filters.search ? 1 : 0);
}

export default function HomePage({
  products,
  filters,
  maxPrice,
  onFilterChange,
  onResetFilters,
  onViewProduct,
  onAddToCart,
  productsState,
  onRefresh,
  showToast
}) {
  const { loading, error, filteredProducts } = productsState;
  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <main className="container mt-4">
      <section className="mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h1 className="h2 mb-1">Luxury Timepieces</h1>
          <p className="text-muted mb-0">A curated inventory demo with admin tools.</p>
        </div>
        <div className="text-muted text-end">
          <div><strong>{filteredProducts.length}</strong> products found</div>
          <div className="small">{activeFilterCount} active filters</div>
        </div>
      </section>

      <section className="mb-4">
        <FilterPanel
          products={products}
          filters={filters}
          maxPrice={maxPrice}
          onChange={(next) => onFilterChange((prev) => ({ ...prev, ...next }))}
          onReset={onResetFilters}
        />
      </section>

      <section className="mb-5">
        {loading ? <LoadingSkeleton /> : null}

        {error ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={onRefresh}>Retry</button>
          </div>
        ) : null}

        {!loading && !error && !filteredProducts.length ? (
          <EmptyState
            icon="bi-search"
            title="No watches match the current criteria"
            message="Try clearing filters or broadening your search to discover more timepieces."
            action={<button className="btn btn-outline-secondary" onClick={onResetFilters}>Clear Filters</button>}
          />
        ) : null}

        {!loading && !error ? (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetails={onViewProduct} onAddToCart={onAddToCart} />
            ))}
          </div>
        ) : null}
      </section>

      <section id="admin" className="mb-5 py-5 border-top">
        <h2 className="h3 mb-4">Inventory Management</h2>
        <AdminPanel products={products} onDataChanged={onRefresh} showToast={showToast} />
      </section>
    </main>
  );
}
