import './Explore.css';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Exercises from '../components/Exercises';
import SearchExercises from '../components/SearchExercises';
import { fetchGifMap } from '../utils/fetchGifs';

function Explore() {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');
  const [gifMap, setGifMap] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadGifs = async () => {
      const gifs = await fetchGifMap();
      console.log('gifs returned from fetchGifMap', gifs);
      setGifMap(gifs);
    };

    loadGifs();
  }, []);

  useEffect(() => {
    console.log('gifMap state changed', gifMap);
    console.log('gifMap keys', Object.keys(gifMap));
  }, [gifMap]);

  return (
    <div className="fullpage-div">

      <div className="explore-bg-img"></div>

      <div className="explore-title-div">
        <h1 className="title">EXPLORE EXERCISES</h1>
      </div>
      
      <div className="searchbar-filters-div">
        <SearchExercises
          setExercises={setExercises}
          bodyPart={bodyPart}
          setBodyPart={setBodyPart}
          setIsSearching={setIsSearching}
        />
      </div>
      <div className="results-div">
        <Exercises
        setExercises={setExercises}
        exercises={exercises}
        bodyPart={bodyPart}
        gifMap={gifMap}
        isSearching={isSearching}
      />
      </div>
    </div>
  );
}

export default Explore;
