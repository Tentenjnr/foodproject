import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RealTimeProvider } from './context/RealTimeContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LiveChat from './components/LiveChat';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';

// Restaurant Owner Pages
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantMeals from './pages/RestaurantMeals';
import RestaurantOrders from './pages/RestaurantOrders';
import RestaurantAnalytics from './pages/RestaurantAnalytics';
import RestaurantSettings from './pages/RestaurantSettings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminOrders from './pages/AdminOrders';
import Reports from './pages/Reports';

// Additional Pages
import Payment from './pages/Payment';
import OrderDetails from './pages/OrderDetails';
import RestaurantRegister from './pages/RestaurantRegister';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RealTimeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              
              {/* Protected Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/order-success/:orderId?" element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />
              
              {/* Restaurant Owner Routes */}
              <Route path="/restaurant/dashboard" element={
                <ProtectedRoute requiredRole="restaurant_owner">
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/meals" element={
                <ProtectedRoute requiredRole="restaurant_owner">
                  <RestaurantMeals />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/orders" element={
                <ProtectedRoute requiredRole="restaurant_owner">
                  <RestaurantOrders />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/analytics" element={
                <ProtectedRoute requiredRole="restaurant_owner">
                  <RestaurantAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/settings" element={
                <ProtectedRoute requiredRole="restaurant_owner">
                  <RestaurantSettings />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/restaurants" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminRestaurants />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* Additional Routes */}
              <Route path="/payment" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="/order/:orderId" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/register" element={<RestaurantRegister />} />
              </Routes>
            </main>
            
            <LiveChat />
          </div>
        </RealTimeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;