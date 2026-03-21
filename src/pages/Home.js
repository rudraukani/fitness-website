import "./Home.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
/*
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import Exercises from '../components/Exercises';
import SearchExercises from '../components/SearchExercises';
import { fetchGifMap } from '../utils/fetchGifs';
*/


const Home = () => {
  return (
    <div className="fullpage-div">

      <div className="bg-img"></div>

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
        <div className="fade-div"></div>
        <div className="explore-div">
          <button className="btn1">EXPLORE EXERCISES - IT'S FREE! <ChevronRightIcon /></button>
        </div>
      </div>

      <div className="scroll-content">
        <div className="blank-div"></div>
        <div className="learnmore-div">
          <button className="btn2">SCROLL TO LEARN MORE <KeyboardArrowDownIcon /></button>
        </div>

        <div className="features-div"></div>
      </div>
    </div>
  );
};

export default Home;