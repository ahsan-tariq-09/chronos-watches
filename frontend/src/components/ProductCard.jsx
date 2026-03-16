export default function ProductCard({ product, onViewDetails, onAddToCart }) {
  const stockVariant = product.stock === 0 ? "danger" : product.stock < 5 ? "warning" : "success";

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img src={product.imageUrl} className="card-img-top watch-card-image" alt={product.name} />
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between gap-2 mb-2">
            <h5 className="card-title mb-0">{product.name}</h5>
            <span className={`badge text-bg-${stockVariant}`}>{product.stock === 0 ? "Out" : `${product.stock}`}</span>
          </div>
          <p className="text-muted mb-2">{product.brand}</p>
          <h6 className="text-primary mb-2">${product.price.toFixed(2)}</h6>
          <p className="small text-muted mb-3 text-capitalize">{product.style} · {product.movement}</p>
          <div className="mt-auto d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => onViewDetails(product)}>View</button>
            <button className="btn btn-primary btn-sm" disabled={product.stock <= 0} onClick={() => onAddToCart(product)}>
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
