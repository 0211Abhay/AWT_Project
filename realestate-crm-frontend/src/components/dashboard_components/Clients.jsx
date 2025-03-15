import React, { useState, useEffect } from 'react';
// import '../..styles/Clients.css';
import "../../style/Clients.css"
const Client = () => {
    // Sample initial client data
    const initialClients = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-1234',
            joinDate: '2022-01-15',
            status: 'active',
            deals: [
                { id: 101, propertyAddress: '123 Main St', type: 'sale', amount: 350000, date: '2022-04-15', status: 'completed' },
                { id: 102, propertyAddress: '456 Oak Ave', type: 'rental', amount: 2000, date: '2022-06-01', status: 'active' }
            ]
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-5678',
            joinDate: '2022-03-22',
            status: 'active',
            deals: [
                { id: 103, propertyAddress: '789 Pine Rd', type: 'sale', amount: 425000, date: '2022-09-20', status: 'completed' }
            ]
        },
        {
            id: 3,
            name: 'Robert Johnson',
            email: 'robert@example.com',
            phone: '555-9012',
            joinDate: '2022-05-10',
            status: 'inactive',
            deals: []
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily@example.com',
            phone: '555-3456',
            joinDate: '2022-07-05',
            status: 'active',
            deals: [
                { id: 104, propertyAddress: '101 Maple Dr', type: 'rental', amount: 1800, date: '2022-08-15', status: 'active' }
            ]
        },
        {
            id: 5,
            name: 'Michael Wilson',
            email: 'michael@example.com',
            phone: '555-7890',
            joinDate: '2022-09-18',
            status: 'active',
            deals: [
                { id: 105, propertyAddress: '202 Elm St', type: 'sale', amount: 280000, date: '2022-11-05', status: 'completed' },
                { id: 106, propertyAddress: '303 Cedar Ln', type: 'rental', amount: 2200, date: '2023-01-10', status: 'active' }
            ]
        },
    ];

    // State management
    const [clients, setClients] = useState(initialClients);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [showClientDetails, setShowClientDetails] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [dealFilter, setDealFilter] = useState('all');
    const [currentClient, setCurrentClient] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        joinDate: '',
        status: 'active',
        deals: []
    });

    // Filter clients based on search term and status
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Filter deals for the selected client
    const filteredDeals = selectedClient?.deals.filter(deal => {
        return dealFilter === 'all' || deal.type === dealFilter;
    }) || [];

    // Handle input changes for form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentClient({ ...currentClient, [name]: value });
    };

    // View client details
    const viewClientDetails = (client) => {
        setSelectedClient(client);
        setShowClientDetails(true);
    };

    // Add new client
    const addClient = () => {
        // Simple validation
        if (!currentClient.name || !currentClient.email || !currentClient.phone) {
            alert('Please fill all required fields');
            return;
        }

        const newClient = {
            ...currentClient,
            id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
            joinDate: new Date().toISOString().split('T')[0],
            deals: []
        };

        setClients([...clients, newClient]);
        resetForm();
        setIsAddingClient(false);
    };

    // Update existing client
    const updateClient = () => {
        // Simple validation
        if (!currentClient.name || !currentClient.email || !currentClient.phone) {
            alert('Please fill all required fields');
            return;
        }

        setClients(clients.map(client =>
            client.id === currentClient.id ? currentClient : client
        ));

        resetForm();
        setIsEditingClient(false);
    };

    // Delete client
    const deleteClient = (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            setClients(clients.filter(client => client.id !== id));
        }
    };

    // Set up edit form
    const editClient = (client) => {
        setCurrentClient({ ...client });
        setIsEditingClient(true);
    };

    // Reset form
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

    // Cancel form
    const cancelForm = () => {
        resetForm();
        setIsAddingClient(false);
        setIsEditingClient(false);
    };

    // Close client details modal
    const closeClientDetails = () => {
        setShowClientDetails(false);
        setSelectedClient(null);
        setDealFilter('all');
    };

    return (
        <div className="client-container">
            {/* <header className="client-header">
                <div className="client-header-content">
                    <h1>Client Management</h1>
                    <p>Manage your client portfolio</p>
                </div>
            </header> */}

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

            {/* Client List Section */}
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

            {/* Client Form Modal */}
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

            {/* Client Details Modal */}
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