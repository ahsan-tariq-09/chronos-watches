import AdminPanel from "../components/AdminPanel";
import FilterPanel from "../components/FilterPanel";
import ProductCard from "../components/ProductCard";

export default function HomePage({ products, filters, maxPrice, onFilterChange, onViewProduct, onAddToCart, productsState, onRefresh, showToast }) {
  const { loading, error, filteredProducts } = productsState;

  return (
    <main className="container mt-4">
      <section className="mb-4 d-flex justify-content-between align-items-center"><div><h1 className="h2 mb-1">Luxury Timepieces</h1><p className="text-muted mb-0">A curated inventory demo with admin tools.</p></div><div className="text-muted">{filteredProducts.length} products found</div></section>

      <section className="mb-4"><FilterPanel products={products} filters={filters} maxPrice={maxPrice} onChange={(next) => onFilterChange((prev) => ({ ...prev, ...next }))} /></section>

      <section className="mb-5">
        {loading && <div className="text-center py-5">Loading watches...</div>}
        {error && <div className="alert alert-danger d-flex justify-content-between"><span>{error}</span><button className="btn btn-sm btn-outline-danger" onClick={onRefresh}>Retry</button></div>}
        {!loading && !error && !filteredProducts.length && <div className="text-center py-5"><h4>No watches match your filters.</h4></div>}
        <div className="row g-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onViewDetails={onViewProduct} onAddToCart={onAddToCart} />)}</div>
      </section>

      <section className="mb-5 py-5 border-top"><h2 className="h3 mb-4">Inventory Management</h2><AdminPanel products={products} onDataChanged={onRefresh} showToast={showToast} /></section>
    </main>
  );
}
