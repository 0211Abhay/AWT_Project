import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Users,
    Home,
    Calendar,
    UserCog,
    Building,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ activeSection, onNavigate }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { broker, logout } = useAuth();

    const navItems = [
        { name: 'clients', icon: <Users size={18} />, requiresAuth: true },
        { name: 'properties', icon: <Building size={18} />, requiresAuth: true },
        { name: 'rental', icon: <Home size={18} />, requiresAuth: true },
        { name: 'schedule', icon: <Calendar size={18} />, requiresAuth: true },
        { name: 'profile', icon: <UserCog size={18} />, requiresAuth: true }
    ];

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    };

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
                    Logo
                </Link>

                <div className="nav-items">
                    {navItems.map(({ name, icon, requiresAuth }) => (
                        (!requiresAuth || broker) && (
                            <button
                                key={name}
                                className={`nav-button ${activeSection === name ? 'active' : ''}`}
                                onClick={() => handleNavClick(name)}
                            >
                                {icon}
                                <span className="nav-text">
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </span>
                            </button>
                        )
                    ))}

                    {!broker ? (
                        <Link to="/login" className="nav-button login-button">
                            <UserCog size={18} />
                            <span className="nav-text">Login</span>
                        </Link>
                    ) : (
                        <button onClick={handleLogout} className="nav-button logout-button">
                            <LogOut size={18} />
                            <span className="nav-text">Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;