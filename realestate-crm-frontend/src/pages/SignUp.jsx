import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import axios from 'axios';
import API_CONFIG from '../config/api';
import "../style/Login.css";
import GoogleButton from 'react-google-button'

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/register`, {
                name,
                email,
                phone,
                password
            }, {
                withCredentials: true
            });

            alert("Broker registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Broker Account</h1>
                    <p>Please enter your details to register as a broker</p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <User size={20} className="input-icon" />
                        <input
                            type="text"
                            placeholder="Broker Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Mail size={20} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Broker Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Phone size={20} className="input-icon" />
                        <input
                            type="tel"
                            placeholder="Broker Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Register as Broker
                    </button>

                </form>
                <div className='google-login-div'>

                    <GoogleButton className='google-button' style={{ width: '300px', borderRadius: '0px' }}
                        onClick={() => { console.log('Google button clicked') }}
                    />
                </div>
                <div className="auth-footer">
                    <p>
                        Already have a broker account?{" "}
                        <Link to="/login" className="accent-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
