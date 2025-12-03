import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../config/api';

export default function RestaurantMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main_course',
    image: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await api.get('/meals/my-meals');
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMeal) {
        await api.put(`/meals/${editingMeal._id}`, formData);
      } else {
        await api.post('/meals', formData);
      }
      fetchMeals();
      resetForm();
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description,
      price: meal.price,
      category: meal.category,
      image: meal.image,
      isAvailable: meal.isAvailable
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this meal?')) {
      try {
        await api.delete(`/meals/${id}`);
        fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  const toggleAvailability = async (id, isAvailable) => {
    try {
      await api.put(`/meals/${id}`, { isAvailable: !isAvailable });
      fetchMeals();
    } catch (error) {
      console.error('Error updating meal:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main_course',
      image: '',
      isAvailable: true
    });
    setEditingMeal(null);
    setShowForm(false);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meal Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Meal
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingMeal ? 'Edit Meal' : 'Add New Meal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Meal Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Price"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                />
              </div>
              <textarea
                placeholder="Description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="main_course">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="pizza">Pizza</option>
                  <option value="burger">Burger</option>
                </select>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingMeal ? 'Update' : 'Add'} Meal
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map(meal => (
            <div key={meal._id} className="bg-white rounded-lg shadow p-4">
              <img
                src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                alt={meal.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{meal.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-orange-500 font-bold text-xl">${meal.price}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  meal.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {meal.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(meal)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => toggleAvailability(meal._id, meal.isAvailable)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {meal.isAvailable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(meal._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}