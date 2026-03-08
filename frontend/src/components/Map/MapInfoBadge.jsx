import React from 'react';

const badgeBaseStyle = {
  position: 'absolute',
  top: 80,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
  padding: '10px 24px',
  borderRadius: 30,
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
};

export function MatchInfoBadge({ totalResults, searchRadiusKm, orgCount, cached, cacheExpiresMinutes }) {
  return (
    <div style={{ ...badgeBaseStyle, border: '1px solid rgba(35,100,170,0.15)' }}>
      <span
        style={{
          background: 'linear-gradient(135deg, #2364AA, #1a4f8a)',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {totalResults} matches
      </span>
      <span style={{ fontSize: 13, color: '#2c3e50', fontWeight: 500 }}>
        within <strong>{searchRadiusKm} km</strong>
      </span>
      {orgCount > 0 && (
        <span
          style={{
            background: 'linear-gradient(135deg, #EA7317, #d66410)',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          🏢 {orgCount} orgs
        </span>
      )}
      {cached && (
        <span
          style={{
            background: 'linear-gradient(135deg, #73BFB8, #5ba8a1)',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          ⚡ Cached ({cacheExpiresMinutes}m left)
        </span>
      )}
    </div>
  );
}

export function DealNetworkBadge({ partnerCount }) {
  return (
    <div style={{ ...badgeBaseStyle, border: '1px solid rgba(245,158,11,0.25)', gap: 12 }}>
      <span
        style={{
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        🌐 Your Network
      </span>
      <span style={{ fontSize: 13, color: '#2c3e50', fontWeight: 500 }}>
        <strong>{partnerCount}</strong> deal partner{partnerCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
