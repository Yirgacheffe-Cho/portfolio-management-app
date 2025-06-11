import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center justify-between">
        <div className="text-2xl font-bold">총 자산</div>
        <div className="flex items-center gap-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded-md">
            업그레이드
          </button>
          <button className="bg-gray-300 px-2 py-1 rounded-md">🔄</button>
          <button className="bg-gray-300 px-2 py-1 rounded-md">⚙️</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 text-center text-gray-600 mb-4">
        <div>수익</div>
        <div>세금</div>
        <div>배당</div>
        <div>추이</div>
        <div>비중</div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://via.placeholder.com/32" alt="Asset" />
            <div>
              <div className="text-lg font-semibold">TIGER 미국나스닥100</div>
              <div className="text-sm text-gray-500">118,181원</div>
            </div>
          </div>
          <div className="text-red-500 text-lg">+0.39%</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
