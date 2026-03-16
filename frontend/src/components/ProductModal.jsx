import ModalShell from "./ModalShell";

export default function ProductModal({ product, onClose, onAddToCart }) {
  return (
    <ModalShell isOpen={Boolean(product)} title={product?.name || "Watch Details"} size="modal-lg" onClose={onClose}>
      {product ? (
        <div className="row g-4">
          <div className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid modal-img" />
          </div>
          <div className="col-md-6">
            <h4>{product.brand}</h4>
            <h3 className="text-primary">${product.price.toFixed(2)}</h3>
            <p>{product.description}</p>
            <p><strong>Style:</strong> {product.style}</p>
            <p><strong>Movement:</strong> {product.movement}</p>
            <p><strong>Stock:</strong> {product.stock > 0 ? product.stock : "Out of stock"}</p>
            <button className="btn btn-primary" disabled={product.stock <= 0} onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      ) : null}
    </ModalShell>
  );
}
