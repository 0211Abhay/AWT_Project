import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Square, XSquare, Bell, Users, MapPin, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import "../../style/Schedule.css";

const Schedule = () => {
    const [activeView, setActiveView] = useState('list');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [showNewVisitForm, setShowNewVisitForm] = useState(false);
    const [newVisitData, setNewVisitData] = useState({
        date: '',
        time: '',
        property: '',
        client: '',
        contactNumber: '',
        email: '',
        notes: ''
    });

    // Sample data
    const visits = [
        {
            id: 1,
            property: "Oceanview Apartment",
            client: "James Wilson",
            date: "2023-11-12",
            time: "10:00 AM",
            status: "scheduled",
            contactNumber: "+1 (123) 456-7890",
            email: "james@example.com",
            notes: "Client is interested in 2-bedroom apartments with ocean view. Budget around $500,000."
        },
        {
            id: 2,
            property: "Downtown Loft",
            client: "Emily Rodriguez",
            date: "2023-11-10",
            time: "2:30 PM",
            status: "scheduled",
            contactNumber: "+1 (234) 567-8901",
            email: "emily@example.com",
            notes: "Client prefers modern design. Looking for investment property."
        },
        {
            id: 3,
            property: "Sunset Villa",
            client: "Michael Chen",
            date: "2023-11-05",
            time: "4:00 PM",
            status: "completed",
            contactNumber: "+1 (345) 678-9012",
            email: "michael@example.com",
            notes: "Client loved the property. Following up with financing options."
        },
        {
            id: 4,
            property: "Parkside Condo",
            client: "Sarah Johnson",
            date: "2023-11-08",
            time: "11:30 AM",
            status: "cancelled",
            contactNumber: "+1 (456) 789-0123",
            email: "sarah@example.com",
            notes: "Client cancelled due to schedule conflict. Wants to reschedule next week."
        },
        {
            id: 5,
            property: "Riverside House",
            client: "David Kim",
            date: "2023-11-15",
            time: "1:00 PM",
            status: "scheduled",
            contactNumber: "+1 (567) 890-1234",
            email: "david@example.com",
            notes: "Client is relocating from another city. Needs property close to downtown."
        },
    ];

    // Properties for dropdown
    const properties = [
        "Oceanview Apartment",
        "Downtown Loft",
        "Sunset Villa",
        "Parkside Condo",
        "Riverside House",
        "Maple Heights",
        "Grove Terrace",
        "Hillside Retreat"
    ];

    // Clients for dropdown
    const clients = [
        "James Wilson",
        "Emily Rodriguez",
        "Michael Chen",
        "Sarah Johnson",
        "David Kim",
        "Lisa Brown",
        "Robert Taylor",
        "Amanda Lee"
    ];

    // Filter visits based on status and search query
    const filteredVisits = visits.filter(visit => {
        const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
        const matchesSearch = visit.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            visit.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Function to get status class for styling
    const getStatusClass = (status) => {
        switch (status) {
            case 'scheduled': return 'status-scheduled';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Handle status change
    const handleStatusChange = (id, newStatus) => {
        console.log(`Changing visit ${id} status to ${newStatus}`);
        // In a real app, update the state or call an API
    };

    // Handle visit selection
    const handleVisitSelect = (visit) => {
        setSelectedVisit(visit);
    };

    // Handle new visit form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVisitData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmitVisit = (e) => {
        e.preventDefault();
        console.log('New visit data:', newVisitData);
        // In a real app, save the data and update state
        setShowNewVisitForm(false);
        setNewVisitData({
            date: '',
            time: '',
            property: '',
            client: '',
            contactNumber: '',
            email: '',
            notes: ''
        });
    };

    // Dashboard metrics
    const dashboardMetrics = {
        totalScheduled: 3,
        completedThisMonth: 5,
        cancelledThisMonth: 1,
        conversionRate: 70
    };

    // Generate days for the calendar view
    const generateCalendarDays = () => {
        const days = [];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add cells for each day in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toISOString().split('T')[0];

            // Find visits on this day
            const dayVisits = visits.filter(visit => visit.date === dateString);

            days.push(
                <div key={`day-${day}`} className={`calendar-day ${day === today.getDate() ? 'today' : ''}`}>
                    <div className="day-number">{day}</div>
                    {dayVisits.length > 0 && (
                        <div className="day-visits">
                            {dayVisits.map(visit => (
                                <div
                                    key={visit.id}
                                    className={`visit-pill ${getStatusClass(visit.status)}`}
                                    onClick={() => handleVisitSelect(visit)}
                                >
                                    {visit.time} - {visit.client}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return days;
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
        <div className="visit-scheduling">
            <div className="page-header">
                <div className="title-area">
                    <h1>Visit Scheduling</h1>
                </div>
                <div className="action-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowNewVisitForm(true)}
                    >
                        <Calendar size={16} />
                        <span>Schedule New Visit</span>
                    </button>
                </div>
            </div>

            <div className="dashboard-overview">
                <div className="metric-card">
                    <div className="metric-icon scheduled-icon">
                        <Calendar size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Scheduled Visits</h3>
                        <p className="metric-value" data-target={dashboardMetrics.totalScheduled}>
                            {dashboardMetrics.totalScheduled}
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon completed-icon">
                        <CheckCircle size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Completed This Month</h3>
                        <p className="metric-value" data-target={dashboardMetrics.completedThisMonth}>
                            {dashboardMetrics.completedThisMonth}
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon cancelled-icon">
                        <XCircle size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Cancelled This Month</h3>
                        <p className="metric-value" data-target={dashboardMetrics.cancelledThisMonth}>
                            {dashboardMetrics.cancelledThisMonth}
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon conversion-icon">
                        <Users size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Conversion Rate</h3>
                        <p className="metric-value" data-target={dashboardMetrics.conversionRate}>
                            {dashboardMetrics.conversionRate}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="view-toggle">
                <button
                    className={`toggle-btn ${activeView === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveView('list')}
                >
                    <Square size={16} />
                    <span>List View</span>
                </button>
                <button
                    className={`toggle-btn ${activeView === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveView('calendar')}
                >
                    <Calendar size={16} />
                    <span>Calendar View</span>
                </button>
            </div>

            <div className="content-area">
                {activeView === 'list' && (
                    <div className="list-view">
                        <div className="filter-controls">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by property or client"
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
                                    className={`filter-btn ${filterStatus === 'scheduled' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('scheduled')}
                                >
                                    Scheduled
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('completed')}
                                >
                                    Completed
                                </button>
                                <button
                                    className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('cancelled')}
                                >
                                    Cancelled
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVisits.map(visit => (
                                        <tr key={visit.id} onClick={() => handleVisitSelect(visit)}>
                                            <td>{visit.property}</td>
                                            <td>{visit.client}</td>
                                            <td>{formatDate(visit.date)}</td>
                                            <td>{visit.time}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(visit.status)}`}>
                                                    {visit.status === 'scheduled' && <CheckSquare size={14} />}
                                                    {visit.status === 'completed' && <CheckCircle size={14} />}
                                                    {visit.status === 'cancelled' && <XSquare size={14} />}
                                                    {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons-container">
                                                    {visit.status === 'scheduled' && (
                                                        <>
                                                            <button
                                                                className="action-btn complete-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStatusChange(visit.id, 'completed');
                                                                }}
                                                            >
                                                                Complete
                                                            </button>
                                                            <button
                                                                className="action-btn cancel-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStatusChange(visit.id, 'cancelled');
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {(visit.status === 'completed' || visit.status === 'cancelled') && (
                                                        <button
                                                            className="action-btn reschedule-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNewVisitData({
                                                                    ...newVisitData,
                                                                    property: visit.property,
                                                                    client: visit.client,
                                                                    contactNumber: visit.contactNumber,
                                                                    email: visit.email,
                                                                    notes: visit.notes
                                                                });
                                                                setShowNewVisitForm(true);
                                                            }}
                                                        >
                                                            Reschedule
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {selectedVisit && (
                            <div className="detail-panel">
                                <div className="detail-header">
                                    <h3>Visit Details</h3>
                                    <button className="close-btn" onClick={() => setSelectedVisit(null)}>×</button>
                                </div>
                                <div className="detail-content">
                                    <div className="detail-columns">
                                        <div className="detail-column">
                                            <div className="detail-section">
                                                <h4>Property Information</h4>
                                                <p><strong>Property:</strong> {selectedVisit.property}</p>
                                                <p><strong>Address:</strong> 123 Example Street, Cityville</p>
                                                <p><strong>Type:</strong> Residential</p>
                                                <p><strong>Price:</strong> $450,000</p>
                                            </div>

                                            <div className="detail-section">
                                                <h4>Client Information</h4>
                                                <p><strong>Name:</strong> {selectedVisit.client}</p>
                                                <p><strong>Phone:</strong> {selectedVisit.contactNumber}</p>
                                                <p><strong>Email:</strong> {selectedVisit.email}</p>
                                            </div>
                                        </div>

                                        <div className="detail-column">
                                            <div className="detail-section">
                                                <h4>Visit Details</h4>
                                                <p><strong>Date:</strong> {formatDate(selectedVisit.date)}</p>
                                                <p><strong>Time:</strong> {selectedVisit.time}</p>
                                                <p><strong>Status:</strong>
                                                    <span className={`status-text ${getStatusClass(selectedVisit.status)}`}>
                                                        {selectedVisit.status.charAt(0).toUpperCase() + selectedVisit.status.slice(1)}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="detail-section">
                                                <h4>Notes</h4>
                                                <div className="notes-area">
                                                    <p>{selectedVisit.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-actions">
                                        <button className="btn btn-outline">
                                            <Bell size={14} />
                                            <span>Send Reminder</span>
                                        </button>
                                        <button className="btn btn-outline">
                                            <Calendar size={14} />
                                            <span>Add to Calendar</span>
                                        </button>
                                        <button className="btn btn-primary">
                                            <span>Edit Visit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeView === 'calendar' && (
                    <div className="calendar-view">
                        <div className="calendar-header">
                            <h3>November 2023</h3>
                            <div className="calendar-nav">
                                <button className="btn btn-outline">
                                    <span>Previous</span>
                                </button>
                                <button className="btn btn-outline">
                                    <span>Today</span>
                                </button>
                                <button className="btn btn-outline">
                                    <span>Next</span>
                                </button>
                            </div>
                        </div>
                        <div className="calendar-days-header">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                        <div className="calendar-grid">
                            {generateCalendarDays()}
                        </div>
                    </div>
                )}
            </div>

            {showNewVisitForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Schedule New Visit</h3>
                            <button className="close-btn" onClick={() => setShowNewVisitForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmitVisit}>
                            <div className="form-grid">
                                <div className="form-column">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={newVisitData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={newVisitData.time}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Property</label>
                                        <select
                                            name="property"
                                            value={newVisitData.property}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Property</option>
                                            {properties.map((property, index) => (
                                                <option key={index} value={property}>{property}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-column">
                                    <div className="form-group">
                                        <label>Client</label>
                                        <select
                                            name="client"
                                            value={newVisitData.client}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Client</option>
                                            {clients.map((client, index) => (
                                                <option key={index} value={client}>{client}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Number</label>
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            value={newVisitData.contactNumber}
                                            onChange={handleInputChange}
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={newVisitData.email}
                                            onChange={handleInputChange}
                                            placeholder="client@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes & Instructions</label>
                                <textarea
                                    name="notes"
                                    value={newVisitData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Add any details about the visit or client preferences"
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="reminder-settings">
                                <h4>Notification Settings</h4>
                                <div className="reminder-toggle">
                                    <span>Send email reminder to client (24h before)</span>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="reminder-toggle">
                                    <span>Send SMS reminder to client (2h before)</span>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowNewVisitForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Schedule Visit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
