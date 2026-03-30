import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { addFavoriteExercise } from '../utils/favorites';

const ExerciseCard = ({ exercise, gifUrl }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/account');
      return;
    }

    try {
      setFavLoading(true);
      await addFavoriteExercise(currentUser.uid, exercise);
      setFavorite(true);
      navigate('/favorites');
    } catch (error) {
      console.error('Favorite button error:', error);
      alert('Could not save favorite right now. Please try again.');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link className="exercise-card" to={`/exercise/${exercise.id}`}>
      <img src={gifUrl || exercise.gifUrl} alt={exercise.name} loading="lazy" />

      <Stack direction="row" sx={{ justifyContent: 'space-between', px: '10px', mt: '10px' }}>
        <Stack direction="row">
          <Button
            sx={{
              ml: '11px',
              color: '#fff',
              background: '#FFA9A9',
              fontSize: '14px',
              borderRadius: '20px',
              textTransform: 'capitalize',
            }}
          >
            {exercise.bodyPart}
          </Button>

          <Button
            sx={{
              ml: '11px',
              color: '#fff',
              background: '#FCC757',
              fontSize: '14px',
              borderRadius: '20px',
              textTransform: 'capitalize',
            }}
          >
            {exercise.target}
          </Button>
        </Stack>

        <Button
          onClick={handleFavoriteClick}
          disabled={favLoading || favorite}
          sx={{
            color: '#fff',
            background: favorite ? '#ff2625' : '#222',
            fontSize: '12px',
            borderRadius: '20px',
            textTransform: 'capitalize',
            minWidth: '90px',
            '&:hover': {
              background: favorite ? '#d91f1f' : '#333',
            },
          }}
        >
          {favorite ? 'Saved' : 'Favorite'}
        </Button>
      </Stack>

      <Typography
        ml="21px"
        color="#fff"
        fontWeight="bold"
        sx={{ fontSize: { lg: '24px', xs: '20px' } }}
        mt="11px"
        pb="10px"
        textTransform="capitalize"
      >
        {exercise.name}
      </Typography>
    </Link>
  );
};

export default ExerciseCard;