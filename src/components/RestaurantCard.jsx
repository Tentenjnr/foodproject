import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

export default function RestaurantCard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="card group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {restaurant.isActive ? (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              Open Now
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              Closed
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Delivery Fee Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            ${restaurant.deliveryFee?.toFixed(2)} delivery
          </span>
        </div>

        {/* Overlay on closed */}
        {!restaurant.isActive && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="font-bold text-lg">Currently Closed</p>
              <p className="text-sm opacity-90">Opens tomorrow at 9:00 AM</p>
            </div>
          </div>
        )}
      </div>
      
      <Link to={`/restaurant/${restaurant._id}`} className="block p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>
          </div>
        </div>
        
        {/* Rating and Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{restaurant.rating?.toFixed(1) || '4.5'}</span>
            </div>
            <span className="text-gray-500 text-sm">({restaurant.totalReviews || '100'}+ reviews)</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{restaurant.deliveryTime || '25-35 min'}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{restaurant.address?.city || 'City'}</span>
          </div>
        </div>
        
        {/* Cuisine Tag */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
              {restaurant.cuisine}
            </span>
            <span className="text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
              View Menu →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
