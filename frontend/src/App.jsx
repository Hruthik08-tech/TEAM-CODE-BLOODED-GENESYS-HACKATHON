import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import './index.css';

// Auth
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';

// Layout
import AppLayout from './components/Layout/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Map from './pages/Map.jsx';
import OrganisationDashboard from './pages/OrganisationDashboard/index.jsx';
import Supply from './pages/Supply/Supply.jsx';
import Demand from './pages/Demand/Demand.jsx';
import MatchResults from './pages/MatchResults/MatchResults.jsx';
import Requests from './pages/Requests/Requests.jsx';
import RoomList from './pages/BusinessRoom/RoomList.jsx';
import BusinessRoomEnhanced from './pages/BusinessRoom/BusinessRoomEnhanced.jsx';
import Deals from './pages/Deals/Deals.jsx';
import DealBarcode from './pages/Deals/DealBarcode.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Notifications from './pages/Notifications/Notifications.jsx';
import Verify from './pages/Verify/Verify.jsx';

// Legacy
import NavBar from './components/NavBar.jsx';

// Helper: Route layout wrapper decides whether to use AppLayout or standalone
const AppRoutes = () => {
  const location = useLocation();

  // Public pages that do NOT use AppLayout
  const publicPaths = ['/login', '/register', '/verify', '/map'];
  const isPublic = publicPaths.some(p => location.pathname.startsWith(p));

  if (isPublic) {
    return (
      <>
        {location.pathname === '/map' && <NavBar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </>
    );
  }

  // Protected pages use AppLayout
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/organisation" element={<ProtectedRoute><OrganisationDashboard /></ProtectedRoute>} />
        <Route path="/supply" element={<ProtectedRoute><Supply /></ProtectedRoute>} />
        <Route path="/demand" element={<ProtectedRoute><Demand /></ProtectedRoute>} />
        <Route path="/match-results" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
        <Route path="/rooms/:roomId" element={<ProtectedRoute><BusinessRoomEnhanced /></ProtectedRoute>} />
        <Route path="/business-room" element={<ProtectedRoute><BusinessRoomEnhanced /></ProtectedRoute>} />
        <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
        <Route path="/deals/:dealId/barcode" element={<ProtectedRoute><DealBarcode /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  )
}

export default App
