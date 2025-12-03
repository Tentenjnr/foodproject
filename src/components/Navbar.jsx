import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, UtensilsCrossed, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <div className="gradient-bg p-2 rounded-xl shadow-lg">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FoodExpress
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {/* Customer Navigation */}
                {user?.role === 'customer' && (
                  <>
                    <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Restaurants
                    </Link>
                    <Link to="/orders" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      My Orders
                    </Link>
                    <Link to="/cart" className="relative group">
                      <div className="p-2 rounded-xl hover:bg-emerald-50 transition-colors">
                        <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-emerald-600" />
                        {getItemCount() > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                            {getItemCount()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </>
                )}

                {/* Restaurant Owner Navigation */}
                {user?.role === 'restaurant_owner' && (
                  <>
                    <Link to="/restaurant/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-medium">
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link to="/restaurant/meals" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Meals
                    </Link>
                    <Link to="/restaurant/orders" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Orders
                    </Link>
                    <Link to="/restaurant/analytics" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Analytics
                    </Link>
                    <Link to="/restaurant/settings" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Settings
                    </Link>
                  </>
                )}

                {/* Admin Navigation */}
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-medium">
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Users
                    </Link>
                    <Link to="/admin/restaurants" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Restaurants
                    </Link>
                    <Link to="/admin/orders" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Orders
                    </Link>
                    <Link to="/admin/reports" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      Reports
                    </Link>
                  </>
                )}

                {/* Notifications */}
                <NotificationCenter />

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:block">Logout</span>
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-64 glass-card py-2 hidden group-hover:block shadow-2xl">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                {user?.role === 'customer' && (
                  <>
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Restaurants
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      My Orders
                    </Link>
                    <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Cart ({getItemCount()})
                    </Link>
                  </>
                )}
                {user?.role === 'restaurant_owner' && (
                  <>
                    <Link to="/restaurant/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Dashboard
                    </Link>
                    <Link to="/restaurant/meals" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Meals
                    </Link>
                    <Link to="/restaurant/orders" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Orders
                    </Link>
                    <Link to="/restaurant/analytics" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Analytics
                    </Link>
                    <Link to="/restaurant/settings" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Settings
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Dashboard
                    </Link>
                    <Link to="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Users
                    </Link>
                    <Link to="/admin/restaurants" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Restaurants
                    </Link>
                    <Link to="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Orders
                    </Link>
                    <Link to="/admin/reports" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                      Reports
                    </Link>
                  </>
                )}
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg">
                  Sign In
                </Link>
                <Link to="/register" className="block px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
