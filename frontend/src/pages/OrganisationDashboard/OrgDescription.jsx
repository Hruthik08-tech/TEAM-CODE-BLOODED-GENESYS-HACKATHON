import React from 'react';

const OrgDescription = ({ user }) => {
    return (
        <div className="description-container">
            <h3 className="section-title">Description:</h3>
            <div className="description-content-box">
                {user?.description || 'No description provided. Update your organisation profile to add a description.'}
            </div>
        </div>
    );
};

export default OrgDescription;
