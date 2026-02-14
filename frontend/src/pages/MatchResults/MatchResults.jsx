import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './MatchResults.css';

const MatchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get('type') || 'supply';
    const listingId = searchParams.get('id') || '';

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [matches, setMatches] = useState([]);
    const [savedMatches, setSavedMatches] = useState(new Set());
    const [dismissedMatches, setDismissedMatches] = useState(new Set());

    // Mock source listing
    const sourceListing = type === 'supply' ? {
        uuid: listingId || 'SUP-4921-X82',
        name: 'Medical Masks (N95)',
        category: 'Healthcare',
        price: 2.50,
        quantity: 500,
        quantityUnit: 'pieces',
        description: 'High-grade N95 masks for emergency response teams.',
    } : {
        uuid: listingId || 'DEM-3821-A91',
        name: 'Emergency Response Kit Request',
        category: 'Healthcare',
        maxPrice: 150.00,
        quantity: 200,
        quantityUnit: 'kits',
        description: 'Complete emergency response kits including first aid, masks, and sanitisers.',
    };

    // Mock matches
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setMatches([
                {
                    id: 'M-001',
                    uuid: type === 'supply' ? 'DEM-7890-K12' : 'SUP-5544-P33',
                    name: type === 'supply' ? 'Emergency Medical Supply Request' : 'N95 Respirators (Bulk)',
                    category: 'Healthcare',
                    price: type === 'supply' ? 3.00 : 2.20,
                    quantity: 300,
                    quantityUnit: 'pieces',
                    orgName: 'Global Aid Foundation',
                    description: 'Urgent need for medical-grade protective equipment.',
                    overallScore: 92,
                    scores: { name: 88, description: 85, price: 95, category: 100 },
                },
                {
                    id: 'M-002',
                    uuid: type === 'supply' ? 'DEM-1122-L45' : 'SUP-9911-R78',
                    name: type === 'supply' ? 'Protective Equipment Order' : 'KN95 Face Masks',
                    category: 'Healthcare',
                    price: type === 'supply' ? 4.50 : 1.80,
                    quantity: 150,
                    quantityUnit: 'pieces',
                    orgName: 'Red Cross Supplies',
                    description: 'Personal protective equipment for field workers.',
                    overallScore: 78,
                    scores: { name: 72, description: 80, price: 68, category: 100 },
                },
                {
                    id: 'M-003',
                    uuid: type === 'supply' ? 'DEM-3344-M67' : 'SUP-2233-S01',
                    name: type === 'supply' ? 'Sanitation Kit Demand' : 'Hygiene Protection Sets',
                    category: 'Sanitation',
                    price: type === 'supply' ? 5.00 : 3.50,
                    quantity: 80,
                    quantityUnit: 'kits',
                    orgName: 'Eco Shelters',
                    description: 'Basic sanitation and hygiene kits for disaster zones.',
                    overallScore: 55,
                    scores: { name: 45, description: 60, price: 50, category: 65 },
                },
            ]);
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [type, listingId]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-medium';
        return 'score-low';
    };

    const handleSave = (matchId) => {
        setSavedMatches(prev => new Set([...prev, matchId]));
    };

    const handleDismiss = (matchId) => {
        setDismissedMatches(prev => new Set([...prev, matchId]));
    };

    const handleSendRequest = (match) => {
        navigate('/requests');
    };

    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const visibleMatches = matches.filter(m => !dismissedMatches.has(m.id));

    return (
        <div className="match-results-page">
            <div className="match-results-container">
                {/* Left panel — source listing */}
                <div className="source-panel">
                    <h3 className="source-panel-label">Searching From</h3>
                    <div className="source-card">
                        <div className="source-type-badge">
                            {type === 'supply' ? 'Supply' : 'Demand'}
                        </div>
                        <h3 className="source-name">{sourceListing.name}</h3>
                        <div className="source-category">{sourceListing.category}</div>
                        <p className="source-description">{sourceListing.description}</p>
                        <div className="source-details">
                            <div className="source-detail-item">
                                <span className="source-detail-label">{type === 'supply' ? 'Price' : 'Max Price'}</span>
                                <span className="source-detail-value">${(sourceListing.price || sourceListing.maxPrice)?.toFixed(2)}</span>
                            </div>
                            <div className="source-detail-item">
                                <span className="source-detail-label">Quantity</span>
                                <span className="source-detail-value">{sourceListing.quantity} {sourceListing.quantityUnit}</span>
                            </div>
                            <div className="source-detail-item">
                                <span className="source-detail-label">ID</span>
                                <span className="source-detail-value">{sourceListing.uuid}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel — match results */}
                <div className="results-panel">
                    <h3 className="results-panel-title">
                        <span className="results-title-bar" />
                        {type === 'supply' ? 'Matching Demands' : 'Matching Supplies'}
                        <span className="results-count">{visibleMatches.length} results</span>
                    </h3>

                    <div className="results-list">
                        {isLoading ? (
                            <>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="skeleton-card">
                                        <div className="skeleton-line skeleton-wide" />
                                        <div className="skeleton-line skeleton-medium" />
                                        <div className="skeleton-line skeleton-narrow" />
                                        <div className="skeleton-row">
                                            <div className="skeleton-box" />
                                            <div className="skeleton-box" />
                                            <div className="skeleton-box" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : error ? (
                            <div className="match-error-state">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <p>Something went wrong while fetching matches.</p>
                                <button className="retry-btn" onClick={handleRetry}>Try Again</button>
                            </div>
                        ) : visibleMatches.length === 0 ? (
                            <div className="match-empty-state">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                <p>No matches found for this listing.</p>
                                <span>Try adjusting and resubmitting.</span>
                            </div>
                        ) : (
                            visibleMatches.map(match => {
                                const isSaved = savedMatches.has(match.id);
                                return (
                                    <div key={match.id} className={`match-result-card ${isSaved ? 'saved' : ''}`}>
                                        <div className="match-card-header">
                                            <div className="match-card-left">
                                                <span className="match-category-badge">{match.category}</span>
                                                <h4 className="match-item-name">{match.name}</h4>
                                                <span className="match-org-name">{match.orgName}</span>
                                            </div>
                                            <div className={`match-score-badge ${getScoreColor(match.overallScore)}`}>
                                                {match.overallScore}% Match
                                            </div>
                                        </div>

                                        <p className="match-description">{match.description}</p>

                                        <div className="match-details-row">
                                            <div className="match-detail">
                                                <span className="match-detail-icon">💰</span>
                                                <span>${match.price.toFixed(2)}/unit</span>
                                            </div>
                                            <div className="match-detail">
                                                <span className="match-detail-icon">📦</span>
                                                <span>{match.quantity} {match.quantityUnit}</span>
                                            </div>
                                        </div>

                                        <div className="score-breakdown">
                                            <span className="breakdown-title">Score Breakdown:</span>
                                            <div className="breakdown-grid">
                                                {Object.entries(match.scores).map(([key, val]) => (
                                                    <div key={key} className="breakdown-item">
                                                        <span className="breakdown-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                        <div className="breakdown-bar-bg">
                                                            <div className={`breakdown-bar-fill ${getScoreColor(val)}`} style={{ width: `${val}%` }} />
                                                        </div>
                                                        <span className="breakdown-value">{val}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="match-card-actions">
                                            {isSaved ? (
                                                <>
                                                    <button className="match-saved-btn" disabled>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                        Saved ✓
                                                    </button>
                                                    <button className="send-request-btn" onClick={() => handleSendRequest(match)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                                        Send Request
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="save-match-btn" onClick={() => handleSave(match.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                                        Save Match
                                                    </button>
                                                    <button className="dismiss-match-btn" onClick={() => handleDismiss(match.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                        Dismiss
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchResults;
