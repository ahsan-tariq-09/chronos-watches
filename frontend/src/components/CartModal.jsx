export default function CartModal({ isOpen, cart, total, onClose, onQuantityChange, onRemove, onCheckout }) {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document"><div className="modal-content">
        <div className="modal-header"><h5 className="modal-title">Your Cart</h5><button className="btn-close" onClick={onClose} /></div>
        <div className="modal-body">
          {!cart.length ? <p>Your cart is empty.</p> : (
            <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th /></tr></thead><tbody>
              {cart.map((item) => <tr key={item.id}><td><div className="d-flex align-items-center gap-2"><img src={item.imageUrl} alt={item.name} className="cart-thumb" /><span>{item.name}</span></div></td><td>${item.price.toFixed(2)}</td><td><div className="input-group input-group-sm qty-group"><button className="btn btn-outline-secondary" onClick={() => onQuantityChange(item.id, -1)}>-</button><input className="form-control text-center" value={item.quantity} readOnly /><button className="btn btn-outline-secondary" onClick={() => onQuantityChange(item.id, 1)}>+</button></div></td><td>${(item.price * item.quantity).toFixed(2)}</td><td><button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}><i className="bi bi-trash" /></button></td></tr>)}
            </tbody></table></div>
          )}
          <div className="d-flex justify-content-end"><h4>Grand Total: ${total.toFixed(2)}</h4></div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Continue Shopping</button><button className="btn btn-primary" onClick={onCheckout}>Proceed to Checkout</button></div>
      </div></div>
      <div className="modal-backdrop show" onClick={onClose} />
    </div>
  );
}
