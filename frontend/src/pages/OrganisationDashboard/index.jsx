import React from 'react';
import './OrganisationDashboard.css';
import { useAuth } from '../../context/AuthContext.jsx';
import OrgProfile from './OrgProfile.jsx';
import OrgDescription from './OrgDescription.jsx';


const OrganisationDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="org-page-wrapper">
            <div className="org-dashboard-container">
                <div className="dashboard-header">
                    <div className="header-left">
                        <h1 className="org-title">{user?.org_name || 'Organisation Name'}</h1>
                        <span className="org-badge">
                            {user?.is_active ? 'Verified Partner' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="sidebar-column">
                        <OrgProfile user={user} />
                    </div>
                    <div className="content-column">
                        <div className="combined-details-box">
                            <div className="scrollable-details-content">
                                <OrgDescription user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganisationDashboard;
