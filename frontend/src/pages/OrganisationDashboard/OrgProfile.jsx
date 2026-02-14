import React from 'react';

const OrgProfile = ({ user }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    };

    return (
        <div className="org-profile-combined-box">
            <div className="org-image-container">
                <img 
                    src={user?.logo_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt="Organization Building" 
                    className="org-image" 
                />
            </div>
            
            <div className="org-info-card">
                {/* Contact details on left, status on right */}
                <div className="contact-status-row">
                    <div className="contact-details-group">
                        <div className="info-group">
                            <p className="info-value">{user?.email || 'contact@organization.com'}</p>
                        </div>
                        
                        <div className="info-group">
                            <p className="info-value">{user?.phone_number || '—'}</p>
                        </div>
                        
                        <div className="info-group">
                            <p className="info-value info-link">
                                {user?.website_url || '—'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="status-group">
                        <span className={`status-badge ${user?.is_active ? 'active' : 'inactive'}`}>
                            {user?.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                
                <div className="address-info-group-container">
                    <p className="info-value">{user?.address || '—'}</p>
                    <div className="address-info-group">
                        <div className="address-field">
                            <span className="info-label info-label-address">City:</span>
                            <p className="info-value">{user?.city || '—'}</p>
                        </div>
                        <div className="address-field">
                            <span className="info-label info-label-address">State:</span>
                            <p className="info-value">{user?.state || '—'}</p>
                        </div>
                        <div className="address-field">
                            <span className="info-label info-label-address">Country:</span>
                            <p className="info-value">{user?.country || '—'}</p>
                        </div>
                    </div>
                    <p className="info-value">{user?.postal_code || '—'}</p>
                </div>
                
                <div className="info-footer">
                    created on: {formatDate(user?.created_at)}
                </div>
            </div>
        </div>
    );
};

export default OrgProfile;
