import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    // Redirect to orders page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Your order has been placed successfully and is being prepared.
        </p>

        {orderId && (
          <div className="glass-card p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">Order ID</h2>
            <p className="text-emerald-600 font-mono text-lg">{orderId}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-emerald-500" />
            <span>Estimated delivery: 25-35 minutes</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span>Delivering to your address</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5 text-emerald-500" />
            <span>We'll call you when we arrive</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full btn-primary"
          >
            Track Your Order
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full btn-secondary"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Redirecting to orders page in 5 seconds...
        </p>
      </div>
    </div>
  );
}