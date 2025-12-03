import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Plus, Trash2, Star } from 'lucide-react';
import api from '../config/api';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || ''
  });
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', isDefault: true },
    { id: 2, label: 'Work', street: '456 Business Ave', city: 'New York', state: 'NY', zipCode: '10002', isDefault: false }
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', state: '', zipCode: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      });
      
      setMessage('Profile updated successfully!');
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-emerald-600 font-semibold mb-1">{user?.email}</p>
              <p className="text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                <p className="text-emerald-800 font-semibold">Member since</p>
                <p className="text-emerald-600">{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-xl font-semibold ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field pl-12 h-14"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-field pl-12 h-14"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="input-field pl-12 h-14 bg-gray-100 cursor-not-allowed text-gray-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Email address cannot be changed for security reasons</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                    Delivery Address
                  </h3>
                  
                  <div className="space-y-6">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="input-field h-14"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-field h-14"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="input-field h-14"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="input-field h-14"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" disabled={loading} className="btn-primary flex-1 h-14 text-lg font-bold">
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Saving Changes...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              📍 Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              ❤️ Favorites
            </button>
          </div>

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div key={address.id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{address.label}</h4>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2">{address.street}</p>
                    <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                    {!address.isDefault && (
                      <button className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                        Set as Default
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddAddress && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Address</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Address Label (Home, Work, etc.)"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="input-field"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          setAddresses([...addresses, { ...newAddress, id: Date.now(), isDefault: false }]);
                          setNewAddress({ label: '', street: '', city: '', state: '', zipCode: '' });
                          setShowAddAddress(false);
                        }}
                        className="flex-1 btn-primary"
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setShowAddAddress(false)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Favorite Restaurants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.8, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300' },
                  { id: 2, name: 'Burger House', cuisine: 'American', rating: 4.6, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300' },
                  { id: 3, name: 'Sushi Master', cuisine: 'Japanese', rating: 4.9, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300' }
                ].map((restaurant) => (
                  <div key={restaurant.id} className="card p-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{restaurant.name}</h4>
                    <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
