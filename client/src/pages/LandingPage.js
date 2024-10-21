import React from 'react';
import Landingpage_comp1 from './Landingpage_comp1'; // Adjust path if necessary
import '../components/LandingPage.css'; // Import the updated CSS

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="row">
        <div className="landingpage-comp1">
          <Landingpage_comp1 />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
