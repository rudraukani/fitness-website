import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [loadingBodyParts, setLoadingBodyParts] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingBodyParts(true);
      setError('');

      try {
        const [bodyPartsData, exercisesData] = await Promise.all([
          fetchData(
            'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
            exerciseOptions
          ),
          fetchData(
            'https://exercisedb.p.rapidapi.com/exercises',
            exerciseOptions
          ),
        ]);

        setBodyParts(['all', ...(Array.isArray(bodyPartsData) ? bodyPartsData : [])]);
        setAllExercises(Array.isArray(exercisesData) ? exercisesData : []);
      } catch (error) {
        console.error('Initial fetch error:', error);
        setBodyParts(['all']);
        setAllExercises([]);
        setError(error.message);
      } finally {
        setLoadingBodyParts(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = () => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return;

    setLoadingSearch(true);
    setError('');

    try {
      const searchedExercises = allExercises.filter((item) => {
        const matchesSearch =
          item.name?.toLowerCase().includes(normalizedSearch) ||
          item.target?.toLowerCase().includes(normalizedSearch) ||
          item.equipment?.toLowerCase().includes(normalizedSearch) ||
          item.bodyPart?.toLowerCase().includes(normalizedSearch);

        const matchesBodyPart =
          bodyPart === 'all' ||
          !bodyPart ||
          item.bodyPart?.toLowerCase() === bodyPart.toLowerCase();

        return matchesSearch && matchesBodyPart;
      });

      setExercises(searchedExercises);
      window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
    } catch (error) {
        console.error('Search error:', error);
        setExercises([]);
        setError('Search failed.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Stack alignItems="center" mt="0.5rem" justifyContent="center" p="20px">
      {error && (
        <Box sx={{ color: 'red', mb: 2 }}>
          {error}
        </Box>
      )}

      <Box 
        position="relative" 
        mb="72px"
        sx={{width: '70vw', maxWidth: '70vw', minWidth: '300px'}}
      >
        <TextField
          sx={{
            width: '80%',
            minWidth: '300px',
            backgroundColor: '#d9d9d9',
            borderRadius: '20px',
            '& .MuiInputBase-root': {
              height: '3.5rem',
              borderRadius: '20px'
            },
            '& input': {
              fontWeight: '400',
              paddingLeft: '2rem', 
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Exerise Name"
          type="text"
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: '#d9d9d9',
            color: '#000',
            borderRadius: '20px',
            textTransform: 'none',
            width: '12%', maxWidth: '12%', minWidth: '50px',
            height: '3.5rem',
            position: 'absolute',
            ml: '1rem',
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontWeight: '600',
            fontSize: '13px',
          }}
          onClick={handleSearch}
          disabled={loadingSearch || allExercises.length === 0}
        >
          {loadingSearch ? '...' : 'SEARCH'}
        </Button>
      </Box>

      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
        {!loadingBodyParts && (
          <HorizontalScrollbar
            data={bodyParts}
            bodyParts
            setBodyPart={setBodyPart}
            bodyPart={bodyPart}
          />
        )}
      </Box>
    </Stack>
  );
};

export default SearchExercises;

/* 
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const bodyPartsData = await fetchData(
          'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
          exerciseOptions
        );

        setBodyParts(['all', ...(Array.isArray(bodyPartsData) ? bodyPartsData : [])]);
      } catch (error) {
        console.error('Body parts error:', error);
        setBodyParts(['all']);
      }
    };

    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const exercisesData = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises?limit=0',
        exerciseOptions
      );

      const list = Array.isArray(exercisesData) ? exercisesData : [];

      const searchedExercises = list.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.target?.toLowerCase().includes(search.toLowerCase()) ||
          item.equipment?.toLowerCase().includes(search.toLowerCase()) ||
          item.bodyPart?.toLowerCase().includes(search.toLowerCase())
      );

      window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
      setSearch('');
      setExercises(searchedExercises);
    } catch (error) {
      console.error('Search error:', error);
      setExercises([]);
    }
  };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography
        fontWeight={700}
        sx={{ fontSize: { lg: '44px', xs: '30px' } }}
        mb="49px"
        textAlign="center"
      >
        Awesome Exercises You <br /> Should Know
      </Typography>

      <Box position="relative" mb="72px">
        <TextField
          height="76px"
          sx={{
            input: { fontWeight: '700', border: 'none', borderRadius: '4px' },
            width: { lg: '1170px', xs: '350px' },
            backgroundColor: '#fff',
            borderRadius: '40px'
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Exercises"
          type="text"
        />

        <Button
          className="search-btn"
          sx={{
            bgcolor: '#FF2625',
            color: '#fff',
            textTransform: 'none',
            width: { lg: '173px', xs: '80px' },
            height: '56px',
            position: 'absolute',
            right: '0px',
            fontSize: { lg: '20px', xs: '14px' }
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
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
*/
