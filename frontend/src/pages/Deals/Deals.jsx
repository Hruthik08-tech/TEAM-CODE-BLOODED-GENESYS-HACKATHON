import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Deals.css';

const Deals = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');

    const deals = [
        {
            id: 'DEAL-4921',
            partnerOrg: 'Global Aid Foundation',
            itemName: 'Emergency Medical Kits',
            quantity: 200,
            agreedPrice: 140.00,
            totalValue: 28000.00,
            currency: 'USD',
            status: 'active',
            createdAt: '2024-02-10',
            deliveryDate: '2024-03-15',
        },
        {
            id: 'DEAL-5033',
            partnerOrg: 'Alpha Logistics',
            itemName: 'Heavy Duty Shipping Crates',
            quantity: 50,
            agreedPrice: 175.00,
            totalValue: 8750.00,
            currency: 'USD',
            status: 'completed',
            createdAt: '2024-01-20',
            deliveryDate: '2024-02-05',
        },
        {
            id: 'DEAL-6147',
            partnerOrg: 'Eco Shelters',
            itemName: 'Portable Emergency Shelters',
            quantity: 30,
            agreedPrice: 350.00,
            totalValue: 10500.00,
            currency: 'USD',
            status: 'active',
            createdAt: '2024-02-08',
            deliveryDate: '2024-04-01',
        },
        {
            id: 'DEAL-7259',
            partnerOrg: 'AquaFilter Corp',
            itemName: 'Water Purification Systems',
            quantity: 100,
            agreedPrice: 45.00,
            totalValue: 4500.00,
            currency: 'USD',
            status: 'cancelled',
            createdAt: '2024-01-15',
            deliveryDate: '2024-02-28',
        },
    ];

    const statusConfig = {
        active: { label: 'Active', className: 'deal-status-active' },
        completed: { label: 'Completed', className: 'deal-status-completed' },
        cancelled: { label: 'Cancelled', className: 'deal-status-cancelled' },
    };

    const filteredDeals = deals.filter(deal => filterStatus === 'all' || deal.status === filterStatus);

    const summaryStats = {
        totalDeals: deals.length,
        activeDeals: deals.filter(d => d.status === 'active').length,
        totalValue: deals.filter(d => d.status !== 'cancelled').reduce((sum, d) => sum + d.totalValue, 0),
    };

    return (
        <div className="deals-page">
            <div className="deals-header">
                <div>
                    <h1 className="deals-title">Deals</h1>
                    <p className="deals-subtitle">Track and manage your closed deals</p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="deals-summary-row">
                <div className="summary-card">
                    <span className="summary-value">{summaryStats.totalDeals}</span>
                    <span className="summary-label">Total Deals</span>
                </div>
                <div className="summary-card summary-active">
                    <span className="summary-value">{summaryStats.activeDeals}</span>
                    <span className="summary-label">Active Deals</span>
                </div>
                <div className="summary-card summary-value-card">
                    <span className="summary-value">${summaryStats.totalValue.toLocaleString()}</span>
                    <span className="summary-label">Total Value</span>
                </div>
            </div>

            {/* Filters */}
            <div className="deals-filter-row">
                {['all', 'active', 'completed', 'cancelled'].map(status => (
                    <button
                        key={status}
                        className={`deals-filter-pill ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status === 'all' ? 'All Deals' : statusConfig[status]?.label || status}
                    </button>
                ))}
            </div>

            {/* Deals list */}
            <div className="deals-list">
                {filteredDeals.length === 0 ? (
                    <div className="deals-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                        <p>No deals found.</p>
                    </div>
                ) : (
                    filteredDeals.map(deal => (
                        <div key={deal.id} className={`deal-card ${deal.status}`}>
                            <div className="deal-card-top">
                                <div className="deal-card-left">
                                    <div className="deal-meta-row">
                                        <span className="deal-id">{deal.id}</span>
                                        <span className={`deal-status-badge ${statusConfig[deal.status]?.className}`}>
                                            {statusConfig[deal.status]?.label}
                                        </span>
                                    </div>
                                    <h3 className="deal-item-name">{deal.itemName}</h3>
                                    <span className="deal-partner">with {deal.partnerOrg}</span>
                                </div>
                                <div className="deal-value-block">
                                    <span className="deal-total-value">${deal.totalValue.toLocaleString()}</span>
                                    <span className="deal-value-label">Total Value</span>
                                </div>
                            </div>

                            <div className="deal-details-grid">
                                <div className="deal-detail">
                                    <span className="deal-detail-label">Quantity</span>
                                    <span className="deal-detail-value">{deal.quantity} units</span>
                                </div>
                                <div className="deal-detail">
                                    <span className="deal-detail-label">Agreed Price</span>
                                    <span className="deal-detail-value">${deal.agreedPrice.toFixed(2)}/unit</span>
                                </div>
                                <div className="deal-detail">
                                    <span className="deal-detail-label">Created</span>
                                    <span className="deal-detail-value">{deal.createdAt}</span>
                                </div>
                                <div className="deal-detail">
                                    <span className="deal-detail-label">Delivery By</span>
                                    <span className="deal-detail-value">{deal.deliveryDate}</span>
                                </div>
                            </div>

                            {deal.status === 'active' && (
                                <div className="deal-actions">
                                    <button className="deal-action-btn deal-qr-btn" onClick={() => navigate(`/deals/${deal.id}/barcode`)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                                        View QR Code
                                    </button>
                                    <button className="deal-action-btn deal-room-btn" onClick={() => navigate('/business-room')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                        Open Room
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Deals;
