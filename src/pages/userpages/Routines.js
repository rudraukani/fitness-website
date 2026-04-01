import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const emptyRoutineForm = {
  title: "",
  level: "",
  duration: "",
  frequency: "",
  focus: "",
  description: "",
};

const emptyExerciseForm = {
  name: "",
  sets: "",
  reps: "",
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

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [savedRoutineIds, setSavedRoutineIds] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoutine, setNewRoutine] = useState(emptyRoutineForm);
  const [exerciseForm, setExerciseForm] = useState(emptyExerciseForm);
  const [routineExercises, setRoutineExercises] = useState([]);
  const [formError, setFormError] = useState("");
  const [viewingRoutineId, setViewingRoutineId] = useState(null);

  const [addExerciseForms, setAddExerciseForms] = useState({});
  const [editExerciseState, setEditExerciseState] = useState({
    routineId: null,
    exerciseId: null,
    name: "",
    sets: "",
    reps: "",
    equipment: "",
  });

  const handleToggleSave = (routineId) => {
    setSavedRoutineIds((prev) =>
      prev.includes(routineId)
        ? prev.filter((id) => id !== routineId)
        : [...prev, routineId]
    );
  };

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
    const trimmedExercise = {
      name: exerciseForm.name.trim(),
      sets: exerciseForm.sets.trim(),
      reps: exerciseForm.reps.trim(),
      equipment: exerciseForm.equipment.trim(),
    };

    if (!trimmedExercise.name || !trimmedExercise.sets || !trimmedExercise.reps) {
      setFormError("Please fill in exercise name, sets, and reps before adding the exercise.");
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

  const handleCreateRoutine = () => {
    const trimmedRoutine = {
      title: newRoutine.title.trim(),
      level: newRoutine.level.trim(),
      duration: newRoutine.duration.trim(),
      frequency: newRoutine.frequency.trim(),
      focus: newRoutine.focus.trim(),
      description: newRoutine.description.trim(),
    };

    const hasEmptyRoutineField = Object.values(trimmedRoutine).some((value) => !value);

    if (hasEmptyRoutineField) {
      setFormError("Please fill in all routine details before creating the routine.");
      return;
    }

    if (routineExercises.length === 0) {
      setFormError("Please add at least one exercise to the routine.");
      return;
    }

    const createdRoutine = {
      id: makeId(),
      ...trimmedRoutine,
      exercises: routineExercises,
    };

    setRoutines((prev) => [createdRoutine, ...prev]);
    setNewRoutine(emptyRoutineForm);
    setExerciseForm(emptyExerciseForm);
    setRoutineExercises([]);
    setFormError("");
    setShowCreateForm(false);
    setViewingRoutineId(null);
  };

  const handleDeleteRoutine = (routineId) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    setSavedRoutineIds((prev) => prev.filter((id) => id !== routineId));

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
        equipment: "",
      });
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
      equipment: "",
    });
  };

  const handleDeleteExerciseFromRoutine = (routineId, exerciseId) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;

        return {
          ...routine,
          exercises: routine.exercises.filter(
            (exercise) => exercise.id !== exerciseId
          ),
        };
      })
    );

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
        equipment: "",
      });
    }
  };

  const startEditExercise = (routineId, exercise) => {
    setEditExerciseState({
      routineId,
      exerciseId: exercise.id,
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      equipment: exercise.equipment || "",
    });
  };

  const cancelEditExercise = () => {
    setEditExerciseState({
      routineId: null,
      exerciseId: null,
      name: "",
      sets: "",
      reps: "",
      equipment: "",
    });
  };

  const handleEditExerciseInputChange = (field, value) => {
    setEditExerciseState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveEditedExercise = () => {
    const trimmedExercise = {
      name: editExerciseState.name.trim(),
      sets: editExerciseState.sets.trim(),
      reps: editExerciseState.reps.trim(),
      equipment: editExerciseState.equipment.trim(),
    };

    if (!trimmedExercise.name || !trimmedExercise.sets || !trimmedExercise.reps) {
      return;
    }

    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== editExerciseState.routineId) return routine;

        return {
          ...routine,
          exercises: routine.exercises.map((exercise) =>
            exercise.id === editExerciseState.exerciseId
              ? { ...exercise, ...trimmedExercise }
              : exercise
          ),
        };
      })
    );

    cancelEditExercise();
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

  const handleAddExerciseToExistingRoutine = (routineId) => {
    const currentForm = addExerciseForms[routineId] || emptyExerciseForm;

    const trimmedExercise = {
      name: currentForm.name.trim(),
      sets: currentForm.sets.trim(),
      reps: currentForm.reps.trim(),
      equipment: currentForm.equipment.trim(),
    };

    if (!trimmedExercise.name || !trimmedExercise.sets || !trimmedExercise.reps) {
      return;
    }

    const newExercise = {
      id: makeId(),
      ...trimmedExercise,
    };

    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              exercises: [...routine.exercises, newExercise],
            }
          : routine
      )
    );

    setAddExerciseForms((prev) => ({
      ...prev,
      [routineId]: emptyExerciseForm,
    }));
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
            reps, and equipment, then manage them in one clean list.
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
                label="Routine Name"
                fullWidth
                value={newRoutine.title}
                onChange={(e) => handleRoutineInputChange("title", e.target.value)}
                sx={inputSx}
              />

              <TextField
                label="Level"
                fullWidth
                value={newRoutine.level}
                onChange={(e) => handleRoutineInputChange("level", e.target.value)}
                placeholder="Beginner / Intermediate / Advanced"
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
                label="Duration"
                fullWidth
                value={newRoutine.duration}
                onChange={(e) => handleRoutineInputChange("duration", e.target.value)}
                placeholder="6 Weeks"
                sx={inputSx}
              />

              <TextField
                label="Frequency"
                fullWidth
                value={newRoutine.frequency}
                onChange={(e) => handleRoutineInputChange("frequency", e.target.value)}
                placeholder="4 Days / Week"
                sx={inputSx}
              />
            </Stack>

            <TextField
              label="Focus"
              fullWidth
              value={newRoutine.focus}
              onChange={(e) => handleRoutineInputChange("focus", e.target.value)}
              placeholder="Strength / Muscle Gain / Fat Loss"
              sx={inputSx}
            />

            <TextField
              label="Routine Description"
              fullWidth
              multiline
              minRows={3}
              value={newRoutine.description}
              onChange={(e) => handleRoutineInputChange("description", e.target.value)}
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
                  label="Exercise Name"
                  fullWidth
                  value={exerciseForm.name}
                  onChange={(e) => handleExerciseInputChange("name", e.target.value)}
                  placeholder="Squats"
                  sx={inputSx}
                />

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <TextField
                    label="Sets"
                    fullWidth
                    value={exerciseForm.sets}
                    onChange={(e) => handleExerciseInputChange("sets", e.target.value)}
                    placeholder="3"
                    sx={inputSx}
                  />

                  <TextField
                    label="Reps"
                    fullWidth
                    value={exerciseForm.reps}
                    onChange={(e) => handleExerciseInputChange("reps", e.target.value)}
                    placeholder="10"
                    sx={inputSx}
                  />

                  <TextField
                    label="Equipment (Optional)"
                    fullWidth
                    value={exerciseForm.equipment}
                    onChange={(e) =>
                      handleExerciseInputChange("equipment", e.target.value)
                    }
                    placeholder="Dumbbells / Barbell / None"
                    sx={inputSx}
                  />
                </Stack>
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
                            {exercise.name}: {exercise.sets} sets of {exercise.reps} reps
                          </Typography>
                          <Typography sx={{ color: "rgba(0,0,0,0.65)", mt: 0.4 }}>
                            Equipment: {exercise.equipment || "None"}
                          </Typography>
                        </Box>

                        <Button
                          variant="text"
                          onClick={() => handleRemoveExerciseFromCreateForm(exercise.id)}
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
            exercises, sets, reps, and equipment.
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

                        <Chip
                          label={routine.level}
                          sx={{
                            fontWeight: 700,
                            background: "rgba(17,17,17,0.08)",
                            color: "#111",
                          }}
                        />

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

                      <Typography
                        sx={{
                          color: "rgba(0,0,0,0.72)",
                          fontSize: "1rem",
                          lineHeight: 1.7,
                          mb: 2,
                          maxWidth: "800px",
                        }}
                      >
                        {routine.description}
                      </Typography>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        useFlexGap
                        flexWrap="wrap"
                        sx={{ mb: 2 }}
                      >
                        <Chip
                          icon={<AccessTimeRoundedIcon />}
                          label={routine.duration}
                          sx={{ background: "rgba(255,255,255,0.7)" }}
                        />
                        <Chip
                          icon={<CalendarMonthRoundedIcon />}
                          label={routine.frequency}
                          sx={{ background: "rgba(255,255,255,0.7)" }}
                        />
                        <Chip
                          icon={<BoltRoundedIcon />}
                          label={routine.focus}
                          sx={{ background: "rgba(255,255,255,0.7)" }}
                        />
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
                        variant="outlined"
                        onClick={() => handleToggleSave(routine.id)}
                        sx={{
                          borderColor: isSaved ? "#3066BE" : "#111",
                          color: isSaved ? "#3066BE" : "#111",
                          fontWeight: 700,
                          borderRadius: "14px",
                          px: 2.5,
                          py: 1.2,
                          "&:hover": {
                            borderColor: isSaved ? "#3066BE" : "#111",
                            background: isSaved
                              ? "rgba(48,102,190,0.08)"
                              : "rgba(17,17,17,0.05)",
                          },
                        }}
                      >
                        {isSaved ? "Saved" : "Save Routine"}
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
                        <Typography
                          sx={{
                            fontSize: "1.2rem",
                            fontWeight: 800,
                            color: "#111",
                          }}
                        >
                          {routine.title} Plan Details
                        </Typography>

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
                                      label="Exercise Name"
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
                                      <TextField
                                        label="Sets"
                                        fullWidth
                                        value={editExerciseState.sets}
                                        onChange={(e) =>
                                          handleEditExerciseInputChange("sets", e.target.value)
                                        }
                                        sx={inputSx}
                                      />

                                      <TextField
                                        label="Reps"
                                        fullWidth
                                        value={editExerciseState.reps}
                                        onChange={(e) =>
                                          handleEditExerciseInputChange("reps", e.target.value)
                                        }
                                        sx={inputSx}
                                      />

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
                                    </Stack>

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
                                        {exercise.name}: {exercise.sets} sets of {exercise.reps} reps
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
                        <Typography
                          sx={{
                            fontSize: "1.05rem",
                            fontWeight: 800,
                            color: "#111",
                            mb: 2,
                          }}
                        >
                          Add More Exercises
                        </Typography>

                        <Stack spacing={2}>
                          <TextField
                            label="Exercise Name"
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
                            <TextField
                              label="Sets"
                              fullWidth
                              value={addForm.sets}
                              onChange={(e) =>
                                handleAddExerciseToExistingRoutineInput(
                                  routine.id,
                                  "sets",
                                  e.target.value
                                )
                              }
                              sx={inputSx}
                            />

                            <TextField
                              label="Reps"
                              fullWidth
                              value={addForm.reps}
                              onChange={(e) =>
                                handleAddExerciseToExistingRoutineInput(
                                  routine.id,
                                  "reps",
                                  e.target.value
                                )
                              }
                              sx={inputSx}
                            />

                            <TextField
                              label="Equipment (Optional)"
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
                          </Stack>

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