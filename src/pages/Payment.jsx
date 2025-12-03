import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const deliveryAddress = location.state?.deliveryAddress;
  const restaurant = location.state?.restaurant;

  useEffect(() => {
    if (!deliveryAddress || !restaurant || cartItems.length === 0) {
      navigate('/cart');
    }
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        restaurant: restaurant._id,
        items: cartItems.map(item => ({
          meal: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          cardLast4: paymentForm.cardNumber.slice(-4),
          cardType: 'visa'
        } : null,
        total: getCartTotal() + 5.99 // Including delivery fee
      };

      const response = await api.post('/orders', orderData);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      navigate(`/order-success/${response.data._id}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <p className="text-gray-600">Secure payment processing</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'paypal' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-6 h-6 mx-auto mb-2 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                  <span className="text-sm font-medium">PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-6 h-6 mx-auto mb-2 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">$</div>
                  <span className="text-sm font-medium">Cash</span>
                </button>
              </div>
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({
                        ...paymentForm,
                        cardNumber: formatCardNumber(e.target.value)
                      })}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength="5"
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          expiryDate: formatExpiryDate(e.target.value)
                        })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        required
                        maxLength="4"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          cvv: e.target.value.replace(/\D/g, '')
                        })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm({
                        ...paymentForm,
                        cardName: e.target.value
                      })}
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Lock className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-emerald-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>${(getCartTotal() + 5.99).toFixed(2)}</span>
              </div>
            </div>

            {deliveryAddress && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-sm text-gray-600">
                  {deliveryAddress.street}<br />
                  {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}