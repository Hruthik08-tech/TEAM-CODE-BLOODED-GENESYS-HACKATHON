import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Requests.css';

const Requests = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('received');

    const [sentRequests, setSentRequests] = useState([
        {
            id: 'REQ-S001',
            type: 'demand',
            itemName: 'Emergency Medical Kits',
            matchScore: 92,
            toOrg: 'Global Aid Foundation',
            status: 'pending',
            sentAt: '2024-02-10T14:30:00Z',
            message: 'We would like to initiate a business discussion for your medical kit supply.',
        },
        {
            id: 'REQ-S002',
            type: 'supply',
            itemName: 'Portable Solar Panels',
            matchScore: 78,
            toOrg: 'SunPower Industries',
            status: 'accepted',
            sentAt: '2024-02-08T10:00:00Z',
            message: 'Your solar panel supply matches our demand. Interested in discussing terms.',
        },
        {
            id: 'REQ-S003',
            type: 'demand',
            itemName: 'Water Purifiers',
            matchScore: 65,
            toOrg: 'AquaFilter Corp',
            status: 'rejected',
            sentAt: '2024-02-05T16:45:00Z',
            message: 'Looking for bulk water purifier supply for relief operations.',
        },
    ]);

    const [receivedRequests, setReceivedRequests] = useState([
        {
            id: 'REQ-R001',
            type: 'supply',
            itemName: 'N95 Masks (Medical Grade)',
            matchScore: 88,
            fromOrg: 'Alpha Logistics',
            status: 'pending',
            sentAt: '2024-02-11T09:15:00Z',
            message: 'We are interested in your N95 mask supply. Can we discuss pricing and logistics?',
        },
        {
            id: 'REQ-R002',
            type: 'demand',
            itemName: 'Emergency Shelters',
            matchScore: 55,
            fromOrg: 'Eco Shelters',
            status: 'pending',
            sentAt: '2024-02-09T11:30:00Z',
            message: 'Your shelter supply matches our requirements. Would like to open a business room.',
        },
        {
            id: 'REQ-R003',
            type: 'supply',
            itemName: 'First Aid Supplies',
            matchScore: 91,
            fromOrg: 'MedSupply Co.',
            status: 'accepted',
            sentAt: '2024-02-07T08:00:00Z',
            message: 'Excellent match on first aid supplies. Ready to negotiate.',
        },
    ]);

    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleAccept = (id) => {
        setReceivedRequests(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r)
        );
        // Prompt 154: On Accept -> navigate to business room
        setTimeout(() => {
            navigate('/rooms');
        }, 1000);
    };

    const handleRejectClick = (id) => {
        setRejectingId(id);
    };

    const handleConfirmReject = (id) => {
        setReceivedRequests(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'rejected', rejectionReason } : r)
        );
        setRejectingId(null);
        setRejectionReason('');
    };

    const handleCancelReject = () => {
        setRejectingId(null);
        setRejectionReason('');
    };

    const handleOpenRoom = (request) => {
        navigate('/business-room');
    };

    const getStatusClass = (status) => `req-status-${status}`;

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const requests = activeTab === 'received' ? receivedRequests : sentRequests;
    const pendingCount = receivedRequests.filter(r => r.status === 'pending').length;

    return (
        <div className="requests-page">
            <div className="requests-header">
                <div className="requests-header-left">
                    <h1 className="requests-title">Requests</h1>
                    <p className="requests-subtitle">Manage incoming and outgoing match requests</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="requests-tabs">
                <button
                    className={`req-tab ${activeTab === 'received' ? 'active' : ''}`}
                    onClick={() => setActiveTab('received')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                    Received
                    {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
                </button>
                <button
                    className={`req-tab ${activeTab === 'sent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sent')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Sent
                </button>
            </div>

            {/* Request List */}
            <div className="requests-list">
                {requests.length === 0 ? (
                    <div className="requests-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <p>No {activeTab} requests yet.</p>
                    </div>
                ) : (
                    requests.map(request => (
                        <div key={request.id} className={`request-card ${request.status}`}>
                            <div className="request-card-top">
                                <div className="request-info">
                                    <div className="request-meta-row">
                                        <span className="request-type-tag">{request.type}</span>
                                        <span className="request-id">{request.id}</span>
                                        <span className="request-date">{formatDate(request.sentAt)}</span>
                                    </div>
                                    <h3 className="request-item-name">{request.itemName}</h3>
                                    <span className="request-org">
                                        {activeTab === 'received' ? `From: ${request.fromOrg}` : `To: ${request.toOrg}`}
                                    </span>
                                </div>
                                <div className="request-right">
                                    <div className={`match-score-circle ${request.matchScore >= 80 ? 'high' : request.matchScore >= 60 ? 'medium' : 'low'}`}>
                                        <span className="score-number">{request.matchScore}%</span>
                                        <span className="score-label">Match</span>
                                    </div>
                                    <span className={`request-status-badge ${getStatusClass(request.status)}`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>

                            {request.message && (
                                <p className="request-message">"{request.message}"</p>
                            )}

                            <div className="request-actions">
                                {activeTab === 'received' && request.status === 'pending' && (
                                    <div className="req-action-flow">
                                        {rejectingId === request.id ? (
                                            <div className="reject-reason-box">
                                                <textarea
                                                    className="reject-reason-input"
                                                    placeholder="Reason for rejection (required)..."
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                />
                                                <div className="reject-reason-btns">
                                                    <button 
                                                        className="confirm-reject-btn"
                                                        onClick={() => handleConfirmReject(request.id)}
                                                        disabled={!rejectionReason.trim()}
                                                    >
                                                        Confirm Reject
                                                    </button>
                                                    <button className="cancel-reject-btn" onClick={handleCancelReject}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="req-action-btn accept-btn" onClick={() => handleAccept(request.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                    Accept
                                                </button>
                                                <button className="req-action-btn reject-btn" onClick={() => handleRejectClick(request.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {request.status === 'accepted' && (
                                    <button className="req-action-btn open-room-btn" onClick={() => handleOpenRoom(request)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                        Open Business Room
                                    </button>
                                )}
                                {request.status === 'rejected' && (
                                    <div className="reject-note-display">
                                        <span className="request-rejected-note">This request has been declined.</span>
                                        {request.rejectionReason && (
                                            <p className="rejection-reason-text">Reason: {request.rejectionReason}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Requests;
