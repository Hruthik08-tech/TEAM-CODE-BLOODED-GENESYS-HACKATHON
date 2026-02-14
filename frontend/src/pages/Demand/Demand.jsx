import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Demand.css';

const Demand = () => {
    const navigate = useNavigate();

    const [demands, setDemands] = useState([
        {
            uuid: 'DEM-3821-A91',
            name: 'Emergency Response Kit Request',
            category: 'Healthcare',
            status: 'active',
            maxPrice: 150.00,
            currency: 'USD',
            quantity: 200,
            quantityUnit: 'kits',
            requiredBy: '2024-03-15',
            deliveryLocation: 'Mumbai, India',
            description: 'Complete emergency response kits including first aid, masks, and sanitisers.'
        },
        {
            uuid: 'DEM-5542-B23',
            name: 'Portable Solar Panels',
            category: 'Energy',
            status: 'pending',
            maxPrice: 85.00,
            currency: 'USD',
            quantity: 50,
            quantityUnit: 'units',
            requiredBy: '2024-02-28',
            deliveryLocation: 'Chennai, India',
            description: 'Foldable solar panels for disaster relief camps.'
        },
        {
            uuid: 'DEM-7890-C45',
            name: 'Water Purification Tablets',
            category: 'Sanitation',
            status: 'completed',
            maxPrice: 0.50,
            currency: 'USD',
            quantity: 10000,
            quantityUnit: 'pieces',
            requiredBy: '2024-01-20',
            deliveryLocation: 'Delhi, India',
            description: 'Chlorine-based water purification tablets for clean drinking water.'
        },
        {
            uuid: 'DEM-1234-D67',
            name: 'Emergency Tents (Family Size)',
            category: 'Shelter',
            status: 'active',
            maxPrice: 120.00,
            currency: 'USD',
            quantity: 100,
            quantityUnit: 'units',
            requiredBy: '2024-04-01',
            deliveryLocation: 'Bangalore, India',
            description: 'Family-sized tents for displaced populations.'
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        maxPrice: '',
        currency: 'USD',
        quantity: '',
        quantityUnit: '',
        requiredBy: '',
        deliveryLocation: '',
        description: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDemand = {
            uuid: `DEM-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
            name: formData.name,
            category: formData.category,
            status: 'pending',
            maxPrice: parseFloat(formData.maxPrice),
            currency: formData.currency,
            quantity: parseFloat(formData.quantity),
            quantityUnit: formData.quantityUnit,
            requiredBy: formData.requiredBy,
            deliveryLocation: formData.deliveryLocation,
            description: formData.description,
        };
        setDemands([newDemand, ...demands]);
        setFormData({
            name: '', category: '', maxPrice: '', currency: 'USD',
            quantity: '', quantityUnit: '', requiredBy: '', deliveryLocation: '', description: ''
        });
    };

    const getFilteredAndSortedDemands = () => {
        let filtered = demands.filter(demand => {
            const matchesSearch = demand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  demand.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || demand.status === filterStatus;
            const matchesCategory = filterCategory === 'all' || demand.category === filterCategory;
            return matchesSearch && matchesStatus && matchesCategory;
        });

        filtered.sort((a, b) => {
            if (sortBy === 'price') return b.maxPrice - a.maxPrice;
            if (sortBy === 'status') return a.status.localeCompare(b.status);
            return 0;
        });

        return filtered;
    };

    const uniqueCategories = [...new Set(demands.map(d => d.category))];

    const handleFindMatches = (demand) => {
        navigate(`/match-results?type=demand&id=${demand.uuid}`);
    };

    return (
        <div className="demand-page-wrapper">
            <div className="demand-container">

                {/* History Section */}
                <div className="demand-history-column">
                    <div className="section-header">
                        <h2 className="demand-section-title">Demand History</h2>
                    </div>

                    <div className="filter-controls">
                        <div className="search-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search demands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-row">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                                <option value="all">All Categories</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                                <option value="date">Sort by Date</option>
                                <option value="price">Sort by Price</option>
                                <option value="status">Sort by Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="demand-history-list-container">
                        {getFilteredAndSortedDemands().map((demand) => (
                            <div key={demand.uuid} className="demand-item-card">
                                <div className="item-main-info">
                                    <div className="item-name-group">
                                        <div className="item-category-tag">{demand.category}</div>
                                        <h3 className="item-name">{demand.name}</h3>
                                    </div>
                                    <div className={`item-status-pill status-${demand.status}`}>
                                        {demand.status}
                                    </div>
                                </div>

                                <div className="item-details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Reference ID</span>
                                        <span className="detail-value">{demand.uuid}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Max Price</span>
                                        <span className="detail-value">${demand.maxPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Quantity</span>
                                        <span className="detail-value">{demand.quantity} {demand.quantityUnit}</span>
                                    </div>
                                </div>

                                <div className="demand-card-actions">
                                    <button className="demand-action-btn find-matches-btn" onClick={() => handleFindMatches(demand)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                        Find Matching Supplies
                                    </button>
                                    <button className="demand-action-btn delete-btn" onClick={() => setDemands(prev => prev.filter(d => d.uuid !== demand.uuid))}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create Section */}
                <div className="demand-create-column">
                    <div className="section-header">
                        <h2 className="demand-section-title">Create Demand</h2>
                    </div>

                    <form className="create-form-container" onSubmit={handleSubmit}>
                        <div className="form-scroll-content">
                            <div className="input-group">
                                <label className="input-label">Item Name</label>
                                <input type="text" name="name" placeholder="e.g. Emergency Response Kits" className="styled-input" value={formData.name} onChange={handleInputChange} required />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Item Category</label>
                                <input type="text" name="category" placeholder="e.g. Healthcare" className="styled-input" value={formData.category} onChange={handleInputChange} required />
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label className="input-label">Max Price per Unit</label>
                                    <input type="number" name="maxPrice" step="0.01" placeholder="0.00" className="styled-input" value={formData.maxPrice} onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Currency</label>
                                    <select name="currency" className="styled-input" value={formData.currency} onChange={handleInputChange} required>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="INR">INR - Indian Rupee</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="JPY">JPY - Japanese Yen</option>
                                        <option value="AUD">AUD - Australian Dollar</option>
                                        <option value="CAD">CAD - Canadian Dollar</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label className="input-label">Quantity</label>
                                    <input type="number" name="quantity" step="0.01" placeholder="0" className="styled-input" value={formData.quantity} onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Quantity Unit</label>
                                    <select name="quantityUnit" className="styled-input" value={formData.quantityUnit} onChange={handleInputChange} required>
                                        <option value="">Select unit...</option>
                                        <option value="kg">kg - Kilograms</option>
                                        <option value="g">g - Grams</option>
                                        <option value="pieces">Pieces</option>
                                        <option value="litres">Litres</option>
                                        <option value="ml">ml - Millilitres</option>
                                        <option value="units">Units</option>
                                        <option value="boxes">Boxes</option>
                                        <option value="crates">Crates</option>
                                        <option value="kits">Kits</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label className="input-label">Required By Date</label>
                                    <input type="date" name="requiredBy" className="styled-input" value={formData.requiredBy} onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Delivery Location</label>
                                    <input type="text" name="deliveryLocation" placeholder="e.g. Mumbai, India" className="styled-input" value={formData.deliveryLocation} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Item Description</label>
                                <textarea name="description" placeholder="Describe the demand specifications..." className="styled-input styled-textarea" value={formData.description} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="supply-btn-container">
                            <button type="submit" className="submit-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                Register Demand
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Demand;
