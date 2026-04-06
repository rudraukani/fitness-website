import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert,Box,Button,
  Chip,CircularProgress,Stack,Typography,
} from '@mui/material';
import { exerciseOptions, fetchData } from '../utils/fetchData';
import { fetchGifMap } from '../utils/fetchGifs';
import { colors } from '../components/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';
import {
  addFavoriteExercise,
  removeFavoriteExercise,
  getUserFavorites,
} from '../utils/favorites';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState('');
  const [gifMap, setGifMap] = useState({});

  const { currentUser } = useAuth();
  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favoriteStatusLoading, setFavoriteStatusLoading] = useState(true);  

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

  useEffect(() => {
      const loadFavoriteStatus = async () => {
        if (!currentUser || !exerciseDetail?.id) {
          setFavorite(false);
          setFavoriteStatusLoading(false);
          return;
        }
  
        try {
          setFavoriteStatusLoading(true);
  
          const userFavs = await getUserFavorites(currentUser.uid);
          const alreadySaved = userFavs.some(
            (fav) => String(fav.id) === String(exerciseDetail.id)
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
    }, [currentUser, exerciseDetail?.id]);
  
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!exerciseDetail) return;

    if (!currentUser) {
      alert('Please sign in to save exercises!');
      return;
    }

    try {
      setFavLoading(true);

      if (favorite) {
        await removeFavoriteExercise(currentUser.uid, String(exerciseDetail.id));
        setFavorite(false);

      } else {
        await addFavoriteExercise(currentUser.uid, {
          ...exerciseDetail,
          gifUrl:
            gifMap[exerciseDetail.name?.toLowerCase?.().trim()] ||
            exerciseDetail.gifUrl ||
            '',
        });
        setFavorite(true);

      }
    } catch (error) {
      console.error('Favorite button error:', error);
      alert('Could not update favorite right now. Please try again.');
    } finally {
      setFavLoading(false);
    }
  };

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

        <Button
              component={Link}
              to="/explore"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                maxWidth: 'fit-content',
                px: 2,
                py: 1,
                mb: 4, 
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: colors.main, 
                '&:hover': {
                    background: colors.highlight,
                  },
                backgroundColor: colors.bkg, 
                borderRadius: '15px',
              }}
            >
              Explore
            </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      mx: 'auto', 
      px: { xs: 2, md: 4 }, 
      py: 5,
    }}>
      <div className="exercise-detail-bg-img"></div>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={5}
        alignItems={{ xs: 'center', md: 'flex-start' }}
      >
        <Stack 
          direction='column'
        >
          <Stack direction='row'>

            <Button
              component={Link}
              to="/explore"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                maxWidth: 'fit-content',
                px: 2,
                py: 1,
                mb: 4, 
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: colors.main, 
                '&:hover': {
                    background: colors.highlight,
                  },
                backgroundColor: colors.bkg, 
                borderRadius: '15px',
              }}
            >
              Explore
            </Button>

            <Box width='1em' />

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
                minHeight: 'fit-content',
                height: 'max-content',
                px: 2,
                py: 1,
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
          </Stack>

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
        </Stack>

        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Contrail One", sans-serif',
              textTransform: 'capitalize',
              color: colors.bkg,
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {exerciseDetail.name}
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
            <Chip
              label={`Category: ${exerciseDetail.bodyPart}`}
              sx={{ 
                textTransform: 'capitalize', 
                color: '#fff',
                backgroundColor: colors.highlight, 
              }}
            />
            <Chip
              label={`Primary Target Muscle: ${exerciseDetail.target}`}
              sx={{ 
                textTransform: 'capitalize', 
                color: '#fff',
                backgroundColor: colors.yellow, 
              }}
            />

            {(exerciseDetail.secondaryMuscles || []).length > 0 && (
              <Chip
                label={`Secondary Target Muscle: ${
                  exerciseDetail.secondaryMuscles
                    .map(m => m.charAt(0).toUpperCase() + m.slice(1))
                    .join(', ')
                }`}
                sx={{
                  textTransform: 'capitalize',
                  color: '#fff',
                  backgroundColor: colors.green,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              />
            )}

            <Chip
              label={`Equipment: ${exerciseDetail.equipment}`}
              sx={{ 
                textTransform: 'capitalize',
                backgroundColor: colors.highlight,
                color: '#fff',
              }}
            />
          </Stack>

          {exerciseDetail.instructions && Array.isArray(exerciseDetail.instructions) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  color: colors.bkg, 
                  fontFamily: '"IBM Plex Sans", sans-serif',
                }}>
                Instructions
              </Typography>

              <Stack spacing={1.5}>
                {exerciseDetail.instructions.map((step, index) => (
                  <Box
                    key={`${exerciseDetail.id}-step-${index}`}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: colors.bkg,
                      fontFamily: '"IBM Plex Sans", sans-serif',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, mb: 0.5, fontFamily: '"IBM Plex Sans", sans-serif', }}>
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
            fontFamily: '"IBM Plex Sans", sans-serif',
            color: colors.bkg,
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
                  backgroundColor: colors.bkg,
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
