import React from 'react';

const bannerStyle = {
  position: 'absolute',
  top: 80,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  background: '#fff3f3',
  border: '1px solid #e74c3c',
  padding: '12px 24px',
  borderRadius: 12,
  fontFamily: 'var(--font-sans)',
  color: '#c0392b',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export default function MapErrorBanner({ message }) {
  if (!message) return null;
  return <div style={bannerStyle}>⚠️ {message}</div>;
}
