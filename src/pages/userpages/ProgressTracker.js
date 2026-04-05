import React, { useEffect, useMemo, useState } from "react";
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
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
  Label,
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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.65)",
  },
};

const pieColors = ["#111111", "#3066BE", "#6C8CD5", "#8FAADC", "#B7C7E6", "#D8E1F0"];

const monthOptions = (() => {
  const options = [];
  const startYear = 2024;
  const endYear = 2027;
  for (let year = startYear; year <= endYear; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const value = `${year}-${String(month).padStart(2, "0")}`;
      const label = new Date(`${value}-01`).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
      });
      options.push({ value, label });
    }
  }
  return options;
})();

const parseAnyDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date;
  return null;
};

const getLogDate = (log) =>
  parseAnyDate(log?.logDate) ||
  parseAnyDate(log?.createdAt) ||
  parseAnyDate(log?.updatedAt);

const getMetricDate = (metric) =>
  parseAnyDate(metric?.updatedAt) ||
  parseAnyDate(metric?.createdAt) ||
  parseAnyDate(metric?.logDate);

const getRoutineDate = (routine) =>
  parseAnyDate(routine?.updatedAt) ||
  parseAnyDate(routine?.createdAt);

const getMonthStartDate = (monthString) => {
  if (!monthString) return null;
  return new Date(`${monthString}-01T00:00:00`);
};

const getMonthEndDate = (monthString) => {
  if (!monthString) return null;
  const [year, month] = monthString.split("-").map(Number);
  return new Date(year, month, 0, 23, 59, 59, 999);
};

const getMonthLabel = (date) =>
  date.toLocaleDateString("en-CA", { month: "short", year: "numeric" });

const getDateLabel = (date) =>
  date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });

const valueOnlyTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <Box
      sx={{
        background: "rgba(17,17,17,0.92)",
        color: "#fff",
        px: 1.5,
        py: 1,
        borderRadius: "10px",
        fontSize: "0.9rem",
      }}
    >
      {payload.map((item) => (
        <Typography
          key={item.dataKey}
          sx={{ fontSize: "0.9rem", color: "#fff" }}
        >
          {item.name}: {item.value}
        </Typography>
      ))}
    </Box>
  );
};

const ProgressTracker = () => {
  const { currentUser } = useAuth();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const defaultStart = `${new Date().getFullYear() - 1}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [startMonth, setStartMonth] = useState(defaultStart);
  const [endMonth, setEndMonth] = useState(currentMonth);

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

  const rangeStart = useMemo(() => getMonthStartDate(startMonth), [startMonth]);
  const rangeEnd = useMemo(() => getMonthEndDate(endMonth), [endMonth]);

  const filteredLogs = useMemo(() => {
    if (!rangeStart || !rangeEnd) return logs;
    return logs.filter((log) => {
      const date = getLogDate(log);
      return date && date >= rangeStart && date <= rangeEnd;
    });
  }, [logs, rangeStart, rangeEnd]);

  const filteredMetrics = useMemo(() => {
    if (!rangeStart || !rangeEnd) return metricsHistory;
    return metricsHistory.filter((metric) => {
      const date = getMetricDate(metric);
      return date && date >= rangeStart && date <= rangeEnd;
    });
  }, [metricsHistory, rangeStart, rangeEnd]);

  const filteredRoutines = useMemo(() => {
    if (!rangeStart || !rangeEnd) return routines;
    return routines.filter((routine) => {
      const date = getRoutineDate(routine);
      if (!date) return true;
      return date >= rangeStart && date <= rangeEnd;
    });
  }, [routines, rangeStart, rangeEnd]);

  const latestMetric = filteredMetrics.length
    ? filteredMetrics[filteredMetrics.length - 1]
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
      filteredRoutines.reduce(
        (sum, routine) =>
          sum + (Array.isArray(routine.exercises) ? routine.exercises.length : 0),
        0
      ),
    [filteredRoutines]
  );

  const totalWorkoutMinutes = useMemo(
    () =>
      filteredLogs.reduce((sum, log) => {
        const mins = parseInt(log.minutes || 0, 10) || 0;
        const secs = parseInt(log.seconds || 0, 10) || 0;
        return sum + mins + secs / 60;
      }, 0),
    [filteredLogs]
  );

  const weightTrendData = useMemo(() => {
    return filteredMetrics
      .map((entry, index) => ({
        index: index + 1,
        weight: Number(entry.weight) || 0,
      }))
      .filter((item) => item.weight > 0);
  }, [filteredMetrics]);

  const bmiTrendData = useMemo(() => {
    return filteredMetrics
      .map((entry, index) => {
        const heightCm = parseFloat(entry.height);
        const weightKg = parseFloat(entry.weight);

        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
          return { index: index + 1, bmi: 0 };
        }

        const heightMeters = heightCm / 100;
        return {
          index: index + 1,
          bmi: Number((weightKg / (heightMeters * heightMeters)).toFixed(2)),
        };
      })
      .filter((item) => item.bmi > 0);
  }, [filteredMetrics]);

  const categoryDistributionData = useMemo(() => {
    const counts = filteredLogs.reduce((acc, log) => {
      const category = log.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  const routineExerciseData = useMemo(() => {
    return filteredRoutines.slice(0, 6).map((routine, index) => ({
      name: routine.title || `Routine ${index + 1}`,
      exercises: Array.isArray(routine.exercises) ? routine.exercises.length : 0,
    }));
  }, [filteredRoutines]);

  const strengthProgressData = useMemo(() => {
    const maxByExercise = filteredLogs.reduce((acc, log) => {
      const exerciseName = log.exercise?.name || log.exercise || "Unknown";
      const numericWeight = Number(log.weight) || 0;
      const weightUnit = log.weightUnit || "";

      if (!acc[exerciseName] || numericWeight > acc[exerciseName].maxWeight) {
        acc[exerciseName] = {
          name: exerciseName,
          maxWeight: numericWeight,
          unit: weightUnit,
        };
      }
      return acc;
    }, {});

    return Object.values(maxByExercise)
      .sort((a, b) => b.maxWeight - a.maxWeight)
      .slice(0, 8);
  }, [filteredLogs]);

  const calendarMonths = useMemo(() => {
    if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) return [];

    const months = [];
    const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    const last = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

    while (cursor <= last) {
      months.push(new Date(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  }, [rangeStart, rangeEnd]);

  const workoutMinutesByDate = useMemo(() => {
    const map = {};

    filteredLogs.forEach((log) => {
      const date = getLogDate(log);
      if (!date) return;
      const key = date.toISOString().slice(0, 10);
      const mins = parseInt(log.minutes || 0, 10) || 0;
      const secs = parseInt(log.seconds || 0, 10) || 0;
      const total = mins + secs / 60;
      map[key] = (map[key] || 0) + total;
    });

    return map;
  }, [filteredLogs]);

  const getCalendarCellStyles = (minutes) => {
    if (!minutes) {
      return {
        background: "rgba(255,255,255,0.45)",
        color: "rgba(0,0,0,0.45)",
      };
    }
    if (minutes < 15) {
      return {
        background: "rgba(183,199,230,0.9)",
        color: "#111",
      };
    }
    if (minutes < 30) {
      return {
        background: "rgba(143,170,220,0.95)",
        color: "#111",
      };
    }
    if (minutes < 45) {
      return {
        background: "rgba(108,140,213,0.96)",
        color: "#fff",
      };
    }
    return {
      background: "rgba(48,102,190,0.98)",
      color: "#fff",
    };
  };

  const hasAnyData =
    filteredRoutines.length > 0 ||
    filteredLogs.length > 0 ||
    filteredMetrics.length > 0;

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
          Track your workout patterns, body changes, consistency, and strength
          progress with a more detailed visual dashboard.
        </Typography>
      </Box>

      {/* Time Selection */}
      <Box sx={{ ...panelSx, mb: 4 }}>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, mb: 2 }}>
          Time Range Selection
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          <TextField
            select
            label="Start Month"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            sx={{ ...inputSx, minWidth: "240px" }}
          >
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="End Month"
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            sx={{ ...inputSx, minWidth: "240px" }}
          >
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
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
            {filteredRoutines.length}
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
            {filteredLogs.length}
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
          {/* Consistency Calendar */}
          <Box sx={panelSx}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 1 }}>
              Consistency Calendar + Workout Duration
            </Typography>

            <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
              Each calendar date shows the total workout minutes logged on that day.
            </Typography>

            <Stack spacing={3}>
              {calendarMonths.map((monthDate) => {
                const year = monthDate.getFullYear();
                const month = monthDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const offset = firstDay.getDay();

                const cells = [];

                for (let i = 0; i < offset; i += 1) {
                  cells.push(
                    <Box
                      key={`empty-${year}-${month}-${i}`}
                      sx={{ width: 44, height: 44 }}
                    />
                  );
                }

                for (let day = 1; day <= daysInMonth; day += 1) {
                  const dateKey = new Date(year, month, day)
                    .toISOString()
                    .slice(0, 10);
                  const minutes = workoutMinutesByDate[dateKey] || 0;
                  const styles = getCalendarCellStyles(minutes);

                  cells.push(
                    <Box
                      key={dateKey}
                      title={`${getDateLabel(new Date(dateKey))}: ${Math.round(
                        minutes
                      )} min`}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        ...styles,
                      }}
                    >
                      <Box sx={{ lineHeight: 1 }}>{day}</Box>
                      <Box sx={{ lineHeight: 1, fontSize: "0.63rem" }}>
                        {minutes ? Math.round(minutes) : "-"}
                      </Box>
                    </Box>
                  );
                }

                return (
                  <Box key={`${year}-${month}`}>
                    <Typography sx={{ fontWeight: 800, mb: 1.5 }}>
                      {getMonthLabel(monthDate)}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 44px)",
                        gap: 1,
                        justifyContent: "flex-start",
                      }}
                    >
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (dayName) => (
                          <Box
                            key={`${year}-${month}-${dayName}`}
                            sx={{
                              width: 44,
                              textAlign: "center",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              color: "rgba(0,0,0,0.7)",
                              mb: 0.5,
                            }}
                          >
                            {dayName}
                          </Box>
                        )
                      )}
                      {cells}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={3}
            useFlexGap
            flexWrap="wrap"
          >
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
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                      />
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

            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                Strength Progress
              </Typography>

              {strengthProgressData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={strengthProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name">
                        <Label value="Exercises" position="insideBottom" offset={-2} />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Max Weight"
                          angle={-90}
                          position="insideLeft"
                          style={{ textAnchor: "middle" }}
                        />
                      </YAxis>
                      <Tooltip content={valueOnlyTooltip} />
                      <Bar
                        dataKey="maxWeight"
                        name="Max Weight"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  No strength data available.
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
                      <XAxis
                        dataKey="index"
                        tickFormatter={() => ""}
                      >
                        <Label value="Entries" position="insideBottom" offset={-2} />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Weight"
                          angle={-90}
                          position="insideLeft"
                          style={{ textAnchor: "middle" }}
                        />
                      </YAxis>
                      <Tooltip content={valueOnlyTooltip} />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Weight"
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
                      <XAxis
                        dataKey="index"
                        tickFormatter={() => ""}
                      >
                        <Label value="Entries" position="insideBottom" offset={-2} />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="BMI"
                          angle={-90}
                          position="insideLeft"
                          style={{ textAnchor: "middle" }}
                        />
                      </YAxis>
                      <Tooltip content={valueOnlyTooltip} />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        name="BMI"
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

          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={3}
            useFlexGap
            flexWrap="wrap"
          >
            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                Routine Exercise Breakdown
              </Typography>

              {routineExerciseData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={routineExerciseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name">
                        <Label value="Routines" position="insideBottom" offset={-2} />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Exercises"
                          angle={-90}
                          position="insideLeft"
                          style={{ textAnchor: "middle" }}
                        />
                      </YAxis>
                      <Tooltip content={valueOnlyTooltip} />
                      <Bar
                        dataKey="exercises"
                        name="Exercises"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                  No routines available to graph.
                </Typography>
              )}
            </Box>

            <Box sx={{ ...panelSx, flex: 1, minWidth: "320px" }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2 }}>
                Total Exercises Across Routines
              </Typography>

              <Typography
                sx={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "#111",
                  mb: 1,
                }}
              >
                {totalExercisesAcrossRoutines}
              </Typography>

              <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8 }}>
                This shows the total number of exercises you have added across all
                your saved routines in the selected time range.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default ProgressTracker;