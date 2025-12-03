import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      setError("Failed to load restaurants");
    }
    setLoading(false);
  };

  const deleteRestaurant = async (id) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      await axios.delete(`http://localhost:4500/api/restaurants/${id}`);
      setRestaurants(restaurants.filter((r) => r._id !== id));
    } catch (err) {
      alert("Error deleting restaurant.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading restaurants...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">All Restaurants</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden bg-white shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img
                    src={restaurant.image || "/default.jpg"}
                    alt={restaurant.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="py-3 px-4 font-semibold">{restaurant.name}</td>

                <td className="py-3 px-4 text-gray-600">
                  {restaurant.description.slice(0, 40)}...
                </td>

                <td className="py-3 px-4">{restaurant.address}</td>

                <td className="py-3 px-4 flex gap-3">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() =>
                      (window.location.href = `/admin/edit-restaurant/${restaurant._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => deleteRestaurant(restaurant._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>  
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
