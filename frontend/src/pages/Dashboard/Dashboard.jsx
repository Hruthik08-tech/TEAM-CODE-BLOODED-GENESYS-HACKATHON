import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const orgName = user?.org_name || 'My Organisation';

    const stats = [
        { label: 'Active Supplies', value: 12, color: '#2364AA', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        )},
        { label: 'Active Demands', value: 8, color: '#EA7317', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>
        )},
        { label: 'Pending Requests', value: 5, color: '#73BFB8', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        )},
        { label: 'Active Deals', value: 3, color: '#2f855a', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        )},
    ];

    const recentActivity = [
        { id: 1, type: 'request', title: 'New request from Alpha Logistics', time: '5 min ago', desc: 'For Medical Masks (N95)' },
        { id: 2, type: 'match', title: '3 new matches found', time: '1 hour ago', desc: 'For Emergency Response Kits' },
        { id: 3, type: 'room', title: 'Message in Business Room', time: '2 hours ago', desc: 'Eco Shelters sent a new proposal' },
        { id: 4, type: 'deal', title: 'Deal #DEAL-5033 finalised', time: '6 hours ago', desc: 'Heavy Duty Shipping Crates' },
        { id: 5, type: 'request', title: 'Request accepted by Global Aid', time: '1 day ago', desc: 'Emergency Medical Kits' },
    ];

    const quickActions = [
        { label: 'Create Supply', path: '/supply', color: '#2364AA', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        )},
        { label: 'Create Demand', path: '/demand', color: '#EA7317', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        )},
        { label: 'View Rooms', path: '/rooms', color: '#73BFB8', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        )},
        { label: 'My Deals', path: '/deals', color: '#2f855a', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        )},
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-welcome">
                <div className="welcome-text">
                    <h1 className="welcome-title">Welcome back, <span className="welcome-org">{orgName}</span></h1>
                    <p className="welcome-subtitle">Here's what's happening with your supply-demand network today.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="dashboard-stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card" style={{ '--stat-color': stat.color }}>
                        <div className="stat-icon-wrapper">
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="dashboard-main-grid">
                {/* Recent Activity */}
                <div className="dashboard-card activity-card">
                    <h3 className="card-title">Recent Activity</h3>
                    <div className="activity-list">
                        {recentActivity.map(item => (
                            <div key={item.id} className="activity-item">
                                <div className={`activity-dot dot-${item.type}`} />
                                <div className="activity-content">
                                    <span className="activity-title">{item.title}</span>
                                    <span className="activity-desc">{item.desc}</span>
                                </div>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card quick-actions-card">
                    <h3 className="card-title">Quick Actions</h3>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, i) => (
                            <button key={i} className="quick-action-btn" style={{ '--action-color': action.color }} onClick={() => navigate(action.path)}>
                                <span className="quick-action-icon">{action.icon}</span>
                                <span className="quick-action-label">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
