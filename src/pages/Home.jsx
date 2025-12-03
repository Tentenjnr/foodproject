import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import api from '../config/api';
import RestaurantCard from '../components/RestaurantCard';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      // Handle both direct array and nested response structure
      const restaurantData = response.data.restaurants || response.data || [];
      setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Fallback mock data when backend is not available
      const mockRestaurants = [
        {
          _id: '1',
          name: 'Pizza Palace',
          description: 'Authentic Italian pizza with fresh ingredients',
          cuisine: 'italian',
          rating: 4.5,
          totalReviews: 234,
          deliveryTime: '25-35 min',
          deliveryFee: 2.99,
          isActive: true,
          address: { city: 'Downtown' }
        },
        {
          _id: '2',
          name: 'Burger Junction',
          description: 'Gourmet burgers made with premium beef',
          cuisine: 'american',
          rating: 4.3,
          totalReviews: 189,
          deliveryTime: '20-30 min',
          deliveryFee: 1.99,
          isActive: true,
          address: { city: 'Midtown' }
        }
      ];
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(false);
    }
  };

  const cuisines = ['all', ...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!restaurant) return false;
    const matchesSearch = (restaurant.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (restaurant.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-bg text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Delicious Food
              <span className="block text-yellow-300">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-emerald-50 max-w-3xl mx-auto">
              Order from the best restaurants in your city. Fresh ingredients, fast delivery, amazing taste.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-600 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-2xl text-lg font-medium"
                />
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">500+ Restaurants</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">30 Min Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">24/7 Service</span>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="/restaurant/register"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🏪 Partner with Us - Register Your Restaurant
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Cuisine</h2>
          <p className="text-gray-600 text-lg">Discover amazing food from different cultures</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {cuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCuisine === cuisine
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border border-gray-200'
              }`}
            >
              {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Restaurants</h2>
          <p className="text-gray-600 text-lg">Top-rated restaurants in your area</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading delicious restaurants...</p>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
