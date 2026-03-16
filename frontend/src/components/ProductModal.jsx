export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">{product.name}</h5><button className="btn-close" onClick={onClose} /></div>
          <div className="modal-body row g-4">
            <div className="col-md-6"><img src={product.imageUrl} alt={product.name} className="img-fluid modal-img" /></div>
            <div className="col-md-6">
              <h4>{product.brand}</h4><h3 className="text-primary">${product.price.toFixed(2)}</h3><p>{product.description}</p>
              <p><strong>Style:</strong> {product.style}</p><p><strong>Movement:</strong> {product.movement}</p><p><strong>Stock:</strong> {product.stock > 0 ? product.stock : "Out of stock"}</p>
              <button className="btn btn-primary" disabled={product.stock <= 0} onClick={() => onAddToCart(product)}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onClose} />
    </div>
  );
}
