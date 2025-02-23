import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardStats = ({ accountBalance, chartData, cardData }) => {
  // Default chart data if not provided
  const defaultChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Account Balance',
        data: [1200, 1900, 3000, 5000, 2300, 3200, 4000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Orders',
        data: [2, 3, 4, 5, 6, 7, 8],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  // Default card data if not provided
  const defaultCardData = [
    { title: 'MODE', value: 'Advertiser', color: 'bg-blue-500' },
    { title: 'PENDING ORDERS', value: 0, color: 'bg-green-500' },
    { title: 'ACCOUNT BALANCE', value: `€${accountBalance || 0}`, color: 'bg-red-500' },
    { title: 'CART ITEMS', value: 0, color: 'bg-orange-500' },
  ];

  // Extract the latest values for the chart title
  const latestBalance = (chartData?.datasets[0]?.data.slice(-1)[0]) || defaultChartData.datasets[0].data.slice(-1)[0];
  const latestOrders = (chartData?.datasets[1]?.data.slice(-1)[0]) || defaultChartData.datasets[1].data.slice(-1)[0];

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Overall User Balance and Orders',
      },
    },
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full p-4">
        {(cardData || defaultCardData).map((card, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className={`${card.color} h-2`}></div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Balance and Orders Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
          <div className="bg-blue-500 h-2"></div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">LATEST BALANCE</p>
            <p className="text-2xl font-bold">€{latestBalance}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
          <div className="bg-purple-500 h-2"></div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">LATEST ORDERS</p>
            <p className="text-2xl font-bold">{latestOrders}</p>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="w-full p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 transform transition-transform hover:scale-105">
          <Line data={chartData || defaultChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;  