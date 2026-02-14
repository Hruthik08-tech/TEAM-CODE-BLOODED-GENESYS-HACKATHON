import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './DealBarcode.css';

const DealBarcode = () => {
    const { dealId } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Mock deal data
    const deal = {
        id: dealId || 'DEAL-4921',
        partnerOrg: 'Global Aid Foundation',
        itemName: 'Emergency Medical Kits',
        quantity: 200,
        agreedPrice: 140.00,
        totalValue: 28000.00,
        currency: 'USD',
        status: 'active',
        createdAt: '2024-02-10',
        deliveryDate: '2024-03-15',
    };

    const verifyUrl = `${window.location.origin}/verify?deal=${deal.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(verifyUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="deal-barcode-page">
            <button className="back-btn" onClick={() => navigate('/deals')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Back to Deals
            </button>

            <div className="barcode-content">
                <div className="barcode-card">
                    <div className="barcode-card-header">
                        <h2 className="barcode-card-title">Deal QR Code</h2>
                        <p className="barcode-card-subtitle">Scan to verify and close this deal</p>
                    </div>

                    <div className="qr-code-container">
                        <div className="qr-frame">
                            <QRCodeSVG
                                value={verifyUrl}
                                size={220}
                                bgColor="#ffffff"
                                fgColor="#2c3e50"
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <p className="qr-instruction">Point your camera at this code to verify the deal</p>
                    </div>

                    <div className="verify-link-section">
                        <label className="verify-link-label">Verification Link</label>
                        <div className="verify-link-box">
                            <span className="verify-link-text">{verifyUrl}</span>
                            <button className="copy-link-btn" onClick={handleCopyLink}>
                                {copied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="barcode-deal-info">
                    <h3 className="deal-info-title">Deal Details</h3>
                    <div className="deal-info-list">
                        <div className="deal-info-item">
                            <span className="deal-info-label">Deal ID</span>
                            <span className="deal-info-value">{deal.id}</span>
                        </div>
                        <div className="deal-info-item">
                            <span className="deal-info-label">Item</span>
                            <span className="deal-info-value">{deal.itemName}</span>
                        </div>
                        <div className="deal-info-item">
                            <span className="deal-info-label">Partner</span>
                            <span className="deal-info-value">{deal.partnerOrg}</span>
                        </div>
                        <div className="deal-info-item">
                            <span className="deal-info-label">Quantity</span>
                            <span className="deal-info-value">{deal.quantity} units</span>
                        </div>
                        <div className="deal-info-item">
                            <span className="deal-info-label">Agreed Price</span>
                            <span className="deal-info-value">${deal.agreedPrice.toFixed(2)}/unit</span>
                        </div>
                        <div className="deal-info-item highlight">
                            <span className="deal-info-label">Total Value</span>
                            <span className="deal-info-value">${deal.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="deal-info-item">
                            <span className="deal-info-label">Delivery By</span>
                            <span className="deal-info-value">{deal.deliveryDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealBarcode;
