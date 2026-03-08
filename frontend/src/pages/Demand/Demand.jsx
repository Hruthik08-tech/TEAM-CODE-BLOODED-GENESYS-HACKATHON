import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemand, useCategories, useFilteredList } from '../../hooks/index.js';
import { RatingBadge, SearchFilterBar, PriceDisplay } from '../../components/shared/index.js';
import { CURRENCY_OPTIONS, QUANTITY_UNIT_OPTIONS } from '../../utils/formatters.js';
import './Demand.css';

const DEMAND_FORM_INITIAL = {
  name: '',
  category: '',
  maxPrice: '',
  currency: 'USD',
  quantity: '',
  quantityUnit: '',
  requiredBy: '',
  deliveryLocation: '',
  searchRadius: 50,
  description: '',
};

const Demand = () => {
  const navigate = useNavigate();
  const { demands, isLoading, rateDemand, deleteDemand, createDemand } = useDemand();
  const categories = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(DEMAND_FORM_INITIAL);

  const filteredDemands = useFilteredList(
    demands,
    { searchQuery, filterStatus, filterCategory, sortBy },
    { getPrice: (d) => d.maxPrice }
  );

  const uniqueCategories = [...new Set(demands.map((d) => d.category).filter(Boolean))];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDemand({
        item_name: formData.name,
        item_category: formData.category,
        item_description: formData.description,
        max_price_per_unit: parseFloat(formData.maxPrice) || null,
        currency: formData.currency,
        quantity: parseFloat(formData.quantity) || null,
        quantity_unit: formData.quantityUnit,
        required_by: formData.requiredBy || null,
        delivery_location: formData.deliveryLocation || null,
        search_radius: parseFloat(formData.searchRadius) || 50,
      });
      setFormData(DEMAND_FORM_INITIAL);
    } catch (err) {
      alert('Failed to create demand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (demandId) => {
    if (!window.confirm('Are you sure you want to delete this demand?')) return;
    await deleteDemand(demandId);
  };

  return (
    <div className="demand-page-wrapper">
      <div className="demand-container">
        <div className="demand-history-column">
          <div className="section-header">
            <h2 className="demand-section-title">Demand History</h2>
          </div>
          <SearchFilterBar
            searchPlaceholder="Search demands..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            filterCategory={filterCategory}
            onFilterCategoryChange={setFilterCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categoryOptions={uniqueCategories}
          />
          <div className="demand-history-list-container">
            {filteredDemands.map((demand) => (
              <div key={demand.uuid} className="demand-item-card">
                <div className="item-main-info">
                  <div className="item-name-group">
                    <div className="item-category-tag">{demand.category}</div>
                    <h3 className="item-name">{demand.name}</h3>
                  </div>
                  <div className={`item-status-pill status-${demand.status}`}>{demand.status}</div>
                </div>
                <div className="item-rating-section">
                  <RatingBadge
                    rating={demand.rating}
                    onRate={(newRating) => rateDemand(demand.demandId, newRating)}
                  />
                </div>
                <div className="item-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Reference ID</span>
                    <span className="detail-value">{demand.uuid}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Max Price</span>
                    <span className="detail-value">
                      <PriceDisplay amount={demand.maxPrice} currency={demand.currency} />
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{demand.quantity} {demand.quantityUnit}</span>
                  </div>
                </div>
                <div className="demand-card-actions">
                  <button
                    className="demand-action-btn find-matches-btn"
                    onClick={() => navigate(`/demand/${demand.demandId}/match-map`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    Find Matching Supplies
                  </button>
                  <button
                    className="demand-action-btn delete-btn"
                    onClick={() => handleDelete(demand.demandId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                <select name="category" className="styled-input" value={formData.category} onChange={handleInputChange} required>
                  <option value="" disabled>Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Max Price per Unit</label>
                  <input type="number" name="maxPrice" step="0.01" placeholder="0.00" className="styled-input" value={formData.maxPrice} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Currency</label>
                  <select name="currency" className="styled-input" value={formData.currency} onChange={handleInputChange} required>
                    {CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
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
                    {QUANTITY_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-group radius-input-group">
                <label className="input-label">
                  Search Radius
                  <span className="radius-value-badge">{formData.searchRadius} km</span>
                </label>
                <div className="radius-control">
                  <input type="range" name="searchRadius" min="5" max="500" step="5" className="radius-slider" value={formData.searchRadius} onChange={handleInputChange} />
                  <input type="number" name="searchRadius" min="5" max="500" className="styled-input radius-number" value={formData.searchRadius} onChange={handleInputChange} />
                </div>
                <span className="radius-hint">How far to search for matching supplies</span>
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
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                {isSubmitting ? 'Creating...' : 'Register Demand'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Demand;
