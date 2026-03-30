import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import GymBackground from '../assets/images/gym2.jpg';
import './Account.css';

const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter an email and password!');
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
    <Box className="account-page">
      <Box
        className="account-bg"
        sx={{ backgroundImage: `url(${GymBackground})` }}
      />

      <Paper elevation={10} className="account-card">
        <Stack spacing={3} className="account-stack">
          <Box textAlign="center">

            <Typography className="title">
              <span className="accent">F</span>IT<span className="accent">S</span>COUT
            </Typography>

            <Typography textAlign="center" className="subtitle">
              FITNESS MADE SIMPLE
            </Typography>

          </Box>

          <Typography textAlign="center" className="login-label">
            LOGIN
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="account-input"
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="account-input"
          />

          {message && (
            <Typography className="error-message">
              {message}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            className="account-btn sign-in-btn"
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleSignUp}
            className="account-btn sign-up-btn"
          >
            Sign Up
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleSignIn}
            className="account-btn google-btn"
          >
            Sign in with Google
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;