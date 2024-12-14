import React from 'react';
import { Link } from 'react-router-dom';
import './HomeComponent.css';


const HomeComponent = () => {
  const img1 = '/media/Academics.svg';
  const img2 = '/media/ramesh.JPG';
  const img3 = '/media/Gymkhana.svg';
  const img4 = '/media/placements.jpeg';


  return (
    <div className="containerk">
      <main>
        <article style={{ "--index": 0 }}>
          <div className="article__img">
            <img src={img1} alt="Academics" style={{borderRadius:'0px'}} />
          </div>
          <div className="article__info">
            <h2 className="smoke">Engage in lively discussions with your peers</h2>
            <Link to="/group-chat">
              <button className="glow-on-hover">Kgp Chatroom</button>
            </Link>
          </div>
        </article>

        <article style={{ "--index": 1 }}>
          <div className="article__img">
            <img src={img2} alt="Career" style={{borderRadius:'0px'}} />
          </div>
          <div className="article__info">
            <h2 className="smoke">Get guidance on career planning and job searches</h2>
            <Link to="/career-assistant">
              <button className="glow-on-hover" type="button">Career Assistant</button>
            </Link>
          </div>
        </article>

        <article style={{ "--index": 2 }}>
          <div className="article__img">
            <img src={img3} alt="Gymkhana" style={{borderRadius:'0px'}} />
          </div>
          <div className="article__info">
            <h2 className="smoke">Find resources and help for your academic queries</h2>
            <Link to="/acads-assistant">
              <button className="glow-on-hover">Acads Assistant</button>
            </Link>
          </div>
        </article>

        <article style={{ "--index": 3 }}>
          <div className="article__img">
            <img src={img4} alt="Placements" style={{borderRadius:'0px'}} />
          </div>
          <div className="article__info">
            <h2 className="smoke">Assistance with general inquiries and more...</h2>
            <Link to="/general-assistant">
              <button className="glow-on-hover">General Assistant</button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default HomeComponent;
