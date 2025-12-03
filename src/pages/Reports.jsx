import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Package, Calendar, Download, Filter } from 'lucide-react';
import api from '../config/api';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [reportData, setReportData] = useState({
    revenue: { total: 0, growth: 0 },
    orders: { total: 0, growth: 0 },
    customers: { total: 0, growth: 0 },
    restaurants: { total: 0, growth: 0 },
    popularMeals: [],
    topRestaurants: [],
    revenueChart: [],
    ordersByStatus: {}
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulate API calls for different report data
      const [revenueRes, ordersRes, customersRes, restaurantsRes] = await Promise.all([
        api.get(`/reports/revenue?range=${dateRange}`),
        api.get(`/reports/orders?range=${dateRange}`),
        api.get(`/reports/customers?range=${dateRange}`),
        api.get('/restaurants')
      ]);

      // Mock data for demonstration
      setReportData({
        revenue: { total: 45230.50, growth: 12.5 },
        orders: { total: 1247, growth: 8.3 },
        customers: { total: 892, growth: 15.2 },
        restaurants: { total: restaurantsRes.data.length, growth: 5.1 },
        popularMeals: [
          { name: 'Margherita Pizza', orders: 156, revenue: 2340 },
          { name: 'Chicken Burger', orders: 134, revenue: 2010 },
          { name: 'Pad Thai', orders: 98, revenue: 1470 },
          { name: 'Caesar Salad', orders: 87, revenue: 1305 },
          { name: 'Sushi Roll', orders: 76, revenue: 1520 }
        ],
        topRestaurants: [
          { name: 'Pizza Palace', orders: 234, revenue: 4680, rating: 4.8 },
          { name: 'Burger House', orders: 198, revenue: 3960, rating: 4.6 },
          { name: 'Thai Garden', orders: 167, revenue: 3340, rating: 4.7 },
          { name: 'Sushi Master', orders: 145, revenue: 4350, rating: 4.9 },
          { name: 'Pasta Corner', orders: 123, revenue: 2460, rating: 4.5 }
        ],
        revenueChart: [
          { date: '2024-01-01', revenue: 1200 },
          { date: '2024-01-02', revenue: 1450 },
          { date: '2024-01-03', revenue: 1100 },
          { date: '2024-01-04', revenue: 1680 },
          { date: '2024-01-05', revenue: 1890 },
          { date: '2024-01-06', revenue: 2100 },
          { date: '2024-01-07', revenue: 1950 }
        ],
        ordersByStatus: {
          delivered: 856,
          preparing: 45,
          out_for_delivery: 23,
          cancelled: 67
        }
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const csvContent = [
      ['Metric', 'Value', 'Growth'],
      ['Revenue', `$${reportData.revenue.total.toFixed(2)}`, `${reportData.revenue.growth}%`],
      ['Orders', reportData.orders.total, `${reportData.orders.growth}%`],
      ['Customers', reportData.customers.total, `${reportData.customers.growth}%`],
      ['Restaurants', reportData.restaurants.total, `${reportData.restaurants.growth}%`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 text-lg">Business insights and performance metrics</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900">${reportData.revenue.total.toLocaleString()}</p>
                <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{reportData.revenue.growth}%
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900">{reportData.orders.total.toLocaleString()}</p>
                <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{reportData.orders.growth}%
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-2">Active Customers</p>
                <p className="text-4xl font-bold text-gray-900">{reportData.customers.total.toLocaleString()}</p>
                <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{reportData.customers.growth}%
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-2">Partner Restaurants</p>
                <p className="text-4xl font-bold text-gray-900">{reportData.restaurants.total}</p>
                <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{reportData.restaurants.growth}%
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Meals */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Meals</h3>
            <div className="space-y-4">
              {reportData.popularMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{meal.name}</p>
                      <p className="text-gray-600 text-sm">{meal.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">${meal.revenue.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Restaurants</h3>
            <div className="space-y-4">
              {reportData.topRestaurants.map((restaurant, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{restaurant.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-gray-600 text-sm">{restaurant.rating}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600 text-sm">{restaurant.orders} orders</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">${restaurant.revenue.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(reportData.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                  status === 'delivered' ? 'bg-green-100' :
                  status === 'preparing' ? 'bg-blue-100' :
                  status === 'out_for_delivery' ? 'bg-purple-100' :
                  'bg-red-100'
                }`}>
                  <Package className={`w-8 h-8 ${
                    status === 'delivered' ? 'text-green-600' :
                    status === 'preparing' ? 'text-blue-600' :
                    status === 'out_for_delivery' ? 'text-purple-600' :
                    'text-red-600'
                  }`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-gray-600 text-sm capitalize">{status.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}