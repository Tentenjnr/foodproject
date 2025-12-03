import { useState, useEffect } from 'react';
import { Store, Star, Clock, MapPin, Eye, Ban, CheckCircle } from 'lucide-react';
import api from '../config/api';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async (restaurantId) => {
    try {
      await api.put(`/restaurants/${restaurantId}/status`);
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurant Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} 
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Store className="w-4 h-4 mr-2" />
                    <span className="capitalize">{restaurant.cuisine} Cuisine</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{restaurant.rating?.toFixed(1) || '4.5'} ({restaurant.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{restaurant.deliveryTime || '25-35'} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{restaurant.address?.city || 'City'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleRestaurantStatus(restaurant._id)}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium ${
                      restaurant.isActive 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {restaurant.isActive ? <Ban className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                    {restaurant.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="px-3 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md text-sm font-medium">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}