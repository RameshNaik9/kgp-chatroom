import React from 'react';
import './AdditionalComponent.css';
import OnlineUsersComponent from './OnlineUsersComponent';
import './DummyComponent.css'; 

const AdditionalComponent = ({ profileData, onCloseProfileCard }) => { 
    return (
        <div className="additional-component">
            <OnlineUsersComponent />
            <div className="dummy-component">Dummy Component 1</div>
            <div className="dummy-component">Dummy Component 2</div>

            {profileData && ( 
                <div className="others-profile-card">
                    <span 
                        className="close-btn" 
                        onClick={onCloseProfileCard}
                    >
                        &times;
                    </span>
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
