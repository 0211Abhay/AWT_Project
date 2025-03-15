import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import "../style/Login.css";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', { email, password, rememberMe });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome back</h1>
                    <p>Please enter your details to sign in</p>
                </div>

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

                    <div className="input-group">
                        <Lock size={20} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="submit-button">
                        Sign in
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="accent-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

