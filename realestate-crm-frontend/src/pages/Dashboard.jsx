import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import RightSidebar from '../components/sidebar/RightSidebar';
import MainContent from "../components/dashboard_components/MainContent";
import "../style/Dashboard.css";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('clients');
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (section) => {
        setActiveSection(section);
        navigate(`/dashboard/${section}`);
    };

    return (
        <div className="dashboard">
            <Header activeSection={activeSection} onNavigate={handleNavigation} />
            <div className="dashboard-content">
                {/* <Sidebar activeSection={activeSection} onNavigate={handleNavigation} /> */}
                <MainContent activeSection={activeSection} />

            </div>
        </div>
    );
};

export default Dashboard;