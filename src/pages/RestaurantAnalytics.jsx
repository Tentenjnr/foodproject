import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, Clock, Star, Calendar } from 'lucide-react';
import api from '../config/api';

export default function RestaurantAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCustomers: 0,
    dailySales: [],
    topMeals: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/analytics/restaurant?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{change >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{item.label}</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-900 font-bold min-w-[60px] text-right">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Analytics</h1>
              <p className="text-gray-600 mt-2">Track your restaurant's performance and growth</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            change={12.5}
            color="bg-gradient-to-r from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={analytics.totalOrders.toLocaleString()}
            change={8.2}
            color="bg-gradient-to-r from-blue-500 to-indigo-600"
          />
          <StatCard
            icon={Users}
            title="Avg Order Value"
            value={`$${analytics.avgOrderValue.toFixed(2)}`}
            change={-2.1}
            color="bg-gradient-to-r from-purple-500 to-pink-600"
          />
          <StatCard
            icon={Star}
            title="Total Customers"
            value={analytics.totalCustomers.toLocaleString()}
            change={15.3}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Sales Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Sales</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.dailySales.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-1000 hover:from-emerald-600 hover:to-teal-500"
                    style={{ 
                      height: `${(day.sales / Math.max(...analytics.dailySales.map(d => d.sales))) * 200}px`,
                      minHeight: '20px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 font-medium">{day.date}</span>
                  <span className="text-xs text-gray-900 font-bold">${day.sales}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Meals */}
          <SimpleChart
            data={analytics.topMeals.map(meal => ({
              label: meal.name,
              value: meal.orders
            }))}
            title="Top Selling Meals"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'on_the_way' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}