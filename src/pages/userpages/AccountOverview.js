import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useAuth } from "../../context/AuthContext";
import { getRoutines } from "../../utils/routines";
import { getWorkoutLogs } from "../../utils/workoutLogs";
import { getBodyMetrics } from "../../utils/bodyMetrics";

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
  const { currentUser } = useAuth();

  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const loadOverviewData = async () => {
      if (!currentUser) {
        setRoutines([]);
        setLogs([]);
        setMetrics(null);
        return;
      }

      try {
        const [routinesData, logsData, metricsData] = await Promise.all([
          getRoutines(currentUser.uid),
          getWorkoutLogs(currentUser.uid),
          getBodyMetrics(currentUser.uid),
        ]);

        setRoutines(Array.isArray(routinesData) ? routinesData : []);
        setLogs(Array.isArray(logsData) ? logsData : []);

        if (Array.isArray(metricsData) && metricsData.length > 0) {
          setMetrics(metricsData[metricsData.length - 1]);
        } else {
          setMetrics(null);
        }
      } catch (error) {
        console.error("Overview load error:", error);
        setRoutines([]);
        setLogs([]);
        setMetrics(null);
      }
    };

    loadOverviewData();
  }, [currentUser]);

  const latestLog = logs.length > 0 ? logs[0] : null;

  const displayedBMI = useMemo(() => {
    const heightCm = parseFloat(metrics?.height);
    const weightKg = parseFloat(metrics?.weight);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return "-";
    }

    const heightMeters = heightCm / 100;
    return (weightKg / (heightMeters * heightMeters)).toFixed(2);
  }, [metrics]);

  const dailyGoalStatus = useMemo(() => {
    if (!metrics) return "Not Set";
    if (routines.length > 0 || logs.length > 0) return "On Track";
    return "Getting Started";
  }, [metrics, routines.length, logs.length]);

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
            {routines.length}
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
            {logs.length}
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
            {displayedBMI}
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
            {dailyGoalStatus}
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
            <Chip label={`Goal: ${metrics ? "Health & Consistency" : "Not Set"}`} />
            <Chip
              label={`Focus: ${
                routines[0]?.focus ? routines[0].focus : "No routine added yet"
              }`}
            />
            <Chip
              label={`Training Split: ${
                routines[0]?.frequency ? routines[0].frequency : "Not Set"
              }`}
            />
            <Chip
              label={`Hydration Goal: ${
                metrics?.waterIntakeGoal
                  ? `${metrics.waterIntakeGoal} L / Day`
                  : "Not Set"
              }`}
            />
          </Stack>

          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
            {routines.length > 0 || logs.length > 0 || metrics ? (
              <>
                Your overview is now based on your real activity. Keep building
                routines, logging workouts, and updating body metrics to get a
                clearer picture of your fitness journey.
              </>
            ) : (
              <>
                You have not added enough fitness data yet. Start by creating a
                routine, logging workouts, and entering your body metrics to
                make this dashboard more useful.
              </>
            )}
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
                <strong>Height:</strong> {metrics?.height ? `${metrics.height} cm` : "-"}
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Weight:</strong> {metrics?.weight ? `${metrics.weight} kg` : "-"}
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Age:</strong> {metrics?.age || "-"}
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>Gender:</strong> {metrics?.gender || "-"}
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                <strong>BMI:</strong> {displayedBMI}
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
                  {metrics?.dailyStepGoal || "-"}
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
                  {metrics?.caloriesIntakeGoal || "-"}
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
                  {metrics?.waterIntakeGoal
                    ? `${metrics.waterIntakeGoal} Litres`
                    : "-"}
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

            {latestLog ? (
              <>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.2}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  <Chip
                    label={`Exercise: ${
                      latestLog.exercise?.name || latestLog.exercise || "-"
                    }`}
                  />
                  <Chip label={`Category: ${latestLog.category || "-"}`} />
                  <Chip label={`Sets: ${latestLog.sets || "-"}`} />
                  <Chip label={`Reps: ${latestLog.reps || "-"}`} />
                  <Chip
                    label={`Weight: ${latestLog.weight || "-"} ${
                      latestLog.weightUnit || ""
                    }`}
                  />
                  <Chip
                    label={`Time: ${latestLog.minutes || 0}m ${
                      latestLog.seconds || 0
                    }s`}
                  />
                </Stack>

                <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
                  Your latest logged workout is now shown here so you can quickly
                  review your most recent activity and training volume.
                </Typography>
              </>
            ) : (
              <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
                No workout logs available yet. Start logging your workouts to
                see your latest session here.
              </Typography>
            )}
          </Box>

          <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
              Routine Snapshot
            </Typography>

            {routines.length > 0 ? (
              <Stack spacing={1.4}>
                {routines.slice(0, 2).map((routine) => (
                  <Box
                    key={routine.id}
                    sx={{
                      p: 1.8,
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.58)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                      {routine.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                      {routine.exercises?.length || 0} exercises added • Focus:{" "}
                      {routine.focus || "Not Set"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
                No routines created yet. Add your first routine to preview it
                here.
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Progress Motivation Panel */}
        <Box sx={panelSx}>
          <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, mb: 2 }}>
            Progress Insight
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
            {routines.length > 0 || logs.length > 0 || metrics ? (
              <>
                You are building a stronger data-driven fitness profile by
                combining routines, workout logs, and body metrics. Keep
                updating your activity regularly so your overview stays accurate
                and meaningful.
              </>
            ) : (
              <>
                Once you start adding routines, workout logs, and body metrics,
                this section will become a much more helpful summary of your
                progress and consistency.
              </>
            )}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountOverview;