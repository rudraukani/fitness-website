import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites, removeFavoriteExercise } from '../utils/favorites';
import ExerciseCard from '../components/ExerciseCard';
import { colors } from '../components/colors';
import GymBackground from '../assets/images/gym2.jpg';

const Favorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFavoriteChange = (exerciseId, isNowFavorite) => {
    if (!isNowFavorite) {
      setFavorites((prev) =>
        prev.filter((exercise) => String(exercise.id) !== String(exerciseId))
      );
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userFavs = await getUserFavorites(currentUser.uid);
        setFavorites(Array.isArray(userFavs) ? userFavs : []);
      } catch (error) {
        console.error('Load favorites error:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${GymBackground})`,
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          bgcolor: colors.bkg,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            fontFamily: "'Contrail One', sans-serif",
            fontSize: '2.5rem',
            color: colors.main,
            py: 1,
            fontWeight: 700,
          }}
        >
          MY FAVOURITES
        </Box>
      </Box>

      <Box sx={{ height: '2rem' }} />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '90%',
          maxWidth: '1200px',
          p: 3,
          borderRadius: '15px',
        }}
      >
        {!currentUser ? (
          <Typography
            sx={{
              color: colors.bkg,
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '1.3rem',
              textAlign: 'center',
            }}
          >
            Please sign in to view favorites.
          </Typography>
        ) : loading ? (
          <Typography
            sx={{
              color: colors.main,
              fontFamily: "'Contrail One', sans-serif",
              fontSize: '1.3rem',
              textAlign: 'center',
            }}
          >
            Loading favorites...
          </Typography>
        ) : favorites.length === 0 ? (
          <Typography
            sx={{
              color: colors.main,
              fontFamily: "'Contrail One', sans-serif",
              fontSize: '1.3rem',
              textAlign: 'center',
            }}
          >
            No favorite exercises yet.
          </Typography>
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
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Favorites;
