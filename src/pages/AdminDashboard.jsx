import { useState, useEffect } from 'react';
import { Users, Store, Package, DollarSign, TrendingUp } from 'lucide-react';
import api from '../config/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, restaurantsRes, ordersRes] = await Promise.all([
        api.get('/users'),
        api.get('/restaurants'),
        api.get('/orders/all')
      ]);
      
      setUsers(usersRes.data);
      setRestaurants(restaurantsRes.data);
      setOrders(ordersRes.data);
      
      setStats({
        totalUsers: usersRes.data.length,
        totalRestaurants: restaurantsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue: ordersRes.data.reduce((sum, order) => sum + order.total, 0)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}/status`, { isActive: !isActive });
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleToggleRestaurantStatus = async (restaurantId, isActive) => {
    try {
      await api.put(`/restaurants/${restaurantId}/status`, { isActive: !isActive });
      fetchData();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage your platform and monitor performance</p>
        </div>

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium mb-2">Total Users</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-emerald-600 text-sm font-semibold mt-2">+12% this month</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium mb-2">Restaurants</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.totalRestaurants}</p>
                  <p className="text-emerald-600 text-sm font-semibold mt-2">+8% this month</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium mb-2">Total Orders</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-emerald-600 text-sm font-semibold mt-2">+25% this month</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium mb-2">Revenue</p>
                  <p className="text-4xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-emerald-600 text-sm font-semibold mt-2">+18% this month</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border border-gray-200'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border border-gray-200'
            }`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'restaurants'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border border-gray-200'
            }`}
          >
            🏪 Restaurants ({restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border border-gray-200'
            }`}
          >
            📦 Orders ({orders.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-semibold">
                          {user.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Management</h2>
              <p className="text-gray-600">Monitor and manage restaurant partners</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Restaurant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cuisine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {restaurants.map(restaurant => (
                    <tr key={restaurant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'} 
                            alt={restaurant.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{restaurant.name}</p>
                            <p className="text-gray-600 text-sm">{restaurant.address?.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                          {restaurant.cuisine}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-semibold">{restaurant.rating?.toFixed(1) || '4.5'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
                          restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleRestaurantStatus(restaurant._id, restaurant.isActive)}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          {restaurant.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h2>
              <p className="text-gray-600">Monitor all platform orders and transactions</p>
            </div>
            
            {orders.map(order => (
              <div key={order._id} className="glass-card p-8 hover:shadow-2xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{order.customer?.name}</span>
                      <span>•</span>
                      <span className="font-medium text-emerald-600">{order.restaurant?.name}</span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${order.total?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-gray-500 text-sm">{order.items?.length || 0} items</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}