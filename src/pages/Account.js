<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
=======
import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Paper } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../firebase';

const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const saveUserToFirestore = async (user) => {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
      },
      { merge: true }
    );
  };

  const handleSignUp = async () => {
    setErrorMsg('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(result.user);
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleSignIn = async () => {
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#111',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: '420px',
          p: 4,
          borderRadius: '20px',
          background: '#1c1c1c',
          color: '#fff',
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center" fontWeight="bold" color="#ff2625">
            Account
          </Typography>

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#bbb' } }}
            InputProps={{ style: { color: '#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#ff2625' },
                '&.Mui-focused fieldset': { borderColor: '#ff2625' },
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#bbb' } }}
            InputProps={{ style: { color: '#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#ff2625' },
                '&.Mui-focused fieldset': { borderColor: '#ff2625' },
              },
            }}
          />

          {errorMsg && (
            <Typography color="error" fontSize="14px">
              {errorMsg}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSignIn}
            sx={{
              background: '#ff2625',
              '&:hover': { background: '#d91f1f' },
              borderRadius: '10px',
            }}
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleSignUp}
            sx={{
              color: '#fff',
              borderColor: '#ff2625',
              borderRadius: '10px',
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
              background: '#222',
              color: '#fff',
              borderRadius: '10px',
              '&:hover': { background: '#333' },
            }}
          >
            Continue with Google
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
>>>>>>> Stashed changes

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import GymBackground from '../assets/images/gym2.jpg';
import './Account.css';
import { colors } from "../components/colors";

const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/user", { replace: true });
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);


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
      navigate("/user");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setMessage(`Logged in with Google as ${result.user.email}`);
      navigate("/user");
    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
    <Box 
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

      <Box 
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

        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;
