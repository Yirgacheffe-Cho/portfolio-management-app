import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: '대시보드', path: '/app/dashboard' },
    { name: '템플릿 만들기', path: '/app/templates' },
    { name: '월간 리스트', path: '/app/monthly-list' },
  ];

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Portfolio App</div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
