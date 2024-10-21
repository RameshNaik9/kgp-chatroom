import React from 'react';

const Greeting = () => {
    const fullName = localStorage.getItem('fullName'); // Retrieve fullName from localStorage

    const getTimeOfDay = () => {
        const hours = new Date().getHours();
        if (hours < 12) return 'Good morning';
        if (hours < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="greeting fst-italic" >
            <h2>{`${getTimeOfDay()}! ${fullName}`}</h2>
        </div>
    );
};

export default Greeting;
