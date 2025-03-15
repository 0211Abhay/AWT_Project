

import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Edit, XCircle, Bell, UserPlus, CheckSquare, FileText,
    Plus, MapPin, Video, Phone, Users, Repeat, Star, MessageSquare, Check,
    X, AlertTriangle, ArrowRight, RefreshCw, ExternalLink
} from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
import "../../style/Rental.css";

const Schedule = () => {
    // State for all meetings
    const [meetings, setMeetings] = useState([]);
    // State for the meeting form
    const [showForm, setShowForm] = useState(false);
    // State for the currently selected meeting (for editing)
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    // State for the views
    const [activeView, setActiveView] = useState('list'); // 'list', 'calendar', 'reports'
    // Current date for the calendar
    const [currentDate, setCurrentDate] = useState(new Date());

    // Initial meetings data (mock data)
    useEffect(() => {
        const initialMeetings = [
            {
                id: 1,
                title: 'Property Viewing',
                date: '2023-10-15',
                time: '14:00',
                client: 'John Smith',
                location: '123 Main St',
                broker: 'Jane Doe',
                status: 'Scheduled',
                priority: 'High',
                mode: 'In-person',
                notes: 'Client interested in 3-bedroom properties',
                clientConfirmation: 'Pending',
                outcome: '',
                recurring: false,
                recurringPeriod: '',
                attended: false,
                followUpSent: false,
                calendarSync: false
            },
            {
                id: 2,
                title: 'Contract Signing',
                date: '2023-10-18',
                time: '10:30',
                client: 'Sarah Johnson',
                location: 'Office',
                broker: 'Michael Brown',
                status: 'Confirmed',
                priority: 'Medium',
                mode: 'In-person',
                notes: 'Bring all necessary documentation',
                clientConfirmation: 'Confirmed',
                outcome: '',
                recurring: false,
                recurringPeriod: '',
                attended: false,
                followUpSent: false,
                calendarSync: false
            }
        ];
        setMeetings(initialMeetings);
    }, []);

    // Function to handle form submission for new/edit meeting
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const meetingData = {
            id: selectedMeeting ? selectedMeeting.id : Date.now(),
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            client: formData.get('client'),
            location: formData.get('location'),
            broker: formData.get('broker'),
            status: formData.get('status'),
            priority: formData.get('priority'),
            mode: formData.get('mode'),
            notes: formData.get('notes'),
            clientConfirmation: formData.get('clientConfirmation'),
            outcome: formData.get('outcome') || '',
            recurring: formData.get('recurring') === 'yes',
            recurringPeriod: formData.get('recurringPeriod') || '',
            attended: false,
            followUpSent: false,
            calendarSync: formData.get('calendarSync') === 'yes'
        };

        if (selectedMeeting) {
            // Update existing meeting
            setMeetings(meetings.map(meeting =>
                meeting.id === selectedMeeting.id ? meetingData : meeting
            ));
            toast({
                title: "Meeting Updated",
                description: `Your meeting with ${meetingData.client} has been updated.`,
            });
        } else {
            // Add new meeting
            setMeetings([...meetings, meetingData]);
            toast({
                title: "Meeting Scheduled",
                description: `New meeting with ${meetingData.client} has been scheduled.`,
            });
        }

        // Reset form and states
        setShowForm(false);
        setSelectedMeeting(null);
        e.target.reset();
    };

    // Function to edit a meeting
    const editMeeting = (meeting) => {
        setSelectedMeeting(meeting);
        setShowForm(true);
    };

    // Function to cancel/delete a meeting
    const cancelMeeting = (id) => {
        if (window.confirm('Are you sure you want to cancel this meeting?')) {
            setMeetings(meetings.filter(meeting => meeting.id !== id));
            toast({
                title: "Meeting Cancelled",
                description: "The meeting has been cancelled successfully.",
            });
        }
    };

    // Function to send a reminder
    const sendReminder = (meeting) => {
        toast({
            title: "Reminder Sent",
            description: `Reminder sent to ${meeting.client} for meeting on ${meeting.date} at ${meeting.time}`,
        });
    };

    // Function to update meeting status
    const updateStatus = (id, newStatus) => {
        setMeetings(meetings.map(meeting =>
            meeting.id === id ? { ...meeting, status: newStatus } : meeting
        ));
        toast({
            title: "Status Updated",
            description: `Meeting status has been updated to ${newStatus}.`,
        });
    };

    // Function to mark meeting as attended/missed
    const markAttendance = (id, attended) => {
        setMeetings(meetings.map(meeting =>
            meeting.id === id ? { ...meeting, attended } : meeting
        ));
        toast({
            title: attended ? "Meeting Attended" : "Meeting Missed",
            description: attended ? "Meeting marked as attended." : "Meeting marked as missed.",
        });
    };

    // Function to update client confirmation status
    const updateClientConfirmation = (id, status) => {
        setMeetings(meetings.map(meeting =>
            meeting.id === id ? { ...meeting, clientConfirmation: status } : meeting
        ));
        toast({
            title: "Confirmation Updated",
            description: `Client confirmation status updated to ${status}.`,
        });
    };

    // Function to send follow up
    const sendFollowUp = (id) => {
        setMeetings(meetings.map(meeting =>
            meeting.id === id ? { ...meeting, followUpSent: true } : meeting
        ));
        toast({
            title: "Follow-up Sent",
            description: "Automated follow-up message has been sent to the client.",
        });
    };

    // Function to sync with calendar
    const syncWithCalendar = (id) => {
        setMeetings(meetings.map(meeting =>
            meeting.id === id ? { ...meeting, calendarSync: true } : meeting
        ));
        toast({
            title: "Calendar Synced",
            description: "Meeting has been synced with your calendar application.",
        });
    };

    // Function to reschedule meeting
    const rescheduleMeeting = (meeting) => {
        setSelectedMeeting({ ...meeting, status: 'Rescheduled' });
        setShowForm(true);
    };

    // Function to set meeting outcome
    const setMeetingOutcome = (id, outcome) => {
        setMeetings(meetings.map(meeting =>
            meeting.id === id ? { ...meeting, outcome } : meeting
        ));
        toast({
            title: "Outcome Recorded",
            description: `Meeting outcome set to: ${outcome}`,
        });
    };

    // Function to get meetings for a specific date
    const getMeetingsForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return meetings.filter(meeting => meeting.date === dateString);
    };

    // Calendar view helpers
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Render calendar
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayMeetings = meetings.filter(meeting => meeting.date === dateString);

            days.push(
                <div
                    key={`day-${day}`}
                    className={`calendar-day ${dayMeetings.length > 0 ? 'has-meetings' : ''}`}
                    onClick={() => {
                        const clickedDate = new Date(year, month, day);
                        setCurrentDate(clickedDate);
                    }}
                >
                    <span className="day-number">{day}</span>
                    {dayMeetings.length > 0 && (
                        <div className="meeting-indicator">
                            <span>{dayMeetings.length}</span>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    <button
                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        className="calendar-nav-button"
                    >
                        &lt;
                    </button>
                    <h2>{monthNames[month]} {year}</h2>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        className="calendar-nav-button"
                    >
                        &gt;
                    </button>
                </div>
                <div className="weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className="calendar-grid">
                    {days}
                </div>
                <div className="daily-meetings">
                    <h3>{currentDate.toDateString()}</h3>
                    {getMeetingsForDate(currentDate).length > 0 ? (
                        getMeetingsForDate(currentDate).map(meeting => (
                            <div key={meeting.id} className="meeting-card">
                                <h4>{meeting.title}</h4>
                                <p><strong>Time:</strong> {meeting.time}</p>
                                <p><strong>Client:</strong> {meeting.client}</p>
                                <p><strong>Location:</strong> {meeting.location}</p>
                                <p><strong>Priority:</strong> {meeting.priority}</p>
                                <p><strong>Mode:</strong> {meeting.mode}</p>
                                <div className="meeting-actions">
                                    <button onClick={() => editMeeting(meeting)} className="edit-btn">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => rescheduleMeeting(meeting)} className="reschedule-btn">
                                        <RefreshCw size={16} />
                                    </button>
                                    <button onClick={() => cancelMeeting(meeting.id)} className="cancel-btn">
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No meetings scheduled for this date.</p>
                    )}
                </div>
            </div>
        );
    };

    // Render reports view
    const renderReports = () => {
        const statusCounts = meetings.reduce((acc, meeting) => {
            acc[meeting.status] = (acc[meeting.status] || 0) + 1;
            return acc;
        }, {});

        const brokerCounts = meetings.reduce((acc, meeting) => {
            acc[meeting.broker] = (acc[meeting.broker] || 0) + 1;
            return acc;
        }, {});

        const priorityCounts = meetings.reduce((acc, meeting) => {
            acc[meeting.priority] = (acc[meeting.priority] || 0) + 1;
            return acc;
        }, {});

        const modeCounts = meetings.reduce((acc, meeting) => {
            acc[meeting.mode] = (acc[meeting.mode] || 0) + 1;
            return acc;
        }, {});

        return (
            <div className="reports-container">
                <h2>Meeting Reports</h2>

                <div className="report-section">
                    <h3>Meetings by Status</h3>
                    <div className="report-graph status-graph">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status} className="graph-bar">
                                <div className="bar-label">{status}</div>
                                <div className="bar-value" style={{ width: `${count * 50}px` }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="report-section">
                    <h3>Meetings by Broker</h3>
                    <div className="report-graph broker-graph">
                        {Object.entries(brokerCounts).map(([broker, count]) => (
                            <div key={broker} className="graph-bar">
                                <div className="bar-label">{broker}</div>
                                <div className="bar-value" style={{ width: `${count * 50}px` }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="report-section">
                    <h3>Meetings by Priority</h3>
                    <div className="report-graph priority-graph">
                        {Object.entries(priorityCounts).map(([priority, count]) => (
                            <div key={priority} className="graph-bar">
                                <div className="bar-label">{priority}</div>
                                <div className="bar-value" style={{ width: `${count * 50}px` }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="report-section">
                    <h3>Meetings by Mode</h3>
                    <div className="report-graph mode-graph">
                        {Object.entries(modeCounts).map(([mode, count]) => (
                            <div key={mode} className="graph-bar">
                                <div className="bar-label">{mode}</div>
                                <div className="bar-value" style={{ width: `${count * 50}px` }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="report-section">
                    <h3>Recent Meetings</h3>
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Client</th>
                                <th>Broker</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Mode</th>
                                <th>Outcome</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.slice(-5).map(meeting => (
                                <tr key={meeting.id}>
                                    <td>{meeting.date}</td>
                                    <td>{meeting.title}</td>
                                    <td>{meeting.client}</td>
                                    <td>{meeting.broker}</td>
                                    <td>{meeting.status}</td>
                                    <td>{meeting.priority}</td>
                                    <td>{meeting.mode}</td>
                                    <td>{meeting.outcome || 'Not recorded'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="schedule-container">

            <div className="action-buttons-container">
                <div> <h1 className="">Meeting Management</h1></div>
                <div className="action-buttons">
                    <button
                        className="primary-button"
                        onClick={() => { setShowForm(true); setSelectedMeeting(null); }}
                    >
                        <Plus size={18} />
                        Schedule New Meeting
                    </button>
                    <button
                        className={`toggle-button ${activeView === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActiveView(activeView === 'calendar' ? 'list' : 'calendar')}
                    >
                        <Calendar size={18} />
                        {activeView === 'calendar' ? 'List View' : 'Calendar View'}
                    </button>
                    <button
                        className={`secondary-button ${activeView === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveView(activeView === 'reports' ? 'list' : 'reports')}
                    >
                        <FileText size={18} />
                        {activeView === 'reports' ? 'List View' : 'Generate Reports'}
                    </button>
                </div>
            </div>

            {/* Meeting Form */}
            {showForm && (
                <div className="form-modal">
                    <div className="form-container">
                        <h2>{selectedMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Meeting Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    defaultValue={selectedMeeting?.title || ''}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        required
                                        defaultValue={selectedMeeting?.date || ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time">Time</label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        required
                                        defaultValue={selectedMeeting?.time || ''}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="client">Client Name</label>
                                <input
                                    type="text"
                                    id="client"
                                    name="client"
                                    required
                                    defaultValue={selectedMeeting?.client || ''}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    defaultValue={selectedMeeting?.location || ''}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="broker">Assign to Broker</label>
                                    <select
                                        id="broker"
                                        name="broker"
                                        required
                                        defaultValue={selectedMeeting?.broker || ''}
                                    >
                                        <option value="">Select a Broker</option>
                                        <option value="Jane Doe">Jane Doe</option>
                                        <option value="Michael Brown">Michael Brown</option>
                                        <option value="Sarah Johnson">Sarah Johnson</option>
                                        <option value="Robert Wilson">Robert Wilson</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        required
                                        defaultValue={selectedMeeting?.status || 'Scheduled'}
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Rescheduled">Rescheduled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="priority">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        required
                                        defaultValue={selectedMeeting?.priority || 'Medium'}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mode">Meeting Mode</label>
                                    <select
                                        id="mode"
                                        name="mode"
                                        required
                                        defaultValue={selectedMeeting?.mode || 'In-person'}
                                    >
                                        <option value="In-person">In-person</option>
                                        <option value="Phone Call">Phone Call</option>
                                        <option value="Virtual">Virtual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="clientConfirmation">Client Confirmation</label>
                                    <select
                                        id="clientConfirmation"
                                        name="clientConfirmation"
                                        required
                                        defaultValue={selectedMeeting?.clientConfirmation || 'Pending'}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Declined">Declined</option>
                                        <option value="Rescheduled">Rescheduled</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="outcome">Meeting Outcome</label>
                                    <select
                                        id="outcome"
                                        name="outcome"
                                        defaultValue={selectedMeeting?.outcome || ''}
                                    >
                                        <option value="">Not Set</option>
                                        <option value="Interested">Interested</option>
                                        <option value="Not Interested">Not Interested</option>
                                        <option value="Requires Follow-up">Requires Follow-up</option>
                                        <option value="Deal Closed">Deal Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="recurring">Recurring Meeting</label>
                                    <select
                                        id="recurring"
                                        name="recurring"
                                        defaultValue={selectedMeeting?.recurring ? 'yes' : 'no'}
                                    >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="recurringPeriod">Recurring Period</label>
                                    <select
                                        id="recurringPeriod"
                                        name="recurringPeriod"
                                        defaultValue={selectedMeeting?.recurringPeriod || ''}
                                        disabled={!selectedMeeting?.recurring}
                                    >
                                        <option value="">Not Applicable</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="calendarSync">Sync with Calendar</label>
                                <select
                                    id="calendarSync"
                                    name="calendarSync"
                                    defaultValue={selectedMeeting?.calendarSync ? 'yes' : 'no'}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    defaultValue={selectedMeeting?.notes || ''}
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    {selectedMeeting ? 'Update Meeting' : 'Schedule Meeting'}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => { setShowForm(false); setSelectedMeeting(null); }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Content - either Calendar, Reports, or List View */}
            {activeView === 'calendar' ? (
                renderCalendar()
            ) : activeView === 'reports' ? (
                renderReports()
            ) : (
                <div className="meetings-list">
                    <h2>Upcoming Meetings</h2>
                    {meetings.length > 0 ? (
                        <div className="meetings-grid">
                            {meetings.map(meeting => (
                                <div key={meeting.id} className="meeting-card">
                                    <div className="meeting-header">
                                        <h3>{meeting.title}</h3>
                                        <div className="meeting-indicators">
                                            <span className={`status-badge ${meeting.status.toLowerCase()}`}>
                                                {meeting.status}
                                            </span>
                                            <span className={`priority-badge ${meeting.priority.toLowerCase()}`}>
                                                {meeting.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="meeting-details">
                                        <div className="meeting-info">
                                            <p><Clock size={16} /> {meeting.date} at {meeting.time}</p>
                                            <p><UserPlus size={16} /> Client: {meeting.client}</p>

                                            {meeting.mode === 'In-person' ? (
                                                <p><MapPin size={16} /> Location: {meeting.location}</p>
                                            ) : meeting.mode === 'Virtual' ? (
                                                <p><Video size={16} /> Virtual Meeting</p>
                                            ) : (
                                                <p><Phone size={16} /> Phone Call</p>
                                            )}

                                            <p><CheckSquare size={16} /> Broker: {meeting.broker}</p>

                                            <div className="client-confirmation">
                                                <p>
                                                    Client Confirmation:
                                                    <span className={`confirmation-status ${meeting.clientConfirmation.toLowerCase()}`}>
                                                        {meeting.clientConfirmation}
                                                    </span>
                                                </p>
                                            </div>

                                            {meeting.recurring && (
                                                <p><Repeat size={16} /> Recurring: {meeting.recurringPeriod}</p>
                                            )}

                                            {meeting.outcome && (
                                                <p><CheckSquare size={16} /> Outcome: {meeting.outcome}</p>
                                            )}
                                        </div>
                                        {meeting.notes && (
                                            <div className="meeting-notes">
                                                <strong><MessageSquare size={14} /> Notes:</strong>
                                                <p>{meeting.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="meeting-actions">
                                        <button onClick={() => editMeeting(meeting)} className="action-button edit">
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button onClick={() => rescheduleMeeting(meeting)} className="action-button reschedule">
                                            <RefreshCw size={16} />
                                            Reschedule
                                        </button>
                                        <button onClick={() => sendReminder(meeting)} className="action-button reminder">
                                            <Bell size={16} />
                                            Reminder
                                        </button>
                                        <button onClick={() => cancelMeeting(meeting.id)} className="action-button cancel">
                                            <XCircle size={16} />
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="extended-actions">
                                        <div className="action-row">
                                            <label>Update Status:</label>
                                            <select
                                                value={meeting.status}
                                                onChange={(e) => updateStatus(meeting.id, e.target.value)}
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Rescheduled">Rescheduled</option>
                                            </select>
                                        </div>

                                        <div className="action-row">
                                            <label>Client Confirmation:</label>
                                            <select
                                                value={meeting.clientConfirmation}
                                                onChange={(e) => updateClientConfirmation(meeting.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Declined">Declined</option>
                                                <option value="Rescheduled">Rescheduled</option>
                                            </select>
                                        </div>

                                        <div className="action-row">
                                            <label>Meeting Outcome:</label>
                                            <select
                                                value={meeting.outcome}
                                                onChange={(e) => setMeetingOutcome(meeting.id, e.target.value)}
                                            >
                                                <option value="">Not Set</option>
                                                <option value="Interested">Interested</option>
                                                <option value="Not Interested">Not Interested</option>
                                                <option value="Requires Follow-up">Requires Follow-up</option>
                                                <option value="Deal Closed">Deal Closed</option>
                                            </select>
                                        </div>

                                        <div className="action-buttons-row">
                                            <button onClick={() => markAttendance(meeting.id, true)} className="attendance-btn attended">
                                                <Check size={14} /> Attended
                                            </button>
                                            <button onClick={() => markAttendance(meeting.id, false)} className="attendance-btn missed">
                                                <X size={14} /> Missed
                                            </button>
                                            <button onClick={() => sendFollowUp(meeting.id)} className="attendance-btn followup" disabled={meeting.followUpSent}>
                                                <ArrowRight size={14} /> {meeting.followUpSent ? 'Follow-up Sent' : 'Send Follow-up'}
                                            </button>
                                            <button onClick={() => syncWithCalendar(meeting.id)} className="attendance-btn sync" disabled={meeting.calendarSync}>
                                                <ExternalLink size={14} /> {meeting.calendarSync ? 'Synced' : 'Sync Calendar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-meetings">
                            <p>No meetings scheduled. Click "Schedule New Meeting" to create one.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Schedule;
