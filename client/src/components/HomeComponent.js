import React from 'react';
import './HomeComponent.css';
import img1 from '../media/Academics.svg';
import img2 from '../media/Career.svg';
import img3 from '../media/Gymkhana.svg';
import img4 from '../media/placements.jpeg';
const HomeComponent = () => {
  return (
    <div className="containerk">
      <main>
        <article style={{ "--index": 0 }}>
          <div className="article__img">
            <img src={img1} alt="" style={{borderRadius:'0px'}}/>
          </div>
          <div className="article__info">
            <h2>CSS Scroll Animations</h2>
            <p>Check out this rad demo</p>
            <a href="#">Follow</a>
          </div>
        </article>

        <article style={{ "--index": 1 }}>
          <div className="article__img">
            <img src={img2} alt="" style={{borderRadius:'0px'}}/>
          </div>
          <div className="article__info">
            <h2>Animate on scroll</h2>
            <p>Works with media queries too</p>
            <a href="#">Check it out</a>
          </div>
        </article>

        <article style={{ "--index": 2 }}>
          <div className="article__img">
            <img src={img3} alt="" style={{borderRadius:'0px'}}/>
          </div>
          <div className="article__info">
            <h2>Parallax Effects</h2>
            <p>Tweak your timings</p>
            <a href="#">Get Styling</a>
          </div>
        </article>

        <article style={{ "--index": 3 }}>
          <div className="article__img">
            <img src={img4} alt="" style={{borderRadius:'0px'}} />
          </div>
          <div className="article__info">
            <h2>Drive Keyframes</h2>
            <p>CSS alone and...</p>
            <a href="#">No JavaScript</a>
          </div>
        </article>
      </main>
    </div>
  );
};

export default HomeComponent;
