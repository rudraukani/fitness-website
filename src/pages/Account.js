import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";

import GymBackground from "../assets/images/gym2.jpg";
import { colors } from "../components/colors";
import { PestControlRodentSharp } from "@mui/icons-material";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const navigate = useNavigate();

  // Check if already logged in
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
    setMessage("");

    if (!email || !password) {
      setMessage("PLEASE ENTER EMAIL & PASSWORD");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setMessage(`Account created for ${userCredential.user.email}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("PLEASE ENTER EMAIL & PASSWORD");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setMessage(`Logged in as ${userCredential.user.email}`);
      navigate("/user");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage("");

    try {
      const result = await signInWithPopup(auth, provider);
      setMessage(`Logged in with Google as ${result.user.email}`);
      navigate("/user");
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
      }}
    >
      <Box
        sx={{ 
          backgroundImage: `url(${GymBackground})`,
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(3px)',
        }}
      />

      <Paper elevation={10} 
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          borderRadius: '28px',
          bgcolor: colors.bkg,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Stack spacing={3}
           sx={{
              bgcolor: colors.bkg,
            }}
        >
          <Box textAlign="center">

            <Typography
              sx={{
                fontFamily: '"Contrail One", sans-serif',
                fontSize: '3rem',
                color: colors.main,
                fontWeight: 800,
              }}
            >
              <Typography component="span" 
                sx={{ 
                  fontFamily: '"Contrail One", sans-serif',
                  fontSize: '4rem',
                  color: colors.main,
                  fontWeight: 800,
                }}>
                F
              </Typography>
              IT
              <Typography component="span" 
                sx={{ 
                  fontFamily: '"Contrail One", sans-serif',
                  fontSize: '4rem',
                  color: colors.main,
                  fontWeight: 800, 
                }}>
                S
              </Typography>
              COUT
            </Typography>

            <Typography textAlign="center"
              sx={{
                fontFamily: '"Contrail One", sans-serif',
                fontSize: '1.5rem',
                color: colors.main,
                width: '100%',
                marginTop: '-1.5rem',
                fontWeight: 800,
              }}
            >
              FITNESS MADE SIMPLE
            </Typography>

          </Box>

          <Typography textAlign="center" 
            sx={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: colors.main,
            }}
          >
            LOGIN
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": {color: "var(--main)",},
              "& .MuiOutlinedInput-input": {color: "var(--highlight)",},
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "rgba(255, 255, 255, 0.04)",
                "& fieldset": {borderColor: "var(--main)",},
                "&:hover fieldset": {borderColor: "var(--highlight)",},
                "&.Mui-focused fieldset": {borderColor: "var(--highlight)",},
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": {color: "var(--main)",},
              "& .MuiOutlinedInput-input": {color: "var(--highlight)",},
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "rgba(255, 255, 255, 0.04)",
                "& fieldset": {borderColor: "var(--main)",},
                "&:hover fieldset": {borderColor: "var(--highlight)",},
                "&.Mui-focused fieldset": {borderColor: "var(--highlight)",},
              },
            }}
          />

          {message && (
            <Typography className="error-message"
              sx={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: colors.highlight,
                textAlign: 'center',
              }}
            >
              {message}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            className="account-btn sign-in-btn"
            sx={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              py: '0.75rem',
              borderRadius: '15px',
              fontWeight: 700,
              bgcolor: colors.main,
              color: colors.bkg,
              "&:hover": {backgroundColor: "var(--highlight)",},
            }}
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleSignUp}
            sx={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              py: '0.75rem',
              borderRadius: '15px',
              fontWeight: 700,
              bgcolor: colors.main,
              color: colors.bkg,
              "&:hover": {backgroundColor: "var(--highlight)",},
            }}
          >
            Sign Up
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleSignIn}
            sx={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              py: '0.75rem',
              borderRadius: '15px',
              fontWeight: 700,
              bgcolor: colors.main,
              color: colors.bkg,
              "&:hover": {backgroundColor: "var(--highlight)",},
            }}
          >
            Sign In with Google
          </Button>

        </Stack>
      </Paper>
    </Box>

  );
};

export default Account;