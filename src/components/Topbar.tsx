import React from 'react';

const Topbar: React.FC = () => {
  return (
    <div className="w-full h-16 bg-gray-100 border-b flex items-center justify-between px-6">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
