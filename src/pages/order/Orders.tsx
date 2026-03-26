import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import { Clock, Package, Truck, CheckCircle, MapPin, ClipboardCheck, CookingPot, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Order.css';

function Orders() {
  const { user } = useAuth();
  const orders = useQuery(api.orders.listUserOrders, user ? { userId: user._id as any } : "skip");
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="order-page empty">
        <div className="order-container">
          <h2>Please sign in to view your orders</h2>
          <button className="auth-btn" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={20} className="status-pending" />;
      case 'Approved': return <CheckCircle size={20} className="status-approved" />;
      case 'Preparing': return <Package size={20} className="status-preparing" />;
      case 'Delivering': return <Truck size={20} className="status-delivering" />;
      case 'Delivered': return <CheckCircle size={20} className="status-delivered" />;
      default: return <Clock size={20} />;
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <h1>My Orders</h1>

        {orders === undefined ? (
          <div className="loading-orders">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <ShoppingBag size={48} />
            <p>You haven't placed any orders yet</p>
            <button className="browse-btn" onClick={() => navigate('/menu')}>Explore Menu</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-id">Order ID: {order._id.substring(0, 8)}...</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`order-status-badge ${order.status.toLowerCase()}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-grid">
                    {order.items.map((item) => (
                      <div key={item._id} className="order-item-mini">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-meta">{item.quantity} x {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-delivery-info">
                    <p><MapPin size={16} /> {order.address}</p>
                    {(order as any).addressMapUrl && (
                      <a
                        href={(order as any).addressMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="order-map-link"
                      >
                        <ExternalLink size={13} />
                        View on Map
                      </a>
                    )}
                    <p className="order-total-price">Total: {order.total}</p>
                  </div>
                </div>
                
                {/* Order Progress Tracker */}
                {(() => {
                  const steps = ['Pending', 'Approved', 'Preparing', 'Delivering', 'Delivered'];
                  const currentIdx = steps.indexOf(order.status);
                  const icons = [
                    <Clock size={18} strokeWidth={1.75} />,
                    <ClipboardCheck size={18} strokeWidth={1.75} />,
                    <CookingPot size={18} strokeWidth={1.75} />,
                    <Truck size={18} strokeWidth={1.75} />,
                    <CheckCircle size={18} strokeWidth={1.75} />,
                  ];
                  return (
                    <div className="order-tracker">
                      <div className="tracker-line">
                        <div className="tracker-line-fill" style={{ width: `${currentIdx >= 0 ? (currentIdx / (steps.length - 1)) * 100 : 0}%` }} />
                      </div>
                      {steps.map((step, i) => (
                        <div key={step} className={`tracker-step ${i <= currentIdx ? 'active' : ''} ${i === currentIdx ? 'current' : ''}`}>
                          <div className="step-dot">
                            {icons[i]}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reuse icon
const ShoppingBag = ({ size }: { size: number }) => <Package size={size} />;

export default Orders;
