import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Star, MessageCircle } from 'lucide-react';
import api from '../config/api';
import LiveOrderTracker from '../components/LiveOrderTracker';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'cancelled' });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/restaurants/${order.restaurant._id}/reviews`, {
        orderId: order._id,
        rating: review.rating,
        comment: review.comment
      });
      setShowReview(false);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button onClick={() => navigate('/orders')} className="btn-primary">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="glass-card p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-emerald-600 font-semibold text-lg">{order.restaurant?.name}</p>
                  <p className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ${order.total?.toFixed(2)}
                  </p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold mt-2 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {order.status === 'pending' && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button
                    onClick={() => setShowReview(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Leave Review
                  </button>
                )}
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.meal?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                      alt={item.meal?.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.meal?.name}</h4>
                      <p className="text-gray-600 text-sm">{item.meal?.description}</p>
                      <p className="text-emerald-600 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${(order.total - 5.99).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>$5.99</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Delivery Address</h4>
                    <p className="text-gray-600">
                      {order.deliveryAddress?.street}<br />
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Estimated Delivery</h4>
                    <p className="text-gray-600">
                      {order.status === 'delivered' ? 'Delivered' : '25-35 minutes'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Tracking Sidebar */}
          <div className="lg:col-span-1">
            {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery') && (
              <LiveOrderTracker orderId={order._id} initialStatus={order.status} />
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview({ ...review, rating: star })}
                        className={`text-2xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    className="input-field"
                    rows="4"
                    placeholder="Share your experience..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 btn-primary">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReview(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}