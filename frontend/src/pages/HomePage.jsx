import AdminPanel from "../components/AdminPanel";
import EmptyState from "../components/EmptyState";
import FilterPanel from "../components/FilterPanel";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ProductCard from "../components/ProductCard";

export default function HomePage({
  products,
  filters,
  maxPrice,
  onFilterChange,
  onViewProduct,
  onAddToCart,
  productsState,
  onRefresh,
  showToast
}) {
  const { loading, error, filteredProducts } = productsState;

  return (
    <main className="container mt-4 pb-5">
      <section className="mb-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2">
        <div>
          <h1 className="h2 mb-1">Luxury Timepieces</h1>
          <p className="text-muted mb-0">A curated inventory demo with admin tools.</p>
        </div>
        <div className="text-muted small fw-semibold">{filteredProducts.length} products found</div>
      </section>

      <section className="mb-4">
        <FilterPanel
          products={products}
          filters={filters}
          maxPrice={maxPrice}
          onChange={(next) => onFilterChange((prev) => ({ ...prev, ...next }))}
        />
      </section>

      <section className="mb-5">
        {loading && <LoadingSkeleton cards={6} />}

        {!loading && error && (
          <EmptyState
            icon="bi-exclamation-triangle"
            title="Could not load watches"
            message={error}
            action={
              <button className="btn btn-outline-danger" onClick={onRefresh}>
                Retry
              </button>
            }
          />
        )}

        {!loading && !error && !filteredProducts.length && (
          <EmptyState
            icon="bi-search"
            title="No watches match your current filters"
            message="Try clearing one or more filters, adjusting the price range, or searching with a broader term."
            action={
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  onFilterChange((prev) => ({
                    ...prev,
                    styles: [],
                    brands: [],
                    movements: [],
                    search: "",
                    sortBy: "featured",
                    priceRange: [0, maxPrice]
                  }))
                }
              >
                Reset Filters
              </button>
            }
          />
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-5 py-5 border-top">
        <div className="mb-3">
          <h2 className="h3 mb-1">Inventory Management</h2>
          <p className="text-muted mb-0">Add, edit, and manage watches with server-backed persistence.</p>
        </div>
        <AdminPanel products={products} onDataChanged={onRefresh} showToast={showToast} />
      </section>
    </main>
  );
}
