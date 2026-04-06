import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useAuth } from "../../context/AuthContext";
import {
  addRoutine,
  updateRoutine,
  deleteRoutine,
  getRoutines,
} from "../../utils/routines";

const levelOptions = ["beginner", "intermediate", "expert"];
const durationUnitOptions = ["days", "weeks", "months"];
const focusOptions = ["strength", "muscle gain", "fat loss"];
const routineCountOptions = Array.from({ length: 60 }, (_, index) =>
  String(index + 1)
);
const exerciseCountOptions = Array.from({ length: 50 }, (_, index) =>
  String(index + 1)
);
const timeUnitOptions = ["seconds", "minutes"];

const emptyRoutineForm = {
  title: "",
  level: "",
  durationValue: "",
  durationUnit: "",
  frequencyValue: "",
  frequencyUnit: "",
  focus: "",
  notes: "",
};

const emptyExerciseForm = {
  name: "",
  sets: "",
  reps: "",
  timeValue: "",
  timeUnit: "",
  equipment: "",
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

const routineCardSx = {
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

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const capitalizeWords = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatCountWithUnit = (value, unit, fallback = "") => {
  if (value && unit) {
    return `${value} ${unit}`;
  }

  return fallback;
};

const formatExerciseDetail = (exercise) => {
  const hasSetsAndReps = exercise.sets && exercise.reps;
  const hasTime = exercise.timeValue && exercise.timeUnit;

  if (hasSetsAndReps) {
    return `${exercise.sets} sets × ${exercise.reps} reps`;
  }

  if (hasTime) {
    return `${exercise.timeValue} ${exercise.timeUnit}`;
  }

  return "Exercise details not set";
};

const normalizeRoutine = (routine) => ({
  ...routine,
  level: routine.level || "",
  durationValue: routine.durationValue || "",
  durationUnit: routine.durationUnit || "",
  frequencyValue: routine.frequencyValue || "",
  frequencyUnit: routine.frequencyUnit || "",
  focus: routine.focus || "",
  notes: routine.notes || routine.description || "",
  saved: routine.saved !== false,
  exercises: (routine.exercises || []).map((exercise) => ({
    ...exercise,
    sets: exercise.sets || "",
    reps: exercise.reps || "",
    timeValue: exercise.timeValue || "",
    timeUnit: exercise.timeUnit || "",
    equipment: exercise.equipment || "",
  })),
});

const buildTrimmedRoutine = (routine) => ({
  title: routine.title.trim(),
  level: routine.level.trim(),
  durationValue: routine.durationValue.trim(),
  durationUnit: routine.durationUnit.trim(),
  frequencyValue: routine.frequencyValue.trim(),
  frequencyUnit: routine.frequencyUnit.trim(),
  focus: routine.focus.trim(),
  notes: routine.notes.trim(),
});

const buildTrimmedExercise = (exercise) => ({
  name: exercise.name.trim(),
  sets: exercise.sets.trim(),
  reps: exercise.reps.trim(),
  timeValue: exercise.timeValue.trim(),
  timeUnit: exercise.timeUnit.trim(),
  equipment: exercise.equipment.trim(),
});

const validateExercise = (exercise) => {
  if (!exercise.name) {
    return "Please fill in the exercise name before adding the exercise.";
  }

  const hasSetsAndReps = Boolean(exercise.sets && exercise.reps);
  const hasPartialSetsAndReps = Boolean(exercise.sets || exercise.reps);
  const hasTime = Boolean(exercise.timeValue && exercise.timeUnit);
  const hasPartialTime = Boolean(exercise.timeValue || exercise.timeUnit);

  if (hasSetsAndReps && hasTime) {
    return "Please fill in either Sets & Reps or Time for the exercise, not both.";
  }

  if (!hasSetsAndReps && !hasTime) {
    return "Please fill in either Sets & Reps or Time for the exercise.";
  }

  if (hasPartialSetsAndReps && !hasSetsAndReps) {
    return "Please complete both Sets and Reps for the exercise.";
  }

  if (hasPartialTime && !hasTime) {
    return "Please complete both Time fields for the exercise.";
  }

  return "";
};

const Routines = () => {
  const { currentUser } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [savedRoutineIds, setSavedRoutineIds] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoutine, setNewRoutine] = useState(emptyRoutineForm);
  const [exerciseForm, setExerciseForm] = useState(emptyExerciseForm);
  const [routineExercises, setRoutineExercises] = useState([]);
  const [formError, setFormError] = useState("");
  const [viewingRoutineId, setViewingRoutineId] = useState(null);

  const [showAddExercises, setShowAddExercises] = useState(false);
  const [addExerciseForms, setAddExerciseForms] = useState({});
  const [editExerciseState, setEditExerciseState] = useState({
    routineId: null,
    exerciseId: null,
    name: "",
    sets: "",
    reps: "",
    timeValue: "",
    timeUnit: "",
    equipment: "",
  });

  const loadRoutinesFromFirestore = async () => {
    if (!currentUser) {
      setRoutines([]);
      setSavedRoutineIds([]);
      return;
    }

    try {
      const firestoreRoutines = await getRoutines(currentUser.uid);
      const normalizedRoutines = firestoreRoutines.map(normalizeRoutine);
      setRoutines(normalizedRoutines);
      setSavedRoutineIds(
        normalizedRoutines
          .filter((routine) => routine.saved !== false)
          .map((routine) => routine.id)
      );
    } catch (error) {
      console.error("Load routines error:", error);
      setRoutines([]);
      setSavedRoutineIds([]);
    }
  };

  useEffect(() => {
    loadRoutinesFromFirestore();
  }, [currentUser]);

  const handleRoutineInputChange = (field, value) => {
    setNewRoutine((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExerciseInputChange = (field, value) => {
    setExerciseForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddExercise = () => {
    const trimmedExercise = buildTrimmedExercise(exerciseForm);
    const exerciseError = validateExercise(trimmedExercise);

    if (exerciseError) {
      setFormError(exerciseError);
      return;
    }

    const newExercise = {
      id: makeId(),
      ...trimmedExercise,
    };

    setRoutineExercises((prev) => [...prev, newExercise]);
    setExerciseForm(emptyExerciseForm);
    setFormError("");
  };

  const handleRemoveExerciseFromCreateForm = (exerciseId) => {
    setRoutineExercises((prev) =>
      prev.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const handleCreateRoutine = async () => {
    const trimmedRoutine = buildTrimmedRoutine(newRoutine);

    if (!trimmedRoutine.title) {
      setFormError("Please fill in the routine name before creating the routine.");
      return;
    }

    if (
      (trimmedRoutine.durationValue && !trimmedRoutine.durationUnit) ||
      (!trimmedRoutine.durationValue && trimmedRoutine.durationUnit)
    ) {
      setFormError("Please complete both Duration fields or leave them blank.");
      return;
    }

    if (
      (trimmedRoutine.frequencyValue && !trimmedRoutine.frequencyUnit) ||
      (!trimmedRoutine.frequencyValue && trimmedRoutine.frequencyUnit)
    ) {
      setFormError("Please complete both Frequency fields or leave them blank.");
      return;
    }

    if (routineExercises.length === 0) {
      setFormError("Please add at least one exercise to the routine.");
      return;
    }

    if (!currentUser) {
      setFormError("Please log in to save routines.");
      return;
    }

    try {
      await addRoutine(currentUser.uid, {
        ...trimmedRoutine,
        exercises: routineExercises,
        saved: true,
      });

      await loadRoutinesFromFirestore();

      setNewRoutine(emptyRoutineForm);
      setExerciseForm(emptyExerciseForm);
      setRoutineExercises([]);
      setFormError("");
      setShowCreateForm(false);
      setViewingRoutineId(null);
    } catch (error) {
      console.error("Create routine error:", error);
      setFormError("Failed to save routine.");
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    if (!currentUser) return;

    try {
      await deleteRoutine(currentUser.uid, routineId);
      await loadRoutinesFromFirestore();

      if (viewingRoutineId === routineId) {
        setViewingRoutineId(null);
      }

      if (editExerciseState.routineId === routineId) {
        setEditExerciseState({
          routineId: null,
          exerciseId: null,
          name: "",
          sets: "",
          reps: "",
          timeValue: "",
          timeUnit: "",
          equipment: "",
        });
      }
    } catch (error) {
      console.error("Delete routine error:", error);
    }
  };

  const handleViewPlan = (routineId) => {
    setViewingRoutineId((prev) => (prev === routineId ? null : routineId));
    setEditExerciseState({
      routineId: null,
      exerciseId: null,
      name: "",
      sets: "",
      reps: "",
      timeValue: "",
      timeUnit: "",
      equipment: "",
    });
    setFormError("");
  };

  const handleDeleteExerciseFromRoutine = async (routineId, exerciseId) => {
    if (!currentUser) return;

    const routine = routines.find((item) => item.id === routineId);
    if (!routine) return;

    const updatedExercises = routine.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );

    try {
      await updateRoutine(currentUser.uid, routineId, {
        exercises: updatedExercises,
      });

      await loadRoutinesFromFirestore();

      if (
        editExerciseState.routineId === routineId &&
        editExerciseState.exerciseId === exerciseId
      ) {
        setEditExerciseState({
          routineId: null,
          exerciseId: null,
          name: "",
          sets: "",
          reps: "",
          timeValue: "",
          timeUnit: "",
          equipment: "",
        });
      }
    } catch (error) {
      console.error("Delete exercise from routine error:", error);
    }
  };

  const startEditExercise = (routineId, exercise) => {
    setEditExerciseState({
      routineId,
      exerciseId: exercise.id,
      name: exercise.name,
      sets: exercise.sets || "",
      reps: exercise.reps || "",
      timeValue: exercise.timeValue || "",
      timeUnit: exercise.timeUnit || "",
      equipment: exercise.equipment || "",
    });
    setFormError("");
  };

  const cancelEditExercise = () => {
    setEditExerciseState({
      routineId: null,
      exerciseId: null,
      name: "",
      sets: "",
      reps: "",
      timeValue: "",
      timeUnit: "",
      equipment: "",
    });
    setFormError("");
  };

  const handleEditExerciseInputChange = (field, value) => {
    setEditExerciseState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveEditedExercise = async () => {
    if (!currentUser) return;

    const trimmedExercise = buildTrimmedExercise(editExerciseState);
    const exerciseError = validateExercise(trimmedExercise);

    if (exerciseError) {
      setFormError(exerciseError);
      return;
    }

    const routine = routines.find((item) => item.id === editExerciseState.routineId);
    if (!routine) return;

    const updatedExercises = routine.exercises.map((exercise) =>
      exercise.id === editExerciseState.exerciseId
        ? { ...exercise, ...trimmedExercise }
        : exercise
    );

    try {
      await updateRoutine(currentUser.uid, routine.id, {
        exercises: updatedExercises,
      });

      await loadRoutinesFromFirestore();
      cancelEditExercise();
    } catch (error) {
      console.error("Edit exercise in routine error:", error);
    }
  };

  const handleAddExerciseToExistingRoutineInput = (routineId, field, value) => {
    setAddExerciseForms((prev) => ({
      ...prev,
      [routineId]: {
        ...(prev[routineId] || emptyExerciseForm),
        [field]: value,
      },
    }));
  };

  const handleAddExerciseToExistingRoutine = async (routineId) => {
    if (!currentUser) return;

    const currentForm = addExerciseForms[routineId] || emptyExerciseForm;
    const trimmedExercise = buildTrimmedExercise(currentForm);
    const exerciseError = validateExercise(trimmedExercise);

    if (exerciseError) {
      setFormError(exerciseError);
      return;
    }

    const routine = routines.find((item) => item.id === routineId);
    if (!routine) return;

    const newExercise = {
      id: makeId(),
      ...trimmedExercise,
    };

    try {
      await updateRoutine(currentUser.uid, routineId, {
        exercises: [...routine.exercises, newExercise],
      });

      await loadRoutinesFromFirestore();
      setFormError("");

      setAddExerciseForms((prev) => ({
        ...prev,
        [routineId]: emptyExerciseForm,
      }));
    } catch (error) {
      console.error("Add exercise to existing routine error:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.6rem" },
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.1,
            }}
          >
            Workout Routines
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: "1rem",
              color: "rgba(0,0,0,0.7)",
              maxWidth: "760px",
            }}
          >
            Create your own workout routines manually, add exercises with sets,
            reps, time, and equipment, then manage them in one clean list.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setShowCreateForm((prev) => !prev)}
          sx={{
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "14px",
            px: 3,
            py: 1.2,
            boxShadow: "none",
            "&:hover": {
              background: "#222",
              boxShadow: "none",
            },
          }}
        >
          {showCreateForm ? "Close Form" : "Create Routine"}
        </Button>
      </Stack>

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
            Custom routines created by user
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <CalendarMonthRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Saved Routines</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {savedRoutineIds.length}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Routines bookmarked for later
          </Typography>
        </Box>
      </Stack>

      {showCreateForm && (
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
            Create Your Routine
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
            Fill in the routine details and add as many exercises as you want.
          </Typography>

          <Stack spacing={2.2}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <TextField
                label="Name"
                fullWidth
                value={newRoutine.title}
                onChange={(e) => handleRoutineInputChange("title", e.target.value)}
                sx={inputSx}
              />

              <TextField
                label="Level"
                fullWidth
                select
                value={newRoutine.level}
                onChange={(e) => handleRoutineInputChange("level", e.target.value)}
                sx={inputSx}
              >
                <MenuItem value="">None</MenuItem>
                {levelOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {capitalizeWords(option)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
              Duration:
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                <TextField
                  label="#"
                  fullWidth
                  select
                  value={newRoutine.durationValue}
                  onChange={(e) =>
                    handleRoutineInputChange("durationValue", e.target.value)
                  }
                  sx={inputSx}
                >
                  <MenuItem value="">None</MenuItem>
                  {routineCountOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Unit"
                  fullWidth
                  select
                  value={newRoutine.durationUnit}
                  onChange={(e) =>
                    handleRoutineInputChange("durationUnit", e.target.value)
                  }
                  sx={inputSx}
                >
                  <MenuItem value="">None</MenuItem>
                  {durationUnitOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {capitalizeWords(option)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
              Frequency:
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                <TextField
                  label="#"
                  fullWidth
                  select
                  value={newRoutine.frequencyValue}
                  onChange={(e) =>
                    handleRoutineInputChange("frequencyValue", e.target.value)
                  }
                  sx={inputSx}
                >
                  <MenuItem value="">None</MenuItem>
                  {routineCountOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Unit"
                  fullWidth
                  select
                  value={newRoutine.frequencyUnit}
                  onChange={(e) =>
                    handleRoutineInputChange("frequencyUnit", e.target.value)
                  }
                  sx={inputSx}
                >
                  <MenuItem value="">None</MenuItem>
                  {durationUnitOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {capitalizeWords(option)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            <TextField
              label="Focus"
              fullWidth
              select
              value={newRoutine.focus}
              onChange={(e) => handleRoutineInputChange("focus", e.target.value)}
              sx={inputSx}
            >
              <MenuItem value="">None</MenuItem>
              {focusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {capitalizeWords(option)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Notes"
              fullWidth
              multiline
              minRows={3}
              value={newRoutine.notes}
              onChange={(e) => handleRoutineInputChange("notes", e.target.value)}
              sx={inputSx}
            />

            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: "18px",
                background: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, mb: 2 }}>
                Add Exercises
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Name"
                  fullWidth
                  value={exerciseForm.name}
                  onChange={(e) => handleExerciseInputChange("name", e.target.value)}
                  placeholder="Squats"
                  sx={inputSx}
                />

                <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
                  By Sets & Reps:
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                    <TextField
                      label="Sets"
                      fullWidth
                      select
                      value={exerciseForm.sets}
                      onChange={(e) =>
                        handleExerciseInputChange("sets", e.target.value)
                      }
                      sx={inputSx}
                    >
                      <MenuItem value="">None</MenuItem>
                      {exerciseCountOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Reps"
                      fullWidth
                      select
                      value={exerciseForm.reps}
                      onChange={(e) =>
                        handleExerciseInputChange("reps", e.target.value)
                      }
                      sx={inputSx}
                    >
                      <MenuItem value="">None</MenuItem>
                      {exerciseCountOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Stack>

                <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
                  By Time:
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                    <TextField
                      label="Time"
                      fullWidth
                      select
                      value={exerciseForm.timeValue}
                      onChange={(e) =>
                        handleExerciseInputChange("timeValue", e.target.value)
                      }
                      sx={inputSx}
                    >
                      <MenuItem value="">None</MenuItem>
                      {exerciseCountOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Unit"
                      fullWidth
                      select
                      value={exerciseForm.timeUnit}
                      onChange={(e) =>
                        handleExerciseInputChange("timeUnit", e.target.value)
                      }
                      sx={inputSx}
                    >
                      <MenuItem value="">None</MenuItem>
                      {timeUnitOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {capitalizeWords(option)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Stack>

                <TextField
                  label="Equipment"
                  fullWidth
                  value={exerciseForm.equipment}
                  onChange={(e) =>
                    handleExerciseInputChange("equipment", e.target.value)
                  }
                  placeholder="Dumbbells / Barbell / None"
                  sx={inputSx}
                />
              </Stack>

              <Button
                variant="outlined"
                onClick={handleAddExercise}
                sx={{
                  mt: 2,
                  borderColor: "#111",
                  color: "#111",
                  fontWeight: 700,
                  borderRadius: "14px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: "#111",
                    background: "rgba(17,17,17,0.05)",
                  },
                }}
              >
                Add Exercise
              </Button>

              {routineExercises.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                    Added Exercises
                  </Typography>

                  <Stack spacing={1.5}>
                    {routineExercises.map((exercise) => (
                      <Box
                        key={exercise.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1.5,
                          p: 2,
                          borderRadius: "14px",
                          background: "rgba(255,255,255,0.55)",
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: "#111" }}>
                            {exercise.name}: {formatExerciseDetail(exercise)}
                          </Typography>
                          <Typography sx={{ color: "rgba(0,0,0,0.65)", mt: 0.4 }}>
                            Equipment: {exercise.equipment || "None"}
                          </Typography>
                        </Box>

                        <Button
                          variant="text"
                          onClick={() =>
                            handleRemoveExerciseFromCreateForm(exercise.id)
                          }
                          sx={{
                            color: "#b42318",
                            fontWeight: 700,
                            minWidth: "auto",
                            p: 0,
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {formError && (
              <Typography sx={{ color: "#b42318", fontWeight: 600 }}>
                {formError}
              </Typography>
            )}

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={handleCreateRoutine}
                sx={{
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
                Create Routine
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormError("");
                  setNewRoutine(emptyRoutineForm);
                  setExerciseForm(emptyExerciseForm);
                  setRoutineExercises([]);
                }}
                sx={{
                  borderColor: "#111",
                  color: "#111",
                  fontWeight: 700,
                  borderRadius: "14px",
                  px: 3,
                  py: 1.1,
                  "&:hover": {
                    borderColor: "#111",
                    background: "rgba(17,17,17,0.05)",
                  },
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {routines.length === 0 ? (
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
            No routines created yet
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
            Start by creating your first custom workout routine and add your own
            exercises, sets, reps, time, and equipment.
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setShowCreateForm(true)}
            sx={{
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "14px",
              px: 3,
              py: 1.2,
              boxShadow: "none",
              "&:hover": {
                background: "#222",
                boxShadow: "none",
              },
            }}
          >
            Create First Routine
          </Button>
        </Box>
      ) : (
        <Stack spacing={3}>
          {routines.map((routine) => {
            const isSaved = savedRoutineIds.includes(routine.id);
            const isViewing = viewingRoutineId === routine.id;
            const addForm = addExerciseForms[routine.id] || emptyExerciseForm;
            const durationLabel = formatCountWithUnit(
              routine.durationValue,
              routine.durationUnit,
              routine.duration
            );
            const frequencyLabel = formatCountWithUnit(
              routine.frequencyValue,
              routine.frequencyUnit,
              routine.frequency
            );

            return (
              <Box key={routine.id} sx={routineCardSx}>
                <Stack spacing={2.5}>
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
                          {routine.title}
                        </Typography>

                        {routine.level && (
                          <Chip
                            label={capitalizeWords(routine.level)}
                            sx={{
                              fontWeight: 700,
                              background: "rgba(17,17,17,0.08)",
                              color: "#111",
                            }}
                          />
                        )}

                        {isSaved && (
                          <Chip
                            label="Saved"
                            sx={{
                              fontWeight: 700,
                              background: "rgba(48,102,190,0.14)",
                              color: "#163d78",
                            }}
                          />
                        )}
                      </Stack>

                      {routine.notes && (
                        <Typography
                          sx={{
                            color: "rgba(0,0,0,0.72)",
                            fontSize: "1rem",
                            lineHeight: 1.7,
                            mb: 2,
                            maxWidth: "800px",
                          }}
                        >
                          {routine.notes}
                        </Typography>
                      )}

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        useFlexGap
                        flexWrap="wrap"
                        sx={{ mb: 2 }}
                      >
                        {durationLabel && (
                          <Chip
                            icon={<AccessTimeRoundedIcon />}
                            label={durationLabel}
                            sx={{ background: "rgba(255,255,255,0.7)" }}
                          />
                        )}
                        {frequencyLabel && (
                          <Chip
                            icon={<CalendarMonthRoundedIcon />}
                            label={frequencyLabel}
                            sx={{ background: "rgba(255,255,255,0.7)" }}
                          />
                        )}
                        {routine.focus && (
                          <Chip
                            icon={<BoltRoundedIcon />}
                            label={capitalizeWords(routine.focus)}
                            sx={{ background: "rgba(255,255,255,0.7)" }}
                          />
                        )}
                      </Stack>

                      <Typography sx={{ fontWeight: 700 }}>
                        Exercises: {routine.exercises.length}
                      </Typography>
                    </Box>

                    <Stack
                      direction={{ xs: "row", md: "column" }}
                      spacing={1.5}
                      justifyContent="center"
                      sx={{ minWidth: { md: "190px" } }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleViewPlan(routine.id)}
                        sx={{
                          background: "#111",
                          color: "#fff",
                          fontWeight: 700,
                          borderRadius: "14px",
                          px: 2.5,
                          py: 1.2,
                          boxShadow: "none",
                          "&:hover": {
                            background: "#222",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {isViewing ? "Hide Plan" : "View Plan"}
                      </Button>

                      <Button
                        variant="text"
                        startIcon={<DeleteRoundedIcon />}
                        onClick={() => handleDeleteRoutine(routine.id)}
                        sx={{
                          color: "#b42318",
                          fontWeight: 700,
                          borderRadius: "14px",
                          "&:hover": {
                            background: "rgba(180,35,24,0.08)",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>

                  {isViewing && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 2.5,
                        borderRadius: "18px",
                        background: "rgba(255,255,255,0.58)",
                        border: "1px solid rgba(255,255,255,0.24)",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={2}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        sx={{ mb: 2 }}
                      >
                        <Button
                          variant="text"
                          startIcon={<CloseRoundedIcon />}
                          onClick={() => setViewingRoutineId(null)}
                          sx={{
                            color: "#111",
                            fontWeight: 700,
                          }}
                        >
                          Close
                        </Button>
                      </Stack>

                      <Stack spacing={1.5} sx={{ mb: 3 }}>
                        {routine.exercises.length > 0 ? (
                          routine.exercises.map((exercise) => {
                            const isEditing =
                              editExerciseState.routineId === routine.id &&
                              editExerciseState.exerciseId === exercise.id;

                            return (
                              <Box
                                key={exercise.id}
                                sx={{
                                  p: 2,
                                  borderRadius: "14px",
                                  background: "rgba(255,255,255,0.7)",
                                }}
                              >
                                {isEditing ? (
                                  <Stack spacing={2}>
                                    <TextField
                                      label="Name"
                                      fullWidth
                                      value={editExerciseState.name}
                                      onChange={(e) =>
                                        handleEditExerciseInputChange("name", e.target.value)
                                      }
                                      sx={inputSx}
                                    />

                                    <Stack
                                      direction={{ xs: "column", md: "row" }}
                                      spacing={2}
                                      useFlexGap
                                      flexWrap="wrap"
                                    >
                                      <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                                        <TextField
                                          label="Sets"
                                          fullWidth
                                          select
                                          value={editExerciseState.sets}
                                          onChange={(e) =>
                                            handleEditExerciseInputChange("sets", e.target.value)
                                          }
                                          sx={inputSx}
                                        >
                                          <MenuItem value="">None</MenuItem>
                                          {exerciseCountOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </TextField>

                                        <TextField
                                          label="Reps"
                                          fullWidth
                                          select
                                          value={editExerciseState.reps}
                                          onChange={(e) =>
                                            handleEditExerciseInputChange("reps", e.target.value)
                                          }
                                          sx={inputSx}
                                        >
                                          <MenuItem value="">None</MenuItem>
                                          {exerciseCountOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </Stack>

                                      <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                                        <TextField
                                          label="Time"
                                          fullWidth
                                          select
                                          value={editExerciseState.timeValue}
                                          onChange={(e) =>
                                            handleEditExerciseInputChange(
                                              "timeValue",
                                              e.target.value
                                            )
                                          }
                                          sx={inputSx}
                                        >
                                          <MenuItem value="">None</MenuItem>
                                          {exerciseCountOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </TextField>

                                        <TextField
                                          label="Unit"
                                          fullWidth
                                          select
                                          value={editExerciseState.timeUnit}
                                          onChange={(e) =>
                                            handleEditExerciseInputChange(
                                              "timeUnit",
                                              e.target.value
                                            )
                                          }
                                          sx={inputSx}
                                        >
                                          <MenuItem value="">None</MenuItem>
                                          {timeUnitOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                              {capitalizeWords(option)}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </Stack>
                                    </Stack>

                                    <TextField
                                      label="Equipment"
                                      fullWidth
                                      value={editExerciseState.equipment}
                                      onChange={(e) =>
                                        handleEditExerciseInputChange(
                                          "equipment",
                                          e.target.value
                                        )
                                      }
                                      sx={inputSx}
                                    />

                                    <Stack direction="row" spacing={1.5}>
                                      <Button
                                        variant="contained"
                                        onClick={saveEditedExercise}
                                        sx={{
                                          background: "#111",
                                          color: "#fff",
                                          fontWeight: 700,
                                          borderRadius: "14px",
                                          boxShadow: "none",
                                          "&:hover": {
                                            background: "#222",
                                            boxShadow: "none",
                                          },
                                        }}
                                      >
                                        Save Changes
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        onClick={cancelEditExercise}
                                        sx={{
                                          borderColor: "#111",
                                          color: "#111",
                                          fontWeight: 700,
                                          borderRadius: "14px",
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </Stack>
                                  </Stack>
                                ) : (
                                  <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    justifyContent="space-between"
                                    alignItems={{ xs: "flex-start", sm: "center" }}
                                    gap={1.5}
                                  >
                                    <Box>
                                      <Typography sx={{ fontWeight: 700, color: "#111" }}>
                                        {exercise.name}: {formatExerciseDetail(exercise)}
                                      </Typography>
                                      <Typography
                                        sx={{ color: "rgba(0,0,0,0.7)", mt: 0.5 }}
                                      >
                                        Equipment: {exercise.equipment || "None"}
                                      </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1}>
                                      <Button
                                        variant="text"
                                        startIcon={<EditRoundedIcon />}
                                        onClick={() => startEditExercise(routine.id, exercise)}
                                        sx={{
                                          color: "#111",
                                          fontWeight: 700,
                                          "&:hover": {
                                            background: "rgba(17,17,17,0.06)",
                                          },
                                        }}
                                      >
                                        Edit
                                      </Button>

                                      <Button
                                        variant="text"
                                        startIcon={<DeleteRoundedIcon />}
                                        onClick={() =>
                                          handleDeleteExerciseFromRoutine(
                                            routine.id,
                                            exercise.id
                                          )
                                        }
                                        sx={{
                                          color: "#b42318",
                                          fontWeight: 700,
                                          "&:hover": {
                                            background: "rgba(180,35,24,0.08)",
                                          },
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </Stack>
                                  </Stack>
                                )}
                              </Box>
                            );
                          })
                        ) : (
                          <Typography sx={{ color: "rgba(0,0,0,0.7)" }}>
                            No exercises left in this routine.
                          </Typography>
                        )}
                      </Stack>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.45)",
                          border: "1px solid rgba(255,255,255,0.24)",
                        }}
                      >
                        <Button
                          onClick={() => setShowAddExercises(!showAddExercises)}
                          sx={{
                            fontSize: "1.05rem",
                            fontWeight: 800,
                            color: "#111",
                            mb: 2,
                            textTransform: "none",
                            justifyContent: "flex-start",
                            p: 0,
                          }}
                        >
                          {showAddExercises ? "Hide Exercises" : "Add More Exercises"}
                        </Button>

                        {showAddExercises && (
                          <Stack spacing={2}>
                            <TextField
                              label="Name"
                              fullWidth
                              value={addForm.name}
                              onChange={(e) =>
                                handleAddExerciseToExistingRoutineInput(
                                  routine.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              sx={inputSx}
                            />

                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              spacing={2}
                              useFlexGap
                              flexWrap="wrap"
                            >
                              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                                <TextField
                                  label="Sets"
                                  fullWidth
                                  select
                                  value={addForm.sets}
                                  onChange={(e) =>
                                    handleAddExerciseToExistingRoutineInput(
                                      routine.id,
                                      "sets",
                                      e.target.value
                                    )
                                  }
                                  sx={inputSx}
                                >
                                  <MenuItem value="">None</MenuItem>
                                  {exerciseCountOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  label="Reps"
                                  fullWidth
                                  select
                                  value={addForm.reps}
                                  onChange={(e) =>
                                    handleAddExerciseToExistingRoutineInput(
                                      routine.id,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  sx={inputSx}
                                >
                                  <MenuItem value="">None</MenuItem>
                                  {exerciseCountOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Stack>

                              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                                <TextField
                                  label="Time"
                                  fullWidth
                                  select
                                  value={addForm.timeValue}
                                  onChange={(e) =>
                                    handleAddExerciseToExistingRoutineInput(
                                      routine.id,
                                      "timeValue",
                                      e.target.value
                                    )
                                  }
                                  sx={inputSx}
                                >
                                  <MenuItem value="">None</MenuItem>
                                  {exerciseCountOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  label="Unit"
                                  fullWidth
                                  select
                                  value={addForm.timeUnit}
                                  onChange={(e) =>
                                    handleAddExerciseToExistingRoutineInput(
                                      routine.id,
                                      "timeUnit",
                                      e.target.value
                                    )
                                  }
                                  sx={inputSx}
                                >
                                  <MenuItem value="">None</MenuItem>
                                  {timeUnitOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {capitalizeWords(option)}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Stack>
                            </Stack>

                            <TextField
                              label="Equipment"
                              fullWidth
                              value={addForm.equipment}
                              onChange={(e) =>
                                handleAddExerciseToExistingRoutineInput(
                                  routine.id,
                                  "equipment",
                                  e.target.value
                                )
                              }
                              sx={inputSx}
                            />

                            <Button
                              variant="contained"
                              onClick={() => handleAddExerciseToExistingRoutine(routine.id)}
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
                              Add Exercise to Routine
                            </Button>
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default Routines;