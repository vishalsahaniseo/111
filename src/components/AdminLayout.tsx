import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/ghost', icon: Home },
    { name: 'Posts', path: '/ghost/posts', icon: FileText },
    { name: 'Settings', path: '/ghost/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/ghost" className="text-xl font-semibold tracking-tight text-black">
            Ghost Clone
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path || (item.path !== '/ghost' && location.pathname.startsWith(item.path))
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700">
            <User className="w-5 h-5" />
            <span className="truncate flex-1">{user?.email}</span>
          </div>
          <button
            onClick={signOut}
            className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
