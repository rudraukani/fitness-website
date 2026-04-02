import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  addFavoriteExercise,
  getUserFavorites,
} from '../utils/favorites';
import { colors } from "./colors";

const ExerciseCard = ({ exercise, gifUrl }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favoriteStatusLoading, setFavoriteStatusLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!currentUser || !exercise?.id) {
        setFavorite(false);
        setFavoriteStatusLoading(false);
        return;
      }

      try {
        setFavoriteStatusLoading(true);

        const userFavs = await getUserFavorites(currentUser.uid);
        const alreadySaved = userFavs.some(
          (fav) => String(fav.id) === String(exercise.id)
        );

        setFavorite(alreadySaved);
      } catch (error) {
        console.error('Load favorite status error:', error);
        setFavorite(false);
      } finally {
        setFavoriteStatusLoading(false);
      }
    };

    loadFavoriteStatus();
  }, [currentUser, exercise?.id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/account');
      return;
    }

    if (favorite) {
      return;
    }

    try {
      setFavLoading(true);
      await addFavoriteExercise(currentUser.uid, exercise);
      setFavorite(true);
    } catch (error) {
      console.error('Favorite button error:', error);
      alert('Could not save favorite right now. Please try again.');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link className="exercise-card" to={`/exercise/${exercise.id}`}>
      
      <Box
        sx={{
          width: "100%",
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "center",
          py: "0.5em",
        }}
      >
        <img
          src={gifUrl || exercise.gifUrl}
          alt={exercise.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </Box>
      
      <Box sx={{height: "1.5em",}} />

      <Stack direction="row" width="100%" justifyContent="space-evenly">
        <Button
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#fff',
            background: colors.highlight,
            fontSize: '0.9em',
            borderRadius: '20px',
            textTransform: 'capitalize',
          }}
        >
          {exercise.bodyPart}
        </Button>

        <Button
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#fff',
            background: colors.highlight,
            fontSize: '0.9em',
            borderRadius: '20px',
            textTransform: 'capitalize',
          }}
        >
          {exercise.target}
        </Button>

        <Button
          onClick={handleFavoriteClick}
          disabled={favLoading || favoriteStatusLoading || favorite}
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#fff',
            background: favorite ? '#4caf50' : '#1c1c1c',
            fontSize: '0.9em',
            borderRadius: '20px',
            textTransform: 'capitalize',
            opacity: favLoading || favoriteStatusLoading ? 0.7 : 1,
          }}
        >
          {favorite ? 'Saved' : favLoading ? 'Saving...' : 'Favorite'}
        </Button>
      </Stack>
      
      <Box sx={{height: "1em",}} />

      <Box
        sx={{
          width: "100%",
          height: "4em",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.15em",
            textAlign: "center",
            px: "1em",

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          textTransform="capitalize"
        >
          {exercise.name}
        </Typography>
      </Box>

    </Link>
  );
};

export default ExerciseCard;
