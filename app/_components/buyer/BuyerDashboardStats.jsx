"use client";

import { motion } from "framer-motion";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const statsData = [
  { title: "Not Started", description: "Tasks waiting for acceptances or rejections", count: 0, icon: "📋", color: "bg-yellow-100" },
  { title: "In Progress", description: "Tasks in progress, you will receive notifications", count: 0, icon: "⏳", color: "bg-blue-100" },
  { title: "Pending Approval", description: "Tasks waiting for your approval", count: 0, icon: "✅", color: "bg-green-100" },
  { title: "In Improvement", description: "Tasks you have sent for improvement", count: 0, icon: "⚙️", color: "bg-red-100" }
];

const defaultChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Account Balance',
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000)),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Account Balance Over Time', position: 'top', align: 'start' },
    tooltip: { enabled: true },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
  },
};

const BuyerDashboardStats = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg shadow-md ${stat.color}`}
          >
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <span className="mr-2 text-xl">{stat.icon}</span> {stat.title}
            </h3>
            <p className="text-gray-500">{stat.description}</p>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stat.count.toString().padStart(2, '0')}</div>
          </motion.div>
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
            <div className="w-4/5" style={{ height: '300px' }}>
              <Line data={defaultChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Educational Links Section */}
      <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Useful Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <iframe className="w-full h-64" src="https://www.youtube.com/embed/k7ELO356Npo" title="React Crash Course"></iframe> */}
          {/* <iframe className="w-full h-64" src="https://www.youtube.com/embed/IKt-tK9UinI" title="Next.js Full Course"></iframe> */}
          {/* <iframe className="w-full h-64" src="https://www.youtube.com/embed/jS4aFq5-91M" title="JavaScript Basics"></iframe> */}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardStats;
