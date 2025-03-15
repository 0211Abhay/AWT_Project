

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Users,
    Home,
    Calendar,
    UserCog,
    Building
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activeSection, onNavigate }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();

    const navItems = [
        { name: 'clients', icon: <Users size={18} /> },
        { name: 'properties', icon: <Building size={18} /> },
        { name: 'rental', icon: <Home size={18} /> },
        { name: 'schedule', icon: <Calendar size={18} /> },
        { name: 'profile', icon: <UserCog size={18} /> }
    ];

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide navbar when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleNavClick = (name) => {
        if (onNavigate) {
            onNavigate(name);
        }
    };

    return (
        <nav className={`navbar ${!isVisible ? 'navbar-hidden' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    YourLogo
                </Link>

                <div className="nav-items">

                    {navItems.map(({ name, icon }) => (
                        <button
                            key={name}
                            className={`nav-button ${activeSection === name ? 'active' : ''}`}
                            onClick={() => handleNavClick(name)}
                        >
                            <span className="nav-text">
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;