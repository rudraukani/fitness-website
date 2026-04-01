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
        minHeight: "100vh",
				paddingTop: "1.5rem",
				position: "relative",
				display: "flex",
				justifyContent: "center",
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

        {/* content div */}
        <Box>

          {/* navbar div */}
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
              flex: 1, 
              minHeight: "70vh",
              minWidth: "70vw", 
              p: 3, 
              borderRadius: "15px",
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
