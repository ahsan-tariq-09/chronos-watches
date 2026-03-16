import { useMemo, useState } from "react";
import { WatchAPI } from "../services/api";
import { MOVEMENT_OPTIONS, STYLE_OPTIONS } from "../utils/constants";
import { validateProductForm } from "../utils/validation";

const emptyForm = { name: "", brand: "", price: "", style: "", movement: "", stock: "", imageUrl: "", description: "" };

export default function AdminPanel({ products, onDataChanged, showToast }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");

  const filteredInventory = useMemo(() => {
    const term = inventorySearch.trim().toLowerCase();
    return [...products]
      .sort((a, b) => a.id - b.id)
      .filter((item) => !term || item.name.toLowerCase().includes(term) || item.brand.toLowerCase().includes(term));
  }, [products, inventorySearch]);

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      brand: form.brand.trim(),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock)
    };

    const validation = validateProductForm(payload);
    setErrors(validation.errors);
    if (!validation.isValid) return;

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
    setErrors({});
    setForm({
      name: item.name,
      brand: item.brand,
      price: String(item.price),
      style: item.style,
      movement: item.movement,
      stock: String(item.stock),
      imageUrl: item.imageUrl,
      description: item.description
    });
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

  const onFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  return (
    <div className="row g-4">
      <div className="col-xl-5">
        <div className="admin-form">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{editingId ? "Edit Watch" : "Add New Watch"}</h4>
            {editingId ? <span className="badge text-bg-info">Editing #{editingId}</span> : null}
          </div>

          <form onSubmit={submit} noValidate>
            <div className="row g-3">
              <div className="col-md-6"><Field label="Watch Name" value={form.name} onChange={(v) => onFieldChange("name", v)} error={errors.name} /></div>
              <div className="col-md-6"><Field label="Brand" value={form.brand} onChange={(v) => onFieldChange("brand", v)} error={errors.brand} /></div>
              <div className="col-md-6"><Field label="Price ($)" type="number" value={form.price} onChange={(v) => onFieldChange("price", v)} error={errors.price} /></div>
              <div className="col-md-6"><Field label="Stock Quantity" type="number" value={form.stock} onChange={(v) => onFieldChange("stock", v)} error={errors.stock} /></div>
              <div className="col-md-6"><SelectField label="Style" value={form.style} options={STYLE_OPTIONS} onChange={(v) => onFieldChange("style", v)} error={errors.style} /></div>
              <div className="col-md-6"><SelectField label="Movement" value={form.movement} options={MOVEMENT_OPTIONS} onChange={(v) => onFieldChange("movement", v)} error={errors.movement} /></div>
              <div className="col-12"><Field label="Image URL" type="url" value={form.imageUrl} onChange={(v) => onFieldChange("imageUrl", v)} error={errors.imageUrl} /></div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className={`form-control ${errors.description ? "is-invalid" : ""}`} rows="3" value={form.description} onChange={(e) => onFieldChange("description", e.target.value)} />
                <div className="invalid-feedback">{errors.description}</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button disabled={saving} className="btn btn-primary" type="submit">
                {saving ? "Saving..." : editingId ? "Update Watch" : "Add Watch"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Reset Form</button>
            </div>
          </form>
        </div>
      </div>

      <div className="col-xl-7">
        <div className="admin-form">
          <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-3">
            <h4 className="mb-0">Inventory List</h4>
            <div className="admin-toolbar">
              <input className="form-control form-control-sm" placeholder="Search inventory..." value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {!filteredInventory.length ? (
                  <tr><td colSpan="5" className="text-center text-muted py-4">No watches found for current search.</td></tr>
                ) : filteredInventory.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${product.stock === 0 ? "text-bg-danger" : product.stock < 5 ? "text-bg-warning" : "text-bg-success"}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(product)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(product.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
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
    <div>
      <label className="form-label">{label}</label>
      <input className={`form-control ${error ? "is-invalid" : ""}`} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <select className={`form-select ${error ? "is-invalid" : ""}`} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select {label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}
