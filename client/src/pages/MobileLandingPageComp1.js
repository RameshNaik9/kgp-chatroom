import React from 'react';
import MobileLandingPageComp2 from './MobileLandingPageComp2';
import './MobileLandingPageComp1.css'; // Import the CSS file

const MobileLandingPageComp1 = () => {
  return (
    <div className="mobile-container">
      <header className="mobile-header">
        <h1>
          Welcome to <span className="gold">KGpedia</span>
        </h1>
      </header>
      <main className="mobile-main">
        {/* Optional description */}
        {/* <p>Except for the texts at least</p> */}
        <MobileLandingPageComp2 />
      </main>
      {/* Optional footer */}
      {/* <footer className="mobile-footer">
        <p>Footer content here</p>
      </footer> */}
    </div>
  );
};

export default MobileLandingPageComp1;
