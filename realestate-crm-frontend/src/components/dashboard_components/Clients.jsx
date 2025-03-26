import React, { useState, useEffect } from 'react';
import "../../style/Clients.css"

const Client = () => {
    // State management
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [showClientDetails, setShowClientDetails] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [dealFilter, setDealFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null); // <-- Add error state
    const [currentClient, setCurrentClient] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        joinDate: '',
        status: 'active',
        deals: []
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/client/getAllClient");
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || "Failed to fetch clients");
            }

            const data = await response.json();
            console.log('Received client data:', data); // Debug log
            
            setClients(data.map(client => ({
                id: client.client_id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                joinDate: client.created_at,
                status: 'active', // Default status since it's not in the model
                deals: [] // Default empty deals since it's not in the model
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

    const viewClientDetails = (client) => {
        setSelectedClient(client);
        setShowClientDetails(true);
    };

    const addClient = async () => {
        if (!currentClient.name || !currentClient.email || !currentClient.phone) {
            alert('Please fill all required fields');
            return;
        }

        const newClientData = {
            name: currentClient.name,
            email: currentClient.email,
            phone: currentClient.phone,
            status: currentClient.status,
            brokerId: 1,
            address: currentClient.address || ''
        };

        try {
            const response = await fetch('http://localhost:5001/api/client/createClient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClientData)
            });

            if (!response.ok) throw new Error('Failed to add client');

            await fetchClients(); // Refresh client list
            resetForm();
            setIsAddingClient(false);
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Error adding client. Please try again.');
        }
    };

    const updateClient = async () => {
        if (!currentClient.name || !currentClient.email || !currentClient.phone) {
            alert('Please fill all required fields');
            return;
        }

        try {
            await fetch(`http://localhost:5001/api/client/updateClient/${currentClient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentClient)
            });
            await fetchClients(); // Refresh client list
            resetForm();
            setIsEditingClient(false);
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Error updating client. Please try again.');
        }
    };

    const deleteClient = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await fetch(`http://localhost:5001/api/client/deleteClient/${id}`, { method: 'DELETE' });
                await fetchClients(); // Refresh client list
            } catch (error) {
                console.error('Error deleting client:', error);
                alert('Error deleting client. Please try again.');
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
            joinDate: '',
            status: 'active',
            deals: []
        });
    };

    const cancelForm = () => {
        resetForm();
        setIsAddingClient(false);
        setIsEditingClient(false);
    };

    const closeClientDetails = () => {
        setShowClientDetails(false);
        setSelectedClient(null);
        setDealFilter('all');
    };

    const filteredClients = (clients || []).filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

        return matchesSearch && matchesStatus;
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

                <div className="client-filters">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-select"
                    >
                        <option value="all">All Clients</option>
                        <option value="active">Active Clients</option>
                        <option value="inactive">Inactive Clients</option>
                    </select>

                    <button
                        className="add-client-btn"
                        onClick={() => {
                            resetForm();
                            setIsAddingClient(true);
                        }}
                    >
                        Add New Client
                    </button>
                </div>
            </div>

            <div className="client-list-container">
                {filteredClients.length > 0 ? (
                    <div className="client-list">
                        <div className="client-list-header">
                            <span className="client-name-header">Name</span>
                            <span className="client-email-header">Email</span>
                            <span className="client-phone-header">Phone</span>
                            <span className="client-date-header">Join Date</span>
                            <span className="client-status-header">Status</span>
                            <span className="client-actions-header">Actions</span>
                        </div>

                        {filteredClients.map(client => (
                            <div className={`client-item ${client.status}`} key={client.id}>
                                <span className="client-name">{client.name}</span>
                                <span className="client-email">{client.email}</span>
                                <span className="client-phone">{client.phone}</span>
                                <span className="client-date">{client.joinDate}</span>
                                <span className={`client-status status-${client.status}`}>
                                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                </span>
                                <div className="client-actions">
                                    <button
                                        className="view-client-btn"
                                        onClick={() => viewClientDetails(client)}
                                    >
                                        View Deals
                                    </button>
                                    <button
                                        className="edit-client-btn"
                                        onClick={() => editClient(client)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-client-btn"
                                        onClick={() => deleteClient(client.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-clients">
                        <p>No clients found matching your criteria</p>
                    </div>
                )}
            </div>

            {(isAddingClient || isEditingClient) && (
                <div className="client-modal-overlay">
                    <div className="client-modal">
                        <div className="client-modal-header">
                            <h2>{isAddingClient ? 'Add New Client' : 'Edit Client'}</h2>
                            <button className="close-modal-btn" onClick={cancelForm}>×</button>
                        </div>

                        <div className="client-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentClient.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={currentClient.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={currentClient.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={currentClient.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={cancelForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-btn"
                                    onClick={isAddingClient ? addClient : updateClient}
                                >
                                    {isAddingClient ? 'Add Client' : 'Update Client'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showClientDetails && selectedClient && (
                <div className="client-modal-overlay">
                    <div className="client-modal client-details-modal">
                        <div className="client-modal-header">
                            <h2>Client Deals: {selectedClient.name}</h2>
                            <button className="close-modal-btn" onClick={closeClientDetails}>×</button>
                        </div>

                        <div className="client-details-content">
                            <div className="client-info">
                                <p><strong>Email:</strong> {selectedClient.email}</p>
                                <p><strong>Phone:</strong> {selectedClient.phone}</p>
                                <p><strong>Join Date:</strong> {selectedClient.joinDate}</p>
                                <p><strong>Status:</strong> <span className={`status-badge status-${selectedClient.status}`}>
                                    {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                                </span></p>
                            </div>

                            <div className="deals-section">
                                <div className="deals-header">
                                    <h3>Deal History</h3>
                                    <select
                                        value={dealFilter}
                                        onChange={(e) => setDealFilter(e.target.value)}
                                        className="deal-type-select"
                                    >
                                        <option value="all">All Deals</option>
                                        <option value="sale">Sales</option>
                                        <option value="rental">Rentals</option>
                                    </select>
                                </div>

                                {filteredDeals.length > 0 ? (
                                    <div className="deals-list">
                                        <div className="deal-list-header">
                                            <span>Property</span>
                                            <span>Type</span>
                                            <span>Amount</span>
                                            <span>Date</span>
                                            <span>Status</span>
                                        </div>
                                        {filteredDeals.map(deal => (
                                            <div className="deal-item" key={deal.id}>
                                                <span className="deal-property">{deal.propertyAddress}</span>
                                                <span className="deal-type">
                                                    {deal.type === 'sale' ? 'Sale' : 'Rental'}
                                                </span>
                                                <span className="deal-amount">
                                                    ${deal.type === 'sale'
                                                        ? deal.amount.toLocaleString()
                                                        : `${deal.amount.toLocaleString()}/mo`}
                                                </span>
                                                <span className="deal-date">{deal.date}</span>
                                                <span className={`deal-status status-${deal.status}`}>
                                                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-deals">
                                        <p>No deals found for this client</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Client;