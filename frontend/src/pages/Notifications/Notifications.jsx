import React, { useState } from 'react';
import './Notifications.css';

const Notifications = () => {
    const [filter, setFilter] = useState('all');

    const [notifications, setNotifications] = useState([
        {
            id: 1, type: 'request', title: 'New Request Received',
            message: 'Alpha Logistics sent a matching request for Medical Masks (N95). Match score: 92%.',
            time: '5 minutes ago', read: false,
        },
        {
            id: 2, type: 'room', title: 'Business Room Created',
            message: 'A new business room has been opened with Eco Shelters for Emergency Tents negotiation.',
            time: '1 hour ago', read: false,
        },
        {
            id: 3, type: 'deal', title: 'Deal Closed Successfully',
            message: 'Deal #DEAL-5033 with Alpha Logistics has been marked as successfully completed.',
            time: '3 hours ago', read: true,
        },
        {
            id: 4, type: 'match', title: 'New Matches Found',
            message: 'AI matching found 3 new potential matches for your "Water Purification Tablets" demand.',
            time: '6 hours ago', read: true,
        },
        {
            id: 5, type: 'request', title: 'Request Accepted',
            message: 'Your request to Global Aid Foundation for Emergency Medical Kits was accepted.',
            time: '1 day ago', read: true,
        },
        {
            id: 6, type: 'system', title: 'Profile Updated',
            message: 'Your organisation profile has been updated and verified.',
            time: '2 days ago', read: true,
        },
        {
            id: 7, type: 'deal', title: 'Deal Cancelled',
            message: 'Deal #DEAL-7259 with AquaFilter Corp has been cancelled by the counterparty.',
            time: '3 days ago', read: true,
        },
        {
            id: 8, type: 'match', title: 'Match Score Improved',
            message: 'Match accuracy for your "Solar Panels" demand has improved to 85% after re-evaluation.',
            time: '4 days ago', read: true,
        },
    ]);

    const handleMarkRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getFilteredNotifications = () => {
        if (filter === 'unread') return notifications.filter(n => !n.read);
        if (filter !== 'all') return notifications.filter(n => n.type === filter);
        return notifications;
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type) => {
        switch (type) {
            case 'request': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            );
            case 'room': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            );
            case 'deal': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            );
            case 'match': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            );
            case 'system': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            );
            default: return null;
        }
    };

    return (
        <div className="notifications-page">
            <div className="notif-page-header">
                <div>
                    <h1 className="notif-page-title">Notifications</h1>
                    <p className="notif-page-subtitle">{unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}</p>
                </div>
                {unreadCount > 0 && (
                    <button className="mark-all-btn" onClick={handleMarkAllRead}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notif-filter-pills">
                {['all', 'unread', 'request', 'room', 'deal', 'match', 'system'].map(f => (
                    <button
                        key={f}
                        className={`notif-filter-pill ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'unread' && unreadCount > 0 && <span className="pill-count">{unreadCount}</span>}
                    </button>
                ))}
            </div>

            <div className="notif-list">
                {getFilteredNotifications().length === 0 ? (
                    <div className="notif-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        <p>No notifications to show.</p>
                    </div>
                ) : (
                    getFilteredNotifications().map(notif => (
                        <div key={notif.id} className={`notif-card ${notif.read ? '' : 'unread'}`}>
                            <div className={`notif-card-icon notif-type-${notif.type}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="notif-card-content">
                                <div className="notif-card-top-row">
                                    <h4 className="notif-card-title">{notif.title}</h4>
                                    <span className="notif-card-time">{notif.time}</span>
                                </div>
                                <p className="notif-card-message">{notif.message}</p>
                            </div>
                            <div className="notif-card-actions">
                                {!notif.read && (
                                    <button className="notif-mark-btn" onClick={() => handleMarkRead(notif.id)} title="Mark as read">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </button>
                                )}
                                <button className="notif-delete-btn" onClick={() => handleDelete(notif.id)} title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
