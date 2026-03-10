import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { exerciseOptions, fetchData, youtubeOptions } from '../utils/fetchData';
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchExercisesData = async () => {
      try {
        const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com';
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';

        const exerciseDetailData = await fetchData(
          `${exerciseDbUrl}/exercises/exercise/${id}`,
          exerciseOptions
        );

        setExerciseDetail(exerciseDetailData || null);

        if (exerciseDetailData?.name) {
          const exerciseVideosData = await fetchData(
            `${youtubeSearchUrl}/search?query=${encodeURIComponent(
              `${exerciseDetailData.name} exercise`
            )}&type=v`,
            youtubeOptions
          );

          setExerciseVideos(exerciseVideosData?.contents || []);
        }

        if (exerciseDetailData?.target) {
          const targetMuscleExercisesData = await fetchData(
            `${exerciseDbUrl}/exercises/target/${encodeURIComponent(
              exerciseDetailData.target
            )}`,
            exerciseOptions
          );

          setTargetMuscleExercises(
            Array.isArray(targetMuscleExercisesData) ? targetMuscleExercisesData : []
          );
        }

        if (exerciseDetailData?.equipment) {
          const equipmentExercisesData = await fetchData(
            `${exerciseDbUrl}/exercises/equipment/${encodeURIComponent(
              exerciseDetailData.equipment
            )}`,
            exerciseOptions
          );

          setEquipmentExercises(
            Array.isArray(equipmentExercisesData) ? equipmentExercisesData : []
          );
        }
      } catch (error) {
        console.error('Exercise detail error:', error);
        setExerciseDetail(null);
        setExerciseVideos([]);
        setTargetMuscleExercises([]);
        setEquipmentExercises([]);
      }
    };

    fetchExercisesData();
  }, [id]);

  if (!exerciseDetail) {
    return <Box sx={{ mt: { lg: '96px', xs: '60px' }, p: '20px' }}>Loading...</Box>;
  }

  return (
  <Box sx={{ mt: { lg: '96px', xs: '60px' } }}>
    {exerciseDetail ? <Detail exerciseDetail={exerciseDetail} /> : <div>Loading...</div>}

    {exerciseDetail?.name && exerciseVideos.length > 0 && (
      <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name} />
    )}

    <SimilarExercises
      targetMuscleExercises={targetMuscleExercises}
      equipmentExercises={equipmentExercises}
    />
  </Box>
);
};

export default ExerciseDetail;