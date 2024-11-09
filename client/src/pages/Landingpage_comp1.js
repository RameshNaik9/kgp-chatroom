import React, { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import '../components/Landingpage_comp1.css'; // Shooting stars and styles for this component
import Landingpage_comp2 from './Landingpage_comp2'; // Import the second component
import '../components/Landingpage_comp2.css';
import abhiramaImage from '../media/abhirama.jpeg';
import rameshImage from '../media/ramesh.JPG';
import koushikImage from '../media/koushik.JPG';
import chanduImage from '../media/chandu.jpeg';
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
            Welcome to <span className="gold">KGPedia</span> 
          </h1>
          <p
            className="disappear"
            data-scroll
            data-scroll-class="appear"
            data-scroll-repeat="true"
          >
            An Open Source Initiative to organise IITKGP's information
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
    imgSrc: abhiramaImage,
    name: 'Abhirama',
    title: 'AI Engineer',
    scrollDirection: 'horizontal',
    scrollSpeed: '4'
  },
  {  imgSrc: rameshImage,
    name: 'Ramesh',
    title: 'Backend & AI Engineer',
    scrollDirection: 'horizontal',
    scrollSpeed: '-3'
  },
  {
    imgSrc: chanduImage,
    name: 'Chandu',
    title: 'Full Stack Developer',
    scrollDirection: 'horizontal',
    scrollSpeed: '4'
  },
  {
    imgSrc: koushikImage,
    name: 'Koushik',
    title: 'Data Analyst',
    scrollDirection: 'horizontal',
    scrollSpeed: '-3'
  }
  // {
  //   imgSrc: 'https://images.unsplash.com/photo-1571442463800-1337d7af9d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
  //   name: 'Joyce Jenkins',
  //   title: 'Brand Designer',
  //   scrollDirection: 'horizontal',
  //   scrollSpeed: '3'
  // },
  // {
  //   imgSrc: 'https://images.unsplash.com/photo-1506956191951-7a88da4435e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
  //   name: 'Riyah Juhn',
  //   title: 'Fullstack Developer',
  //   scrollDirection: 'horizontal',
  //   scrollSpeed: '-3'
  // },
  
];

export default Landingpage_comp1;
