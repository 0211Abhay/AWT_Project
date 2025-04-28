import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../../style/Clients.css"

const Client = () => {
    // State management
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSchedules, setClientSchedules] = useState([]);
    const [clientProperties, setClientProperties] = useState([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [errorDetails, setErrorDetails] = useState(null);
    const [currentClient, setCurrentClient] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);


    const fetchClientDetails = async (clientId) => {
        setLoadingDetails(true);
        try {
            console.log('Fetching client details for client ID:', clientId);

            // Fetch schedules
            const schedulesRes = await fetch(`http://localhost:5001/api/schedule/client/${clientId}`);
            if (!schedulesRes.ok) {
                const errorData = await schedulesRes.json();
                throw new Error(errorData.details || 'Failed to fetch schedules');
            }
            const schedulesData = await schedulesRes.json();
            console.log('Fetched schedules:', schedulesData);

            setClientSchedules(schedulesData);

            // Fetch property for the first schedule
            if (schedulesData.length > 0 && schedulesData[0].property_id) {
                const propertyId = schedulesData[0].property_id;
                console.log('Fetching property with ID:', propertyId);

                const propertyRes = await fetch(`http://localhost:5001/api/property/getOneProperty/${propertyId}`);
                if (!propertyRes.ok) {
                    const errorData = await propertyRes.json();
                    throw new Error(errorData.details || 'Failed to fetch property');
                }
                const propertyData = await propertyRes.json();
                console.log('Fetched property data:', propertyData);
            } else {
                console.log('No schedules or no property_id found.');
            }

        } catch (error) {
            console.error('Error fetching client details:', error);
            setErrorDetails(error.message);
        } finally {
            setLoadingDetails(false);
        }
    };


    const handleViewDetails = async (client) => {
        setSelectedClient(client);
        setIsProfileModalOpen(true);
        await fetchClientDetails(client.id);
    };
    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/client/getAllClient");
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || "Failed to fetch clients");
            }

            const data = await response.json();
            console.log('Received client data:', data);
            setClients(data.map(client => ({
                id: client.client_id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address || '',
                joinDate: client.created_at
            })));
        } catch (error) {
            console.error("Error fetching clients:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentClient({ ...currentClient, [name]: value });
    };

    const addClient = async () => {
        if (!currentClient.name || !currentClient.email || !currentClient.phone) {
            setError('Please fill all required fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/client/createClient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    broker_id: 1,
                    ...currentClient
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add client");
            }

            await fetchClients();
            resetForm();
            setIsAddingClient(false);
            setError(null);
        } catch (error) {
            console.error('Error adding client:', error);
            setError(error.message);
        }
    };

    const updateClient = async () => {
        if (!currentClient.name || !currentClient.email || !currentClient.phone) {
            setError('Please fill all required fields');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/client/updateClient/${currentClient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentClient)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update client");
            }

            await fetchClients();
            resetForm();
            setIsEditingClient(false);
            setError(null);
        } catch (error) {
            console.error('Error updating client:', error);
            setError(error.message);
        }
    };

    const deleteClient = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                const response = await fetch(`http://localhost:5001/api/client/deleteClient/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to delete client");
                }

                await fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                setError(error.message);
            }
        }
    };

    const editClient = (client) => {
        setCurrentClient({ ...client });
        setIsEditingClient(true);
    };

    const resetForm = () => {
        setCurrentClient({
            id: null,
            name: '',
            email: '',
            phone: '',
            address: ''
        });
    };

    const cancelForm = () => {
        resetForm();
        setIsAddingClient(false);
        setIsEditingClient(false);
    };

    const filteredClients = (clients || []).filter(client => {
        return client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);
    });

    return (
        <div className="client-container">
            <div className="client-controls">
                <div className="client-search">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button
                    onClick={() => setIsAddingClient(true)}
                    className="add-client-btn"
                >
                    Add New Client
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isAddingClient || isEditingClient ? (
                <div className="client-form">
                    <h2>{isAddingClient ? 'Add New Client' : 'Edit Client'}</h2>
                    <form>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={currentClient.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={currentClient.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={currentClient.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={currentClient.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-buttons">
                            <button
                                type="button"
                                onClick={isAddingClient ? addClient : updateClient}
                                className="submit-btn"
                            >
                                {isAddingClient ? 'Add Client' : 'Update Client'}
                            </button>
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="clients-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.address}</td>
                                    <td>{new Date(client.joinDate).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => editClient(client)}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteClient(client.id)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(client)}
                                            className="view-btn"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isProfileModalOpen && selectedClient && (
                <div className="client-profile-modal-overlay">
                    <div className="client-profile-modal">
                        <button
                            className="modal-close-btn"
                            onClick={() => setIsProfileModalOpen(false)}
                        >
                            &times;
                        </button>

                        <h2 className="modal-title">{selectedClient.name}'s Profile</h2>

                        {loadingDetails ? (
                            <div className="loading-indicator">Loading details...</div>
                        ) : errorDetails ? (
                            <div className="error-message">{errorDetails}</div>
                        ) : (
                            <>
                                <div className="client-info-section">
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <p>{selectedClient.email}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Phone:</label>
                                        <p>{selectedClient.phone}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Address:</label>
                                        <p>{selectedClient.address || 'Not available'}</p>
                                    </div>
                                </div>
                                <div className="schedules-section">
                                    <h3>Scheduled Visits</h3>
                                    {clientSchedules.length > 0 ? (
                                        <div className="schedule-table">
                                            <div className="schedule-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontWeight: 'bold' }}>
                                                <span>Property</span>
                                                <span>Location</span>
                                                <span>Date</span>
                                                <span>Time</span>
                                                <span>Status</span>
                                            </div>
                                            {clientSchedules.map(schedule => (
                                                <div key={schedule.schedule_id} className="schedule-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', alignItems: 'center' }}>
                                                    <span>{schedule.property?.name || 'Property Name Unavailable'}</span>
                                                    <span>{schedule.property?.location || 'Location Unavailable'}</span>
                                                    <span>{new Date(schedule.date).toLocaleDateString()}</span>
                                                    <span>{schedule.time}</span>
                                                    <span className={`status-${schedule.status.toLowerCase()}`}>
                                                        {schedule.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-data">No scheduled visits found</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Client;