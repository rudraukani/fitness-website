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
import { colors } from "../components/colors";

const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('PLEASE ENTER EMAIL & PASSWORD');
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
      setMessage('PLEASE ENTER EMAIL & PASSWORD');
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
    <Box // full page 
      className="account-page"
      sx={{
        minHeight: "100vh",
        paddingTop: "1.5rem",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >

      <Box // background div 
        className="account-bg"
        sx={{ 
          backgroundImage: `url(${GymBackground})`,
          position: "absolute",
          inset: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(3px)",
        }}
      />

      <Paper // full form
        elevation={10} 
        className="account-card"
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          padding: "32px",
          borderRadius: "28px",
          background: colors.bkg,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(14px)",
          color: colors.main,
        }}
      >
        <Stack spacing={3} className="account-stack">
          <Box textAlign="center">

            <Typography //form title
              textAlign="center"
              sx={{ 
                fontFamily: "'Contrail One', sans-serif", 
                fontSize: "3rem", 
                color: colors.main,
                pb: 0,
                pt: 0, }}
            >
              <span className="accent-ac">F</span>IT<span className="accent-ac">S</span>COUT
            </Typography>

            <Typography //subtitle 
              textAlign="center"
              sx={{ 
                fontFamily: "'Contrail One', sans-serif",
                fontSize: "1.4rem",
                color: colors.main,
                width: "100%",
                mt: "-1.5rem", 
              }}
              
            >
              FITNESS MADE SIMPLE
            </Typography>

          </Box>

          <Typography // login label
            textAlign="center" 
            sx={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: colors.main,
            }}
          >
            LOGIN
          </Typography>

          <TextField // email input 
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
            <Typography 
              textAlign="center"
              sx={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: "700",
                color: colors.highlight,
              }}
            >
              {message}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            className="account-btn"
            sx={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              borderRadius: "15px",
              fontWeight: "700",
              background: colors.main,
              color: colors.bkg,
            }}
          >
            Sign In
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSignUp}
            className="account-btn"
            sx={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              borderRadius: "15px",
              fontWeight: "700",
              background: colors.main,
              color: colors.bkg,
            }}
          >
            Sign Up
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleSignIn}
            className="account-btn"
            sx={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              borderRadius: "15px",
              fontWeight: "700",
              background: colors.main,
              color: colors.bkg,
            }}
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
