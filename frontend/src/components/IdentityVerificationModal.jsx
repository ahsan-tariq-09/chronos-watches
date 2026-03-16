import { useEffect, useState } from "react";
import { validateIdentityForm } from "../utils/validation";
import ModalShell from "./ModalShell";

const initialForm = { fullName: "", idNumber: "", idPhoto: null };

export default function IdentityVerificationModal({ product, onClose, onSuccess, showToast }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(initialForm);
      setErrors({});
    }
  }, [product]);

  const submit = () => {
    const validation = validateIdentityForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSuccess(product);
    showToast("Verification complete", "Identity verified for premium purchase.", "success");
    onClose();
  };

  return (
    <ModalShell
      isOpen={Boolean(product)}
      title="Identity Verification Required"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit}>
            Submit Verification
          </button>
        </>
      }
    >
      <p className="text-muted small">
        Premium watches over $1000 require verification before purchase completion.
      </p>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
          placeholder="Jane Doe"
          value={formData.fullName}
          onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
        />
        <div className="invalid-feedback">{errors.fullName}</div>
      </div>
      <div className="mb-3">
        <label className="form-label">Government ID Number</label>
        <input
          className={`form-control ${errors.idNumber ? "is-invalid" : ""}`}
          placeholder="ID-123456"
          value={formData.idNumber}
          onChange={(e) => setFormData((p) => ({ ...p, idNumber: e.target.value }))}
        />
        <div className="invalid-feedback">{errors.idNumber}</div>
      </div>
      <div className="mb-0">
        <label className="form-label">ID Photo</label>
        <input
          className={`form-control ${errors.idPhoto ? "is-invalid" : ""}`}
          type="file"
          accept="image/*"
          onChange={(e) => setFormData((p) => ({ ...p, idPhoto: e.target.files?.[0] || null }))}
        />
        <div className="invalid-feedback">{errors.idPhoto}</div>
      </div>
    </ModalShell>
  );
}
