import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function Cart() {
  const { items, restaurant, updateQuantity, removeItem, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    instructions: ''
  });

  const subtotal = getSubtotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      alert('Please fill in all delivery address fields');
      return;
    }

    // Navigate to payment page with order data
    navigate('/payment', {
      state: {
        deliveryAddress,
        restaurant,
        cartItems: items,
        total
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-16 h-16 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 text-lg mb-8">Discover amazing restaurants and add some delicious meals to get started!</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Your Cart
          </h1>
          <p className="text-gray-600 text-lg">Review your order and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">From {restaurant?.name}</h2>
                  <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <img 
                      src={item.meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} 
                      alt={item.meal.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{item.meal.name}</h3>
                      <p className="text-emerald-600 font-bold text-lg mb-4">${item.meal.price.toFixed(2)} each</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="font-bold text-xl text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-xl text-gray-900">
                            ${(item.meal.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
              </div>
              
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                  className="input-field h-14"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    className="input-field h-14"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                    className="input-field h-14"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={deliveryAddress.zipCode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                    className="input-field h-14"
                  />
                </div>
                <textarea
                  placeholder="Special delivery instructions (optional)"
                  value={deliveryAddress.instructions}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, instructions: e.target.value })}
                  className="input-field"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Delivery Fee</span>
                  <span className="font-bold text-lg">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Tax & Fees</span>
                  <span className="font-bold text-lg">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-gray-900">Total</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-primary h-14 text-lg font-bold"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing Order...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <ShoppingBag className="w-5 h-5" />
                    Place Order
                  </div>
                )}
              </button>
              
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">Estimated Delivery</p>
                    <p className="text-emerald-600">25-35 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
