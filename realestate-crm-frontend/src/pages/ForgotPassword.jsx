import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import "../style/Login.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        console.log('Password reset requested for:', email);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Reset password</h1>
                    <p>Enter your email to receive reset instructions</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-button">
                            Send instructions
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>Check your email for reset instructions.</p>
                    </div>
                )}

                <div className="auth-footer">
                    <Link to="/login" className="back-link">
                        <ArrowLeft size={20} />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
