import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MapPin, Phone, CreditCard } from 'lucide-react';
import './Order.css';

function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="order-page empty">
        <div className="order-container">
          <h2>Please sign in to checkout</h2>
          <button className="auth-btn" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="order-page empty">
        <div className="order-container">
          <h2>Your cart is empty</h2>
          <button className="browse-btn" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        userId: user._id as any,
        total: totalPrice,
        address,
        phone,
        items: items.map(i => ({
          mealId: i.mealId as any,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
          image: i.image
        }))
      });
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <h1>Checkout</h1>
        
        <div className="checkout-grid">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3><MapPin size={20} /> Delivery Address</h3>
                <textarea 
                  placeholder="Enter your full delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-section">
                <h3><Phone size={20} /> Contact Phone</h3>
                <input 
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-section">
                <h3><CreditCard size={20} /> Payment Method</h3>
                <div className="payment-method-fixed">
                  <input type="radio" checked readOnly />
                  <span>Cash on Delivery</span>
                </div>
              </div>

              {error && <div className="order-error">{error}</div>}

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order - ${totalPrice}`}
              </button>
            </form>
          </div>

          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.mealId} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="summary-item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                      <p className="item-price">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
