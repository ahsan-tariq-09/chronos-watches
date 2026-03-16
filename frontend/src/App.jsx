import { useEffect, useState } from "react";
import CartModal from "./components/CartModal";
import IdentityVerificationModal from "./components/IdentityVerificationModal";
import ProductModal from "./components/ProductModal";
import ToastAlert from "./components/ToastAlert";
import { useCart } from "./hooks/useCart";
import { useCatalog } from "./hooks/useCatalog";
import { useToast } from "./hooks/useToast";
import HomePage from "./pages/HomePage";
import { WatchAPI } from "./services/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [verificationTarget, setVerificationTarget] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { toast, showToast, dismissToast } = useToast();
  const { filters, setFilters, maxPrice, filteredProducts } = useCatalog(products);
  const { cart, cartCount, grandTotal, addToCart, verifyAndAdd, changeQuantity, removeItem, checkout } = useCart(showToast);

  const fetchProducts = async () => {
    setLoading(true); setError("");
    try { setProducts(await WatchAPI.getAllWatches()); }
    catch (err) { setError(err.message || "Failed to load watches."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice] })); }, [maxPrice, setFilters]);

  const handleCheckout = () => {
    const result = checkout();
    if (!result.ok) return showToast("Error", result.message, "danger");
    showToast("Success", result.message, "success");
    setIsCartOpen(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark"><div className="container"><a className="navbar-brand" href="#">Chronos Watches</a><button className="btn btn-outline-light ms-auto" onClick={() => setIsCartOpen(true)}><i className="bi bi-cart" /> <span>{cartCount}</span></button></div></nav>

      <HomePage
        products={products}
        filters={filters}
        maxPrice={maxPrice}
        onFilterChange={setFilters}
        onViewProduct={setSelectedProduct}
        onAddToCart={(product) => addToCart(product, setVerificationTarget)}
        productsState={{ loading, error, filteredProducts }}
        onRefresh={fetchProducts}
        showToast={showToast}
      />

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={(product) => addToCart(product, setVerificationTarget)} />
      <IdentityVerificationModal product={verificationTarget} onClose={() => setVerificationTarget(null)} onSuccess={verifyAndAdd} showToast={showToast} />
      <CartModal isOpen={isCartOpen} cart={cart} total={grandTotal} onClose={() => setIsCartOpen(false)} onQuantityChange={changeQuantity} onRemove={removeItem} onCheckout={handleCheckout} />
      <ToastAlert toast={toast} onClose={dismissToast} />
    </>
  );
}
