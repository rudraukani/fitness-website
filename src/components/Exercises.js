import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Pagination } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import ExerciseCard from './ExerciseCard';

const Exercises = ({ exercises, bodyPart, setExercises, gifMap, isSearching }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 24;

  const safeExercises = Array.isArray(exercises) ? exercises : [];
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = safeExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const paginate = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isSearching) return;
    let cancelled = false;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchExercisesData = async () => {
      try {

                let finalExercises = [];

        if (bodyPart === 'all') {
          const apiPageSize = 10; // cap for Basic plan
          const maxTotal = 40; // total cap
          const delayMs = 250;

          let offset = 0;
          let allExercises = [];
          let hasMore = true;

          while (hasMore && !cancelled && allExercises.length < maxTotal) {
            const batch = await fetchData(
              `https://exercisedb.p.rapidapi.com/exercises?limit=${apiPageSize}&offset=${offset}`,
              exerciseOptions
            );

            if (!Array.isArray(batch) || batch.length === 0) {
              hasMore = false;
              break;
            }

            const existingIds = new Set(allExercises.map((exercise) => String(exercise.id)));
            const uniqueBatch = batch.filter(
              (exercise) => !existingIds.has(String(exercise.id))
            );

            if (uniqueBatch.length === 0) {
              hasMore = false;
              break;
            }

            allExercises = allExercises.concat(uniqueBatch);

            if (batch.length < apiPageSize) {
              hasMore = false;
              break;
            }

            offset += apiPageSize;

            await sleep(delayMs);
          }

          finalExercises = allExercises.slice(0, maxTotal);
        } else {
          const bodyPartExercises = await fetchData(
            `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(bodyPart)}`,
            exerciseOptions
          );

          finalExercises = Array.isArray(bodyPartExercises) ? bodyPartExercises : [];
        }

        if (!cancelled) {
          setExercises(finalExercises);
          setCurrentPage(1);
        }

        /*
        const apiPageSize = 10; // cap for Basic plan
        const maxTotal = 40; // total cap
        const delayMs = 250;

        let offset = 0;
        let allExercises = [];
        let hasMore = true;

        while (hasMore && !cancelled && allExercises.length < maxTotal) {
          const url =
            bodyPart === 'all'
              ? `https://exercisedb.p.rapidapi.com/exercises?limit=${apiPageSize}&offset=${offset}`
              : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
                  bodyPart
                )}?limit=${apiPageSize}&offset=${offset}`;

          const batch = await fetchData(url, exerciseOptions); 
          

          if (!Array.isArray(batch) || batch.length === 0) {
            hasMore = false;
            break;
          }

          const existingIds = new Set(allExercises.map((exercise) => String(exercise.id)));
          const uniqueBatch = batch.filter(
            (exercise) => !existingIds.has(String(exercise.id))
          );

          if (uniqueBatch.length === 0) {
            hasMore = false;
            break;
          }

          allExercises = allExercises.concat(uniqueBatch);

          if (batch.length < apiPageSize) {
            hasMore = false;
            break;
          }

          offset += apiPageSize;

          await sleep(delayMs);
        }

        // trim to maxTotal just in case we slightly overshoot
        const finalExercises = allExercises.slice(0, maxTotal);

        if (!cancelled) {
          setExercises(finalExercises);
          setCurrentPage(1);
        } */
      } catch (error) {
        console.error('Exercises error:', error);
        if (!cancelled) setExercises([]);
      }
    };

    fetchExercisesData();

    return () => {
      cancelled = true;
    };
  }, [bodyPart, isSearching, setExercises]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [exercises]);

  return (
    <Box id="exercises" p="20px">
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontWeight: 900,
          paddingBottom: '1em',
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
            gifUrl={gifMap?.[exercise.name?.toLowerCase?.().trim()]}
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
