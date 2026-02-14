import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('auth_token', 'mock-token-' + Date.now());
            localStorage.setItem('org_name', 'Demo Organisation');
            setIsLoading(false);
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div className="auth-page login-page">
            <div className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="login-card-wrapper">
                        <div className="auth-brand">
                            <div className="auth-brand-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            </div>
                            <h1 className="auth-title">Welcome Back</h1>
                            <p className="auth-subtitle">Sign in to your GENYSIS account</p>
                        </div>

                        {error && (
                            <div className="auth-error-banner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                {error}
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label className="auth-label">Email Address</label>
                                <input type="email" name="email" className="auth-input" placeholder="contact@organisation.com" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Password</label>
                                <div className="password-wrapper">
                                    <input type={showPassword ? 'text' : 'password'} name="password" className="auth-input" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                <div className="forgot-password-link">
                                    <Link to="/forgot-password">Forgot password?</Link>
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="auth-spinner" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="auth-switch-text">
                            Don't have an account? <Link to="/register" className="auth-switch-link">Register</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="auth-hero-panel">
                <div className="hero-content">
                    <div className="hero-visual">
                        <div className="hero-circle hero-circle-1" />
                        <div className="hero-circle hero-circle-2" />
                        <div className="hero-circle hero-circle-3" />
                    </div>
                    <h2 className="hero-title">Supply Meets Demand</h2>
                    <p className="hero-description">
                        Access your dashboard to manage supplies, demands, and negotiate deals with AI-powered matching.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
