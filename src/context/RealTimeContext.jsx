import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const RealTimeContext = createContext();

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

export const RealTimeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [orderUpdates, setOrderUpdates] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  // Simulate WebSocket connection (replace with actual WebSocket in production)
  useEffect(() => {
    if (isAuthenticated && user) {
      // Simulate connection
      setIsConnected(true);
      
      // Simulate receiving real-time updates
      const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance of update
          simulateOrderUpdate();
        }
      }, 10000); // Check every 10 seconds

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  const simulateOrderUpdate = () => {
    const statuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const orderId = `order_${Date.now()}`;
    
    const update = {
      orderId,
      status: randomStatus,
      timestamp: new Date(),
      message: getStatusMessage(randomStatus)
    };

    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: update
    }));

    addNotification({
      id: Date.now(),
      type: 'order_update',
      title: 'Order Update',
      message: update.message,
      timestamp: new Date(),
      read: false
    });
  };

  const getStatusMessage = (status) => {
    const messages = {
      confirmed: 'Your order has been confirmed!',
      preparing: 'Your order is being prepared',
      out_for_delivery: 'Your order is out for delivery',
      delivered: 'Your order has been delivered!'
    };
    return messages[status] || 'Order status updated';
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const value = {
    notifications,
    orderUpdates,
    isConnected,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    getUnreadCount
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};