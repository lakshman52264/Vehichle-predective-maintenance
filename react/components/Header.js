import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { user, logout } = useAuth(); // Access the user and logout function from AuthContext
  const navigate = useNavigate(); // Use navigate to redirect the user after sign-out

  // Handle the logout process
  const handleLogout = async () => {
    try {
      await logout(); // Call logout from AuthContext
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="p-8 bg-white shadow-md flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Vehicle Health</h1>
        
        {/* Alert Icon */}
        <div className="relative">
          <ExclamationTriangleIcon
            className="w-6 h-6 text-red-600 cursor-pointer"
            onClick={() => setShowAlert(!showAlert)}
          />
          
          {/* Alert Dropdown */}
          {showAlert && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <ul className="text-sm text-gray-700">
                <li className="mb-1">⚠️ Maintenance overdue</li>
                <li className="mb-1">⚠️ High CO2 Emission</li>
                <li className="mb-1">⚠️ Fatigue Driving</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center p-2 rounded-md hover:bg-gray-100 focus:outline-none">
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100' : ''
                } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                Change Vehicle
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100' : ''
                } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                Add Vehicle
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout} // Call handleLogout on click
                className={`${
                  active ? 'bg-gray-100' : ''
                } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                Log Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </header>
  );
};

export default Header;
