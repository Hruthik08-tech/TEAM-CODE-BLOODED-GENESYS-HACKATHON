import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessRoom from './BusinessRoom.jsx';
import './BusinessRoomEnhanced.css';

const BusinessRoomEnhanced = () => {
    const navigate = useNavigate();
    const [isClosed, setIsClosed] = useState(false);
    const [dealStatus, setDealStatus] = useState('active'); // active | success | failed
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmType, setConfirmType] = useState(null);

    const handleMarkStatus = (type) => {
        setConfirmType(type);
        setShowConfirm(true);
    };

    const confirmStatusChange = () => {
        setDealStatus(confirmType);
        setIsClosed(true);
        setShowConfirm(false);
    };

    const goToBarcode = () => {
        // Mock ID for current development
        navigate('/deals/DEAL-8421/barcode');
    };

    return (
        <div className="business-room-enhanced">
            {/* Overlay Header for Deal Actions */}
            <div className="deal-action-header">
                <div className="deal-context-info">
                    <span className="deal-label">Negotiation Status:</span>
                    <span className={`deal-status-pill ${dealStatus}`}>
                        {dealStatus === 'active' ? 'Ongoing' : dealStatus === 'success' ? 'Deal Closed Success' : 'Deal Failed'}
                    </span>
                </div>
                
                <div className="deal-btn-group">
                    {!isClosed ? (
                        <>
                            <button className="deal-btn success" onClick={() => handleMarkStatus('success')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                Mark as Success
                            </button>
                            <button className="deal-btn failed" onClick={() => handleMarkStatus('failed')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                Mark as Failed
                            </button>
                        </>
                    ) : (
                        dealStatus === 'success' && (
                            <button className="deal-btn barcode" onClick={goToBarcode}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                                View Deal QR Code
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Render the original BusinessRoom component */}
            <div className="original-room-content">
                <BusinessRoom />
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <h3>Confirm Status Change</h3>
                        <p>Are you sure you want to mark this deal as <strong>{confirmType === 'success' ? 'Successful' : 'Failed'}</strong>? This action cannot be undone and will close the business room.</p>
                        <div className="modal-btns">
                            <button className={`confirm-submit-btn ${confirmType}`} onClick={confirmStatusChange}>
                                Yes, Confirm
                            </button>
                            <button className="confirm-cancel-btn" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessRoomEnhanced;
