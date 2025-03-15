import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Upload, FileText, Search, Bell, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import "../../style/Rental.css";
const Rental = () => {
    const [activeTab, setActiveTab] = useState('payments');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);

    // Sample data
    const rentals = [
        { id: 1, property: "Oceanview Apartment", tenant: "James Wilson", dueDate: "2023-11-05", amount: 1850, status: "paid", paymentDate: "2023-11-03", method: "Bank Transfer" },
        { id: 2, property: "Downtown Loft", tenant: "Emily Rodriguez", dueDate: "2023-11-10", amount: 2100, status: "due", paymentDate: "", method: "" },
        { id: 3, property: "Sunset Villa", tenant: "Michael Chen", dueDate: "2023-10-28", amount: 3200, status: "overdue", paymentDate: "", method: "" },
        { id: 4, property: "Parkside Condo", tenant: "Sarah Johnson", dueDate: "2023-11-15", amount: 1950, status: "paid", paymentDate: "2023-11-01", method: "Credit Card" },
        { id: 5, property: "Riverside House", tenant: "David Kim", dueDate: "2023-11-20", amount: 2800, status: "due", paymentDate: "", method: "" },
    ];

    const leases = [
        { id: 1, property: "Oceanview Apartment", tenant: "James Wilson", startDate: "2023-01-10", endDate: "2023-12-10", status: "expiring-soon" },
        { id: 2, property: "Downtown Loft", tenant: "Emily Rodriguez", startDate: "2023-03-15", endDate: "2024-03-15", status: "active" },
        { id: 3, property: "Sunset Villa", tenant: "Michael Chen", startDate: "2022-10-28", endDate: "2023-10-28", status: "expired" },
        { id: 4, property: "Parkside Condo", tenant: "Sarah Johnson", startDate: "2023-05-20", endDate: "2024-05-20", status: "active" },
        { id: 5, property: "Riverside House", tenant: "David Kim", startDate: "2023-06-01", endDate: "2024-06-01", status: "active" },
    ];

    const documents = [
        { id: 1, name: "Lease_Oceanview_Wilson.pdf", property: "Oceanview Apartment", type: "Lease Agreement", uploadDate: "2023-01-10" },
        { id: 2, name: "ID_Emily_Rodriguez.pdf", property: "Downtown Loft", type: "Tenant ID", uploadDate: "2023-03-15" },
        { id: 3, name: "Payment_Receipt_Oct_Chen.pdf", property: "Sunset Villa", type: "Payment Receipt", uploadDate: "2023-10-05" },
        { id: 4, name: "Insurance_Parkside_Johnson.pdf", property: "Parkside Condo", type: "Insurance", uploadDate: "2023-05-25" },
        { id: 5, name: "Inspection_Riverside_2023.pdf", property: "Riverside House", type: "Property Inspection", uploadDate: "2023-07-12" },
    ];

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

    const handleMarkAsPaid = (id) => {
        console.log(`Marking rental ${id} as paid`);
        // In a real app, update the state or call an API
    };

    const handleUploadDocument = () => {
        console.log('Upload document clicked');
        // In a real app, open a file upload dialog
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
                    <button className="btn btn-primary">
                        <span>Add New Tenant</span>
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
                                            <input type="checkbox" checked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="reminder-toggle">
                                        <span>SMS Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" />
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
                                            <input type="checkbox" checked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="reminder-toggle">
                                        <span>SMS Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" checked={true} />
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
                                            <input type="checkbox" checked={true} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="reminder-toggle">
                                        <span>SMS Notification</span>
                                        <label className="switch">
                                            <input type="checkbox" />
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
        </div>
    );
};

export default Rental;