import { useEffect, useRef, useState } from "react";
import CartModal from "./components/CartModal";
import IdentityVerificationModal from "./components/IdentityVerificationModal";
import ProductModal from "./components/ProductModal";
import ToastAlert from "./components/ToastAlert";
import { useCatalog } from "./hooks/useCatalog";
import { useCart } from "./hooks/useCart";
import { useModal } from "./hooks/useModal";
import { useToast } from "./hooks/useToast";
import HomePage from "./pages/HomePage";
import { WatchAPI } from "./services/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productModal = useModal();
  const verificationModal = useModal();
  const cartModal = useModal();

  const { toast, showToast, dismissToast } = useToast();
  const { filters, setFilters, maxPrice, filteredProducts, resetFilters } = useCatalog(products);
  const { cart, cartCount, grandTotal, addToCart, verifyAndAdd, changeQuantity, removeItem, checkout } = useCart(showToast);

  const initializedPriceRef = useRef(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await WatchAPI.getAllWatches());
    } catch (err) {
      setError(err.message || "Failed to load watches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilters((prev) => {
      if (!initializedPriceRef.current) {
        initializedPriceRef.current = true;
        return { ...prev, priceRange: [0, maxPrice] };
      }
      if (prev.priceRange[1] > maxPrice) {
        return { ...prev, priceRange: [0, maxPrice] };
      }
      return prev;
    });
  }, [maxPrice, setFilters]);

  const handleCheckout = () => {
    const result = checkout();
    if (!result.ok) {
      showToast("Error", result.message, "danger");
      return;
    }

    showToast("Success", result.message, "success");
    cartModal.close();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Chronos Watches</a>
          <button className="btn btn-outline-light ms-auto" onClick={() => cartModal.open(true)}>
            <i className="bi bi-cart" /> <span>{cartCount}</span>
          </button>
        </div>
      </nav>

      <HomePage
        products={products}
        filters={filters}
        maxPrice={maxPrice}
        onFilterChange={setFilters}
        onResetFilters={resetFilters}
        onViewProduct={productModal.open}
        onAddToCart={(product) => addToCart(product, verificationModal.open)}
        productsState={{ loading, error, filteredProducts }}
        onRefresh={fetchProducts}
        showToast={showToast}
      />

      <ProductModal product={productModal.payload} onClose={productModal.close} onAddToCart={(product) => addToCart(product, verificationModal.open)} />
      <IdentityVerificationModal product={verificationModal.payload} onClose={verificationModal.close} onSuccess={verifyAndAdd} showToast={showToast} />
      <CartModal isOpen={cartModal.isOpen && cartModal.payload === true} cart={cart} total={grandTotal} onClose={cartModal.close} onQuantityChange={changeQuantity} onRemove={removeItem} onCheckout={handleCheckout} />
      <ToastAlert toast={toast} onClose={dismissToast} />
    </>
  );
}
