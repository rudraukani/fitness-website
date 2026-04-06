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
import { getBodyMetrics, getBodyMetricLogs } from "../../utils/bodyMetrics";

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

  if (typeof value === "object" && value !== null) {
    if (typeof value.toDate === "function") {
      const d = value.toDate();
      return Number.isNaN(d.getTime()) ? null : d;
    }

    if ("seconds" in value && typeof value.seconds === "number") {
      const d = new Date(value.seconds * 1000);
      return Number.isNaN(d.getTime()) ? null : d;
    }
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date;

  return null;
};

const getLogDate = (log) =>
  parseAnyDate(log?.logDate) ||
  parseAnyDate(log?.createdAt) ||
  parseAnyDate(log?.updatedAt);

const getMetricDate = (metric) =>
  parseAnyDate(metric?.date) ||
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

const makeRangeState = (defaultStart, defaultEnd) => ({
  start: defaultStart,
  end: defaultEnd,
});

const filterByRange = (items, getDateFn, range) => {
  const start = getMonthStartDate(range.start);
  const end = getMonthEndDate(range.end);
  if (!start || !end) return items;

  return items.filter((item) => {
    const date = getDateFn(item);
    return date && date >= start && date <= end;
  });
};

const RangeSelector = ({ title, range, onChange }) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    useFlexGap
    flexWrap="wrap"
    sx={{ mb: 2.5 }}
  >
    <Typography sx={{ fontWeight: 800, minWidth: "180px", pt: { md: 1.2 } }}>
      {title}
    </Typography>

    <TextField
      select
      label="Start Month"
      value={range.start}
      onChange={(e) => onChange({ ...range, start: e.target.value })}
      sx={{ ...inputSx, minWidth: "220px" }}
      size="small"
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
      value={range.end}
      onChange={(e) => onChange({ ...range, end: e.target.value })}
      sx={{ ...inputSx, minWidth: "220px" }}
      size="small"
    >
      {monthOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Stack>
);

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
  const [weightLogs, setWeightLogs] = useState([]);

  const [calendarRange, setCalendarRange] = useState(
    makeRangeState(defaultStart, currentMonth)
  );
  const [categoryRange, setCategoryRange] = useState(
    makeRangeState(defaultStart, currentMonth)
  );
  const [strengthRange, setStrengthRange] = useState(
    makeRangeState(defaultStart, currentMonth)
  );
  const [weightRange, setWeightRange] = useState(
    makeRangeState(defaultStart, currentMonth)
  );
  const [routineRange, setRoutineRange] = useState(
    makeRangeState(defaultStart, currentMonth)
  );

  useEffect(() => {
    const loadProgressData = async () => {
      if (!currentUser) {
        setRoutines([]);
        setLogs([]);
        setMetricsHistory([]);
        setWeightLogs([]);
        return;
      }

      try {
        const [routinesData, logsData, metricsData, bodyWeightLogsData] = await Promise.all([
          getRoutines(currentUser.uid),
          getWorkoutLogs(currentUser.uid),
          getBodyMetrics(currentUser.uid),
          getBodyMetricLogs(currentUser.uid),
        ]);

        setRoutines(Array.isArray(routinesData) ? routinesData : []);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setMetricsHistory(Array.isArray(metricsData) ? metricsData : []);
        setWeightLogs(Array.isArray(bodyWeightLogsData) ? bodyWeightLogsData : []);
      } catch (error) {
        console.error("Progress tracker load error:", error);
        setRoutines([]);
        setLogs([]);
        setMetricsHistory([]);
        setWeightLogs([]);
      }
    };

    loadProgressData();
  }, [currentUser]);

  const latestMetric = metricsHistory.length ? metricsHistory[0] : null;

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
        (sum, routine) =>
          sum + (Array.isArray(routine.exercises) ? routine.exercises.length : 0),
        0
      ),
    [routines]
  );

  const workoutDayCount = useMemo(() => logs.length, [logs]);

  const filteredLogsForCalendar = useMemo(
    () => filterByRange(logs, getLogDate, calendarRange),
    [logs, calendarRange]
  );

  const filteredLogsForCategory = useMemo(
    () => filterByRange(logs, getLogDate, categoryRange),
    [logs, categoryRange]
  );

  const filteredLogsForStrength = useMemo(
    () => filterByRange(logs, getLogDate, strengthRange),
    [logs, strengthRange]
  );

  const filteredWeightLogs = useMemo(
    () => filterByRange(weightLogs, getMetricDate, weightRange),
    [weightLogs, weightRange]
  );

  const filteredRoutinesForBreakdown = useMemo(
    () => filterByRange(routines, getRoutineDate, routineRange),
    [routines, routineRange]
  );

  const weightTrendData = useMemo(() => {
    const source = filteredWeightLogs.length > 0 ? filteredWeightLogs : [];

    return [...source]
      .reverse()
      .map((entry, index) => ({
        index: index + 1,
        label: entry.date || `Entry ${index + 1}`,
        weight: Number(entry.weight) || 0,
      }))
      .filter((item) => item.weight > 0);
  }, [filteredWeightLogs]);

  const categoryDistributionData = useMemo(() => {
    const counts = filteredLogsForCategory.reduce((acc, log) => {
      const routineFocus =
        log.routineSnapshot?.focus ||
        log.routineTitle ||
        "Other";
      acc[routineFocus] = (acc[routineFocus] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLogsForCategory]);

  const routineExerciseData = useMemo(() => {
    return filteredRoutinesForBreakdown.slice(0, 6).map((routine, index) => ({
      name: routine.title || `Routine ${index + 1}`,
      exercises: Array.isArray(routine.exercises) ? routine.exercises.length : 0,
    }));
  }, [filteredRoutinesForBreakdown]);

  const strengthProgressData = useMemo(() => {
    const maxByExercise = {};

    filteredLogsForStrength.forEach((log) => {
      const exercises = Array.isArray(log.exercisePerformance)
        ? log.exercisePerformance
        : [];

      exercises.forEach((exercise) => {
        const exerciseName = exercise?.exerciseName || "Unknown";
        const numericWeight = Number(exercise?.weight) || 0;
        const weightUnit = exercise?.weightUnit || "";

        if (numericWeight <= 0) return;

        if (
          !maxByExercise[exerciseName] ||
          numericWeight > maxByExercise[exerciseName].maxWeight
        ) {
          maxByExercise[exerciseName] = {
            name: exerciseName,
            maxWeight: numericWeight,
            unit: weightUnit,
          };
        }
      });
    });

    return Object.values(maxByExercise)
      .sort((a, b) => b.maxWeight - a.maxWeight)
      .slice(0, 8);
  }, [filteredLogsForStrength]);

  const calendarMonths = useMemo(() => {
    const start = getMonthStartDate(calendarRange.start);
    const end = getMonthEndDate(calendarRange.end);
    if (!start || !end || start > end) return [];

    const months = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= last) {
      months.push(new Date(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  }, [calendarRange]);

  const workoutLoggedByDate = useMemo(() => {
    const map = {};

    filteredLogsForCalendar.forEach((log) => {
      const date = getLogDate(log);
      if (!date) return;
      const key = date.toISOString().slice(0, 10);
      map[key] = true;
    });

    return map;
  }, [filteredLogsForCalendar]);

  const getCalendarCellStyles = (workedOut) => {
    if (!workedOut) {
      return {
        background: "rgba(255,255,255,0.45)",
        color: "rgba(0,0,0,0.45)",
      };
    }

    return {
      background: "rgba(48,102,190,0.98)",
      color: "#fff",
    };
  };

  const hasAnyData =
    routines.length > 0 ||
    logs.length > 0 ||
    metricsHistory.length > 0 ||
    weightLogs.length > 0;

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
          progress with separate time filters for each visualization.
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
            <Typography sx={{ fontWeight: 700 }}>Workout Days</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {workoutDayCount}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Logged workout sessions
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
            Add body metrics, weight logs, workout logs, and routines to unlock your charts here.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          <Box sx={panelSx}>
            <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 1 }}>
              Consistency Calendar
            </Typography>

            <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
              A blue date means the user logged a workout on that day.
            </Typography>

            <RangeSelector
              title="Calendar Range"
              range={calendarRange}
              onChange={setCalendarRange}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(17,17,17,0.18)",
                  borderRadius: "999px",
                },
              }}
            >
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
                      sx={{ width: 34, height: 34 }}
                    />
                  );
                }

                for (let day = 1; day <= daysInMonth; day += 1) {
                  const dateKey = new Date(year, month, day)
                    .toISOString()
                    .slice(0, 10);
                  const workedOut = Boolean(workoutLoggedByDate[dateKey]);
                  const styles = getCalendarCellStyles(workedOut);

                  cells.push(
                    <Box
                      key={dateKey}
                      title={`${getDateLabel(new Date(dateKey))}${workedOut ? ": workout logged" : ""}`}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        ...styles,
                      }}
                    >
                      {day}
                    </Box>
                  );
                }

                return (
                  <Box
                    key={`${year}-${month}`}
                    sx={{
                      minWidth: "310px",
                      flexShrink: 0,
                      p: 2,
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.52)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, mb: 1.5 }}>
                      {getMonthLabel(monthDate)}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 34px)",
                        gap: 0.75,
                        justifyContent: "flex-start",
                      }}
                    >
                      {["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
                        <Box
                          key={`${year}-${month}-${dayName}-${index}`}
                          sx={{
                            width: 34,
                            textAlign: "center",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: "rgba(0,0,0,0.65)",
                            mb: 0.25,
                          }}
                        >
                          {dayName}
                        </Box>
                      ))}
                      {cells}
                    </Box>
                  </Box>
                );
              })}
            </Box>
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

              <RangeSelector
                title="Category Range"
                range={categoryRange}
                onChange={setCategoryRange}
              />

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
                      <Tooltip formatter={(value, name) => [value, name]} />
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

              <RangeSelector
                title="Strength Range"
                range={strengthRange}
                onChange={setStrengthRange}
              />

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

              <RangeSelector
                title="Weight Range"
                range={weightRange}
                onChange={setWeightRange}
              />

              {weightTrendData.length > 0 ? (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={weightTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label">
                        <Label value="Month / Date" position="insideBottom" offset={-2} />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Weight (kg)"
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
                Routine Exercise Breakdown
              </Typography>

              <RangeSelector
                title="Routine Range"
                range={routineRange}
                onChange={setRoutineRange}
              />

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
          </Stack>

          <Box sx={panelSx}>
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
              your saved routines.
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default ProgressTracker;