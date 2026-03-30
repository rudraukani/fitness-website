import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites } from '../utils/favorites';
import ExerciseCard from '../components/ExerciseCard';

const Favorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) return;

      try {
        const userFavs = await getUserFavorites(currentUser.uid);
        setFavorites(userFavs);
      } catch (error) {
        console.error('Load favorites error:', error);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Box p="40px">
        <Typography variant="h4">Please sign in to view favorites.</Typography>
      </Box>
    );
  }

  return (
    <Box p="40px">
      <Typography variant="h3" mb="30px">
        My Favorite Exercises
      </Typography>

      {favorites.length === 0 ? (
        <Typography>No favorite exercises yet.</Typography>
      ) : (
        <Stack
          direction="row"
          sx={{ gap: { lg: '110px', xs: '50px' } }}
          flexWrap="wrap"
          justifyContent="center"
        >
          {favorites.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id || idx}
              exercise={exercise}
              gifUrl={exercise.gifUrl}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Favorites;