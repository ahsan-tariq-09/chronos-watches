import EmptyState from "./EmptyState";
import ModalShell from "./ModalShell";

export default function CartModal({
  isOpen,
  cart,
  total,
  onClose,
  onQuantityChange,
  onRemove,
  onCheckout
}) {
  return (
    <ModalShell
      isOpen={isOpen}
      title="Your Cart"
      size="modal-lg"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Continue Shopping
          </button>
          <button className="btn btn-primary" disabled={!cart.length} onClick={onCheckout}>
            Proceed to Checkout
          </button>
        </>
      }
    >
      {!cart.length ? (
        <EmptyState
          icon="bi-cart-x"
          title="Your cart is currently empty"
          message="Explore the catalog and add a watch to continue to checkout."
        />
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.imageUrl} alt={item.name} className="cart-thumb rounded" />
                      <div>
                        <div>{item.name}</div>
                        {item.price > 1000 && !item.verified ? (
                          <small className="text-warning">Pending identity verification</small>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="input-group input-group-sm qty-group">
                      <button className="btn btn-outline-secondary" onClick={() => onQuantityChange(item.id, -1)}>
                        -
                      </button>
                      <input className="form-control text-center" value={item.quantity} readOnly />
                      <button className="btn btn-outline-secondary" onClick={() => onQuantityChange(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}>
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="d-flex justify-content-end mt-3">
        <h5 className="mb-0">Grand Total: ${total.toFixed(2)}</h5>
      </div>
    </ModalShell>
  );
}
