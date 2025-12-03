import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, DollarSign, MapPin } from 'lucide-react';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import MealCard from '../components/MealCard';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addItem } = useCart();

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      const [restaurantRes, mealsRes] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/meals/restaurant/${id}`)
      ]);
      setRestaurant(restaurantRes.data);
      setMeals(mealsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (meal) => {
    const mealWithRestaurant = { ...meal, restaurant };
    const success = addItem(mealWithRestaurant);
    if (success) {
      alert('Added to cart!');
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Restaurant not found</p>
      </div>
    );
  }

  const categories = ['all', ...new Set(meals.map(m => m.category).filter(Boolean))];
  const filteredMeals = selectedCategory === 'all' 
    ? meals 
    : meals.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Restaurant Header */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                restaurant.isActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {restaurant.isActive ? 'Open Now' : 'Closed'}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                {restaurant.cuisine} Cuisine
              </span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
            <p className="text-xl mb-6 text-gray-200 max-w-3xl">{restaurant.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 fill-current text-yellow-400" />
                  <span className="text-2xl font-bold">{restaurant.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <p className="text-sm text-gray-300">{restaurant.totalReviews || '100'}+ Reviews</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg font-bold">{restaurant.deliveryTime || '25-35'}</span>
                </div>
                <p className="text-sm text-gray-300">Delivery Time</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <span className="text-lg font-bold">${restaurant.deliveryFee?.toFixed(2) || '2.99'}</span>
                </div>
                <p className="text-sm text-gray-300">Delivery Fee</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <span className="text-lg font-bold">{restaurant.address?.city || 'City'}</span>
                </div>
                <p className="text-sm text-gray-300">Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {/* Category Filter */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Menu Categories</h3>
          <div className="flex flex-wrap gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : (category || '').replace(/_/g, ' ').charAt(0).toUpperCase() + (category || '').slice(1).replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Grid */}
        {filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map(meal => (
              <MealCard key={meal._id} meal={meal} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No meals available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
