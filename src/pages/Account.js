import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Fade,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import GymBackground from '../assets/images/gym2.jpg';

const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage(`Account created for ${userCredential.user.email}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage(`Logged in as ${userCredential.user.email}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setMessage(`Logged in with Google as ${result.user.email}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    setMessage('');
    try {
      await signOut(auth);
      setMessage('Logged out successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${GymBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1.05)',
          animation: 'slowZoom 18s ease-in-out infinite alternate',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.82), rgba(0,0,0,0.55), rgba(255,38,37,0.15))',
          backdropFilter: 'blur(2px)',
        }}
      />

      <Fade in timeout={1000}>
        <Paper
          elevation={10}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            p: 4,
            borderRadius: '28px',
            background: 'rgba(18,18,18,0.78)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            backdropFilter: 'blur(14px)',
            color: '#fff',
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography
                sx={{
                  fontSize: { xs: '34px', md: '42px' },
                  fontWeight: 800,
                  color: '#ff2625',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                FitScout
              </Typography>

              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#d1d1d1',
                  mt: 0.5,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                Train smarter. Stay stronger.
              </Typography>
            </Box>

            <Typography
              textAlign="center"
              sx={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              Account Access
            </Typography>

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                  '&:hover fieldset': { borderColor: '#ff2625' },
                  '&.Mui-focused fieldset': { borderColor: '#ff2625' },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                  '&:hover fieldset': { borderColor: '#ff2625' },
                  '&.Mui-focused fieldset': { borderColor: '#ff2625' },
                },
              }}
            />

            {message && (
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#ffb3b3',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {message}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                py: 1.4,
                borderRadius: '14px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                background: 'linear-gradient(90deg, #ff2625, #ff4d4d)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #e01f1f, #ff2625)',
                },
              }}
            >
              Sign In
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleSignUp}
              sx={{
                py: 1.4,
                borderRadius: '14px',
                color: '#fff',
                borderColor: '#ff2625',
                fontWeight: 700,
                letterSpacing: '0.5px',
                '&:hover': {
                  borderColor: '#ff2625',
                  background: 'rgba(255,38,37,0.08)',
                },
              }}
            >
              Sign Up
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGoogleSignIn}
              sx={{
                py: 1.4,
                borderRadius: '14px',
                background: '#202020',
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '0.4px',
                '&:hover': {
                  background: '#2c2c2c',
                },
              }}
            >
              Continue with Google
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={handleLogout}
              sx={{
                color: '#ff2625',
                fontWeight: 700,
                '&:hover': {
                  background: 'rgba(255,38,37,0.06)',
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Paper>
      </Fade>

      <style>
        {`
          @keyframes slowZoom {
            0% {
              transform: scale(1.03);
            }
            100% {
              transform: scale(1.12);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Account;