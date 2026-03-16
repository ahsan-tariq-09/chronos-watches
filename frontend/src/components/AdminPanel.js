import { WatchAPI } from "../services/api.js";
import { FormValidator } from "../utils/validation.js";

export class AdminPanel {
  constructor(container, options = {}) {
    this.container = container;
    this.onDataChanged = options.onDataChanged || (() => {});
    this.editProductId = null;
  }

  async render() {
    this.container.innerHTML = `
      <div class="row">
        <div class="col-lg-6">
          <div class="admin-form">
            <h4>${this.editProductId ? "Edit Watch" : "Add New Watch"}</h4>
            <form id="productForm" novalidate>
              <div class="mb-3">
                <label for="name" class="form-label">Watch Name</label>
                <input type="text" class="form-control" id="name" required>
                <div class="invalid-feedback" id="error-name"></div>
              </div>

              <div class="mb-3">
                <label for="brand" class="form-label">Brand</label>
                <input type="text" class="form-control" id="brand" required>
                <div class="invalid-feedback" id="error-brand"></div>
              </div>

              <div class="mb-3">
                <label for="price" class="form-label">Price ($)</label>
                <input type="number" class="form-control" id="price" min="0" step="0.01" required>
                <div class="invalid-feedback" id="error-price"></div>
              </div>

              <div class="mb-3">
                <label for="style" class="form-label">Style</label>
                <select class="form-select" id="style" required>
                  <option value="">Select Style</option>
                  <option value="dress">Dress</option>
                  <option value="sports">Sports</option>
                  <option value="casual">Casual</option>
                  <option value="luxury">Luxury</option>
                  <option value="limited edition">Limited Edition</option>
                </select>
                <div class="invalid-feedback" id="error-style"></div>
              </div>

              <div class="mb-3">
                <label for="movement" class="form-label">Movement</label>
                <select class="form-select" id="movement" required>
                  <option value="">Select Movement</option>
                  <option value="quartz">Quartz</option>
                  <option value="automatic">Automatic</option>
                  <option value="mechanical">Mechanical</option>
                </select>
                <div class="invalid-feedback" id="error-movement"></div>
              </div>

              <div class="mb-3">
                <label for="stock" class="form-label">Stock Quantity</label>
                <input type="number" class="form-control" id="stock" min="0" required>
                <div class="invalid-feedback" id="error-stock"></div>
              </div>

              <div class="mb-3">
                <label for="imageUrl" class="form-label">Image URL</label>
                <input type="url" class="form-control" id="imageUrl" required>
                <div class="invalid-feedback" id="error-imageUrl"></div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" rows="3" required></textarea>
                <div class="invalid-feedback" id="error-description"></div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">
                  ${this.editProductId ? "Update Watch" : "Add Watch"}
                </button>
                ${this.editProductId ? '<button type="button" class="btn btn-outline-secondary" id="cancelEdit">Cancel</button>' : ""}
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="admin-form">
            <h4>Inventory List</h4>
            <div class="table-responsive">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="inventoryList">
                  <tr>
                    <td colspan="5" class="text-center">Loading inventory...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    await this.loadInventory();
    this.attachEvents();
  }

  attachEvents() {
    const form = this.container.querySelector("#productForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleFormSubmit();
    });

    const cancelBtn = this.container.querySelector("#cancelEdit");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", async () => {
        this.editProductId = null;
        await this.render();
      });
    }
  }

  async loadInventory() {
    const inventoryList = this.container.querySelector("#inventoryList");

    try {
      const products = await WatchAPI.getAllWatches();

      if (!products.length) {
        inventoryList.innerHTML = `<tr><td colspan="5" class="text-center">No watches in inventory.</td></tr>`;
        return;
      }

      inventoryList.innerHTML = products.map((product) => `
        <tr>
          <td>${product.name}</td>
          <td>${product.brand}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.stock}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary edit-product" data-id="${product.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `).join("");

      inventoryList.querySelectorAll(".edit-product").forEach((button) => {
        button.addEventListener("click", () => this.editProduct(Number(button.dataset.id)));
      });

      inventoryList.querySelectorAll(".delete-product").forEach((button) => {
        button.addEventListener("click", () => this.deleteProduct(Number(button.dataset.id)));
      });
    } catch (error) {
      inventoryList.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load inventory.</td></tr>`;
    }
  }

  getFormData() {
    return {
      name: this.container.querySelector("#name").value.trim(),
      brand: this.container.querySelector("#brand").value.trim(),
      price: Number(this.container.querySelector("#price").value),
      style: this.container.querySelector("#style").value,
      movement: this.container.querySelector("#movement").value,
      stock: Number(this.container.querySelector("#stock").value),
      imageUrl: this.container.querySelector("#imageUrl").value.trim(),
      description: this.container.querySelector("#description").value.trim()
    };
  }

  clearValidation() {
    const form = this.container.querySelector("#productForm");
    form.querySelectorAll(".form-control, .form-select").forEach((field) => {
      field.classList.remove("is-invalid");
    });

    form.querySelectorAll(".invalid-feedback").forEach((node) => {
      node.textContent = "";
    });
  }

  showValidationErrors(errors) {
    Object.entries(errors).forEach(([key, message]) => {
      const field = this.container.querySelector(`#${key}`);
      const error = this.container.querySelector(`#error-${key}`);

      if (field) field.classList.add("is-invalid");
      if (error) error.textContent = message;
    });
  }

  async editProduct(productId) {
    const product = await WatchAPI.getWatchById(productId);
    this.editProductId = productId;
    await this.render();

    this.container.querySelector("#name").value = product.name;
    this.container.querySelector("#brand").value = product.brand;
    this.container.querySelector("#price").value = product.price;
    this.container.querySelector("#style").value = product.style;
    this.container.querySelector("#movement").value = product.movement;
    this.container.querySelector("#stock").value = product.stock;
    this.container.querySelector("#imageUrl").value = product.imageUrl;
    this.container.querySelector("#description").value = product.description;
  }

  async deleteProduct(productId) {
    const confirmed = window.confirm("Are you sure you want to delete this watch?");
    if (!confirmed) return;

    await WatchAPI.deleteWatch(productId);
    this.onDataChanged();
    await this.render();
    window.showToast("Success", "Watch deleted successfully.", "success");
  }

  async handleFormSubmit() {
    this.clearValidation();

    const productData = this.getFormData();
    const validation = FormValidator.validateProductForm(productData);

    if (!validation.isValid) {
      this.showValidationErrors(validation.errors);
      return;
    }

    if (this.editProductId) {
      await WatchAPI.updateWatch(this.editProductId, productData);
      window.showToast("Success", "Watch updated successfully.", "success");
      this.editProductId = null;
    } else {
      await WatchAPI.addWatch(productData);
      window.showToast("Success", "Watch added successfully.", "success");
    }

    this.onDataChanged();
    await this.render();
  }
}