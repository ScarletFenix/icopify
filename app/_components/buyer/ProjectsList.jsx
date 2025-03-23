import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faLink,
    faSearch,
    faEdit,
    faTrashAlt,
    faCheckCircle,
    faClock,
    faTimesCircle,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

const statusColors = [
    'bg-blue-100 text-blue-600',
    'bg-gray-100 text-gray-600',
    'bg-blue-200 text-blue-800',
    'bg-orange-100 text-orange-600',
    'bg-green-100 text-green-600',
    'bg-red-100 text-red-600'
];

const statusIcons = {
    "Guest Posting": faEdit,
    "Link Insertion": faLink,
    "Content Writing": faFileAlt,
    "Digital PR & SEO": faSearch
};

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ projectName: '', url: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchProjects = async () => {
        const token = localStorage.getItem('jwt');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            setMessage({ text: 'User not found. Please log in again.', type: 'error' });
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/projects?filters[buyer][id][$eq]=${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProjects(response.data.data || []);
        } catch (error) {
            setMessage({ text: 'Failed to fetch projects.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            setMessage({ text: 'User not found. Please log in again.', type: 'error' });
            return;
        }

        const projectData = {
            data: { ...formData, buyer: user.id }
        };

        try {
            await axios.post(`${API_URL}/api/projects`, projectData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ text: 'Project created successfully!', type: 'success' });
            fetchProjects();
            setShowForm(false);
            setFormData({ projectName: '', url: '' });

            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.error?.message || 'Error creating project. Please try again.', type: 'error' });
        }
    };

    const renderStatusCounts = () => (
        <div className="flex space-x-2">
            {statusColors.map((color, index) => (
                <div key={index} className={`px-2 py-1 rounded text-xs ${color}`}>0</div>
            ))}
        </div>
    );

    return (
        <div className="bg-blue-50 min-h-screen p-4">
            <div className="container mx-auto w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#2D4373] mb-4">
                        Perfect For Agencies & Marketing Teams
                    </h1>
                    <p className="text-[#2D4373] text-center text-base md:text-xl mb-4 px-4">
                        <a href="#" className="hover:text-blue-700">
                            Create a project for each of your clients to ensure you never duplicate placements
                        </a>
                    </p>
                </div>

                {message.text && (
                    <div
                        className={`text-white px-4 py-2 rounded mb-4 ${
                            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="flex justify-start mb-8">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        {showForm ? 'Cancel' : 'Create Project'}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
                    >
                        <input
                            type="text"
                            placeholder="Site Name"
                            value={formData.projectName || ''}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                            className="flex-1 p-2 border border-gray-300 rounded w-full md:w-auto"
                            required
                        />

                        <input
                            type="url"
                            placeholder="URL"
                            value={formData.url || ''}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="flex-1 p-2 border border-gray-300 rounded w-full md:w-auto"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 w-full md:w-auto"
                        >
                            Submit
                        </button>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, idx) => (
                        <div key={idx} className="bg-white text-[#282828] rounded-lg shadow-lg w-full">
                        <div className="bg-[#2f5aa7] text-white p-4 flex justify-between items-center rounded-t-lg">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:underline"
                            title={`Visit ${project.projectName} - ${project.url}`}
                          >
                            {project.projectName}
                          </a>
                        </div>


                            <div className="p-4 space-y-3">
                                {Object.keys(statusIcons).map((status, index) => (
                                    <div key={index}>
                                    <div className="flex items-center w-full">
                                      <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={statusIcons[status]} className="text-blue-600" />
                                        <span className="text-gray-700">{status}</span>
                                      </div>
                                      <div className="ml-auto">{renderStatusCounts()}</div>
                                    </div>

                                        {index !== Object.keys(statusIcons).length - 1 && (
                                            <div className="border-t border-gray-200 my-2"></div>
                                        )}
                                    </div>
                                ))}
                                <div className="flex justify-end mt-4">
                                    <button className="bg-[#ffffff] text-black border px-4 py-2 rounded text-nowrap hover:bg-gradient-to-r from-orange-300 to-red-300">
                                        Search for All Publishers
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))} 
                </div>
            </div>
        </div>
    );
};

export default ProjectsList;