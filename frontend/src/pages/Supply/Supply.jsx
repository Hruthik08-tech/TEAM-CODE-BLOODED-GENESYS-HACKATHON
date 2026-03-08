import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupply, useCategories, useFilteredList } from '../../hooks/index.js';
import { RatingBadge, SearchFilterBar, PriceDisplay } from '../../components/shared/index.js';
import { CURRENCY_OPTIONS, QUANTITY_UNIT_OPTIONS } from '../../utils/formatters.js';
import './Supply.css';

const SUPPLY_FORM_INITIAL = {
  name: '',
  category: '',
  price: '',
  currency: 'USD',
  quantity: '',
  quantityUnit: '',
  searchRadius: 50,
  expiryDate: '',
  supplierName: '',
  supplierContact: '',
  supplierEmail: '',
  description: '',
};

const Supply = () => {
  const navigate = useNavigate();
  const { supplies, isLoading, rateSupply, deleteSupply, createSupply } = useSupply();
  const categories = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [supplierExpanded, setSupplierExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(SUPPLY_FORM_INITIAL);

  const filteredSupplies = useFilteredList(
    supplies,
    { searchQuery, filterStatus, filterCategory, sortBy },
    { getPrice: (s) => s.price }
  );

  const uniqueCategories = [...new Set(supplies.map((s) => s.category).filter(Boolean))];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSupply({
        item_name: formData.name,
        item_category: formData.category,
        item_description: formData.description,
        price_per_unit: parseFloat(formData.price) || null,
        currency: formData.currency,
        quantity: parseFloat(formData.quantity) || null,
        quantity_unit: formData.quantityUnit,
        search_radius: parseFloat(formData.searchRadius) || 50,
        expiry_date: formData.expiryDate || null,
        supplier_name: formData.supplierName || null,
        supplier_contact: formData.supplierContact || null,
        supplier_email: formData.supplierEmail || null,
      });
      setFormData(SUPPLY_FORM_INITIAL);
    } catch (err) {
      alert('Failed to create supply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="supply-page-wrapper">
      <div className="supply-container">
        <div className="history-column">
          <div className="section-header">
            <h2 className="section-title">Supply History</h2>
          </div>
          <SearchFilterBar
            searchPlaceholder="Search supplies..."
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
          <div className="history-list-container">
            {filteredSupplies.map((supply) => (
              <div key={supply.uuid} className="supply-item-card">
                <div className="item-main-info">
                  <div className="item-name-group">
                    <div className="item-category-tag">{supply.category}</div>
                    <h3 className="item-name">{supply.name}</h3>
                  </div>
                  <div className={`item-status-pill status-${supply.status}`}>{supply.status}</div>
                </div>
                <div className="item-rating-section">
                  <RatingBadge
                    rating={supply.rating}
                    onRate={(newRating) => rateSupply(supply.supplyId, newRating)}
                  />
                </div>
                <div className="item-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Reference ID</span>
                    <span className="detail-value">{supply.uuid}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Unit Price</span>
                    <span className="detail-value">
                      <PriceDisplay amount={supply.price} currency={supply.currency} />
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{supply.quantity} {supply.quantityUnit}</span>
                  </div>
                </div>
                <div className="item-card-actions">
                  <button
                    className="match-btn"
                    onClick={() => navigate(`/supply/${supply.supplyId}/match-map`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    Find Matching Demands
                  </button>
                  <button
                    className="delete-item-btn"
                    onClick={() => deleteSupply(supply.supplyId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="create-column">
          <div className="section-header">
            <h2 className="section-title">Create Supply</h2>
          </div>
          <form className="create-form-container" onSubmit={handleSubmit}>
            <div className="form-scroll-content">
              <div className="input-group">
                <label className="input-label">Item Name</label>
                <input type="text" name="name" placeholder="e.g. Solar Generators" className="styled-input" value={formData.name} onChange={handleInputChange} required />
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
                  <label className="input-label">Price per Unit</label>
                  <input type="number" name="price" step="0.01" placeholder="0.00" className="styled-input" value={formData.price} onChange={handleInputChange} required />
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
                <span className="radius-hint">How far to search for matching demands</span>
              </div>
              <div className="input-group">
                <label className="input-label">Expiry Date</label>
                <input type="date" name="expiryDate" className="styled-input" value={formData.expiryDate} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Item Description</label>
                <textarea name="description" placeholder="Describe the supply specifications..." className="styled-input styled-textarea" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="supplier-section">
                <div className="supplier-header" onClick={() => setSupplierExpanded(!supplierExpanded)}>
                  <h3 className="supplier-title">Supplier Details (Optional)</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${supplierExpanded ? 'expanded' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {supplierExpanded && (
                  <div className="supplier-content">
                    <div className="input-group">
                      <label className="input-label">Supplier Name</label>
                      <input type="text" name="supplierName" placeholder="e.g. MedSupply Co." className="styled-input" value={formData.supplierName} onChange={handleInputChange} />
                    </div>
                    <div className="input-row">
                      <div className="input-group">
                        <label className="input-label">Contact Number</label>
                        <input type="tel" name="supplierContact" placeholder="+1 234 567 8900" className="styled-input" value={formData.supplierContact} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input type="email" name="supplierEmail" placeholder="contact@supplier.com" className="styled-input" value={formData.supplierEmail} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="supply-btn-container">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                {isSubmitting ? 'Creating...' : 'Register Supply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Supply;
