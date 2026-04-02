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
import "./Account.css";
import { colors } from "../components/colors";

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
        minHeight: "100vh",
        paddingTop: "1.5rem",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background */}
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

      {/* Card */}
      <Paper
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
        <Stack spacing={3}>
          <Typography
            textAlign="center"
            sx={{
              fontFamily: "'Contrail One', sans-serif",
              fontSize: "3rem",
              color: colors.main,
            }}
          >
            <span className="accent-ac">F</span>IT
            <span className="accent-ac">S</span>COUT
          </Typography>

          <Typography
            textAlign="center"
            sx={{
              fontFamily: "'Contrail One', sans-serif",
              fontSize: "1.4rem",
              color: colors.main,
              mt: "-1.5rem",
            }}
          >
            FITNESS MADE SIMPLE
          </Typography>

          <Typography
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

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && (
            <Typography textAlign="center" color="error">
              {message}
            </Typography>
          )}

          <Button variant="contained" fullWidth onClick={handleLogin}>
            Sign In
          </Button>

          <Button variant="contained" fullWidth onClick={handleSignUp}>
            Sign Up
          </Button>

          <Button variant="contained" fullWidth onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;