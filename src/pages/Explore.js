import "./Explore.css";
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Exercises from '../components/Exercises';
import SearchExercises from '../components/SearchExercises';
import { fetchGifMap } from '../utils/fetchGifs';

function Explore() {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');
  
  return (
    <div className="fullpage-div">
      <div className="title-div">
        <h1 className="title">EXPLORE EXERCISES</h1>
      </div>
      <div className="searchbar-div">
        <SearchExercises
          setExercises={setExercises}
          bodyPart={bodyPart}
          setBodyPart={setBodyPart}
        />
      </div>
      <div className="filters-div"></div>
      <div className="results-div"></div>
    </div>
  );
}

export default Explore;

/*
function Explore (){
    const [exercises, setExercises] = useState([]);
      const [bodyPart, setBodyPart] = useState('all');
      const [gifMap, setGifMap] = useState({});
      useEffect(() => {
        const loadGifs = async () => {
          const gifs = await fetchGifMap();
          setGifMap(gifs);
        };
        loadGifs();
      }, []);

    return (
    <Box>
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
    )
};

export default Explore;
*/
