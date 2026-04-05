import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { useAuth } from "../../context/AuthContext";
import {
  addWorkoutLog,
  deleteWorkoutLog,
  getWorkoutLogs,
} from "../../utils/workoutLogs";
import { getRoutines } from "../../utils/routines";

const weightUnitOptions = ["kg", "lbs"];

const emptyLogForm = {
  logDate: "",
  routineId: "",
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

const exerciseCardSx = {
  borderRadius: "18px",
  padding: "16px",
  background: "rgba(255,255,255,0.5)",
  border: "1px solid rgba(255,255,255,0.18)",
};

const WorkoutLogs = () => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [formData, setFormData] = useState(emptyLogForm);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [exercisePerformance, setExercisePerformance] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        setLogs([]);
        setRoutines([]);
        return;
      }

      try {
        const [firestoreLogs, firestoreRoutines] = await Promise.all([
          getWorkoutLogs(),
          getRoutines(currentUser.uid),
        ]);

        setLogs(firestoreLogs);
        setRoutines(firestoreRoutines);
      } catch (error) {
        console.error("Load workout data error:", error);
        setLogs([]);
        setRoutines([]);
      }
    };

    loadData();
  }, [currentUser]);

  const latestLog = logs[0];

  const latestDurationLabel = useMemo(() => {
    if (!latestLog?.routineSnapshot?.duration) return "-";
    return latestLog.routineSnapshot.duration;
  }, [latestLog]);

  const latestRoutineLabel = useMemo(() => {
    return latestLog?.routineTitle || "-";
  }, [latestLog]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "routineId") {
      const routine = routines.find((item) => item.id === value) || null;
      setSelectedRoutine(routine);

      const nextPerformance = {};
      (routine?.exercises || []).forEach((exercise, index) => {
        nextPerformance[index] = {
          weight: "",
          weightUnit: "kg",
        };
      });
      setExercisePerformance(nextPerformance);
    }
  };

  const handleExercisePerformanceChange = (index, field, value) => {
    setExercisePerformance((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const buildRoutineSnapshot = (routine) => ({
    title: routine?.title || "",
    level: routine?.level || "",
    duration:
      routine?.duration ||
      [
        routine?.durationValue || "",
        routine?.durationUnit || "",
      ]
        .filter(Boolean)
        .join(" "),
    frequency:
      routine?.frequency ||
      [
        routine?.frequencyValue || "",
        routine?.frequencyUnit || "",
      ]
        .filter(Boolean)
        .join(" "),
    focus: routine?.focus || "",
    notes: routine?.notes || routine?.description || "",
    exercises: Array.isArray(routine?.exercises) ? routine.exercises : [],
  });

  const handleSubmitLog = async () => {
    const trimmedData = {
      logDate: formData.logDate.trim(),
      routineId: formData.routineId.trim(),
    };

    if (!trimmedData.logDate || !trimmedData.routineId || !selectedRoutine) {
      setFormError("Please select a log date and routine before submitting.");
      return;
    }

    if (!currentUser) {
      setFormError("Please log in to save workout logs.");
      return;
    }

    const exercises = selectedRoutine.exercises || [];

    for (let index = 0; index < exercises.length; index += 1) {
      const exercise = exercises[index];
      const requiresWeight = Boolean(exercise?.equipment?.trim());

      if (requiresWeight) {
        const enteredWeight = `${exercisePerformance[index]?.weight || ""}`.trim();
        const enteredWeightUnit = `${exercisePerformance[index]?.weightUnit || ""}`.trim();

        if (!enteredWeight || !enteredWeightUnit) {
          setFormError(
            `Please enter weight and unit for ${exercise.name || `exercise ${index + 1}`}.`
          );
          return;
        }
      }
    }

    try {
      const payload = {
        logDate: trimmedData.logDate,
        routineId: selectedRoutine.id,
        routineTitle: selectedRoutine.title || "",
        routineSnapshot: buildRoutineSnapshot(selectedRoutine),
        exercisePerformance: exercises.map((exercise, index) => ({
          exerciseName: exercise?.name || "",
          equipment: exercise?.equipment || "",
          sets: exercise?.sets || "",
          reps: exercise?.reps || "",
          timeValue: exercise?.timeValue || "",
          timeUnit: exercise?.timeUnit || "",
          weight: exercise?.equipment
            ? Number(exercisePerformance[index]?.weight || 0)
            : 0,
          weightUnit: exercise?.equipment
            ? exercisePerformance[index]?.weightUnit || "kg"
            : "",
        })),
      };

      await addWorkoutLog(payload);

      const firestoreLogs = await getWorkoutLogs();
      setLogs(firestoreLogs);
      setFormData(emptyLogForm);
      setSelectedRoutine(null);
      setExercisePerformance({});
      setFormError("");
    } catch (error) {
      console.error("Save workout log error:", error);
      setFormError("Failed to save workout log.");
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!currentUser) return;

    try {
      await deleteWorkoutLog(logId);
      getWorkoutLogs();
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
          Track each workout session by selecting a routine, reviewing the saved
          exercises, and logging any weight used where equipment is required.
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
            <AssignmentRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Latest Routine</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {latestRoutineLabel}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Most recently logged routine
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <AccessTimeRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Latest Duration</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {latestDurationLabel}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Duration from latest routine snapshot
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
          Select the date and routine below. Saved exercises will appear
          automatically.
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

          <TextField
            select
            label="Routine"
            fullWidth
            value={formData.routineId}
            onChange={(e) => handleInputChange("routineId", e.target.value)}
            sx={inputSx}
          >
            {routines.map((routine) => (
              <MenuItem key={routine.id} value={routine.id}>
                {routine.title}
              </MenuItem>
            ))}
          </TextField>

          {selectedRoutine && (
            <Box
              sx={{
                borderRadius: "20px",
                padding: "18px",
                background: "rgba(255,255,255,0.42)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 2 }}
              >
                {!!selectedRoutine.level && (
                  <Chip label={`Level: ${selectedRoutine.level}`} />
                )}
                {!!buildRoutineSnapshot(selectedRoutine).duration && (
                  <Chip
                    label={`Duration: ${buildRoutineSnapshot(selectedRoutine).duration}`}
                  />
                )}
                {!!buildRoutineSnapshot(selectedRoutine).frequency && (
                  <Chip
                    label={`Frequency: ${buildRoutineSnapshot(selectedRoutine).frequency}`}
                  />
                )}
                {!!selectedRoutine.focus && (
                  <Chip label={`Focus: ${selectedRoutine.focus}`} />
                )}
              </Stack>

              <Typography sx={{ fontWeight: 800, mb: 2 }}>
                Saved Exercises
              </Typography>

              <Stack spacing={2}>
                {(selectedRoutine.exercises || []).map((exercise, index) => {
                  const hasEquipment = Boolean(exercise?.equipment?.trim());

                  return (
                    <Box key={`${exercise.name}-${index}`} sx={exerciseCardSx}>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography
                            sx={{ fontSize: "1.05rem", fontWeight: 800 }}
                          >
                            {exercise.name || `Exercise ${index + 1}`}
                          </Typography>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            sx={{ mt: 1 }}
                          >
                            {!!exercise.sets && (
                              <Chip label={`Sets: ${exercise.sets}`} />
                            )}
                            {!!exercise.reps && (
                              <Chip label={`Reps: ${exercise.reps}`} />
                            )}
                            {!!exercise.timeValue && !!exercise.timeUnit && (
                              <Chip
                                label={`Time: ${exercise.timeValue} ${exercise.timeUnit}`}
                              />
                            )}
                            {!!exercise.equipment && (
                              <Chip label={`Equipment: ${exercise.equipment}`} />
                            )}
                          </Stack>
                        </Box>

                        {hasEquipment && (
                          <>
                            <Divider />
                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              spacing={2}
                              useFlexGap
                              flexWrap="wrap"
                            >
                              <TextField
                                select
                                label="Weight"
                                fullWidth
                                value={exercisePerformance[index]?.weight || ""}
                                onChange={(e) =>
                                  handleExercisePerformanceChange(
                                    index,
                                    "weight",
                                    e.target.value
                                  )
                                }
                                sx={inputSx}
                              >
                                {Array.from({ length: 401 }, (_, i) => i).map(
                                  (value) => (
                                    <MenuItem key={value} value={value}>
                                      {value}
                                    </MenuItem>
                                  )
                                )}
                              </TextField>

                              <TextField
                                select
                                label="Weight Unit"
                                fullWidth
                                value={
                                  exercisePerformance[index]?.weightUnit || "kg"
                                }
                                onChange={(e) =>
                                  handleExercisePerformanceChange(
                                    index,
                                    "weightUnit",
                                    e.target.value
                                  )
                                }
                                sx={inputSx}
                              >
                                {weightUnitOptions.map((unit) => (
                                  <MenuItem key={unit} value={unit}>
                                    {unit}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </>
                        )}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

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
                      {log.routineTitle || log.routineSnapshot?.title || "Routine"}
                    </Typography>

                    {!!log.routineSnapshot?.focus && (
                      <Chip
                        label={log.routineSnapshot.focus}
                        sx={{
                          fontWeight: 700,
                          background: "rgba(17,17,17,0.08)",
                          color: "#111",
                        }}
                      />
                    )}
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
                    {!!log.routineSnapshot?.level && (
                      <Chip label={`Level: ${log.routineSnapshot.level}`} />
                    )}
                    {!!log.routineSnapshot?.duration && (
                      <Chip label={`Duration: ${log.routineSnapshot.duration}`} />
                    )}
                    {!!log.routineSnapshot?.frequency && (
                      <Chip label={`Frequency: ${log.routineSnapshot.frequency}`} />
                    )}
                    <Chip
                      label={`Exercises: ${
                        log.routineSnapshot?.exercises?.length || 0
                      }`}
                    />
                  </Stack>

                  <Stack spacing={1.25}>
                    {(log.exercisePerformance || []).map((exercise, index) => (
                      <Box
                        key={`${exercise.exerciseName}-${index}`}
                        sx={{
                          borderRadius: "16px",
                          padding: "14px",
                          background: "rgba(255,255,255,0.38)",
                          border: "1px solid rgba(255,255,255,0.16)",
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, mb: 1 }}>
                          {exercise.exerciseName || `Exercise ${index + 1}`}
                        </Typography>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          useFlexGap
                          flexWrap="wrap"
                        >
                          {!!exercise.equipment && (
                            <Chip label={`Equipment: ${exercise.equipment}`} />
                          )}
                          {!!exercise.sets && (
                            <Chip label={`Sets: ${exercise.sets}`} />
                          )}
                          {!!exercise.reps && (
                            <Chip label={`Reps: ${exercise.reps}`} />
                          )}
                          {!!exercise.timeValue && !!exercise.timeUnit && (
                            <Chip
                              label={`Time: ${exercise.timeValue} ${exercise.timeUnit}`}
                            />
                          )}
                          {!!exercise.weight && !!exercise.weightUnit && (
                            <Chip
                              label={`Weight: ${exercise.weight} ${exercise.weightUnit}`}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
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
