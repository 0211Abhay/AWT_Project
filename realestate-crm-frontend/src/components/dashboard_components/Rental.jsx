import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Upload, FileText, Search, Bell, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import axios from 'axios';
// import { toast } from 'react-toastify'; // Commented out since it's not properly configured
import "../../style/Rental.css";
const Rental = () => {
    const [activeTab, setActiveTab] = useState('payments');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showRentalModal, setShowRentalModal] = useState(false);

    // State for broker data
    const [currentBrokerId, setCurrentBrokerId] = useState(null);
    const [properties, setProperties] = useState([]);
    const [clients, setClients] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // State for notification preferences
    const [notificationPrefs, setNotificationPrefs] = useState({
        emailNotification: true,
        smsNotification: false,
        calendarReminder: true,
        documentReminder: true,
        paymentReminder: true,
        leaseReminder: false
    });

    // Function to handle checkbox changes
    const handleCheckboxChange = (prefName) => {
        setNotificationPrefs(prev => ({
            ...prev,
            [prefName]: !prev[prefName]
        }));
    };

    const [newRental, setNewRental] = useState({
        broker_id: 1, // Will be updated with current broker ID
        client_id: '',
        property_id: '',
        start_date: '',
        end_date: '',
        rent_amount: '',
        status: 'Active',
        notes: ''
    });

    // Get current broker ID from localStorage on component mount
    useEffect(() => {
        try {
            // Get broker info from localStorage
            const brokerInfo = JSON.parse(localStorage.getItem('brokerInfo')) || {};
            const brokerId = brokerInfo.brokerId || '2'; // Default to broker ID 2 if not found
            console.log('Current broker ID:', brokerId);

            setCurrentBrokerId(brokerId);
            setNewRental(prev => ({
                ...prev,
                broker_id: brokerId
            }));
        } catch (error) {
            console.error('Error getting broker info from localStorage:', error);
            // Fallback to broker ID 2
            setCurrentBrokerId('2');
            setNewRental(prev => ({
                ...prev,
                broker_id: '2'
            }));
        }
    }, []);

    // Fetch properties and clients when modal is opened
    useEffect(() => {
        if (showRentalModal && currentBrokerId) {
            fetchPropertiesAndClients();
        }
    }, [showRentalModal, currentBrokerId]);

    // Function to fetch properties and clients for the current broker
    const fetchPropertiesAndClients = async () => {
        if (!currentBrokerId) return;

        setLoadingData(true);
        try {
            // Fetch properties for this broker
            let propertiesData = [];
            try {
                const propertiesResponse = await axios.get(`http://localhost:5001/api/property/getPropertiesByBroker/${currentBrokerId}`);
                if (propertiesResponse.data) {
                    propertiesData = propertiesResponse.data.properties || [];
                    console.log('Broker properties:', propertiesData);
                }
            } catch (propError) {
                console.error('Error fetching broker properties:', propError);
            }

            // If no properties found for this broker, fetch all properties as fallback
            if (!propertiesData || propertiesData.length === 0) {
                try {
                    const allPropertiesResponse = await axios.get('http://localhost:5001/api/property/getAllProperty');
                    if (allPropertiesResponse.data && allPropertiesResponse.data.properties) {
                        // Filter properties by broker_id if possible, otherwise show all
                        propertiesData = allPropertiesResponse.data.properties.filter(property =>
                            !currentBrokerId || property.broker_id.toString() === currentBrokerId.toString()
                        );
                        console.log('All properties filtered for broker:', propertiesData);
                    }
                } catch (allPropError) {
                    console.error('Error fetching all properties:', allPropError);
                }
            }

            setProperties(propertiesData || []);

            // Similar approach for clients
            let clientsData = [];
            try {
                // Use axios for consistent API calls and POST request for getClientsByBroker
                const clientsResponse = await axios.post('http://localhost:5001/api/client/getClientsByBroker', {
                    broker_id: currentBrokerId
                });

                if (clientsResponse.data) {
                    clientsData = clientsResponse.data;
                    console.log('Broker clients:', clientsData);
                }
            } catch (clientError) {
                console.error('Error fetching broker clients:', clientError);
            }

            // If no clients found for this broker, fetch all clients as fallback
            if (!clientsData || clientsData.length === 0) {
                try {
                    const allClientsResponse = await axios.get('http://localhost:5001/api/client/getAllClient');
                    if (allClientsResponse.data) {
                        // Filter clients by broker_id if possible, otherwise show all
                        clientsData = allClientsResponse.data.filter(client =>
                            !currentBrokerId || client.broker_id.toString() === currentBrokerId.toString()
                        );
                        console.log('All clients filtered for broker:', clientsData);
                    }
                } catch (allClientError) {
                    console.error('Error fetching all clients:', allClientError);
                }
            }

            setClients(clientsData || []);

        } catch (error) {
            console.error('Error in fetchPropertiesAndClients:', error);
            // Show error state instead of using mock data
            setProperties([]);
            setClients([]);
            // Display an error message to the user
            alert('Failed to load properties and clients. Please try again later.');
            // You could also set an error state here if you want to show a specific error UI
        } finally {
            setLoadingData(false);
        }
    };

    // State for rental data
    const [rentals, setRentals] = useState([]);
    const [leases, setLeases] = useState([]);
    const [documents, setDocuments] = useState([]);

    // Helper function to map rental status to payment status
    const mapRentalStatusToPaymentStatus = (rentalStatus) => {
        switch (rentalStatus) {
            case 'Active':
                return 'Pending';
            case 'Completed':
                return 'Paid';
            case 'Terminated':
                return 'Overdue';
            default:
                return 'Unknown';
        }
    };

    // Helper function to determine lease status based on end date and rental status
    const getLeaseStatus = (endDate, rentalStatus) => {
        if (rentalStatus === 'Terminated') {
            return 'Terminated';
        }

        const today = new Date();
        const leaseEndDate = new Date(endDate);

        if (leaseEndDate < today) {
            return 'Expired';
        } else if (rentalStatus === 'Completed') {
            return 'Completed';
        } else {
            // Calculate days remaining
            const daysRemaining = Math.ceil((leaseEndDate - today) / (1000 * 60 * 60 * 24));

            if (daysRemaining <= 30) {
                return 'Expiring Soon';
            } else {
                return 'Active';
            }
        }
    };

    // Function to fetch documents (using mock data since API endpoint doesn't exist yet)
    const fetchDocuments = async () => {
        try {
            setLoadingData(true);

            // Get broker ID from localStorage
            const currentBrokerId = localStorage.getItem('brokerId');

            // Use mock data for now since the API endpoint doesn't exist
            // This will be replaced with a real API call once the endpoint is implemented
            const mockDocuments = [
                { id: 1, name: 'Lease Agreement Template', type: 'PDF', date: '2023-10-15', size: '245 KB' },
                { id: 2, name: 'Rental Application Form', type: 'DOCX', date: '2023-09-22', size: '180 KB' },
                { id: 3, name: 'Property Inspection Checklist', type: 'PDF', date: '2023-11-05', size: '320 KB' }
            ];

            // Filter by broker ID if needed
            const filteredDocuments = currentBrokerId
                ? mockDocuments.filter(doc => doc.broker_id === parseInt(currentBrokerId) || !doc.broker_id)
                : mockDocuments;

            setDocuments(filteredDocuments);
            console.log('Using mock documents data:', filteredDocuments);
        } catch (error) {
            console.error('Error in document handling:', error);
            setDocuments([]);
        } finally {
            setLoadingData(false);
        }
    };

    // Fetch rentals and documents on component mount
    useEffect(() => {
        fetchRentals();
        fetchDocuments();
    }, []);

    // Function to fetch rentals from the backend
    const fetchRentals = async () => {
        try {
            setLoadingData(true);
            // Get broker ID from localStorage
            const currentBrokerId = localStorage.getItem('brokerId');

            // Fetch rentals from the API using the broker-specific endpoint
            const response = await axios.get(`http://localhost:5001/api/rental/getRentalsByBroker/${currentBrokerId}`);

            if (response.data && response.data.rentals) {
                const formattedRentals = response.data.rentals.map(rental => ({
                    id: rental.rental_id,
                    property: rental.property ? rental.property.name : 'Unknown Property',
                    tenant: rental.client ? `${rental.client.first_name} ${rental.client.last_name}` : 'Unknown Client',
                    dueDate: rental.end_date,
                    amount: parseFloat(rental.rent_amount),
                    status: mapRentalStatusToPaymentStatus(rental.status),
                    paymentDate: rental.status === 'Completed' ? rental.updated_at : '',
                    method: rental.status === 'Completed' ? 'Bank Transfer' : '',
                    property_id: rental.property_id,
                    client_id: rental.client_id,
                    start_date: rental.start_date,
                    end_date: rental.end_date
                }));
                setRentals(formattedRentals);

                const formattedLeases = response.data.rentals.map(rental => ({
                    id: rental.rental_id,
                    property: rental.property ? rental.property.name : 'Unknown Property',
                    tenant: rental.client ? `${rental.client.first_name} ${rental.client.last_name}` : 'Unknown Client',
                    startDate: rental.start_date,
                    endDate: rental.end_date,
                    status: getLeaseStatus(rental.end_date, rental.status)
                }));
                setLeases(formattedLeases);
            } else {
                setRentals([]);
                setLeases([]);
            }
        } catch (error) {
            console.error('Error fetching rentals:', error);
            setRentals([]);
            setLeases([]);
            alert('Failed to load rentals. Please try again later.');
        } finally {
            setLoadingData(false);
        }
    };

    // This getLeaseStatus function is now defined earlier in the component

    // Filter rentals based on status and search query
    const filteredRentals = rentals.filter(rental => {
        const matchesStatus = filterStatus === 'all' || rental.status === filterStatus;
        const matchesSearch = rental.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rental.tenant.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Function to get status class for styling
    const getStatusClass = (status) => {
        switch (status) {
            case 'paid': return 'status-paid';
            case 'due': return 'status-due';
            case 'overdue': return 'status-overdue';
            case 'active': return 'status-active';
            case 'expiring-soon': return 'status-expiring';
            case 'expired': return 'status-expired';
            default: return '';
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to handle adding a new rental
    const handleAddRental = async () => {
        try {
            // Validate form
            if (!newRental.client_id || !newRental.property_id || !newRental.start_date ||
                !newRental.end_date || !newRental.rent_amount) {
                alert('Please fill in all required fields');
                return;
            }

            // Get client and property details for display - handle different API data structures
            const selectedClient = clients.find(c => {
                const clientId = c.client_id || c.id;
                return clientId && clientId.toString() === newRental.client_id.toString();
            });

            const selectedProperty = properties.find(p => {
                const propertyId = p.property_id || p.id;
                return propertyId && propertyId.toString() === newRental.property_id.toString();
            });

            if (!selectedClient || !selectedProperty) {
                alert('Invalid client or property selection');
                return;
            }

            // Prepare data for API request
            const rentalData = {
                broker_id: parseInt(newRental.broker_id),
                client_id: parseInt(newRental.client_id),
                property_id: parseInt(newRental.property_id),
                start_date: newRental.start_date,
                end_date: newRental.end_date,
                rent_amount: parseFloat(newRental.rent_amount),
                status: newRental.status,
                notes: newRental.notes
            };

            // Show loading state
            setLoadingData(true);

            // Send data to the backend API
            const response = await axios.post('http://localhost:5001/api/rental/createRental', rentalData);

            // If successful, refresh the rentals data to show the new entry
            if (response.data && response.data.rental) {
                // Fetch updated rental data to ensure we have the latest information
                await fetchRentals();

                // Reset form and close modal
                setNewRental({
                    broker_id: currentBrokerId,
                    client_id: '',
                    property_id: '',
                    start_date: '',
                    end_date: '',
                    rent_amount: '',
                    status: 'Active',
                    notes: ''
                });

                setShowRentalModal(false);

                // Show success message
                alert('Rental agreement added successfully!');
            }
        } catch (error) {
            console.error('Error adding rental:', error);
            alert('Failed to add rental agreement: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoadingData(false);
        }
    };

    const handleMarkAsPaid = (id) => {
        // Update the rental status to paid
        setRentals(prevRentals =>
            prevRentals.map(rental =>
                rental.id === id
                    ? { ...rental, status: 'paid', paymentDate: new Date().toISOString().split('T')[0], method: 'Bank Transfer' }
                    : rental
            )
        );

        // Also update the lease status
        setLeases(prevLeases =>
            prevLeases.map(lease =>
                lease.id === id
                    ? { ...lease, status: 'expired' }
                    : lease
            )
        );

        // In a real app, you would call an API to update the status
        // axios.patch(`/api/rental/changeRentalStatus/${id}`, { status: 'Completed' });

        alert('Rental marked as paid successfully!');
    };

    const handleUploadDocument = () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Create a new document entry
            const newDocId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
            const newDocument = {
                id: newDocId,
                name: file.name,
                property: selectedProperty || 'General',
                type: file.name.toLowerCase().includes('lease') ? 'Lease Agreement' :
                    file.name.toLowerCase().includes('id') ? 'Tenant ID' : 'Document',
                uploadDate: new Date().toISOString().split('T')[0]
            };

            // Add to documents state
            setDocuments(prevDocs => [newDocument, ...prevDocs]);

            alert('Document uploaded successfully!');
        };

        fileInput.click();
    };

    const handlePropertySelect = (property) => {
        setSelectedProperty(property);
    };

    // Dashboard metrics
    const dashboardMetrics = {
        totalRentedProperties: 5,
        upcomingPayments: 2,
        expiringLeases: 1,
        overduePayments: 1
    };

    useEffect(() => {
        // Animation for dashboard numbers
        const counters = document.querySelectorAll('.metric-value');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 20;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => { }, 50);
            } else {
                counter.innerText = target;
            }
        });
    }, []);

    return (
        <div className="rental-management">
            <div className="page-header">
                <div className="title-area">
                    <h1>Rental Management</h1>
                    {/* <p>Efficiently manage your rental properties, tenants, and payments</p> */}
                </div>
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => setShowRentalModal(true)}>
                        <span>Add New Rental</span>
                    </button>
                    <button className="btn btn-secondary" onClick={handleUploadDocument}>
                        <Upload size={16} />
                        <span>Upload Document</span>
                    </button>
                </div>
            </div>

            <div className="dashboard-overview">
                <div className="metric-card">
                    <div className="metric-icon properties-icon">
                        <FileText size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Rented Properties</h3>
                        <p className="metric-value" data-target={dashboardMetrics.totalRentedProperties}>
                            {dashboardMetrics.totalRentedProperties}
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon upcoming-icon">
                        <Clock size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Upcoming Payments</h3>
                        <p className="metric-value" data-target={dashboardMetrics.upcomingPayments}>
                            {dashboardMetrics.upcomingPayments}
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon expiring-icon">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Expiring Leases</h3>
                        <p className="metric-value" data-target={dashboardMetrics.expiringLeases}>
                            {dashboardMetrics.expiringLeases}
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon overdue-icon">
                        <XCircle size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Overdue Payments</h3>
                        <p className="metric-value" data-target={dashboardMetrics.overduePayments}>
                            {dashboardMetrics.overduePayments}
                        </p>
                    </div>
                </div>
            </div>

            <div className="content-tabs">
                <button
                    className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payments')}
                >
                    <DollarSign size={18} />
                    <span>Rent Payments</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'leases' ? 'active' : ''}`}
                    onClick={() => setActiveTab('leases')}
                >
                    <Calendar size={18} />
                    <span>Lease Agreements</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                >
                    <FileText size={18} />
                    <span>Documents</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'reminders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reminders')}
                >
                    <Bell size={18} />
                    <span>Reminders</span>
                </button>
            </div>

            <div className="content-area">
                {activeTab === 'payments' && (
                    <div className="payments-tab">
                        <div className="filter-controls">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by property or tenant"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="status-filters">
                                <button
                                    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('paid')}
                                >
                                    Paid
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'due' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('due')}
                                >
                                    Due
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'overdue' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('overdue')}
                                >
                                    Overdue
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Tenant</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRentals.map(rental => (
                                        <tr key={rental.id} onClick={() => handlePropertySelect(rental)}>
                                            <td>{rental.property}</td>
                                            <td>{rental.tenant}</td>
                                            <td>{formatDate(rental.dueDate)}</td>
                                            <td>${rental.amount.toLocaleString()}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(rental.status)}`}>
                                                    {rental.status === 'paid' && <CheckCircle size={14} />}
                                                    {rental.status === 'due' && <Clock size={14} />}
                                                    {rental.status === 'overdue' && <XCircle size={14} />}
                                                    {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                {rental.status !== 'paid' && (
                                                    <button
                                                        className="action-btn mark-paid-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsPaid(rental.id);
                                                        }}
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                )}
                                                {rental.status === 'paid' && (
                                                    <button className="action-btn view-receipt-btn">
                                                        View Receipt
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {selectedProperty && (
                            <div className="detail-panel">
                                <div className="detail-header">
                                    <h3>{selectedProperty.property}</h3>
                                    <button className="close-btn" onClick={() => setSelectedProperty(null)}>×</button>
                                </div>
                                <div className="detail-content">
                                    <div className="detail-section">
                                        <h4>Tenant Information</h4>
                                        <p><strong>Name:</strong> {selectedProperty.tenant}</p>
                                        <p><strong>Contact:</strong> +1 (123) 456-7890</p>
                                        <p><strong>Email:</strong> tenant@example.com</p>
                                    </div>
                                    <div className="detail-section">
                                        <h4>Payment History</h4>
                                        <div className="mini-table">
                                            <div className="mini-row header">
                                                <div>Date</div>
                                                <div>Amount</div>
                                                <div>Method</div>
                                            </div>
                                            <div className="mini-row">
                                                <div>Oct 5, 2023</div>
                                                <div>${selectedProperty.amount}</div>
                                                <div>Bank Transfer</div>
                                            </div>
                                            <div className="mini-row">
                                                <div>Sep 3, 2023</div>
                                                <div>${selectedProperty.amount}</div>
                                                <div>Credit Card</div>
                                            </div>
                                            <div className="mini-row">
                                                <div>Aug 5, 2023</div>
                                                <div>${selectedProperty.amount}</div>
                                                <div>Bank Transfer</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-actions">
                                        <button className="btn btn-outline">Contact Tenant</button>
                                        <button className="btn btn-primary">View Documents</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'leases' && (
                    <div className="leases-tab">
                        <div className="filter-controls">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by property or tenant"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Tenant</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leases.map(lease => (
                                        <tr key={lease.id}>
                                            <td>{lease.property}</td>
                                            <td>{lease.tenant}</td>
                                            <td>{formatDate(lease.startDate)}</td>
                                            <td>{formatDate(lease.endDate)}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(lease.status)}`}>
                                                    {lease.status === 'active' && <CheckCircle size={14} />}
                                                    {lease.status === 'expiring-soon' && <AlertTriangle size={14} />}
                                                    {lease.status === 'expired' && <XCircle size={14} />}
                                                    {lease.status === 'active' && 'Active'}
                                                    {lease.status === 'expiring-soon' && 'Expiring Soon'}
                                                    {lease.status === 'expired' && 'Expired'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="action-btn view-btn">
                                                    View
                                                </button>
                                                <button className="action-btn renew-btn">
                                                    Renew
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="documents-tab">
                        <div className="filter-controls">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search documents"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleUploadDocument}>
                                <Upload size={16} />
                                <span>Upload Document</span>
                            </button>
                        </div>

                        <div className="documents-grid">
                            {documents.map(doc => (
                                <div className="document-card" key={doc.id}>
                                    <div className="document-icon">
                                        <FileText size={32} />
                                    </div>
                                    <div className="document-info">
                                        <h4>{doc.name}</h4>
                                        <p>{doc.property}</p>
                                        <p className="document-type">{doc.type}</p>
                                        <p className="document-date">Uploaded: {formatDate(doc.uploadDate)}</p>
                                    </div>
                                    <div className="document-actions">
                                        <button className="action-btn view-btn">
                                            View
                                        </button>
                                        <button className="action-btn download-btn">
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reminders' && (
                    <div className="reminders-tab">
                        <div className="reminders-header">
                            <h2>Manage Reminders</h2>
                            <button className="btn btn-primary">
                                <Bell size={16} />
                                <span>Create New Reminder</span>
                            </button>
                        </div>

                        <div className="reminders-grid">
                            <div className="reminder-card">
                                <div className="reminder-header">
                                    <h3>Rent Payment Due</h3>
                                    <span className="reminder-badge">Automated</span>
                                </div>
                                <p>Reminder for Emily Rodriguez's rent payment</p>
                                <p className="reminder-date">
                                    <Clock size={14} />
                                    Scheduled for: Nov 8, 2023
                                </p>
                                <div className="reminder-settings">
                                    <div className="reminder-toggle">
                                        <span>Email Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="reminder-toggle">
                                        <span>SMS Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={false} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="reminder-actions">
                                    <button className="action-btn edit-btn">
                                        Edit
                                    </button>
                                    <button className="action-btn delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="reminder-card">
                                <div className="reminder-header">
                                    <h3>Lease Expiration</h3>
                                    <span className="reminder-badge">Automated</span>
                                </div>
                                <p>Reminder for James Wilson's lease expiration</p>
                                <p className="reminder-date">
                                    <Clock size={14} />
                                    Scheduled for: Nov 25, 2023
                                </p>
                                <div className="reminder-settings">
                                    <div className="reminder-toggle">
                                        <span>Email Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="reminder-toggle">
                                        <span>SMS Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="reminder-actions">
                                    <button className="action-btn edit-btn">
                                        Edit
                                    </button>
                                    <button className="action-btn delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="reminder-card">
                                <div className="reminder-header">
                                    <h3>Property Inspection</h3>
                                    <span className="reminder-badge">Custom</span>
                                </div>
                                <p>Annual inspection for Riverside House</p>
                                <p className="reminder-date">
                                    <Clock size={14} />
                                    Scheduled for: Dec 15, 2023
                                </p>
                                <div className="reminder-settings">
                                    <div className="reminder-toggle">
                                        <span>Email Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="reminder-toggle">
                                        <span>SMS Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={false} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="reminder-actions">
                                    <button className="action-btn edit-btn">
                                        Edit
                                    </button>
                                    <button className="action-btn delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Add New Rental Modal */}
            {showRentalModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Rental Agreement</h2>
                            <button className="close-btn" onClick={() => setShowRentalModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // Create a new rental
                                handleAddRental();
                            }}>
                                <div className="form-group">
                                    <label htmlFor="client-id">Client</label>
                                    {loadingData ? (
                                        <div className="loading-text">Loading clients...</div>
                                    ) : (
                                        <select
                                            id="client-id"
                                            value={newRental.client_id}
                                            onChange={(e) => setNewRental({ ...newRental, client_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Client</option>
                                            {clients.map(client => (
                                                <option key={client.client_id || client.id} value={client.client_id || client.id}>
                                                    {client.name || client.client_name || `Client #${client.client_id || client.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="property-id">Property</label>
                                    {loadingData ? (
                                        <div className="loading-text">Loading properties...</div>
                                    ) : (
                                        <select
                                            id="property-id"
                                            value={newRental.property_id}
                                            onChange={(e) => setNewRental({ ...newRental, property_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Property</option>
                                            {properties.map(property => (
                                                <option key={property.property_id || property.id} value={property.property_id || property.id}>
                                                    {property.name || property.property_name || `Property #${property.property_id || property.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="start-date">Start Date</label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        value={newRental.start_date}
                                        onChange={(e) => setNewRental({ ...newRental, start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="end-date">End Date</label>
                                    <input
                                        type="date"
                                        id="end-date"
                                        value={newRental.end_date}
                                        onChange={(e) => setNewRental({ ...newRental, end_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rent-amount">Rent Amount</label>
                                    <input
                                        type="number"
                                        id="rent-amount"
                                        value={newRental.rent_amount}
                                        onChange={(e) => setNewRental({ ...newRental, rent_amount: e.target.value })}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        value={newRental.status}
                                        onChange={(e) => setNewRental({ ...newRental, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Terminated">Terminated</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Notes</label>
                                    <textarea
                                        id="notes"
                                        value={newRental.notes}
                                        onChange={(e) => setNewRental({ ...newRental, notes: e.target.value })}
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowRentalModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Rental</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rental;