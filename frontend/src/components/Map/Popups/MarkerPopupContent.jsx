import React from 'react';
import ScoreBreakdown from '../../MapComponents/ScoreBreakdown/ScoreBreakdown.jsx';

function MyOrgPopup({ marker }) {
  return (
    <div className="custom-popup-content">
      <div className="popup-header">
        <div className="org-info">
          <h3 className="org-name">{marker.orgName}</h3>
          <p className="org-mail" style={{ color: '#D97706', fontWeight: 700 }}>
            ⭐ Your Organisation
          </p>
        </div>
      </div>
      <div className="item-details-card" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
        <p className="item-name">{marker.orgName}</p>
        <p className="item-category">{marker.itemCategory}</p>
      </div>
      {marker.orgMail && <p style={{ fontSize: 11, color: '#666', margin: '4px 0' }}>📧 {marker.orgMail}</p>}
      {marker.contactName && <p style={{ fontSize: 11, color: '#666', margin: '2px 0' }}>📞 {marker.contactName}</p>}
    </div>
  );
}

function DealPartnerPopup({ marker }) {
  return (
    <div className="custom-popup-content">
      <div className="popup-header">
        <div className="org-info">
          <h3 className="org-name">{marker.orgName}</h3>
          <p className="org-mail">{marker.orgMail}</p>
        </div>
      </div>
      <div className="item-details-card" style={{ background: 'linear-gradient(135deg, #2364AA 0%, #1a4f8a 100%)' }}>
        <p className="item-name" style={{ fontSize: 12 }}>🤝 Deal Partner</p>
        <p className="item-category">{marker.itemCategory}</p>
      </div>
      {marker.deals && marker.deals.length > 0 && (
        <div style={{ margin: '6px 0 2px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Active Deals ({marker.deals.length})
          </div>
          {marker.deals.slice(0, 3).map((d, i) => (
            <div
              key={d.deal_id || i}
              style={{
                padding: '5px 8px',
                margin: '3px 0',
                background: 'rgba(35,100,170,0.06)',
                borderRadius: 6,
                fontSize: 11,
                borderLeft: `3px solid ${
                  d.deal_status === 'active' ? '#10b981' : d.deal_status === 'completed' ? '#8b5cf6' : '#f59e0b'
                }`,
              }}
            >
              <div style={{ fontWeight: 600, color: '#1e293b' }}>
                {d.supply_name || 'Supply'} ⇄ {d.demand_name || 'Demand'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 2, color: '#64748b' }}>
                {d.agreed_price != null && <span>💰 {d.currency || '₹'}{d.agreed_price}</span>}
                {d.quantity != null && <span>📦 {d.quantity}</span>}
                <span
                  style={{
                    padding: '0 4px',
                    borderRadius: 3,
                    fontSize: 9,
                    fontWeight: 600,
                    background: d.deal_status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)',
                    color: d.deal_status === 'active' ? '#059669' : '#7c3aed',
                  }}
                >
                  {d.deal_status}
                </span>
              </div>
            </div>
          ))}
          {marker.deals.length > 3 && (
            <p style={{ fontSize: 10, color: '#94a3b8', margin: '4px 0 0', textAlign: 'center' }}>
              +{marker.deals.length - 3} more deals
            </p>
          )}
        </div>
      )}
      {marker.contactName && <p style={{ fontSize: 11, color: '#666', margin: '4px 0' }}>📞 {marker.contactName}</p>}
    </div>
  );
}

function OriginPopup({ marker }) {
  return (
    <div className="custom-popup-content">
      <div className="popup-header">
        <div className="org-info">
          <h3 className="org-name">{marker.orgName}</h3>
          <p className="org-mail" style={{ color: '#059669', fontWeight: 700 }}>
            📍 Your Organisation (Origin)
          </p>
        </div>
      </div>
      <div className="item-details-card" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
        <p className="item-name">{marker.itemName}</p>
        <p className="item-category">{marker.itemCategory}</p>
      </div>
    </div>
  );
}

function OrganisationPopup({ marker, onSendRequest }) {
  return (
    <div className="custom-popup-content">
      <div className="popup-header">
        <div className="org-info">
          <h3 className="org-name">{marker.orgName}</h3>
          <p className="org-mail">{marker.orgMail}</p>
          {marker.contactName && (
            <p style={{ margin: '2px 0', fontSize: 12, color: '#555' }}>📞 {marker.contactName}</p>
          )}
        </div>
      </div>
      <div className="item-details-card" style={{ background: 'linear-gradient(135deg, #EA7317 0%, #d66410 100%)' }}>
        <p className="item-name" style={{ fontSize: 12 }}>🏢 Organisation</p>
        <p className="item-category">{marker.itemCategory}</p>
      </div>
      {marker.description && (
        <p style={{ fontSize: 11, color: '#666', margin: '4px 0 2px', lineHeight: 1.4, fontStyle: 'italic' }}>
          {marker.description.length > 100 ? marker.description.substring(0, 100) + '...' : marker.description}
        </p>
      )}
      {marker.website_url && (
        <a href={marker.website_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2364AA', textDecoration: 'none' }}>
          🌐 {marker.website_url}
        </a>
      )}
      <button className="send-request-btn" onClick={() => onSendRequest(marker)}>
        Send Request
      </button>
    </div>
  );
}

function MatchResultPopup({ marker, isDemandMode, onSendRequest }) {
  return (
    <div className="custom-popup-content">
      <div className="popup-header">
        <div className="org-info">
          <h3 className="org-name">{marker.orgName}</h3>
          <p className="org-mail">{marker.orgMail}</p>
          {marker.contactName && <p style={{ margin: '2px 0', fontSize: 12, color: '#555' }}>📞 {marker.contactName}</p>}
          {marker.contactNo && <p style={{ margin: '2px 0', fontSize: 12, color: '#555' }}>📍 {marker.contactNo}</p>}
        </div>
      </div>
      <div className="item-details-card">
        <p className="item-name">{marker.itemName}</p>
        <p className="item-category">{marker.itemCategory}</p>
        {marker.itemPrice != null && (
          <p className="item-price">
            {isDemandMode ? `Price: ${marker.currency || '₹'}${marker.itemPrice}/unit` : `Max: ${marker.currency || '₹'}${marker.itemPrice}/unit`}
          </p>
        )}
        {marker.quantity && (
          <p style={{ fontSize: 12, marginBottom: 0 }}>
            Qty: {marker.quantity} {marker.quantity_unit}
          </p>
        )}
      </div>
      <ScoreBreakdown breakdown={marker.score_breakdown} labels={marker.match_labels} />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
        <span
          style={{
            background:
              marker.match_score >= 0.7
                ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
                : marker.match_score >= 0.4
                ? 'linear-gradient(135deg, #f39c12, #e67e22)'
                : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {Math.round(marker.match_score * 100)}% match
        </span>
        <span style={{ background: 'rgba(35,100,170,0.1)', color: '#2364AA', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
          📏 {marker.distance_km} km
        </span>
        {marker.category_matched && (
          <span style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
            🏷️ Same Category
          </span>
        )}
      </div>
      {marker.item_description && (
        <p style={{ fontSize: 11, color: '#666', margin: '6px 0 6px', lineHeight: 1.4, fontStyle: 'italic', borderLeft: '2px solid #eee', paddingLeft: '8px' }}>
          {marker.item_description}
        </p>
      )}
      <button className="send-request-btn" onClick={() => onSendRequest(marker)}>
        Send Request
      </button>
    </div>
  );
}

export default function MarkerPopupContent({ marker, isMatchMode, isDemandMode, onSendRequest, fallbackComponent: Fallback }) {
  if (marker.isMyOrg) return <MyOrgPopup marker={marker} />;
  if (marker.isDealPartner) return <DealPartnerPopup marker={marker} />;
  if (marker.isOrigin) return <OriginPopup marker={marker} />;
  if (marker.isOrganisation) return <OrganisationPopup marker={marker} onSendRequest={onSendRequest} />;
  if (marker.isMatchResult && isMatchMode)
    return <MatchResultPopup marker={marker} isDemandMode={isDemandMode} onSendRequest={onSendRequest} />;
  return Fallback ? <Fallback data={marker} /> : null;
}
