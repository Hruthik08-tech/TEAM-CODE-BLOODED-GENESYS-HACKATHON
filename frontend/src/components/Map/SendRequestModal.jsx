import React from 'react';
import '../MapPopup.css';

export default function SendRequestModal({
  selectedMarker,
  requestForm,
  onFormChange,
  onSubmit,
  onClose,
  isSending,
  isSuccess,
  error,
  isSupplyMode,
  isDemandMode,
  supplyId,
  demandId,
  searchData,
}) {
  if (!selectedMarker) return null;

  return (
    <div className="request-modal-overlay" onClick={onClose}>
      <div className="request-modal" onClick={(e) => e.stopPropagation()}>
        <div className="request-modal-header">
          <div>
            <h2 className="request-modal-title">Send Request</h2>
            <p className="request-modal-subtitle">
              To <strong>{selectedMarker.orgName}</strong>
            </p>
          </div>
          <button type="button" className="request-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="request-modal-success">
            <div className="success-icon">✓</div>
            <h3>Request Sent!</h3>
            <p>
              Your request has been sent to <strong>{selectedMarker.orgName}</strong>. They will
              review it and respond soon.
            </p>
            <button type="button" className="request-modal-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="request-modal-form">
            <div className="request-field-group">
              <label className="request-field-label">Requesting To</label>
              <div className="request-field-static">
                <span className="field-icon">🏢</span>
                <span>{selectedMarker.orgName}</span>
              </div>
            </div>

            <div className="request-field-row">
              <div className="request-field-group">
                <label className="request-field-label">Supply</label>
                <div className="request-field-static">
                  <span className="field-icon">📦</span>
                  <span>
                    {isSupplyMode
                      ? `#${supplyId} — ${searchData?.supply_item_name || 'Your Supply'}`
                      : selectedMarker.itemName || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="request-field-group">
                <label className="request-field-label">Demand</label>
                <div className="request-field-static">
                  <span className="field-icon">📋</span>
                  <span>
                    {isDemandMode
                      ? `#${demandId} — ${searchData?.demand_item_name || 'Your Demand'}`
                      : selectedMarker.itemName || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {selectedMarker.match_score != null && (
              <div className="request-field-group">
                <label className="request-field-label">Match Score</label>
                <div className="request-match-score-bar">
                  <div className="match-score-track">
                    <div
                      className="match-score-fill"
                      style={{
                        width: `${Math.round(selectedMarker.match_score * 100)}%`,
                        background:
                          selectedMarker.match_score >= 0.7
                            ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
                            : selectedMarker.match_score >= 0.4
                            ? 'linear-gradient(135deg, #f39c12, #e67e22)'
                            : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      }}
                    />
                  </div>
                  <span className="match-score-value">
                    {Math.round(selectedMarker.match_score * 100)}%
                  </span>
                </div>
              </div>
            )}

            <div className="request-field-row">
              <div className="request-field-group">
                <label className="request-field-label">Supply Snapshot</label>
                <div className="request-field-static small">
                  {selectedMarker.supply_name_snapshot ||
                    (isSupplyMode ? `Supply #${supplyId}` : selectedMarker.itemName) ||
                    '—'}
                </div>
              </div>
              <div className="request-field-group">
                <label className="request-field-label">Demand Snapshot</label>
                <div className="request-field-static small">
                  {selectedMarker.demand_name_snapshot ||
                    (isDemandMode ? `Demand #${demandId}` : selectedMarker.itemName) ||
                    '—'}
                </div>
              </div>
            </div>

            {selectedMarker.distance_km != null && (
              <div className="request-field-group">
                <label className="request-field-label">Distance</label>
                <div className="request-field-static">
                  <span className="field-icon">📏</span>
                  <span>{selectedMarker.distance_km} km away</span>
                </div>
              </div>
            )}

            <div className="request-field-group">
              <label className="request-field-label">
                Message <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="request-message"
                className="request-textarea"
                placeholder="Add a message to introduce yourself or explain what you need..."
                value={requestForm?.message ?? ''}
                onChange={(e) => onFormChange?.({ ...requestForm, message: e.target.value })}
                rows={4}
              />
            </div>

            {error && (
              <div className="request-modal-error">⚠️ {error}</div>
            )}

            <div className="request-modal-actions">
              <button
                type="button"
                className="request-modal-btn secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="request-modal-btn primary" disabled={isSending}>
                {isSending ? (
                  <>
                    <span className="btn-spinner" />
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
