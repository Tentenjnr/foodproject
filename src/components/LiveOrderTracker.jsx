import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, Truck, MapPin, Phone } from 'lucide-react';

export default function LiveOrderTracker({ orderId, initialStatus = 'pending' }) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [estimatedTime, setEstimatedTime] = useState(30);

  const orderSteps = [
    { id: 'pending', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Restaurant confirmed your order' },
    { id: 'preparing', label: 'Preparing', icon: Package, description: 'Your food is being prepared' },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' }
  ];

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = orderSteps.findIndex(step => step.id === currentStatus);
      if (currentIndex < orderSteps.length - 1 && Math.random() > 0.7) {
        setCurrentStatus(orderSteps[currentIndex + 1].id);
        setEstimatedTime(prev => Math.max(0, prev - 5));
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [currentStatus]);

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex(step => step.id === currentStatus);
  };

  const isStepCompleted = (stepIndex) => {
    return stepIndex <= getCurrentStepIndex();
  };

  const isStepActive = (stepIndex) => {
    return stepIndex === getCurrentStepIndex();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Live Order Tracking</h3>
        <div className="flex items-center gap-2 text-emerald-600">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Estimated Time */}
      {currentStatus !== 'delivered' && (
        <div className="bg-emerald-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-900">Estimated Delivery</p>
              <p className="text-emerald-700">{estimatedTime} minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-4">
        {orderSteps.map((step, index) => {
          const Icon = step.icon;
          const completed = isStepCompleted(index);
          const active = isStepActive(index);

          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${completed 
                  ? 'bg-emerald-500 text-white' 
                  : active 
                    ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50' 
                    : 'bg-gray-100 text-gray-400'
                }
                ${active ? 'animate-pulse' : ''}
              `}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium ${completed || active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </h4>
                  {completed && !active && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className={`text-sm ${completed || active ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
                {active && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-emerald-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              {completed && (
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delivery Info */}
      {currentStatus === 'out_for_delivery' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Delivery Driver</p>
                <p className="text-blue-700 text-sm">John Doe</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              <Phone className="w-4 h-4" />
              Call
            </button>
          </div>
        </div>
      )}

      {/* Delivery Success */}
      {currentStatus === 'delivered' && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="font-bold text-green-900 mb-1">Order Delivered!</h4>
          <p className="text-green-700 text-sm">Thank you for choosing us. Enjoy your meal!</p>
        </div>
      )}
    </div>
  );
}