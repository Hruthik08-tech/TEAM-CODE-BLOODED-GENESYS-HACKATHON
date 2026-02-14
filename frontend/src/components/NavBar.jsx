import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import NotificationBell from './Notifications/NotificationBell.jsx';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('organization');
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/map')) setActiveItem('discover');
        else if (path.startsWith('/organisation')) setActiveItem('organization');
        else if (path.startsWith('/supply') || path.startsWith('/demand')) setActiveItem('market');
        else if (path.startsWith('/dashboard')) setActiveItem('dashboard');
        else if (path.startsWith('/match-results')) setActiveItem('match-results');
        else if (path.startsWith('/requests') || path.startsWith('/rooms') || path.startsWith('/business-room') || path.startsWith('/deals')) setActiveItem('manage');
        else setActiveItem('');
        
        // Close dropdown on navigation
        setOpenDropdown(null);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', color: '#6A0572', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        )},
        { id: 'organization', label: 'Organization', path: '/organisation', color: '#73BFB8', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        )},
        { id: 'discover', label: 'Discover', path: '/map', color: '#3DA5D9', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        )},
        { 
            id: 'market', 
            label: 'Market', 
            color: '#2364AA', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            ),
            children: [
                { id: 'supply', label: 'Supplies', path: '/supply' },
                { id: 'demand', label: 'Demands', path: '/demand' }
            ]
        },
        { id: 'match-results', label: 'Matches', path: '/match-results', color: '#AB83A1', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        )},
        { 
            id: 'manage', 
            label: 'Manage', 
            color: '#EA7317', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
            ),
            children: [
                { id: 'requests', label: 'Requests', path: '/requests' },
                { id: 'rooms', label: 'Rooms', path: '/rooms' },
                { id: 'deals', label: 'Deals', path: '/deals' }
            ]
        },
    ];

    const handleItemClick = (item) => {
        if (item.children) {
            setOpenDropdown(openDropdown === item.id ? null : item.id);
        } else {
            setActiveItem(item.id);
            navigate(item.path);
            setOpenDropdown(null);
        }
    };

    const handleChildClick = (e, path) => {
        e.stopPropagation();
        navigate(path);
        setOpenDropdown(null);
    };

    return (
        <nav className="custom-navbar-container">
            <div className="navbar-pill-box" ref={dropdownRef}>
                {navItems.map((item) => (
                    <div key={item.id} className="nav-item-wrapper" style={{ position: 'relative' }}>
                        <button 
                            className={`nav-item-pill ${activeItem === item.id ? 'active' : ''}`}
                            onClick={() => handleItemClick(item)}
                            style={{ 
                                '--item-color': item.color,
                                '--item-bg': `${item.color}20`
                            }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {item.children && (
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className={`dropdown-chevron ${openDropdown === item.id ? 'open' : ''}`}
                                    style={{ marginLeft: '4px', transition: 'transform 0.3s' }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            )}
                        </button>

                        {item.children && openDropdown === item.id && (
                            <div className="navbar-dropdown-menu">
                                {item.children.map((child) => (
                                    <button
                                        key={child.id}
                                        className="navbar-dropdown-item"
                                        onClick={(e) => handleChildClick(e, child.path)}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="navbar-extras">
                <NotificationBell />
            </div>
        </nav>
    );
};

export default NavBar;
