import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import ExerciseCard from './ExerciseCard';
import Loader from './Loader';
import HorizontalScrollbar from './HorizontalScrollbar';
import { fetchData, exerciseOptions } from '../utils/fetchData';

const SimilarExercises = ({ targetMuscle, equipment }) => {
  const [targetExercises, setTargetExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);

  useEffect(() => {
    const fetchSimilarExercises = async () => {
      try {
        if (!targetMuscle || !equipment) return;

        const targetUrl = `https://exercisedb.p.rapidapi.com/exercises/target/${targetMuscle}`;
        const equipmentUrl = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`;

        const [targetData, equipmentData] = await Promise.all([
          fetchData(targetUrl, exerciseOptions),
          fetchData(equipmentUrl, exerciseOptions),
        ]);

        setTargetExercises(Array.isArray(targetData) ? targetData : []);
        setEquipmentExercises(Array.isArray(equipmentData) ? equipmentData : []);
      } catch (error) {
        console.error('Similar exercises error:', error);
        setTargetExercises([]);
        setEquipmentExercises([]);
      }
    };

    fetchSimilarExercises();
  }, [targetMuscle, equipment]);

  return (
    <Box sx={{ mt: { lg: '100px', xs: '0px' } }}>
      <Typography sx={{ fontSize: { lg: '44px', xs: '25px' }, ml: '20px' }} fontWeight={700} color="#000">
        Exercises that target the same muscle group
      </Typography>

      <Stack direction="row" sx={{ p: 2, position: 'relative' }}>
        {targetExercises.length ? (
          <HorizontalScrollbar data={targetExercises} />
        ) : (
          <Loader />
        )}
      </Stack>

      <Typography sx={{ fontSize: { lg: '44px', xs: '25px' }, ml: '20px', mt: '40px' }} fontWeight={700} color="#000">
        Exercises that use the same equipment
      </Typography>

      <Stack direction="row" sx={{ p: 2, position: 'relative' }}>
        {equipmentExercises.length ? (
          <HorizontalScrollbar data={equipmentExercises} />
        ) : (
          <Loader />
        )}
      </Stack>
    </Box>
  );
};

export default SimilarExercises;
