import React from 'react';
import LandingpageComp1 from './LandingpageComp1';
import '../components/LandingPage.css'
// import MobileLandingPageComp1 from './MobileLandingPageComp1';
// import useWindowDimensions from '../hooks/useWindowDimensions'; // Custom hook
// import { isMobile } from 'react-device-detect';

const LandingPage = () => {
  // const { width } = useWindowDimensions();

  // Define breakpoint for mobile devices (e.g., 768px)
  // const isMobile = width <= 768;

  return (
    <div className="landing-page-container">
      <div className="row">
        <div className="landingpage-comp1">
          <LandingpageComp1 />
          {/* {isMobile ? <MobileLandingPageComp1 /> : <LandingpageComp1 />} */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
