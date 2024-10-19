import React from 'react';
import OnlineUsersComponent from './OnlineUsersComponent';
import './AdditionalComponent.css';  // Import CSS file
import './DummyComponent.css';  // Import CSS file



const AdditionalComponent = () => {
    return (
        <div className="additional-component">
            <OnlineUsersComponent />
            <div className="dummy-component">Dummy Component 1</div>
            <div className="dummy-component">Dummy Component 2</div>
        </div>
    );
};

export default AdditionalComponent;
