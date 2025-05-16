import React from 'react';
import API_CONFIG from '../config/api';

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${API_CONFIG.BASE_URL}/api/auth/google`;
    };

    return (
        <button onClick={handleGoogleLogin} style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
            Login with Google
        </button>
    );
};

export default GoogleLoginButton;
