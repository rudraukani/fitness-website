import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert,Box,Button,
  Chip,CircularProgress,Stack,Typography,
} from '@mui/material';
import { exerciseOptions, fetchData } from '../utils/fetchData';
import { fetchGifMap } from '../utils/fetchGifs';

const ExerciseDetail = () => {
  const { id } = useParams();
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState('');
  const [gifMap, setGifMap] = useState({});

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(true);
      setError('');
      setExerciseDetail(null);
      setExerciseVideos([]);

      try {
        const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com';
        const detailData = await fetchData(
          `${exerciseDbUrl}/exercises/exercise/${id}`,
          exerciseOptions
        );

        setExerciseDetail(detailData);

        if (detailData?.name && YOUTUBE_API_KEY) {

          try {
            const query = encodeURIComponent(`${detailData.name} exercise`);
            const youtubeUrl =
              `https://www.googleapis.com/youtube/v3/search` +
              `?part=snippet&maxResults=6&type=video&q=${query}&key=${YOUTUBE_API_KEY}`;

            const videoData = await fetchData(youtubeUrl);

            const normalizedVideos = (videoData?.items || [])
              .filter((item) => item?.id?.videoId)
              .map((item) => ({
                video: {
                  videoId: item.id.videoId,
                  title: item.snippet?.title || 'Untitled video',
                  thumbnails: [
                    {
                      url:
                        item.snippet?.thumbnails?.high?.url ||
                        item.snippet?.thumbnails?.medium?.url ||
                        item.snippet?.thumbnails?.default?.url,
                    },
                  ],
                  channelName: item.snippet?.channelTitle || 'Unknown channel',
                },
              }));

            setExerciseVideos(normalizedVideos);
          } catch (videoError) {
            console.error('Video fetch error:', videoError);
            setExerciseVideos([]);
          } finally {
            setVideoLoading(false);
          }
        } else {
          setExerciseVideos([]);
        }

      } catch (err) {
        console.error('Exercise detail fetch error:', err);
        setError(err.message || 'Failed to load exercise details.');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetails();
  }, [id]);

  useEffect(() => {
    const loadGifMap = async () => {
      try {
        const map = await fetchGifMap();
        setGifMap(map);
      } catch (err) {
        console.error('Failed to load GIF map:', err);
      }
    };

    loadGifMap();
  }, []);

  const topVideos = useMemo(() => {
    return exerciseVideos
      .map((item) => item?.video)
      .filter(Boolean)
      .slice(0, 6);
  }, [exerciseVideos]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography>Loading exercise details...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error || !exerciseDetail) {
    return (
      <Box sx={{ maxWidth: '1100px', mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Could not load this exercise.'}
        </Alert>

        <Button component={Link} to="/explore" variant="contained">
          Back to Explore
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 5 }}>
      <Button
        component={Link}
        to="/explore"
        variant="outlined"
        sx={{ mb: 4 }}
      >
        Back to Explore
      </Button>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={5}
        alignItems={{ xs: 'center', md: 'flex-start' }}
      >
        <Box
          component="img"
          src={gifMap[exerciseDetail.name?.toLowerCase?.().trim()] || exerciseDetail.gifUrl}
          alt={exerciseDetail.name}
          sx={{
            width: { xs: '100%', sm: '420px', md: '480px' },
            maxWidth: '100%',
            borderRadius: 4,
            backgroundColor: '#fff',
            objectFit: 'cover',
            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          }}
        />

        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography
            variant="h3"
            sx={{
              textTransform: 'capitalize',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {exerciseDetail.name}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.9, fontSize: '1.05rem' }}
          >
            {exerciseDetail.name} is a great exercise for building strength and improving
            control. It primarily targets your{' '}
            <strong>{exerciseDetail.target}</strong> using{' '}
            <strong>{exerciseDetail.equipment}</strong>.
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
            <Chip
              label={`Body Part: ${exerciseDetail.bodyPart}`}
              color="primary"
              sx={{ textTransform: 'capitalize' }}
            />
            <Chip
              label={`Target: ${exerciseDetail.target}`}
              color="secondary"
              sx={{ textTransform: 'capitalize' }}
            />
            <Chip
              label={`Equipment: ${exerciseDetail.equipment}`}
              sx={{ textTransform: 'capitalize' }}
            />
          </Stack>

          {exerciseDetail.instructions && Array.isArray(exerciseDetail.instructions) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Instructions
              </Typography>

              <Stack spacing={1.5}>
                {exerciseDetail.instructions.map((step, index) => (
                  <Box
                    key={`${exerciseDetail.id}-step-${index}`}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: '#f8f9fb',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                      Step {index + 1}
                    </Typography>
                    <Typography color="text.secondary">{step}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>

      <Box sx={{ mt: 7 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          YouTube Videos
        </Typography>

        {videoLoading ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={24} />
            <Typography>Loading videos...</Typography>
          </Stack>
        ) : topVideos.length === 0 ? (
          <Alert severity="info">
            No YouTube videos were returned for this exercise right now.
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {topVideos.map((video) => (
              <Box
                key={video.videoId}
                component="a"
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={
                    video.thumbnails?.[0]?.url ||
                    `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
                  }
                  alt={video.title}
                  sx={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {video.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {video.channelName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExerciseDetail;
