import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import AccountNavbar from './AccountNavbar';
import { colors } from "../../components/colors";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import GymBackground from '../../assets/images/gym2.jpg';

const UserAccount = () => {
	const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

	useEffect(() => { // validate user 
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				navigate("/account", { replace: true });
			} else {
        setCheckingAuth(false);
      }
		});

		return () => unsubscribe();
	}, [navigate]);

  if (checkingAuth) return null;

 return(
    <Box 
    	sx={{
        position: "relative",
        zIndex: 1,
        height: "93vh",
				position: "relative",
				display: "flex",
        flexDirection: "column",
				alignItems: "center",
				overflow: "hidden",
        }}
    >
        {/* background image */}
        <Box 
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

        {/* page title div */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            bgcolor: colors.bkg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              fontFamily: "'Contrail One', sans-serif",
              fontSize: "2.5rem",
              color: colors.main,
              paddingTop: "1rem",
              paddingBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            MY DASHBOARD
          </Box>
        </Box>
        
        {/* gap div */}
        <Box sx={{height: '2rem', width: "100%",}} />

        {/* data content div */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flex: 1,            
            minHeight: 0,
            maxHeight: '80%',       
            width: "95%",
            justifyContent: "center",
            px: 2,
            pb: 2,
          }}
        >

          {/* account navbar div */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              width: "14rem",
              minHeight: "6rem",
              height: "25vh",
            }}
          >
            <AccountNavbar />
          </Box>
          
          {/* selected tab content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              flex: 1,  
              p: 3, 
              overflowY: "auto", 
              borderTopRightRadius:"15px",
              borderBottomRadius:"15px",
              borderBottomLeftRadius:"15px",
              borderBottomRightRadius:"15px",
              bgcolor: colors.bkg,
            }}
          >
            <Outlet />
          </Box>

        </Box>

    </Box>


 );
};

export default UserAccount;
