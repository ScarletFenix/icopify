import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DashboardStats = ({ accountBalance, chartData, cardData }) => {
  // Random data for the graph
  const randomData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000));

  // Default chart data if not provided
  const defaultChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Account Balance',
        data: randomData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true, // Fill under the line
        tension: 0, // No bending (sharp corners)
      },
    ],
  };

  // Default card data if not provided
  const defaultCardData = [
    { title: 'Total Revenue', value: `€${Math.floor(Math.random() * 10000)}`, color: 'bg-blue-500' },
    { title: 'Total Orders', value: Math.floor(Math.random() * 100), color: 'bg-green-500' },
    { title: 'Pending Orders', value: Math.floor(Math.random() * 50), color: 'bg-yellow-500' },
    { title: 'Completed Orders', value: Math.floor(Math.random() * 50), color: 'bg-purple-500' },
  ];

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height and width
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
        text: 'Account Balance Over Time',
        position: 'top',
        align: 'start', // Align title to the left
      },
      tooltip: {
        enabled: true, // Show tooltips on hover
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light grid lines for y-axis
        },
      },
    },
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full mt-16 overflow-y-auto z-10">
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

      {/* Graph Section */}
      <div className="w-full p-4 overflow-hidden">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 transform transition-transform hover:scale-105">
          <div className="flex">
            {/* Left Section: Graph Data */}
            <div className="w-1/5 p-4 text-center">
              <h2 className="text-lg font-semibold mb-4">Graph Data</h2>
              <ul>
                <li className="text-sm text-gray-600 mb-2">Since the beginning: <br />   €9,059.47</li>
                <li className="text-sm text-gray-600 mb-2">Last 12 months: <br /> €3,834.44</li>
                <li className="text-sm text-gray-600 mb-2">Last 30 days: <br /> €0.00</li>
              </ul>
            </div>

            {/* Right Section: Graph */}
            <div className="w-4/5" style={{ height: '300px' }}> {/* Smaller height, wider width */}
              <Line data={chartData || defaultChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;