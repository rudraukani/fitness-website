import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { colors } from "./colors";
import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart, setIsSearching }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const bodyPartsData = await fetchData(
          'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
          exerciseOptions
        );

        setBodyParts(['all', ...bodyPartsData]);
      } catch (error) {
        console.error('BodyParts error:', error);
      }
    };

    fetchExerciseData();
  }, []);

  useEffect(() => {
    setIsSearching(false);
  }, [bodyPart]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const query = search.trim().toLowerCase();

    const scoreExercise = (exerciseName, q) => {
      const name = (exerciseName || '').toLowerCase().trim();
      if (!name) return 0;

      if (name === q) return 100;
      if (name.startsWith(q)) return 90;
      if (name.includes(q)) return 75;

      const qWords = q.split(/\s+/).filter(Boolean);
      let score = 0;

      qWords.forEach((word) => {
        if (name === word) score += 30;
        else if (name.startsWith(word)) score += 20;
        else if (name.includes(word)) score += 10;
      });

      return score;
    };

    try {
      let exercisesData = [];

      try {
        const nameResults = await fetchData(
          `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(search.trim())}`,
          exerciseOptions
        );

        if (Array.isArray(nameResults) && nameResults.length > 0) {
          exercisesData = nameResults;
        }
      } catch (error) {
        console.log('Name endpoint failed, falling back to paginated search...');
      }

      if (exercisesData.length === 0) {
        const apiPageSize = 10;
        const maxTotal = 100;
        let offset = 0;
        let allExercises = [];
        let hasMore = true;

        while (hasMore && allExercises.length < maxTotal) {
          const batch = await fetchData(
            `https://exercisedb.p.rapidapi.com/exercises?limit=${apiPageSize}&offset=${offset}`,
            exerciseOptions
          );

          if (!Array.isArray(batch) || batch.length === 0) {
            hasMore = false;
            break;
          }

          allExercises = allExercises.concat(batch);

          if (batch.length < apiPageSize) {
            hasMore = false;
            break;
          }

          offset += apiPageSize;
          await sleep(200);
        }

        exercisesData = allExercises;
      }

      const searchedExercises = exercisesData
        .map((item) => ({
          ...item,
          _score: scoreExercise(item.name, query),
        }))
        .filter((item) => item._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, 8);
      
      setIsSearching(true);
      setExercises(searchedExercises);
      setSearch('');
    } catch (error) {
      console.error('Search error:', error);
      setExercises([]);
    }
  };

  return (
    <Stack alignItems="center" mt="0.5rem" justifyContent="center" p="20px">
      <Box
        position="relative"
        mb="72px"
        sx={{ width: '70vw', minWidth: '300px' }}
      >
        <TextField
          sx={{
            width: '80%',
            backgroundColor: '#d9d9d9',
            borderRadius: '20px',
            '& .MuiInputBase-root': {
              height: '3.5rem',
              borderRadius: '20px',
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Exercise Name"
          type="text"
        />

        <Button
          variant="contained"
          sx={{
            fontFamily: "'IBM PLEX SANS', sans-serif",
            fontWeight: 600,
            bgcolor: colors.bkg,
            color: colors.main,
            borderRadius: '20px',
            width: '12%',
            height: '3.5rem',
            position: 'absolute',
            ml: '1rem',
          }}
          onClick={handleSearch}
        >
          SEARCH
        </Button>
      </Box>

      <Box sx={{ width: '100%', p: '20px' }}>
        <HorizontalScrollbar
          data={bodyParts}
          bodyParts
          setBodyPart={setBodyPart}
          bodyPart={bodyPart}
        />
      </Box>
    </Stack>
  );
};

export default SearchExercises;
