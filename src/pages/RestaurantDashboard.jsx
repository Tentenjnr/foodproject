import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('meals');
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main_course',
    image: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [restaurantRes, mealsRes, ordersRes] = await Promise.all([
        api.get('/restaurants/my-restaurant'),
        api.get('/meals/my-meals'),
        api.get('/orders/restaurant-orders')
      ]);
      setRestaurant(restaurantRes.data);
      setMeals(mealsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async (e) => {
    e.preventDefault();
    try {
      if (editingMeal) {
        await api.put(`/meals/${editingMeal._id}`, mealForm);
      } else {
        await api.post('/meals', { ...mealForm, restaurant: restaurant._id });
      }
      fetchData();
      setShowMealForm(false);
      setEditingMeal(null);
      setMealForm({
        name: '',
        description: '',
        price: '',
        category: 'main_course',
        image: '',
        isAvailable: true
      });
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal');
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      description: meal.description,
      price: meal.price,
      category: meal.category,
      image: meal.image,
      isAvailable: meal.isAvailable
    });
    setShowMealForm(true);
  };

  const handleDeleteMeal = async (id) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      await api.delete(`/meals/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No Restaurant Found</h2>
            <p className="text-gray-600 mb-6">You need to create a restaurant first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600">{restaurant.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('meals')}
            className={`pb-4 px-2 font-semibold ${
              activeTab === 'meals'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600'
            }`}
          >
            Meals
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-semibold ${
              activeTab === 'orders'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* Meals Tab */}
        {activeTab === 'meals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <button
                onClick={() => {
                  setShowMealForm(true);
                  setEditingMeal(null);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Meal
              </button>
            </div>

            {showMealForm && (
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                </h3>
                <form onSubmit={handleSaveMeal} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Meal Name"
                      required
                      value={mealForm.name}
                      onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      required
                      step="0.01"
                      value={mealForm.price}
                      onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    required
                    value={mealForm.description}
                    onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={mealForm.category}
                      onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="appetizer">Appetizer</option>
                      <option value="main_course">Main Course</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                      <option value="salad">Salad</option>
                      <option value="soup">Soup</option>
                      <option value="pizza">Pizza</option>
                      <option value="burger">Burger</option>
                      <option value="pasta">Pasta</option>
                    </select>
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={mealForm.image}
                      onChange={(e) => setMealForm({ ...mealForm, image: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mealForm.isAvailable}
                      onChange={(e) => setMealForm({ ...mealForm, isAvailable: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Available</span>
                  </label>
                  <div className="flex gap-4">
                    <button type="submit" className="btn-primary">
                      {editingMeal ? 'Update' : 'Add'} Meal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMealForm(false);
                        setEditingMeal(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map(meal => (
                <div key={meal._id} className="card p-4">
                  <img
                    src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                    alt={meal.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{meal.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-orange-500 font-bold text-xl">${meal.price.toFixed(2)}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      meal.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {meal.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600">{order.customer?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-orange-500">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm mb-2">
                        <span>{item.quantity}x {item.meal?.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
