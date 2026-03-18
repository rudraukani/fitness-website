import "./Home.css";
import HomePageImage from '../assets/images/main-fitness-img.jpg';

/*
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import Exercises from '../components/Exercises';
import SearchExercises from '../components/SearchExercises';
import { fetchGifMap } from '../utils/fetchGifs';
*/


const Home = () => {
  // const [exercises, setExercises] = useState([]);
  // const [bodyPart, setBodyPart] = useState('all');
  // const [gifMap, setGifMap] = useState({});

  // useEffect(() => {
  //   const loadGifs = async () => {
  //     const gifs = await fetchGifMap();
  //     setGifMap(gifs);
  //   };

  //   loadGifs();
  // }, []);

  return (
    <div className="fullpage-div">
            {/* <div className="navbar-div"></div> */}
            <div className="top-div">
                <div className="words-div">
                    <span className="title">
                      <h1><span className="big-letter">F</span>IT<span className="big-letter">S</span>COUT</h1>
                      <h2 className>FITNESS MADE SIMPLE</h2>
                    </span>
                    <span className="descrip">
                      <p>Your fitness journey should be exciting, not imtimidating.</p>
                      <p>We make exercises easy to find, understand and follow.</p>
                      <p>Everyone deserves to feel confident in the gym!</p>
                    </span>
                </div>
                <div className="main-img-div">
                    <img src={HomePageImage} alt="Fitness" className="main-page-img"/>
                </div>
            </div>
            <div class="bottom-div">
                <h3>LEARN MORE</h3>
                <h3>⌄</h3>
            </div>
        </div>
    /*
    <Box>
      <HeroBanner />
      <SearchExercises
        setExercises={setExercises}
        bodyPart={bodyPart}
        setBodyPart={setBodyPart}
      />
      <Exercises
        setExercises={setExercises}
        exercises={exercises}
        bodyPart={bodyPart}
        gifMap={gifMap}
      />
    </Box> 
    */
  );
};

export default Home;