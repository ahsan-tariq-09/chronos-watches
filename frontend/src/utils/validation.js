export class FormValidator {
  static validateProductForm(formData) {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters.";
    }

    if (!formData.brand || formData.brand.trim().length < 2) {
      errors.brand = "Brand name must be at least 2 characters.";
    }

    if (!formData.price || Number.isNaN(formData.price) || formData.price <= 0) {
      errors.price = "Price must be a positive number.";
    }

    if (!formData.style || !["dress", "sports", "casual", "luxury", "limited edition"].includes(formData.style)) {
      errors.style = "Please select a valid style.";
    }

    if (!formData.movement || !["quartz", "automatic", "mechanical"].includes(formData.movement)) {
      errors.movement = "Please select a valid movement.";
    }

    if (!Number.isInteger(formData.stock) || formData.stock < 0) {
      errors.stock = "Stock must be zero or a positive integer.";
    }

    if (!formData.imageUrl || !this.isValidUrl(formData.imageUrl)) {
      errors.imageUrl = "Please enter a valid image URL.";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateIdentityForm(formData) {
    const errors = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.idNumber || formData.idNumber.trim().length < 6) {
      errors.idNumber = "ID number must be at least 6 characters.";
    }

    if (!formData.idPhoto) {
      errors.idPhoto = "Please upload an ID photo.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}