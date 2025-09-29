import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TrainingDetailsPage from './pages/TrainingDetailsPage';
import ResourcesPage from './pages/ResourcesPage';
import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import { TrainingProvider } from './context/TrainingContext';

function App() {
  return (
    <TrainingProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/training/:id" element={<TrainingDetailsPage />} />
            <Route path="/methodology" element={<ResourcesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </TrainingProvider>
  );
}

export default App;
