export default function ProductCard({ product, onViewDetails, onAddToCart }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img src={product.imageUrl} className="card-img-top watch-card-image" alt={product.name} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="text-muted mb-2">{product.brand}</p>
          <h6 className="text-primary mb-3">${product.price.toFixed(2)}</h6>
          <p className="small text-muted mb-3">{product.style} · {product.movement}</p>
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
