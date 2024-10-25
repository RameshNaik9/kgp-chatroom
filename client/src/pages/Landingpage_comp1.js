import React, { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import '../components/Landingpage_comp1.css'; // Shooting stars and styles for this component
import Landingpage_comp2 from './Landingpage_comp2'; // Import the second component
import '../components/Landingpage_comp2.css';

const Landingpage_comp1 = () => {

  useEffect(() => {
    const scroller = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
    });

    return () => {
      scroller.destroy();
    };
  }, []);

  // Create multiple shooting stars
  const shootingStars = Array(20).fill(0).map((_, i) => (
    <div key={i} className="shooting_star"></div>
  ));

  return (
    <div className="container-box"data-scroll-container>
      <section className="top" data-scroll-section id="pin2">
        {/* Shooting stars container */}
        <div className="night">
          {shootingStars}
        <div className="top-description">
          <h1 data-scroll data-scroll-speed="3">
            Welcome to <span className="gold">IIT KGP</span> Chatroom!
          </h1>
          <p
            className="disappear"
            data-scroll
            data-scroll-class="appear"
            data-scroll-repeat="true"
          >
            except for the texts at least
          </p>
          <svg width="449" height="157" viewBox="0 0 549 157" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.55568 33.819C105.754 212.873 467.187 -29.5023 542.273 101.507"
              stroke="#FDC65D"
              strokeWidth="5"
            />
          </svg>
        </div>
        </div>
      </section>

      <section className="bottom" id="pin" data-scroll-section>
        <div className="container">
          <div className="sign-in">
            <Landingpage_comp2 />
          </div>

          <div className="hires">
            {applicantData.map((applicant) => (
              <Applicant
                key={applicant.name}
                imgSrc={applicant.imgSrc}
                name={applicant.name}
                title={applicant.title}
                scrollDirection={applicant.scrollDirection}
                scrollSpeed={applicant.scrollSpeed}
              />
            ))}
          </div>
        </div>
      </section>
    
    </div>
  );
};

const Applicant = ({ imgSrc, name, title, scrollDirection, scrollSpeed }) => {
  return (
    <div
      className="applicant"
      data-scroll
      data-scroll-direction={scrollDirection}
      data-scroll-speed={scrollSpeed}
    >
      <div className="image-holder">
        <img src={imgSrc} alt={name} />
      </div>
      <h3 className="applicant-name">{name}</h3>
      <p className="job-title">{title}</p>
    </div>
  );
};

// Data for applicants
const applicantData = [
  {
    imgSrc: 'https://images.unsplash.com/photo-1485921040253-3601b55d50aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80',
    name: 'Nelson Michael',
    title: 'Front-end Developer',
    scrollDirection: 'horizontal',
    scrollSpeed: '3'
  },
  {
    imgSrc: 'https://images.unsplash.com/photo-1554780336-390462301acf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    name: 'Cynthia Rice',
    title: 'Product Designer',
    scrollDirection: 'horizontal',
    scrollSpeed: '-3'
  },
  {
    imgSrc: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    name: 'Ahmed Tijani',
    title: 'Flutter Developer',
    scrollDirection: 'horizontal',
    scrollSpeed: '3'
  },
  {
    imgSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    name: 'Mary Duncan',
    title: 'UI Designer',
    scrollDirection: 'horizontal',
    scrollSpeed: '-3'
  },
  {
    imgSrc: 'https://images.unsplash.com/photo-1571442463800-1337d7af9d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
    name: 'Joyce Jenkins',
    title: 'Brand Designer',
    scrollDirection: 'horizontal',
    scrollSpeed: '3'
  },
  {
    imgSrc: 'https://images.unsplash.com/photo-1506956191951-7a88da4435e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
    name: 'Riyah Juhn',
    title: 'Fullstack Developer',
    scrollDirection: 'horizontal',
    scrollSpeed: '-3'
  },
  
];

export default Landingpage_comp1;
