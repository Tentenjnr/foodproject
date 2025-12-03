import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('cartRestaurant');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    
    if (savedRestaurant) {
      try {
        setRestaurant(JSON.parse(savedRestaurant));
      } catch (error) {
        console.error('Error loading cart restaurant:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
    } else {
      localStorage.removeItem('cartRestaurant');
    }
  }, [restaurant]);

  const addItem = (meal, quantity = 1) => {
    // Extract restaurant from meal if it exists
    const mealRestaurant = meal.restaurant;
    
    if (restaurant && mealRestaurant && restaurant._id !== mealRestaurant._id) {
      const confirmSwitch = window.confirm(
        'Adding items from a different restaurant will clear your current cart. Continue?'
      );
      if (!confirmSwitch) return false;
      
      setItems([]);
      setRestaurant(mealRestaurant);
    } else if (!restaurant && mealRestaurant) {
      setRestaurant(mealRestaurant);
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.meal._id === meal._id);

      if (existingItem) {
        return prevItems.map(item =>
          item.meal._id === meal._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { 
        meal, 
        quantity, 
        id: `${meal._id}_${Date.now()}`
      }];
    });

    return true;
  };

  const removeItem = (itemId) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      if (newItems.length === 0) {
        setRestaurant(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.meal.price * item.quantity), 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const deliveryFee = restaurant?.deliveryFee || 0;
    const tax = subtotal * 0.08;
    return subtotal + deliveryFee + tax;
  };

  const value = {
    items,
    restaurant,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    getTotal,
    isEmpty: items.length === 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};