import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Verify.css';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get('deal') || '';

    const [status, setStatus] = useState('loading'); // loading | success | error | notfound
    const [dealData, setDealData] = useState(null);

    useEffect(() => {
        if (!dealId) {
            setStatus('notfound');
            return;
        }
        // Simulate verification API call
        const timer = setTimeout(() => {
            // Mock: if deal ID starts with "DEAL-", it's valid
            if (dealId.startsWith('DEAL-')) {
                setDealData({
                    id: dealId,
                    itemName: 'Emergency Medical Kits',
                    partnerOrg: 'Global Aid Foundation',
                    quantity: 200,
                    agreedPrice: 140.00,
                    totalValue: 28000.00,
                    deliveryDate: '2024-03-15',
                    status: 'verified',
                });
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [dealId]);

    return (
        <div className="verify-page">
            <div className="verify-card">
                {status === 'loading' && (
                    <div className="verify-loading">
                        <div className="verify-spinner" />
                        <h3>Verifying Deal...</h3>
                        <p>Checking deal #{dealId} against the blockchain</p>
                    </div>
                )}

                {status === 'success' && dealData && (
                    <div className="verify-success">
                        <div className="verify-success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <h2 className="verify-success-title">Deal Verified Successfully</h2>
                        <p className="verify-success-desc">This deal has been verified and is authentic.</p>

                        <div className="verify-deal-details">
                            <div className="verify-detail">
                                <span className="verify-detail-label">Deal ID</span>
                                <span className="verify-detail-value">{dealData.id}</span>
                            </div>
                            <div className="verify-detail">
                                <span className="verify-detail-label">Item</span>
                                <span className="verify-detail-value">{dealData.itemName}</span>
                            </div>
                            <div className="verify-detail">
                                <span className="verify-detail-label">Partner</span>
                                <span className="verify-detail-value">{dealData.partnerOrg}</span>
                            </div>
                            <div className="verify-detail">
                                <span className="verify-detail-label">Quantity</span>
                                <span className="verify-detail-value">{dealData.quantity} units</span>
                            </div>
                            <div className="verify-detail">
                                <span className="verify-detail-label">Total Value</span>
                                <span className="verify-detail-value highlight">${dealData.totalValue.toLocaleString()}</span>
                            </div>
                            <div className="verify-detail">
                                <span className="verify-detail-label">Delivery By</span>
                                <span className="verify-detail-value">{dealData.deliveryDate}</span>
                            </div>
                        </div>

                        <div className="verify-stamp">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <span>Verified by GENYSIS Platform</span>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verify-error">
                        <div className="verify-error-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </div>
                        <h2 className="verify-error-title">Verification Failed</h2>
                        <p className="verify-error-desc">The deal ID "{dealId}" could not be verified. It may be invalid or the deal may no longer exist.</p>
                    </div>
                )}

                {status === 'notfound' && (
                    <div className="verify-error">
                        <div className="verify-error-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <h2 className="verify-error-title">No Deal ID Provided</h2>
                        <p className="verify-error-desc">Please scan a valid QR code or use a deal verification link.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Verify;
