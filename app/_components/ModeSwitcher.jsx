// components/ModeSwitcher.js
"use client";

import { useState, useEffect } from 'react';

const ModeSwitcher = ({ jwtToken }) => {
  const [mode, setMode] = useState('Buyer');

  // Fetch current mode from Strapi
  const fetchCurrentMode = async () => {
    const res = await fetch('http://localhost:1337/api/users/me', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const userData = await res.json();
    setMode(userData.mode);
  };

  useEffect(() => {
    fetchCurrentMode();
  }, [jwtToken]);

  // Update mode in Strapi
  const switchMode = async (newMode) => {
    await fetch('http://localhost:1337/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ mode: newMode }),
    });
    setMode(newMode);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">Current Mode: {mode}</h3>
      <button
        onClick={() => switchMode('Buyer')}
        className={`mr-4 px-4 py-2 rounded ${
          mode === 'Buyer' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Buyer Mode
      </button>
      <button
        onClick={() => switchMode('Publisher')}
        className={`px-4 py-2 rounded ${
          mode === 'Publisher' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Publisher Mode
      </button>
    </div>
  );
};

export default ModeSwitcher;
    