import React from "react";
import { colors } from "../../components/colors";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const AccountOverview = () => {
    return(
        <Box
          sx={{
						bgcolor: colors.bkg,
						display: "flex",
						flexDirection: "column",
					}}
        >

					<Box // top div 
						sx={{
							height: "50%",
							width: "100%",
							display: "flex",
						}}
					>
						<Box>Routines</Box>
						<Box>Workout Logs</Box>
					</Box>

					<Box // bottom div 
						sx={{
							height: "50%",
							width: "100%",
							display: "flex",
						}}
					>
						<Box>Body Metrics</Box>
						<Box>Progress Tracker</Box>
					</Box>
					
        </Box>
  );
};

export default AccountOverview;
