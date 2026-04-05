import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getWorkoutLogs } from "../../utils/workoutLogs";
import { getBodyMetrics } from "../../utils/bodyMetrics";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ProgressTracker = () => {
  const { currentUser } = useAuth();

  const [chartData, setChartData] = useState([]);
  const [datesWorked, setDatesWorked] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const generateCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let dayCounter = 1;

    for (let i = 0; i < 42; i++) {
      if (i < firstDay || dayCounter > daysInMonth) {
        calendar.push(null);
      } else {
        const dateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(dayCounter).padStart(2, "0")}`;

        calendar.push({
          day: dayCounter,
          hasWorkout: datesWorked.includes(dateString),
        });

        dayCounter++;
      }
    }

    return calendar;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;

      try {
        // 🔥 WORKOUT LOGS
        const logs = await getWorkoutLogs(currentUser.uid);

        const formatted = logs.map((log) => ({
          date: log.logDate,
          volume: log.weight * log.reps,
          duration: Number(log.minutes) + Number(log.seconds) / 60,
        }));

        setChartData(formatted.reverse());

        const uniqueDates = [
          ...new Set(
            logs.map((l) =>
              new Date(l.logDate).toISOString().split("T")[0]
            )
          ),
        ];

        setDatesWorked(uniqueDates);

        // 🔥 BODY METRICS (FIXED)
        const bodyMetrics = await getBodyMetrics(currentUser.uid);

        const formattedWeight = bodyMetrics
          .filter((log) => log.weight && log.createdAt)
          .map((log) => {
            const cleanWeight = String(log.weight).replace(/[^\d.]/g, "");

            return {
              date: new Date(log.createdAt.seconds * 1000)
                .toISOString()
                .split("T")[0],
              weight: Number(cleanWeight),
            };
          })
          .filter((item) => item.weight > 0 && item.weight < 300); // realistic range

        setWeightData(formattedWeight.reverse());
      } catch (error) {
        console.error("Progress tracker error:", error);
      }
    };

    loadData();
  }, [currentUser]);

  const calendarData = generateCalendar();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontSize: "2.2rem", fontWeight: 800, mb: 3 }}>
        Progress Tracker
      </Typography>

      {chartData.length === 0 ? (
        <Typography>No workout data available</Typography>
      ) : (
        <>
          {/* Strength */}
          <Box sx={{ height: 300, mb: 5 }}>
            <Typography sx={{ fontWeight: 700 }}>
              Strength Progress
            </Typography>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="volume" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Duration */}
          <Box sx={{ height: 300, mb: 5 }}>
            <Typography sx={{ fontWeight: 700 }}>
              Workout Duration
            </Typography>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="duration" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* 🔥 BODY WEIGHT GRAPH */}
          <Box sx={{ height: 300, mb: 5 }}>
            <Typography sx={{ fontWeight: 700 }}>
              Body Weight Progress
            </Typography>
            <ResponsiveContainer>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="weight" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* CALENDAR */}
          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton onClick={handlePrevMonth}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>

              <Typography sx={{ fontWeight: 700 }}>
                {monthName} {year}
              </Typography>

              <IconButton onClick={handleNextMonth}>
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            <Grid container spacing={1} sx={{ mt: 1 }}>
              {calendarData.map((day, index) => (
                <Grid item xs={1.7} key={index}>
                  <Box
                    sx={{
                      height: 60,
                      borderRadius: "10px",
                      backgroundColor: day?.hasWorkout
                        ? "#3066BE"
                        : "#f5f7fa",
                      color: day?.hasWorkout ? "#fff" : "#000",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {day?.day}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProgressTracker;
