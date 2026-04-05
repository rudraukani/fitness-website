import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
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

const pieColors = ["#111111", "#3066BE", "#6C8CD5", "#8FAADC", "#B7C7E6", "#D8E1F0"];

const safeDateLabel = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
};

const ProgressTracker = () => {
  const { currentUser } = useAuth();

  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [metricsHistory, setMetricsHistory] = useState([]);

  useEffect(() => {
    const loadProgressData = async () => {
      if (!currentUser) {
        setRoutines([]);
        setLogs([]);
        setMetricsHistory([]);
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
        setMetricsHistory(Array.isArray(metricsData) ? metricsData : []);
      } catch (error) {
        console.error("Progress tracker load error:", error);
        setRoutines([]);
        setLogs([]);
        setMetricsHistory([]);
      }
    };

    loadProgressData();
  }, [currentUser]);

  const latestMetric = metricsHistory.length
    ? metricsHistory[metricsHistory.length - 1]
    : null;

  const latestBMI = useMemo(() => {
    const heightCm = parseFloat(latestMetric?.height);
    const weightKg = parseFloat(latestMetric?.weight);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return "-";

    const heightMeters = heightCm / 100;
    return (weightKg / (heightMeters * heightMeters)).toFixed(2);
  }, [latestMetric]);

  const totalExercisesAcrossRoutines = useMemo(
    () =>
      routines.reduce(
        (sum, routine) => sum + (Array.isArray(routine.exercises) ? routine.exercises.length : 0),
        0
      ),
    [routines]
  );

  const totalWorkoutMinutes = useMemo(
    () =>
      logs.reduce((sum, log) => {
        const mins = parseInt(log.minutes || 0, 10);
        const secs = parseInt(log.seconds || 0, 10);
        return sum + mins + secs / 60;
      }, 0),
    [logs]
  );

  const weightTrendData = useMemo(() => {
    return metricsHistory.map((entry, index) => ({
      name: safeDateLabel(entry.updatedAt || entry.createdAt || entry.logDate || index),
      weight: Number(entry.weight) || 0,
    }));
  }, [metricsHistory]);

  const bmiTrendData = useMemo(() => {
    return metricsHistory
      .map((entry, index) => {
        const heightCm = parseFloat(entry.height);
        const weightKg = parseFloat(entry.weight);
        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
          return {
            name: safeDateLabel(entry.updatedAt || entry.createdAt || entry.logDate || index),
            bmi: 0,
          };
        }
        const heightMeters = heightCm / 100;
        return {
          name: safeDateLabel(entry.updatedAt || entry.createdAt || entry.logDate || index),
          bmi: Number((weightKg / (heightMeters * heightMeters)).toFixed(2)),
        };
      })
      .filter((item) => item.bmi > 0);
  }, [metricsHistory]);

  const workoutDurationData = useMemo(() => {
    return [...logs]
      .slice(0, 7)
      .reverse()
      .map((log, index) => ({
        name: safeDateLabel(log.logDate || log.createdAt || index),
        duration:
          (parseInt(log.minutes || 0, 10) || 0) +
          (parseInt(log.seconds || 0, 10) || 0) / 60,
      }));
  }, [logs]);

  const categoryDistributionData = useMemo(() => {
    const counts = logs.reduce((acc, log) => {
      const category = log.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const routineExerciseData = useMemo(() => {
    return routines.slice(0, 6).map((routine, index) => ({
      name: routine.title || `Routine ${index + 1}`,
      exercises: Array.isArray(routine.exercises) ? routine.exercises.length : 0,
    }));
  }, [routines]);

  const hasAnyData = routines.length > 0 || logs.length > 0 || metricsHistory.length > 0;

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
          Progress Tracker
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "1rem",
            color: "rgba(0,0,0,0.7)",
            maxWidth: "760px",
          }}
        >
          Visualize your consistency, workout activity, body changes, and routine
          growth with a cleaner progress dashboard.
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
            <Typography sx={{ fontWeight: 700 }}>Total Routines</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {routines.length}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Active custom plans
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
            Logged workout entries
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <MonitorHeartRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Current BMI</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {latestBMI}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Latest recorded BMI
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <TrendingUpRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Workout Minutes</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {Math.round(totalWorkoutMinutes)}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Total logged minutes
          </Typography>
        </Box>
      </Stack>

      {!hasAnyData ? (
        <Box
          sx={{
            borderRadius: "24px",
            padding: { xs: "24px", md: "36px" },
            background: "rgba(255,255,255,0.42)",
            border: "1px solid rgba(255,255,255,0.18)",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, mb: 1 }}>
            No progress data available yet
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.7)" }}>
            Add body metrics, workout logs, and routines to unlock your charts here.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={3}
            useFlexGap
            flexWrap="wrap"
          >
            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                Workout Duration Trend
              </Typography>

              {workoutDurationData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={workoutDurationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="duration" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  No workout duration data available.
                </Typography>
              )}
            </Box>

            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                Workout Category Split
              </Typography>

              {categoryDistributionData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryDistributionData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {categoryDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  No category data available.
                </Typography>
              )}
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={3}
            useFlexGap
            flexWrap="wrap"
          >
            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                Weight Trend
              </Typography>

              {weightTrendData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={weightTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  No weight history available.
                </Typography>
              )}
            </Box>

            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                BMI Trend
              </Typography>

              {bmiTrendData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={bmiTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  No BMI history available.
                </Typography>
              )}
            </Box>
          </Stack>

          <Box sx={panelSx}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
              Routine Exercise Breakdown
            </Typography>

            {routineExerciseData.length > 0 ? (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={routineExerciseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="exercises" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                No routines available to graph.
              </Typography>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default ProgressTracker;