import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth, RequireAdmin } from './lib/auth';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes - No AppLayout */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - With AppLayout */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout>
                <Navigate to="/dashboard" replace />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AppLayout>
                <Admin />
              </AppLayout>
            </RequireAdmin>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;