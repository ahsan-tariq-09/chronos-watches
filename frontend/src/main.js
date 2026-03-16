import { WatchAPI } from "./services/api.js";
import { FormValidator } from "./utils/validation.js";
import { ProductCard } from "./components/productcard.js";
import { FilterPanel } from "./components/FilterPanel.js";
import { AdminPanel } from "./components/AdminPanel.js";

const state = {
  products: [],
  filteredProducts: [],
  cart: JSON.parse(localStorage.getItem("chronos-cart") || "[]")
};

const els = {
  filterPanel: document.getElementById("filterPanel"),
  productGrid: document.getElementById("productGrid"),
  productCount: document.getElementById("productCount"),
  adminPanel: document.getElementById("adminPanel"),
  cartBtn: document.getElementById("cartBtn"),
  cartCount: document.getElementById("cartCount"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  verifyIdentityBtn: document.getElementById("verifyIdentityBtn"),
  productModalContent: document.getElementById("productModalContent"),
  cartModalBody: document.getElementById("cartModalBody")
};

window.showToast = function showToast(title, message, type = "info") {
  const toastEl = document.getElementById("liveToast");
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMessage").textContent = message;

  toastEl.classList.remove(
    "text-bg-primary",
    "text-bg-success",
    "text-bg-danger",
    "text-bg-warning",
    "text-bg-info"
  );
  toastEl.classList.add(`text-bg-${type}`);

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
};

function saveCart() {
  localStorage.setItem("chronos-cart", JSON.stringify(state.cart));
  updateCartCount();
}

function updateCartCount() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  els.cartCount.textContent = count;
}

function applyFilters(filters) {
  state.filteredProducts = state.products.filter((product) => {
    const inPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const inStyle = !filters.styles.length || filters.styles.includes(product.style);
    const inBrand = !filters.brands.length || filters.brands.includes(product.brand);
    const inMovement = !filters.movements.length || filters.movements.includes(product.movement);
    return inPrice && inStyle && inBrand && inMovement;
  });

  renderProducts(state.filteredProducts);
}

function renderProducts(products) {
  els.productGrid.innerHTML = "";

  if (!products.length) {
    els.productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <h4>No watches match your filters.</h4>
      </div>
    `;
    els.productCount.textContent = "0 products found";
    return;
  }

  products.forEach((product) => {
    const card = new ProductCard(product);
    els.productGrid.appendChild(card.render());
  });

  els.productCount.textContent = `${products.length} products found`;
}

function showProductModal(product) {
  els.productModalContent.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">${product.name}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row g-4">
        <div class="col-md-6">
          <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid modal-img">
        </div>
        <div class="col-md-6">
          <h4>${product.brand}</h4>
          <h3 class="text-primary">$${product.price.toFixed(2)}</h3>
          <p>${product.description}</p>
          <p><strong>Style:</strong> ${product.style}</p>
          <p><strong>Movement:</strong> ${product.movement}</p>
          <p><strong>Stock:</strong> ${product.stock > 0 ? product.stock : "Out of stock"}</p>
          <button class="btn btn-primary add-to-cart-btn mt-2" data-id="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;

  new bootstrap.Modal(document.getElementById("productModal")).show();
}

function showIdentityVerification(product) {
  const modalEl = document.getElementById("identityModal");
  modalEl.dataset.productId = String(product.id);
  new bootstrap.Modal(modalEl).show();
}

function addToCart(product) {
  if (product.stock <= 0) {
    window.showToast("Error", "This watch is out of stock.", "danger");
    return;
  }

  const isLimited =
    product.style.toLowerCase().includes("limited") ||
    product.name.toLowerCase().includes("limited");

  if (isLimited && state.cart.some((item) => item.id === product.id)) {
    window.showToast("Error", "Limited edition watches are restricted to one per customer.", "danger");
    return;
  }

  if (product.price > 1000 && !state.cart.some((item) => item.id === product.id && item.verified)) {
    showIdentityVerification(product);
    return;
  }

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      verified: product.price <= 1000
    });
  }

  saveCart();
  window.showToast("Success", `${product.name} added to cart.`, "success");
}

function updateCartItemQuantity(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCartModal();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveCart();
  renderCartModal();
  window.showToast("Removed", "Item removed from cart.", "info");
}

function renderCartModal() {
  if (!state.cart.length) {
    els.cartModalBody.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let grandTotal = 0;

  els.cartModalBody.innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${state.cart.map((item) => {
            const total = item.price * item.quantity;
            grandTotal += total;

            return `
              <tr>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img src="${item.imageUrl}" alt="${item.name}" style="width:50px;height:50px;object-fit:contain;">
                    <span>${item.name}</span>
                  </div>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                  <div class="input-group input-group-sm" style="width:110px;">
                    <button class="btn btn-outline-secondary decrease-qty" data-id="${item.id}" type="button">-</button>
                    <input class="form-control text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary increase-qty" data-id="${item.id}" type="button">+</button>
                  </div>
                </td>
                <td>$${total.toFixed(2)}</td>
                <td>
                  <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}" type="button">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-end">
      <h4>Grand Total: $${grandTotal.toFixed(2)}</h4>
    </div>
  `;

  els.cartModalBody.querySelectorAll(".decrease-qty").forEach((button) => {
    button.addEventListener("click", () => updateCartItemQuantity(Number(button.dataset.id), -1));
  });

  els.cartModalBody.querySelectorAll(".increase-qty").forEach((button) => {
    button.addEventListener("click", () => updateCartItemQuantity(Number(button.dataset.id), 1));
  });

  els.cartModalBody.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.id)));
  });
}

function verifyIdentity() {
  const formData = {
    fullName: document.getElementById("fullName").value,
    idNumber: document.getElementById("idNumber").value,
    idPhoto: document.getElementById("idPhoto").files[0]
  };

  const validation = FormValidator.validateIdentityForm(formData);
  if (!validation.isValid) {
    window.showToast("Error", Object.values(validation.errors).join(" "), "danger");
    return;
  }

  const productId = Number(document.getElementById("identityModal").dataset.productId);
  const product = state.products.find((item) => item.id === productId);

  if (!product) return;

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
    existing.verified = true;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      verified: true
    });
  }

  saveCart();
  window.showToast("Success", `${product.name} added after verification.`, "success");

  const modalEl = document.getElementById("identityModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  document.getElementById("identityForm").reset();
}

function checkout() {
  if (!state.cart.length) {
    window.showToast("Error", "Your cart is empty.", "danger");
    return;
  }

  const unverifiedPremium = state.cart.filter((item) => item.price > 1000 && !item.verified);
  if (unverifiedPremium.length) {
    window.showToast("Error", "Complete identity verification for premium items first.", "danger");
    return;
  }

  state.cart = [];
  saveCart();
  renderCartModal();

  const modal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
  if (modal) modal.hide();

  window.showToast("Success", "Order placed successfully.", "success");
}

async function refreshData() {
  state.products = await WatchAPI.getAllWatches();
  state.filteredProducts = [...state.products];
  renderProducts(state.filteredProducts);
  filterPanel.render(state.products);
}

const filterPanel = new FilterPanel(els.filterPanel, applyFilters);
const adminPanel = new AdminPanel(els.adminPanel, {
  onDataChanged: refreshData
});

async function init() {
  updateCartCount();
  await refreshData();
  await adminPanel.render();

  els.cartBtn.addEventListener("click", () => {
    renderCartModal();
    new bootstrap.Modal(document.getElementById("cartModal")).show();
  });

  els.checkoutBtn.addEventListener("click", checkout);
  els.verifyIdentityBtn.addEventListener("click", verifyIdentity);

  els.productGrid.addEventListener("click", (event) => {
    const viewBtn = event.target.closest(".view-product-btn");
    const addBtn = event.target.closest(".add-to-cart-btn");

    if (viewBtn) {
      const product = state.products.find((item) => item.id === Number(viewBtn.dataset.id));
      if (product) showProductModal(product);
    }

    if (addBtn) {
      const product = state.products.find((item) => item.id === Number(addBtn.dataset.id));
      if (product) addToCart(product);
    }
  });

  els.productModalContent.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".add-to-cart-btn");
    if (!addBtn) return;

    const product = state.products.find((item) => item.id === Number(addBtn.dataset.id));
    if (product) addToCart(product);
  });
}

init().catch((error) => {
  console.error(error);
  window.showToast("Error", "Failed to initialize application.", "danger");
});