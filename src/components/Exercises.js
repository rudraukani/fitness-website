import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Pagination } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import ExerciseCard from './ExerciseCard';

const Exercises = ({ exercises, bodyPart, setExercises, gifMap }) => {
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
    let cancelled = false;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchExercisesData = async () => {
      try {
        const apiPageSize = 10; // cap for Basic plan
        const maxTotal = 40; // total cap
        const delayMs = 250;

        let skip = 0;
        let allExercises = [];
        let hasMore = true;

        while (hasMore && !cancelled && allExercises.length < maxTotal) {
          const url =
            bodyPart === 'all'
              ? `https://exercisedb.p.rapidapi.com/exercises?limit=${apiPageSize}&skip=${skip}`
              : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
                  bodyPart
                )}?limit=${apiPageSize}&skip=${skip}`;

          const batch = await fetchData(url, exerciseOptions);

          if (!Array.isArray(batch) || batch.length === 0) {
            hasMore = false;
            break;
          }

          allExercises = allExercises.concat(batch);

          if (batch.length < apiPageSize) {
            hasMore = false;
            break;
          }

          skip += apiPageSize;

          await sleep(delayMs);
        }

        // Trim to maxTotal just in case we slightly overshoot
        const finalExercises = allExercises.slice(0, maxTotal);

        if (!cancelled) {
          setExercises(finalExercises);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Exercises error:', error);
        if (!cancelled) setExercises([]);
      }
    };

    fetchExercisesData();

    return () => {
      cancelled = true;
    };
  }, [bodyPart, setExercises]);

  /* 
  useEffect(() => {
  let cancelled = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  
  const fetchExercisesData = async () => {
    try {
      const pageSize = 10; // basic plan cap per response
      const delayMs = 250; // delay between calls 
      let skip = 0;
      let allExercises = [];
      let hasMore = true;

      while (hasMore && !cancelled) {
        const url =
          bodyPart === 'all'
            ? `https://exercisedb.p.rapidapi.com/exercises?limit=${pageSize}&skip=${skip}`
            : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
                bodyPart
              )}?limit=${pageSize}&skip=${skip}`;

        const batch = await fetchData(url, exerciseOptions);

        if (!Array.isArray(batch) || batch.length === 0) {
          hasMore = false;
          break;
        }

        allExercises = allExercises.concat(batch);

        // If fewer than pageSize came back, we've reached the end
        if (batch.length < pageSize) {
          hasMore = false;
          break;
        }

        skip += pageSize;

        // small delay helps avoid bursty traffic / 429s
        await sleep(delayMs);
      }

      if (!cancelled) {
        setExercises(allExercises);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Exercises error:', error);
      if (!cancelled) setExercises([]);
    }
    };

    fetchExercisesData();

    return () => {
      cancelled = true;
    };
    }, [bodyPart, setExercises]);
  */

/*
  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const pageSize = 25;      // current API max
        const targetCount = 50;   // keep your overall cap at 50
        const requests = [];

        for (let skip = 0; skip < targetCount; skip += pageSize) {
          const url =
            bodyPart === 'all'
              ? `https://exercisedb.p.rapidapi.com/exercises?limit=${pageSize}&skip=${skip}`
              : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
                  bodyPart
                )}?limit=${pageSize}&skip=${skip}`;

          requests.push(fetchData(url, exerciseOptions));
        }

        const results = await Promise.all(requests);
        const merged = results.flat();

        setExercises(Array.isArray(merged) ? merged.slice(0, targetCount) : []);
        setCurrentPage(1);
      } catch (error) {
        console.error('Exercises error:', error);
        setExercises([]);
      }
    };

    fetchExercisesData();
  }, [bodyPart, setExercises]);
*/

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
            // gifUrl={gifMap?.[exercise.id]}
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