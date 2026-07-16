/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { PublicLayout } from './components/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import PostView from './pages/public/PostView';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import PostsList from './pages/admin/PostsList';
import PostEditor from './pages/admin/PostEditor';
import Settings from './pages/admin/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/ghost/login" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="post/:slug" element={<PostView />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/ghost/login" element={<Login />} />
          <Route path="/ghost" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="editor/:postId" element={<PostEditor />} />
            <Route path="editor" element={<PostEditor />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

