import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Pagination } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import ExerciseCard from './ExerciseCard';

const Exercises = ({ exercises, bodyPart, setExercises, gifMap }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

  const safeExercises = Array.isArray(exercises) ? exercises : [];

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = safeExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const paginate = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        let exercisesData = [];

        if (bodyPart === 'all') {
          exercisesData = await fetchData(
            'https://exercisedb.p.rapidapi.com/exercises?limit=50',
            exerciseOptions
          );
        } else {
          exercisesData = await fetchData(
            `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=50`,
            exerciseOptions
          );
        }

        setExercises(Array.isArray(exercisesData) ? exercisesData : []);
      } catch (error) {
        console.error('Exercises error:', error);
      }
    };

    fetchExercisesData();
  }, [bodyPart, setExercises]);

  return (
    <Box id="exercises" p="20px">
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontWeight: 900,
        }}
      >
        RESULTS
      </Typography>

      <Stack
        direction="row"
        sx={{ gap: { lg: '110px', xs: '50px' } }}
        flexWrap="wrap"
        justifyContent="center"
      >
        {currentExercises.map((exercise, idx) => (
          <ExerciseCard
            key={exercise.id || idx}
            exercise={exercise}
            gifUrl={gifMap?.[exercise.id]}
          />
        ))}
      </Stack>

      {safeExercises.length > exercisesPerPage && (
        <Stack mt="100px" alignItems="center">
          <Pagination
            color="standard"
            shape="rounded"
            count={Math.ceil(safeExercises.length / exercisesPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
};

export default Exercises;