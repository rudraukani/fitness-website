import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

const infoCardSx = {
  flex: 1,
  minWidth: "180px",
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "20px",
  padding: "18px",
  backdropFilter: "blur(10px)",
};

const panelSx = {
  background: "rgba(255,255,255,0.48)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "24px",
  padding: "24px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
};

const AccountOverview = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.1,
          }}
        >
          Account Overview
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "1rem",
            color: "rgba(0,0,0,0.7)",
            maxWidth: "760px",
          }}
        >
          Get a quick snapshot of your fitness journey, body goals, routines,
          and recent workout activity all in one place.
        </Typography>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          mb: 4,
          borderRadius: "24px",
          padding: { xs: "20px", md: "28px" },
          background:
            "linear-gradient(135deg, rgba(17,17,17,0.92), rgba(48,102,190,0.88))",
          color: "#fff",
          boxShadow: "0 14px 34px rgba(0,0,0,0.20)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.95rem", opacity: 0.85, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.7rem", md: "2.2rem" },
                fontWeight: 800,
              }}
            >
              Stay Consistent. Track Progress. Build Better Habits.
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: "720px", opacity: 0.92 }}>
              This dashboard gives you a quick overview of your current health
              stats, active routines, and latest workout progress.
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              background: "#fff",
              color: "#111",
              fontWeight: 700,
              borderRadius: "14px",
              px: 3,
              py: 1.2,
              boxShadow: "none",
              "&:hover": {
                background: "#f1f1f1",
                boxShadow: "none",
              },
            }}
          >
            Keep Going
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        sx={{ mb: 4 }}
      >
        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <FitnessCenterRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>My Routines</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            3
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Active workout routines
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <CalendarMonthRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Workout Logs</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            12
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Recorded training sessions
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <MonitorHeartRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Current BMI</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            23.8
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Based on saved body metrics
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <TrendingUpRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Daily Goal</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            On Track
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Progress moving in the right direction
          </Typography>
        </Box>
      </Stack>

      {/* Main Panels */}
      <Stack spacing={3}>
        {/* Fitness Goal Summary */}
        <Box sx={panelSx}>
          <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, mb: 2 }}>
            Fitness Goal Summary
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            sx={{ mb: 2.5 }}
          >
            <Chip label="Goal: Muscle Gain" />
            <Chip label="Focus: Strength + Consistency" />
            <Chip label="Training Split: 4 Days / Week" />
            <Chip label="Hydration Goal: 3 L / Day" />
          </Stack>

          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
            Your current fitness direction is focused on building strength,
            following a consistent training schedule, and improving overall body
            composition through better workout structure and daily habits.
          </Typography>
        </Box>

        {/* Body Metrics + Daily Targets */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          useFlexGap
          flexWrap="wrap"
        >
          <Box sx={{ ...panelSx, flex: 1, minWidth: "280px" }}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
              Latest Body Metrics
            </Typography>

            <Stack spacing={1.2}>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Height:</strong> 175 cm
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Weight:</strong> 73 kg
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Age:</strong> 21
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Gender:</strong> Male
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>BMI:</strong> 23.8
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ ...panelSx, flex: 1, minWidth: "280px" }}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
              Daily Targets
            </Typography>

            <Stack spacing={1.8}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.6}>
                  <DirectionsRunRoundedIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 700 }}>Daily Step Goal</Typography>
                </Stack>
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  10,000 steps
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.6}>
                  <LocalFireDepartmentRoundedIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 700 }}>
                    Calories Intake Goal
                  </Typography>
                </Stack>
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  2,400 kcal
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.6}>
                  <WaterDropRoundedIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 700 }}>
                    Water Intake Goal
                  </Typography>
                </Stack>
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  3 Litres
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        {/* Recent Workout + Routine Preview */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          useFlexGap
          flexWrap="wrap"
        >
          <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
              Latest Workout Log
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              <Chip label="Exercise: Squats" />
              <Chip label="Category: Legs" />
              <Chip label="Sets: 4" />
              <Chip label="Reps: 10" />
              <Chip label="Weight: 60 kg" />
              <Chip label="Time: 18m 20s" />
            </Stack>

            <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
              Your most recent session focused on lower body strength with a
              structured squat workout. Keep logging sessions to monitor
              consistency and progression over time.
            </Typography>
          </Box>

          <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
              Routine Snapshot
            </Typography>

            <Stack spacing={1.4}>
              <Box
                sx={{
                  p: 1.8,
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.58)",
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                  Legs Routine
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  5 exercises added • Focused on lower body strength
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 1.8,
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.58)",
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                  Abs Routine
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  4 exercises added • Focused on core and stability
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        {/* Progress Motivation Panel */}
        <Box sx={panelSx}>
          <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, mb: 2 }}>
            Progress Insight
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
            You are building a strong foundation by combining structured
            routines, consistent workout logging, and body metric tracking.
            Keep focusing on gradual progress, daily movement, proper hydration,
            and recovery to stay on track with your long-term goals.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountOverview;