import { Plus, Leaf, Flame, Star, Heart } from 'lucide-react';
import { useState } from 'react';

export default function MealCard({ meal, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const spiceIcons = {
    mild: 1,
    medium: 2,
    hot: 3,
    very_hot: 4
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(meal);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="card group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'} 
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {meal.isPopular && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              🔥 Popular
            </span>
          )}
          {!meal.isAvailable && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Sold Out
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

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="bg-white/95 backdrop-blur-sm text-emerald-600 text-lg font-bold px-4 py-2 rounded-full shadow-lg">
            ${meal.price.toFixed(2)}
          </span>
        </div>

        {/* Unavailable Overlay */}
        {!meal.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="font-bold text-lg">Currently Unavailable</p>
              <p className="text-sm opacity-90">Check back later</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {meal.name}
          </h3>
          <p className="text-gray-600 line-clamp-2 leading-relaxed">{meal.description}</p>
        </div>
        
        {/* Rating */}
        {meal.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{meal.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500 text-sm">({meal.totalReviews || '50'}+ reviews)</span>
          </div>
        )}
        
        {/* Dietary Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {meal.dietaryTags?.isVegetarian && (
            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              <Leaf className="w-3 h-3" />
              Vegetarian
            </span>
          )}
          {meal.dietaryTags?.isVegan && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              🌱 Vegan
            </span>
          )}
          {meal.spiceLevel && meal.spiceLevel !== 'none' && (
            <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
              {[...Array(spiceIcons[meal.spiceLevel] || 0)].map((_, i) => (
                <Flame key={i} className="w-3 h-3" />
              ))}
              Spicy
            </span>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!meal.isAvailable || isAdding}
          className={`w-full btn-primary flex items-center justify-center gap-2 h-12 ${
            isAdding ? 'bg-green-500 hover:bg-green-500' : ''
          }`}
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Added!
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
