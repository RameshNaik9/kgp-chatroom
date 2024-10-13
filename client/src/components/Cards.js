import React from 'react';

const Cards = () => {
    const recommendations = [
        "What career options do I have?",
        "How do I prepare for interviews?",
        "Can you help with resume building?",
        "Tell me more about the top companies."
    ];

    return (
        <div className="cards">
            {recommendations.map((question, index) => (
                <div key={index} className="card1">
                    <p>{question}</p>
                </div>
            ))}
        </div>
    );
};

export default Cards;
