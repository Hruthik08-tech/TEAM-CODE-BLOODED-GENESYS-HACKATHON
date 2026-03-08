import React from 'react';

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255,255,255,0.8)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-sans)',
};

const spinnerStyle = (accentColor = '#2364AA') => ({
  width: 48,
  height: 48,
  border: '4px solid #e0e0e0',
  borderTop: `4px solid ${accentColor}`,
  borderRadius: '50%',
  animation: 'map-spin 0.8s linear infinite',
});

export default function MapLoadingOverlay({ message, accentColor = '#2364AA' }) {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle(accentColor)} />
      <p style={{ marginTop: 16, color: '#2c3e50', fontWeight: 600 }}>{message}</p>
      <style>{`@keyframes map-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
