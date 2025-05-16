import React from 'react';
import { Users, Globe, ArrowUpRight, ArrowDownRight, BarChart2, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      label: 'Total Users',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Cities',
      value: '237',
      change: '+3.2%',
      trend: 'up',
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: 'API Requests',
      value: '43,582',
      change: '-8.1%',
      trend: 'down',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      label: 'New Registrations',
      value: '54',
      change: '+28.4%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', date: '2023-05-12' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2023-05-11' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', date: '2023-05-10' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', date: '2023-05-09' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', date: '2023-05-08' },
  ];

  const popularCities = [
    { id: 1, name: 'Tokyo', views: 1248 },
    { id: 2, name: 'Paris', views: 1052 },
    { id: 3, name: 'New York', views: 983 },
    { id: 4, name: 'London', views: 872 },
    { id: 5, name: 'Rome', views: 654 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary-100 p-3 rounded-lg">
                <div className="text-primary-600">
                  {stat.icon}
                </div>
              </div>
              <div className={`text-sm font-medium flex items-center ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 ml-1" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Popular Cities */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Popular Cities</h2>
          </div>
          <div className="p-6">
            {popularCities.map((city, index) => (
              <div key={city.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{city.name}</span>
                  <span className="text-sm text-gray-500">{city.views} views</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${(city.views / popularCities[0].views) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Activity Chart (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Activity Overview</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-md">
              Weekly
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              Yearly
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
          <div className="text-center">
            <BarChart2 className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-gray-500">Activity chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;