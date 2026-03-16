import { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import { validateIdentityForm } from "../utils/validation";

const defaultState = { fullName: "", idNumber: "", idPhoto: null };

export default function IdentityVerificationModal({ product, onClose, onSuccess, showToast }) {
  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => validateIdentityForm(formData), [formData]);

  const closeAndReset = () => {
    setFormData(defaultState);
    setSubmitted(false);
    onClose();
  };

  const submit = () => {
    setSubmitted(true);
    if (!validation.isValid) {
      showToast("Error", "Please complete all identity verification fields.", "danger");
      return;
    }
    onSuccess(product);
    closeAndReset();
  };

  const showError = (field) => submitted && validation.errors[field];

  return (
    <ModalShell
      isOpen={Boolean(product)}
      title="Identity Verification Required"
      onClose={closeAndReset}
      footer={(
        <>
          <button className="btn btn-secondary" onClick={closeAndReset}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Submit Verification</button>
        </>
      )}
    >
      <p className="text-muted small">Premium watches require identity verification before checkout.</p>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input className={`form-control ${showError("fullName") ? "is-invalid" : ""}`} value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} />
        <div className="invalid-feedback">{validation.errors.fullName}</div>
      </div>
      <div className="mb-3">
        <label className="form-label">Government ID Number</label>
        <input className={`form-control ${showError("idNumber") ? "is-invalid" : ""}`} value={formData.idNumber} onChange={(e) => setFormData((p) => ({ ...p, idNumber: e.target.value }))} />
        <div className="invalid-feedback">{validation.errors.idNumber}</div>
      </div>
      <div>
        <label className="form-label">Upload ID Photo</label>
        <input className={`form-control ${showError("idPhoto") ? "is-invalid" : ""}`} type="file" accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, idPhoto: e.target.files?.[0] || null }))} />
        <div className="invalid-feedback">{validation.errors.idPhoto}</div>
      </div>
    </ModalShell>
  );
}
