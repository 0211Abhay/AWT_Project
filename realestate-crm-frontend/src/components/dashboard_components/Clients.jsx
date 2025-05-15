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
    const [clientRentals, setClientRentals] = useState([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [errorDetails, setErrorDetails] = useState(null);
    const [selectedRental, setSelectedRental] = useState(null);
    const [isRentalDetailsModalOpen, setIsRentalDetailsModalOpen] = useState(false);
    const [paidPayments, setPaidPayments] = useState([]);
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

            // Fetch rental information for the client
            try {
                const rentalRes = await axios.get(`http://localhost:5001/api/rental/getRentalsByClient/${clientId}`);
                if (rentalRes.data && rentalRes.data.rentals) {
                    console.log('Fetched rentals:', rentalRes.data.rentals);
                    
                    // Format the rental data similar to how it's done in Rental.jsx
                    const formattedRentals = rentalRes.data.rentals.map(rental => {
                        // Get property name
                        const property = rental.property ? rental.property.name : 'Unknown Property';
                        
                        return {
                            id: rental.rental_id,
                            property: property,
                            property_id: rental.property_id,
                            client_id: rental.client_id,
                            start_date: rental.start_date,
                            end_date: rental.end_date,
                            amount: parseFloat(rental.rent_amount),
                            status: rental.status,
                            notes: rental.notes || ''
                        };
                    });
                    
                    setClientRentals(formattedRentals);
                    
                    // Fetch paid payments for these rentals
                    try {
                        const paidPaymentsResponse = await axios.get('http://localhost:5001/api/payment/getAllPaidPayments');
                        const fetchedPaidPayments = paidPaymentsResponse.data?.payments || [];
                        
                        // Filter to get only payments relevant to this client's rentals
                        const clientRentalIds = formattedRentals.map(r => r.id);
                        const clientPaidPayments = fetchedPaidPayments.filter(payment => 
                            clientRentalIds.includes(payment.rental_id)
                        );
                        
                        setPaidPayments(clientPaidPayments);
                        console.log('Filtered paid payments for client rentals:', clientPaidPayments);
                    } catch (paymentError) {
                        console.error('Error fetching paid payments:', paymentError);
                        setPaidPayments([]);
                    }
                } else {
                    console.log('No rentals found for client:', clientId);
                    setClientRentals([]);
                }
            } catch (rentalError) {
                console.error('Error fetching client rentals:', rentalError);
                setClientRentals([]);
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
                    broker_id: localStorage.getItem('brokerId'),
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
                                <td data-label="Name">{client.name}</td>
                                <td data-label="Email">{client.email}</td>
                                <td data-label="Phone">{client.phone}</td>
                                <td data-label="Address">{client.address}</td>
                                <td data-label="Joined">{new Date(client.joinDate).toLocaleDateString()}</td>
                                <td data-label="Actions">
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
            {/* Client Add/Edit Modal */}
            {(isAddingClient || isEditingClient) && (
                <div className="client-modal-overlay">
                    <div className="client-modal">
                        <button
                            className="modal-close-btn"
                            onClick={cancelForm}
                        >
                            &times;
                        </button>
                        <h2 className="modal-title">{isAddingClient ? 'Add New Client' : 'Edit Client'}</h2>
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
                </div>
            )}
            
            {/* Client Profile Modal */}
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
                                
                                <div className="rentals-section">
                                    <h3>Rental Properties</h3>
                                    {clientRentals.length > 0 ? (
                                        <div className="rental-table">
                                            <div className="rental-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontWeight: 'bold' }}>
                                                <span>Property</span>
                                                <span>Start Date</span>
                                                <span>End Date</span>
                                                <span>Monthly Rent</span>
                                                <span>Actions</span>
                                            </div>
                                            {clientRentals.map(rental => (
                                                <div key={rental.id} className="rental-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', alignItems: 'center' }}>
                                                    <span>{rental.property}</span>
                                                    <span>{new Date(rental.start_date).toLocaleDateString()}</span>
                                                    <span>{new Date(rental.end_date).toLocaleDateString()}</span>
                                                    <span>${rental.amount.toFixed(2)}</span>
                                                    <button 
                                                        className="view-details-btn"
                                                        onClick={() => {
                                                            setSelectedRental(rental);
                                                            setIsRentalDetailsModalOpen(true);
                                                        }}
                                                    >
                                                        Show Details
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-data">No rental properties found</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Rental Details Modal */}
            {isRentalDetailsModalOpen && selectedRental && (
                <div className="rental-details-modal-overlay">
                    <div className="rental-details-modal">
                        <button
                            className="modal-close-btn"
                            onClick={() => setIsRentalDetailsModalOpen(false)}
                        >
                            &times;
                        </button>

                        <h2 className="modal-title">Rental Details: {selectedRental.property}</h2>

                        <div className="rental-info-section">
                            <div className="detail-columns">
                                <div className="detail-column">
                                    <div className="info-item">
                                        <label>Property:</label>
                                        <p>{selectedRental.property}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Start Date:</label>
                                        <p>{new Date(selectedRental.start_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>End Date:</label>
                                        <p>{new Date(selectedRental.end_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="detail-column">
                                    <div className="info-item">
                                        <label>Monthly Rent:</label>
                                        <p>${selectedRental.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Status:</label>
                                        <p>{selectedRental.status}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Notes:</label>
                                        <p>{selectedRental.notes || 'No notes available'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="payment-history-section">
                            <h3>Payment History</h3>
                            <div className="payment-months">
                                {generatePaymentMonths(selectedRental)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Function to generate payment months display
    function generatePaymentMonths(rental) {
        // Get the start and end dates
        const startDate = new Date(rental.start_date);
        const endDate = new Date(rental.end_date);
        
        // Create a list of all months in the rental period
        const months = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            
            // Check if this month has a paid payment
            const isPaid = paidPayments.some(payment => {
                const paymentDate = new Date(payment.payment_date);
                return payment.rental_id === rental.id && 
                       paymentDate.getMonth() === month && 
                       paymentDate.getFullYear() === year;
            });
            
            // Determine status based on current date
            let status;
            const today = new Date();
            
            // Properly compare the dates to fix the issue with future months showing as overdue
            if (isPaid) {
                status = 'paid';
            } else if (year < today.getFullYear() || 
                      (year === today.getFullYear() && month < today.getMonth())) {
                // Past month (previous year or earlier month in current year)
                status = 'overdue';
            } else if (year === today.getFullYear() && month === today.getMonth()) {
                // Current month
                status = 'due';
            } else {
                // Future month
                status = 'upcoming';
            }
            
            months.push({
                month: currentDate.toLocaleString('default', { month: 'long' }),
                year: year,
                status: status
            });
            
            // Move to next month
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return (
            <div className="month-grid">
                {months.map((monthData, index) => (
                    <div key={index} className={`month-item month-${monthData.status}`}>
                        <div className="month-name">{monthData.month} {monthData.year}</div>
                        <div className="month-status">
                            {monthData.status === 'paid' && <span className="status-paid">Paid</span>}
                            {monthData.status === 'overdue' && <span className="status-overdue">Overdue</span>}
                            {monthData.status === 'due' && <span className="status-due">Due</span>}
                            {monthData.status === 'upcoming' && <span className="status-upcoming">Upcoming</span>}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default Client;