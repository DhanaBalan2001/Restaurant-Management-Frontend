import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import Home from './components/home/Home.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import Overview from './components/admin/Overview.jsx';
import MenuManager from './components/admin/MenuManager.jsx';
import OrderManager from './components/admin/OrderManager.jsx';
import ReservationManager from './components/admin/ReservationManager.jsx';
import InventoryManager from './components/admin/InventoryManager.jsx';
import StaffManager from './components/admin/StaffManager.jsx';
import Analytics from './components/admin/Analytics.jsx';
import StaffDashboard from './components/staff/Dashboard.jsx';
import MenuView from './components/customer/MenuView.jsx';
import TableReservation from './components/customer/Reservation.jsx';
import OrderHistory from './components/customer/OrderHistory.jsx';
import Payment from './components/payment/Payments.jsx';
import './App.css';

const NavbarWrapper = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/admin', '/staff', '/login', '/register'];
  return !hideNavbarPaths.some(path => location.pathname.startsWith(path)) ? <Navbar /> : null;
};


const PrivateRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavbarWrapper />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<MenuView />} />
          <Route path="/reservation" element={<TableReservation />} />
          <Route path="/payment/:reservationId" element={<Payment />} />
          <Route path="/reservations/success" element={<Payment />} />

          {/* Admin Routes - No Navbar */}
          <Route path="/admin/*" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="reservations" element={<ReservationManager />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="staff" element={<StaffManager />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Staff Routes - No Navbar */}
          <Route path="/staff/*" element={
            <PrivateRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;