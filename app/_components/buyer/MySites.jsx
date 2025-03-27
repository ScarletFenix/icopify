import React, { useState } from 'react'
import { FaHeart, FaBan, FaFlag } from 'react-icons/fa'

const MySites = ({ favorites = [], blacklisted = [], reported = [] }) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('url')

  const allSites = [
    ...favorites.map(site => ({ ...site, status: 'Favorite' })),
    ...blacklisted.map(site => ({ ...site, status: 'Blacklisted' })),
    ...reported.map(site => ({ ...site, status: 'Reported' }))
  ]

  const filteredSites = allSites.filter(site =>
    filter === 'all' ? true : site.status === filter
  )

  const sortedSites = [...filteredSites].sort((a, b) =>
    a[sortBy]?.localeCompare(b[sortBy])
  )

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">My Site Actions</h2>

      {/* Filter Options */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === 'Favorite' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('Favorite')}
        >
          Favorites
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === 'Blacklisted' ? 'bg-gray-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('Blacklisted')}
        >
          Blacklisted
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === 'Reported' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('Reported')}
        >
          Reported
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="p-3 cursor-pointer"
                onClick={() => setSortBy('url')}
              >
                Website
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => setSortBy('mozDA')}
              >
                DA
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => setSortBy('ahrefsDR')}
              >
                DR
              </th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedSites.length > 0 ? (
              sortedSites.map(site => (
                <tr key={site.id} className="border-t">
                  <td className="p-3">{site.url}</td>
                  <td className="p-3">{site.mozDA}</td>
                  <td className="p-3">{site.ahrefsDR}</td>
                  <td className="p-3 flex items-center gap-2">
                    {site.status === 'Favorite' && (
                      <FaHeart className="text-red-500" />
                    )}
                    {site.status === 'Blacklisted' && (
                      <FaBan className="text-gray-500" />
                    )}
                    {site.status === 'Reported' && (
                      <FaFlag className="text-yellow-500" />
                    )}
                    {site.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No sites available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MySites
