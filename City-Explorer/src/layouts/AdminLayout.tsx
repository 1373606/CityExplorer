import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  BarChart2, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } 
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`bg-gray-800 text-white w-64 flex-shrink-0 ${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center">
              <BarChart2 className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </Link>
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="py-4">
          <div className="px-4 py-2 text-xs text-gray-400 uppercase">Main</div>
          <Link 
            to="/admin" 
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <Users className="h-5 w-5 mr-2" />
            User Management
          </Link>
          <Link 
            to="/admin/cities" 
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <MapPin className="h-5 w-5 mr-2" />
            City Management
          </Link>

          <div className="px-4 py-2 mt-4 text-xs text-gray-400 uppercase">Account</div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign out
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="ml-4 flex items-center">
                <span className="text-gray-700 mr-2">{user?.name}</span>
                <div className="bg-primary-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                  {user?.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-gray-200">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                    Admin
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="ml-2 text-gray-700 font-medium">Dashboard</span>
                </li>
              </ol>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;