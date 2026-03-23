import React from 'react';
import { useNavigate} from 'react-router-dom';
import './Home.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Home = () => {
  const navigate = useNavigate();

  const goToExplorePage = () => {
    navigate('/explore');
  };

  return (
    <div className="fullpage-div">

      <div className="bg-img" />

      <div className="pinned-items">
        {/* navbar goes here, takes 20%vh, is brought in from App.js */}
        <div className="title-div">
          <h1>
            <span className="big-letter">F</span>
            <span className="normal-letter">IT</span>
            <span className="big-letter">S</span>
            <span className="normal-letter">COUT</span>
          </h1>
          <h2>FITNESS MADE SIMPLE</h2>
        </div>
        <div className="explore-div">
          <button type="button" className="btn1" onClick={goToExplorePage}>EXPLORE EXERCISES - IT'S FREE! <ChevronRightIcon /></button>
        </div>
      </div>

      <div className="scroll-content">
        <div className="blank-div" />
        <div className="learnmore-div">
          <button type="button" className="btn2">SCROLL TO LEARN MORE <KeyboardArrowDownIcon /></button>
        </div>
        <div className="blank-div2"/>
        <div className="features-div">

          <div className="general-descrip-div">
            <p className="hook">YOUR FITNESS JOURNEY SHOULD BE EXCITING, NOT INTIMIDATING.</p>
            <p className="hook">WE MAKE EXERCISES EASY TO FIND, UNDERSTAND & FOLLOW.</p>
            <p className="hook">EVERYONE DESERVES TO FEEL CONFIDENT IN THE GYM!</p>
          </div>

          <div className="descip-div">
            <div className="subtitle"><p>EXPLORE OUR EXERCISE LIBRARY!</p></div>
            <div className="descrip">
              <ul>
                <li>Quickly find exercises by name</li>
                <li>Discover new exercises</li>
                <li>Filter exercises by muscle targets</li>
                <li>Access detailed exercise info, including form guidance</li>
              </ul>
            </div>
          </div>

          <div className="descip-div">
            <div className="subtitle"><p>CREATE A FREE ACCOUNT!</p></div>
            <div className="descrip">
              <ul>
                <li>Save exercises for later reference</li>
                <li>Create and save your own workout routines</li>
                <li>Easily log workout info</li>
                <li>Stay motivated through personal progress graphs</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
