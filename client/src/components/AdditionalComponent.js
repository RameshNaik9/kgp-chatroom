import React from 'react';
import './AdditionalComponent.css';
import OnlineUsersComponent from './OnlineUsersComponent';
import './AdditionalComponent.css';  // Import CSS file
import './DummyComponent.css';  // Import CSS file

const AdditionalComponent = ({ profileData }) => {
    return (
        <div className="additional-component">
            <OnlineUsersComponent />
            <div className="dummy-component">Dummy Component 1</div>
            <div className="dummy-component">Dummy Component 2</div>

            {profileData && (  // Conditionally render the profile card
                <div className="others-profile-card">
                    <h5>{profileData.fullName}</h5>
                    <p>{profileData.email}</p>
                    <p>{profileData.rollNumber}</p>
                    <p>{profileData.department} Department</p>
                    <p><strong>Verified:</strong> {profileData.isVerified ? 'Yes' : 'No'}</p>
                    
                </div>
            )}
        </div>
    );
};

export default AdditionalComponent;
