import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useAuth } from "../../context/AuthContext";
import {
  addWorkoutLog,
  deleteWorkoutLog,
  getWorkoutLogs,
} from "../../utils/workoutLogs";

const exerciseOptions = [
  "Squats",
  "Deadlift",
  "Bench Press",
  "Shoulder Press",
  "Lat Pulldown",
  "Bicep Curls",
  "Tricep Pushdown",
  "Leg Press",
  "Lunges",
  "Plank",
  "Crunches",
  "Running",
  "Cycling",
];

const categoryOptions = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Abs",
  "Cardio",
  "Full Body",
];

const equipmentOptions = [
  "None",
  "Dumbbells",
  "Barbell",
  "Machine",
  "Cable",
  "Kettlebell",
  "Resistance Band",
  "Bodyweight",
  "Treadmill",
  "Bike",
];

const weightUnitOptions = ["kg", "lbs"];

const emptyLogForm = {
  logDate: "",
  exercise: "",
  equipment: "",
  category: "",
  sets: "",
  reps: "",
  weight: "",
  weightUnit: "kg",
  minutes: "",
  seconds: "",
};

const infoCardSx = {
  flex: 1,
  minWidth: "180px",
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "20px",
  padding: "18px",
  backdropFilter: "blur(10px)",
};

const logCardSx = {
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

const WorkoutLogs = () => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState(emptyLogForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      if (!currentUser) {
        setLogs([]);
        return;
      }

      try {
        const firestoreLogs = await getWorkoutLogs(currentUser.uid);
        setLogs(firestoreLogs);
      } catch (error) {
        console.error("Load workout logs error:", error);
        setLogs([]);
      }
    };

    loadLogs();
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitLog = async () => {
    const trimmedData = {
      logDate: formData.logDate.trim(),
      exercise: formData.exercise.trim(),
      equipment: formData.equipment.trim(),
      category: formData.category.trim(),
      sets: formData.sets.trim(),
      reps: formData.reps.trim(),
      weight: formData.weight.trim(),
      weightUnit: formData.weightUnit.trim(),
      minutes: formData.minutes.trim(),
      seconds: formData.seconds.trim(),
    };

    if (
      !trimmedData.logDate ||
      !trimmedData.exercise ||
      !trimmedData.equipment ||
      !trimmedData.category ||
      !trimmedData.sets ||
      !trimmedData.reps ||
      !trimmedData.weight ||
      !trimmedData.weightUnit ||
      !trimmedData.minutes ||
      !trimmedData.seconds
    ) {
      setFormError("Please fill in all workout log fields before submitting.");
      return;
    }

    if (!currentUser) {
      setFormError("Please log in to save workout logs.");
      return;
    }

    try {
      await addWorkoutLog(currentUser.uid, {
        logDate: trimmedData.logDate,
        exercise: {
          id: "",
          name: trimmedData.exercise,
        },
        equipment: trimmedData.equipment,
        category: trimmedData.category,
        sets: trimmedData.sets,
        reps: trimmedData.reps,
        weight: trimmedData.weight,
        weightUnit: trimmedData.weightUnit,
        minutes: trimmedData.minutes,
        seconds: trimmedData.seconds,
      });

      const firestoreLogs = await getWorkoutLogs(currentUser.uid);
      setLogs(firestoreLogs);
      setFormData(emptyLogForm);
      setFormError("");
    } catch (error) {
      console.error("Save workout log error:", error);
      setFormError("Failed to save workout log.");
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!currentUser) return;

    try {
      await deleteWorkoutLog(currentUser.uid, logId);
      const firestoreLogs = await getWorkoutLogs(currentUser.uid);
      setLogs(firestoreLogs);
    } catch (error) {
      console.error("Delete workout log error:", error);
    }
  };

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
          Workout Logs
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "1rem",
            color: "rgba(0,0,0,0.7)",
            maxWidth: "760px",
          }}
        >
          Track each workout session by entering exercise details, training
          volume, equipment used, and workout duration.
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
            <Typography sx={{ fontWeight: 700 }}>Total Logs</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {logs.length}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Workout entries recorded
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <CalendarMonthRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Latest Category</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {logs[0]?.category || "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Most recently logged category
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <AccessTimeRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Latest Duration</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {logs[0] ? `${logs[0].minutes}m ${logs[0].seconds}s` : "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Time from latest workout log
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          mb: 4,
          borderRadius: "24px",
          padding: { xs: "20px", md: "28px" },
          background: "rgba(255,255,255,0.52)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, mb: 1 }}>
          Add Workout Log
        </Typography>

        <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
          Enter your workout session details below and submit your log.
        </Typography>

        <Stack spacing={2.2}>
          <TextField
            label="Log Date"
            type="date"
            fullWidth
            value={formData.logDate}
            onChange={(e) => handleInputChange("logDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              select
              label="Exercise"
              fullWidth
              value={formData.exercise}
              onChange={(e) => handleInputChange("exercise", e.target.value)}
              sx={inputSx}
            >
              {exerciseOptions.map((exercise) => (
                <MenuItem key={exercise} value={exercise}>
                  {exercise}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Equipment"
              fullWidth
              value={formData.equipment}
              onChange={(e) => handleInputChange("equipment", e.target.value)}
              sx={inputSx}
            >
              {equipmentOptions.map((equipment) => (
                <MenuItem key={equipment} value={equipment}>
                  {equipment}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              select
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              sx={inputSx}
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Sets"
              fullWidth
              value={formData.sets}
              onChange={(e) => handleInputChange("sets", e.target.value)}
              sx={inputSx}
            />
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              label="Reps"
              fullWidth
              value={formData.reps}
              onChange={(e) => handleInputChange("reps", e.target.value)}
              sx={inputSx}
            />

            <TextField
              label="Weight"
              fullWidth
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              sx={inputSx}
            />

            <TextField
              select
              label="Weight Unit"
              fullWidth
              value={formData.weightUnit}
              onChange={(e) => handleInputChange("weightUnit", e.target.value)}
              sx={inputSx}
            >
              {weightUnitOptions.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              label="Minutes"
              fullWidth
              value={formData.minutes}
              onChange={(e) => handleInputChange("minutes", e.target.value)}
              sx={inputSx}
            />

            <TextField
              label="Seconds"
              fullWidth
              value={formData.seconds}
              onChange={(e) => handleInputChange("seconds", e.target.value)}
              sx={inputSx}
            />
          </Stack>

          {formError && (
            <Typography sx={{ color: "#b42318", fontWeight: 600 }}>
              {formError}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleSubmitLog}
            sx={{
              alignSelf: "flex-start",
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "14px",
              px: 3,
              py: 1.1,
              boxShadow: "none",
              "&:hover": {
                background: "#222",
                boxShadow: "none",
              },
            }}
          >
            Submit
          </Button>
        </Stack>
      </Box>

      {logs.length === 0 ? (
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
            No workout logs added yet
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.7)" }}>
            Submit your first workout entry to start tracking your progress.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {logs.map((log) => (
            <Box key={log.id} sx={logCardSx}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={1.5}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.4rem", md: "1.65rem" },
                        fontWeight: 800,
                        color: "#111",
                      }}
                    >
                      {log.exercise?.name || log.exercise}
                    </Typography>

                    <Chip
                      label={log.category}
                      sx={{
                        fontWeight: 700,
                        background: "rgba(17,17,17,0.08)",
                        color: "#111",
                      }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      color: "rgba(0,0,0,0.72)",
                      fontSize: "1rem",
                      mb: 2,
                    }}
                  >
                    Logged on: {log.logDate}
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ mb: 2 }}
                  >
                    <Chip label={`Equipment: ${log.equipment}`} />
                    <Chip label={`Sets: ${log.sets}`} />
                    <Chip label={`Reps: ${log.reps}`} />
                    <Chip label={`Weight: ${log.weight} ${log.weightUnit}`} />
                    <Chip label={`Time: ${log.minutes}m ${log.seconds}s`} />
                  </Stack>
                </Box>

                <Stack
                  direction={{ xs: "row", md: "column" }}
                  spacing={1.5}
                  justifyContent="center"
                  sx={{ minWidth: { md: "180px" } }}
                >
                  <Button
                    variant="text"
                    startIcon={<DeleteRoundedIcon />}
                    onClick={() => handleDeleteLog(log.id)}
                    sx={{
                      color: "#b42318",
                      fontWeight: 700,
                      borderRadius: "14px",
                      "&:hover": {
                        background: "rgba(180,35,24,0.08)",
                      },
                    }}
                  >
                    Delete Log
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default WorkoutLogs;