import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  addFavoriteExercise,
  removeFavoriteExercise,
  getUserFavorites,
} from '../utils/favorites';
import { colors } from "./colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

const ExerciseCard = ({ exercise, gifUrl, onFavoriteChange }) => {
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

  /*
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
      await addFavoriteExercise(currentUser.uid, {
        ...exercise,
        gifUrl: gifUrl || exercise.gifUrl || '',
      });
      setFavorite(true);
    } catch (error) {
      console.error('Favorite button error:', error);
      alert('Could not save favorite right now. Please try again.');
    } finally {
      setFavLoading(false);
    }
  }; */
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/account');
      return;
    }

    try {
      setFavLoading(true);

      if (favorite) {
        await removeFavoriteExercise(currentUser.uid, String(exercise.id));
        setFavorite(false);

        if (onFavoriteChange) {
          onFavoriteChange(String(exercise.id), false);
        }
      } else {
        await addFavoriteExercise(currentUser.uid, {
          ...exercise,
          gifUrl: gifUrl || exercise.gifUrl || '',
        });
        setFavorite(true);

        if (onFavoriteChange) {
          onFavoriteChange(String(exercise.id), true);
        }
      }
    } catch (error) {
      console.error('Favorite button error:', error);
      alert('Could not update favorite right now. Please try again.');
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
        />
      </Box>
      
      <Box sx={{height: "1.5em",}} />

      <Stack
        direction="row"
        width="100%"
        spacing={1}
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box sx={{height: "100%", width: 2,}} />
        <Button
          onClick={handleFavoriteClick}
          disabled={favLoading || favoriteStatusLoading }
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#fff',
              '&.Mui-disabled': {
                color: '#fff',
                opacity: 1,
              },
              '&:hover': {
                background: colors.pink,
              },
            flexShrink: 0,
            minWidth: 'fit-content',
            width: 'max-content',
            px: 2,
            background: colors.pink,
            fontSize: '0.5em',
            borderRadius: '20px',
            textTransform: 'capitalize',
            opacity: favLoading || favoriteStatusLoading ? 0.7 : 1,
          }}
        >
          {favLoading ? (
            '...'
          ) : favorite ? (
            <BookmarkAddedIcon color="inherit" />
          ) : (
            <FavoriteIcon color="inherit" />
          )}
        </Button>


        <Button
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#fff',
            '&:hover': {
                background: colors.highlight,
              },
            background: colors.highlight,
            fontSize: '0.9em',
            borderRadius: '20px',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            minWidth: 'fit-content',
            width: 'max-content',
            px: 2,
          }}
        >
          {exercise.bodyPart}
        </Button>

      

        
        <Button
          sx={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#fff',
            '&:hover': {
                background: colors.yellow,
              },
            background: colors.yellow,
            fontSize: '0.9em',
            borderRadius: '20px',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            minWidth: 'fit-content',
            width: 'max-content',
            px: 2,
          }}
        >
          {exercise.target}
        </Button>

        {(exercise.secondaryMuscles || []).map((muscle) => (
          <Button
            key={muscle}
            sx={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              color: '#fff',
              '&:hover': {
                background: colors.green,
              },
              background: colors.green,
              fontSize: '0.9em',
              borderRadius: '20px',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 'fit-content',
              width: 'max-content',
              px: 2,
            }}
          >
            {muscle}
          </Button>
        ))}

        <Box sx={{height: "100%", width: 2,}} />
     
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
