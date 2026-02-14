
import React from 'react';
import './AppLayout.css';
import NavBar from '../NavBar.jsx';

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <NavBar />
            
            {/* Main content area */}
            <main className="app-main-content">
                <div className="main-content-body">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
