import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import BannerImage from '../assets/images/banner.png';

const ExerciseCard = ({ exercise, gifMap }) => {

  const imageSrc =
    gifMap?.[exercise.name?.toLowerCase?.().trim()] ||
    exercise.gifUrl;

  console.log("exercise object:", exercise);
  console.log("gifUrl:", exercise.gifUrl);

  return (
    <Link className="exercise-card" to={`/exercise/${exercise.id}`}>
      <img src={imageSrc} alt={exercise.name} loading="lazy" />

      <Stack direction="row">
        <Button
          sx={{
            ml: '21px',
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
            ml: '21px',
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

      <Typography
        color="#fff"
        fontWeight="800"
        textAlign="center"
        sx={{ fontSize: { lg: '14px', xs: '14px' } }}
        pl="1.5rem"
        pr="1.5rem"
        pb="0.5rem"
        textTransform="capitalize"
      >
        {exercise.name}
      </Typography>
    </Link>
  );
};

export default ExerciseCard;
