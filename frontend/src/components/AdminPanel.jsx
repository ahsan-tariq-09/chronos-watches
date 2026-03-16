import { useMemo, useState } from "react";
import { WatchAPI } from "../services/api";
import { MOVEMENT_OPTIONS, STYLE_OPTIONS } from "../utils/constants";
import { validateProductForm } from "../utils/validation";

const emptyForm = {
  name: "",
  brand: "",
  price: "",
  style: "",
  movement: "",
  stock: "",
  imageUrl: "",
  description: ""
};

export default function AdminPanel({ products, onDataChanged, showToast }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const sortedProducts = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return [...products]
      .filter((item) => {
        const matchQuery =
          !lowerQuery ||
          item.name.toLowerCase().includes(lowerQuery) ||
          item.brand.toLowerCase().includes(lowerQuery);

        const matchStock =
          stockFilter === "all" ||
          (stockFilter === "in-stock" ? item.stock > 0 : item.stock === 0);

        return matchQuery && matchStock;
      })
      .sort((a, b) => a.id - b.id);
  }, [products, query, stockFilter]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    const validation = validateProductForm(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await WatchAPI.updateWatch(editingId, payload);
        showToast("Success", "Watch updated successfully.", "success");
      } else {
        await WatchAPI.addWatch(payload);
        showToast("Success", "Watch added successfully.", "success");
      }

      resetForm();
      await onDataChanged();
    } catch (error) {
      showToast("Error", error.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item, price: String(item.price), stock: String(item.stock) });
    setErrors({});
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this watch?")) return;

    try {
      await WatchAPI.deleteWatch(id);
      await onDataChanged();
      showToast("Success", "Watch deleted successfully.", "success");
      if (editingId === id) resetForm();
    } catch (error) {
      showToast("Error", error.message, "danger");
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="admin-form">
          <h4>{editingId ? "Edit Watch" : "Add New Watch"}</h4>
          <form onSubmit={submit} noValidate>
            {[
              ["name", "Watch Name", "text"],
              ["brand", "Brand", "text"],
              ["price", "Price ($)", "number"],
              ["stock", "Stock Quantity", "number"],
              ["imageUrl", "Image URL", "url"]
            ].map(([key, label, type]) => (
              <Field
                key={key}
                label={label}
                type={type}
                value={form[key]}
                onChange={(v) => updateField(key, v)}
                error={errors[key]}
              />
            ))}

            <SelectField
              label="Style"
              value={form.style}
              options={STYLE_OPTIONS}
              onChange={(v) => updateField("style", v)}
              error={errors.style}
            />
            <SelectField
              label="Movement"
              value={form.movement}
              options={MOVEMENT_OPTIONS}
              onChange={(v) => updateField("movement", v)}
              error={errors.movement}
            />

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows="3"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <div className="invalid-feedback">{errors.description}</div>
            </div>

            <div className="d-grid gap-2">
              <button disabled={saving} className="btn btn-primary" type="submit">
                {saving ? "Saving..." : editingId ? "Update Watch" : "Add Watch"}
              </button>
              {editingId ? (
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  Cancel Editing
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="admin-form">
          <h4>Inventory List</h4>

          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input
                className="form-control form-control-sm"
                placeholder="Search inventory by name or brand"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select form-select-sm"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!sortedProducts.length ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No watches found for the current inventory filters.
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${product.stock > 0 ? "text-bg-success" : "text-bg-secondary"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(product)}
                          title="Edit watch"
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(product.id)}
                          title="Delete watch"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        className={`form-select ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}
