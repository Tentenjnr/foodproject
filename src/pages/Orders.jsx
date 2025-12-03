import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Package, MapPin, Eye } from 'lucide-react';
import api from '../config/api';
import LiveOrderTracker from '../components/LiveOrderTracker';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 text-lg">Track your order history and current deliveries</p>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-8">
              <Package className="w-16 h-16 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 text-lg mb-8">Start ordering delicious food to see your order history here</p>
            <button onClick={() => window.location.href = '/'} className="btn-primary">
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="glass-card p-8 hover:shadow-2xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-emerald-600 font-semibold text-lg mb-1">{order.restaurant?.name}</p>
                    <p className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} at {new Date(order.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-gray-500 mb-3">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery') && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Track Live
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-700 font-medium">
                              {item.quantity}x {item.meal?.name || 'Item'}
                            </span>
                            <span className="font-bold text-emerald-600">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Delivery Address</h4>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">{order.deliveryAddress.street}</p>
                            <p className="text-gray-600">{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Live Order Tracking Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-emerald-600 font-medium">{selectedOrder.restaurant?.name}</p>
              </div>
              <div className="p-4">
                <LiveOrderTracker 
                  orderId={selectedOrder._id} 
                  initialStatus={selectedOrder.status}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
