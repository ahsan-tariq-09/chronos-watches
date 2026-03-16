import ModalShell from "./ModalShell";

export default function ProductModal({ product, onClose, onAddToCart }) {
  return (
    <ModalShell
      isOpen={Boolean(product)}
      title={product?.name || "Product Details"}
      size="modal-lg"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Close
          </button>
          {product ? (
            <button
              className="btn btn-primary"
              disabled={product.stock <= 0}
              onClick={() => onAddToCart(product)}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          ) : null}
        </>
      }
    >
      {!product ? null : (
        <div className="row g-4">
          <div className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid modal-img rounded-2" />
          </div>
          <div className="col-md-6">
            <h4 className="mb-1">{product.brand}</h4>
            <h3 className="text-primary mb-3">${product.price.toFixed(2)}</h3>
            <p>{product.description}</p>
            <p className="mb-1">
              <strong>Style:</strong> {product.style}
            </p>
            <p className="mb-1">
              <strong>Movement:</strong> {product.movement}
            </p>
            <p className="mb-0">
              <strong>Stock:</strong> {product.stock > 0 ? product.stock : "Out of stock"}
            </p>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
