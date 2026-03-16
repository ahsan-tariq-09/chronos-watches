import { MOVEMENT_OPTIONS, STYLE_OPTIONS } from "./constants";

function requiredText(value, min, label) {
  const parsed = String(value || "").trim();
  if (parsed.length < min) return `${label} must be at least ${min} characters.`;
  return "";
}

function positiveNumber(value, label) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return `${label} must be a positive number.`;
  return "";
}

function nonNegativeInteger(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return `${label} must be zero or a positive integer.`;
  return "";
}

export function validateProductForm(formData) {
  const errors = {
    name: requiredText(formData.name, 2, "Product name"),
    brand: requiredText(formData.brand, 2, "Brand name"),
    price: positiveNumber(formData.price, "Price"),
    style: STYLE_OPTIONS.includes(formData.style) ? "" : "Please select a valid style.",
    movement: MOVEMENT_OPTIONS.includes(formData.movement) ? "" : "Please select a valid movement.",
    stock: nonNegativeInteger(formData.stock, "Stock"),
    imageUrl: isValidUrl(formData.imageUrl) ? "" : "Please enter a valid image URL.",
    description: requiredText(formData.description, 10, "Description")
  };

  return {
    isValid: Object.values(errors).every((value) => !value),
    errors
  };
}

export function validateIdentityForm(formData) {
  const errors = {
    fullName: requiredText(formData.fullName, 3, "Full name"),
    idNumber: requiredText(formData.idNumber, 6, "ID number"),
    idPhoto: formData.idPhoto ? "" : "Please upload an ID photo."
  };

  return {
    isValid: Object.values(errors).every((value) => !value),
    errors
  };
}

function isValidUrl(value) {
  try {
    new URL(String(value || ""));
    return true;
  } catch {
    return false;
  }
}
