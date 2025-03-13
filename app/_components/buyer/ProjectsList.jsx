import React from 'react';

export default function ProjectsList() {
    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-2">My Projects</h2>
            <ul>
                <li className="border-b py-2">Project A - In Progress</li>
                <li className="border-b py-2">Project B - Completed</li>
                <li className="py-2">Project C - Pending Approval</li>
            </ul>
        </div>
    );
}
