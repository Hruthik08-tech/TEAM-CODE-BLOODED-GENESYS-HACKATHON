import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        orgName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        description: '',
        website: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.orgName.trim()) newErrors.orgName = 'Organisation name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('auth_token', 'mock-token-' + Date.now());
            localStorage.setItem('org_name', formData.orgName);
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="auth-page register-page">
            <div className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="auth-brand">
                        <div className="auth-brand-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join the GENYSIS supply-demand network</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-group">
                            <label className="auth-label">Organisation Name *</label>
                            <input type="text" name="orgName" className={`auth-input ${errors.orgName ? 'error' : ''}`} placeholder="e.g. Alpha Logistics" value={formData.orgName} onChange={handleChange} />
                            {errors.orgName && <span className="auth-field-error">{errors.orgName}</span>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Email Address *</label>
                            <input type="email" name="email" className={`auth-input ${errors.email ? 'error' : ''}`} placeholder="contact@organisation.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="auth-field-error">{errors.email}</span>}
                        </div>

                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Password *</label>
                                <div className="password-wrapper">
                                    <input type={showPassword ? 'text' : 'password'} name="password" className={`auth-input ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" value={formData.password} onChange={handleChange} />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="auth-field-error">{errors.password}</span>}
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Confirm Password *</label>
                                <div className="password-wrapper">
                                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" className={`auth-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} />
                                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Phone Number *</label>
                            <input type="tel" name="phone" className={`auth-input ${errors.phone ? 'error' : ''}`} placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                            {errors.phone && <span className="auth-field-error">{errors.phone}</span>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Street Address *</label>
                            <input type="text" name="address" className={`auth-input ${errors.address ? 'error' : ''}`} placeholder="123, Tech Park, Sector 4" value={formData.address} onChange={handleChange} />
                            {errors.address && <span className="auth-field-error">{errors.address}</span>}
                        </div>

                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">City *</label>
                                <input type="text" name="city" className={`auth-input ${errors.city ? 'error' : ''}`} placeholder="Bangalore" value={formData.city} onChange={handleChange} />
                                {errors.city && <span className="auth-field-error">{errors.city}</span>}
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">State *</label>
                                <input type="text" name="state" className={`auth-input ${errors.state ? 'error' : ''}`} placeholder="Karnataka" value={formData.state} onChange={handleChange} />
                                {errors.state && <span className="auth-field-error">{errors.state}</span>}
                            </div>
                        </div>

                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Country *</label>
                                <input type="text" name="country" className={`auth-input ${errors.country ? 'error' : ''}`} placeholder="India" value={formData.country} onChange={handleChange} />
                                {errors.country && <span className="auth-field-error">{errors.country}</span>}
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Postal Code *</label>
                                <input type="text" name="postalCode" className={`auth-input ${errors.postalCode ? 'error' : ''}`} placeholder="560100" value={formData.postalCode} onChange={handleChange} />
                                {errors.postalCode && <span className="auth-field-error">{errors.postalCode}</span>}
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Description (Optional)</label>
                            <textarea name="description" className="auth-input auth-textarea" placeholder="Tell us about your organisation..." value={formData.description} onChange={handleChange} rows={3} />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Website URL (Optional)</label>
                            <input type="url" name="website" className="auth-input" placeholder="https://www.organisation.com" value={formData.website} onChange={handleChange} />
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <span className="auth-spinner" />
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="auth-switch-text">
                        Already have an account? <Link to="/login" className="auth-switch-link">Sign in</Link>
                    </p>
                </div>
            </div>

            <div className="auth-hero-panel">
                <div className="hero-content">
                    <div className="hero-visual">
                        <div className="hero-circle hero-circle-1" />
                        <div className="hero-circle hero-circle-2" />
                        <div className="hero-circle hero-circle-3" />
                    </div>
                    <h2 className="hero-title">Connect. Match. Trade.</h2>
                    <p className="hero-description">
                        Join the AI-powered supply-demand matching platform that connects organisations worldwide for efficient resource allocation.
                    </p>
                    <div className="hero-features">
                        <div className="hero-feature">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>AI-Powered Semantic Matching</span>
                        </div>
                        <div className="hero-feature">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Secure Business Rooms</span>
                        </div>
                        <div className="hero-feature">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>QR-Verified Deal Closure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
