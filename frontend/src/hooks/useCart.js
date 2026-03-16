import { useMemo, useState } from "react";

const STORAGE_KEY = "chronos-cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useCart(showToast) {
  const [cart, setCart] = useState(loadCart);

  const persist = (next) => {
    setCart(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToCart = (product, onRequireVerification) => {
    if (product.stock <= 0) return showToast("Error", "This watch is out of stock.", "danger");

    const isLimited = product.style.toLowerCase().includes("limited") || product.name.toLowerCase().includes("limited");
    if (isLimited && cart.some((item) => item.id === product.id)) {
      return showToast("Error", "Limited edition watches are restricted to one per customer.", "danger");
    }

    if (product.price > 1000 && !cart.some((item) => item.id === product.id && item.verified)) {
      onRequireVerification(product);
      return;
    }

    const existing = cart.find((item) => item.id === product.id);
    const next = existing
      ? cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.price, quantity: 1, verified: product.price <= 1000 }];

    persist(next);
    showToast("Success", `${product.name} added to cart.`, "success");
  };

  const verifyAndAdd = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    const next = existing
      ? cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1, verified: true } : item))
      : [...cart, { id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.price, quantity: 1, verified: true }];

    persist(next);
    showToast("Success", `${product.name} added after verification.`, "success");
  };

  const changeQuantity = (id, delta) => {
    const next = cart
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
      .filter((item) => item.quantity > 0);
    persist(next);
  };

  const removeItem = (id) => {
    persist(cart.filter((item) => item.id !== id));
    showToast("Removed", "Item removed from cart.", "info");
  };

  const checkout = () => {
    if (!cart.length) return { ok: false, message: "Your cart is empty." };
    if (cart.some((item) => item.price > 1000 && !item.verified)) {
      return { ok: false, message: "Complete identity verification for premium items first." };
    }
    persist([]);
    return { ok: true, message: "Order placed successfully." };
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const grandTotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);

  return { cart, cartCount, grandTotal, addToCart, verifyAndAdd, changeQuantity, removeItem, checkout };
}
