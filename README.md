# 🍔 FoodHub - Food Delivery System

A modern, full-stack food delivery platform built with React, Node.js, Express, and MongoDB.

## ✨ Features

### For Customers
- Browse restaurants by cuisine and location
- View detailed restaurant menus with dietary information
- Add items to cart and place orders
- Track order status in real-time
- View order history
- Manage profile and delivery addresses

### For Restaurant Owners
- Manage restaurant profile
- Add, edit, and delete menu items
- View and manage incoming orders
- Update order status
- Track sales and performance

### For Admins
- Dashboard with system-wide statistics
- Manage users and restaurants
- View all orders
- Activate/deactivate users and restaurants

## 🚀 Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (icons)
- Vite

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd fooddelivery/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/fooddelivery
SECRET_KEY=your_secret_key_here
PORT=4500
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:4500`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd foodproject
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:4500/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

### Default User Roles

You can register as:
- **Customer** - Browse and order food
- **Restaurant Owner** - Manage restaurant and menu
- **Admin** - Full system access (requires manual database update)

### Creating Test Data

You can manually create restaurants and meals through the restaurant owner dashboard, or use MongoDB Compass/Shell to insert test data.

## 📱 Pages

### Public Pages
- `/` - Home (Restaurant listings)
- `/login` - User login
- `/register` - User registration
- `/restaurant/:id` - Restaurant details and menu

### Customer Pages (Protected)
- `/cart` - Shopping cart and checkout
- `/orders` - Order history
- `/profile` - User profile management

### Restaurant Owner Pages (Protected)
- `/restaurant/dashboard` - Restaurant management dashboard

### Admin Pages (Protected)
- `/admin/dashboard` - Admin control panel

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and automatically included in API requests.

## 🎨 Design Features

- Modern, clean UI with Tailwind CSS
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Intuitive navigation
- User-friendly forms with validation
- Real-time cart updates
- Status badges and indicators

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/my-restaurant` - Get owner's restaurant
- `POST /api/restaurants` - Create restaurant (owner/admin)
- `PUT /api/restaurants/:id` - Update restaurant (owner/admin)

### Meals
- `GET /api/meals/restaurant/:id` - Get meals by restaurant
- `GET /api/meals/my-meals` - Get owner's meals
- `POST /api/meals` - Create meal (owner/admin)
- `PUT /api/meals/:id` - Update meal (owner/admin)
- `DELETE /api/meals/:id` - Delete meal (owner/admin)

### Orders
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/restaurant-orders` - Get restaurant's orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (owner/admin)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/:id/status` - Toggle user status (admin)

## 🛠️ Development

### Build for Production

Frontend:
```bash
cd foodproject
npm run build
```

### Linting

```bash
npm run lint
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Amazon Q Developer
