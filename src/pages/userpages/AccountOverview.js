import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
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

const capitalizeWords = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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

  const latestWorkoutSummary = useMemo(() => {
    if (!latestLog) return null;

    const exercises = Array.isArray(latestLog.exercisePerformance)
      ? latestLog.exercisePerformance
      : [];

    const firstExercise = exercises[0] || null;

    const totalSets = exercises.reduce(
      (sum, exercise) => sum + (parseInt(exercise?.sets || 0, 10) || 0),
      0
    );

    const totalReps = exercises.reduce(
      (sum, exercise) => sum + (parseInt(exercise?.reps || 0, 10) || 0),
      0
    );

    const weightEntries = exercises.filter(
      (exercise) => Number(exercise?.weight || 0) > 0
    );

    const maxWeightExercise =
      weightEntries.length > 0
        ? weightEntries.reduce((max, current) =>
            Number(current.weight || 0) > Number(max.weight || 0) ? current : max
          )
        : null;

    return {
      logDate: latestLog.logDate || "-",
      routineTitle:
        latestLog.routineTitle || latestLog.routineSnapshot?.title || "-",
      focus: latestLog.routineSnapshot?.focus || "",
      level: latestLog.routineSnapshot?.level || "",
      duration: latestLog.routineSnapshot?.duration || "-",
      frequency: latestLog.routineSnapshot?.frequency || "-",
      exercisesCount: exercises.length,
      firstExerciseName: firstExercise?.exerciseName || "-",
      firstExerciseEquipment: firstExercise?.equipment || "None",
      totalSets,
      totalReps,
      maxWeight:
        maxWeightExercise && Number(maxWeightExercise.weight || 0) > 0
          ? `${maxWeightExercise.weight} ${maxWeightExercise.weightUnit || ""}`.trim()
          : "-",
    };
  }, [latestLog]);

  return (
    <Box sx={{ width: "100%" }}>
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
          A quick snapshot of your fitness journey, body goals, routines,
          and recent workout activity.
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "1rem",
            color: "rgba(0,0,0,0.7)",
            maxWidth: "760px",
          }}
        >
          Click on the tabs to the left for detailed info.
        </Typography>
      </Box>

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
            Number of saved workout routines
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
      </Stack>

      <Stack spacing={3}>
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
                Your overview is based on your real activity. Keep building
                routines, logging workouts, and updating body metrics to get a
                clearer picture of your fitness journey.
              </>
            ) : (
              <>
                You have not added enough fitness data yet. Start by creating a
                routine, logging workouts, and entering your body metrics.
              </>
            )}
          </Typography>
        </Box>

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

            {latestWorkoutSummary ? (
              <>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.2}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  <Chip label={`Date: ${latestWorkoutSummary.logDate}`} />
                  <Chip label={`Routine: ${latestWorkoutSummary.routineTitle}`} />
                  <Chip label={`Exercises Logged: ${latestWorkoutSummary.exercisesCount}`} />
                  {latestWorkoutSummary.level && (
                    <Chip label={`Level: ${capitalizeWords(latestWorkoutSummary.level)}`} />
                  )}
                  {latestWorkoutSummary.duration !== "-" && (
                    <Chip label={`Duration: ${latestWorkoutSummary.duration}`} />
                  )}
                </Stack>

                <Stack spacing={1.2} sx={{ mb: 2 }}>
                  <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                    <strong>First Exercise:</strong> {latestWorkoutSummary.firstExerciseName}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                    <strong>Equipment:</strong> {latestWorkoutSummary.firstExerciseEquipment}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                    <strong>Total Sets:</strong> {latestWorkoutSummary.totalSets}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                    <strong>Total Reps:</strong> {latestWorkoutSummary.totalReps}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
                    <strong>Heaviest Logged Weight:</strong> {latestWorkoutSummary.maxWeight}
                  </Typography>
                </Stack>

                <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
                  Your latest workout entry now reflects the real data saved from
                  the workout logs page, including the selected routine and logged
                  exercise performance.
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