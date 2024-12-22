import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Booking from "./pages/Booking";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BlockDates from "./pages/admin/BlockDates";
import Login from "./pages/admin/Login";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/block-dates" element={<BlockDates />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  minHeight: '100vh',
                  bgcolor: 'background.default'
                }}>
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1 }}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/rooms" element={<Rooms />} />
                      <Route path="/rooms/:id" element={<RoomDetail />} />
                      <Route path="/booking/:id" element={<Booking />} />
                    </Routes>
                  </Box>
                  <Footer />
                </Box>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App; 