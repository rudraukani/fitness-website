import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import GymBackground from '../assets/images/gym2.jpg';

const UserAccount = () => {
	const navigate = useNavigate();

	useEffect(() => { // validate user 
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				navigate("/");
			}
		});

		return () => unsubscribe();
	}, []);

 return(
    <Box // full page div 
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
    
        <Box // background image 
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


    </Box>


 );
};

export default UserAccount;
