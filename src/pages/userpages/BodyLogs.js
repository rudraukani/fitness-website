import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const emptyBodyMetricsForm = {
  height: "",
  weight: "",
  age: "",
  gender: "",
  dailyStepGoal: "",
  caloriesIntakeGoal: "",
  waterIntakeGoal: "",
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

const BodyLogs = () => {
  const [formData, setFormData] = useState(emptyBodyMetricsForm);
  const [savedMetrics, setSavedMetrics] = useState(null);
  const [formError, setFormError] = useState("");

  const calculatedBMI = useMemo(() => {
    const heightCm = parseFloat(formData.height);
    const weightKg = parseFloat(formData.weight);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return "";
    }

    const heightMeters = heightCm / 100;
    const bmi = weightKg / (heightMeters * heightMeters);
    return bmi.toFixed(2);
  }, [formData.height, formData.weight]);

  const savedBMI = useMemo(() => {
    if (!savedMetrics) return "";
    const heightCm = parseFloat(savedMetrics.height);
    const weightKg = parseFloat(savedMetrics.weight);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return "";
    }

    const heightMeters = heightCm / 100;
    const bmi = weightKg / (heightMeters * heightMeters);
    return bmi.toFixed(2);
  }, [savedMetrics]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitMetrics = () => {
    const trimmedData = {
      height: formData.height.trim(),
      weight: formData.weight.trim(),
      age: formData.age.trim(),
      gender: formData.gender.trim(),
      dailyStepGoal: formData.dailyStepGoal.trim(),
      caloriesIntakeGoal: formData.caloriesIntakeGoal.trim(),
      waterIntakeGoal: formData.waterIntakeGoal.trim(),
    };

    if (
      !trimmedData.height ||
      !trimmedData.weight ||
      !trimmedData.age ||
      !trimmedData.gender ||
      !trimmedData.dailyStepGoal ||
      !trimmedData.caloriesIntakeGoal ||
      !trimmedData.waterIntakeGoal
    ) {
      setFormError("Please fill in all body metric fields before submitting.");
      return;
    }

    setSavedMetrics(trimmedData);
    setFormError("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.1,
          }}
        >
          Body Metrics Log
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "1rem",
            color: "rgba(0,0,0,0.7)",
            maxWidth: "760px",
          }}
        >
          Track your personal body metrics, calculate BMI automatically, and
          define your daily health and fitness goals in one place.
        </Typography>
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
            <AccessibilityNewRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Height</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {savedMetrics?.height ? `${savedMetrics.height} cm` : "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Current recorded height
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <MonitorWeightRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Weight</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {savedMetrics?.weight ? `${savedMetrics.weight} kg` : "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Current recorded weight
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <LocalFireDepartmentRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>BMI</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {savedBMI || calculatedBMI || "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Auto-calculated from height and weight
          </Typography>
        </Box>

        <Box sx={infoCardSx}>
          <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
            <WaterDropRoundedIcon />
            <Typography sx={{ fontWeight: 700 }}>Water Goal</Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {savedMetrics?.waterIntakeGoal ? `${savedMetrics.waterIntakeGoal} L` : "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Daily water intake target
          </Typography>
        </Box>
      </Stack>

      {/* Metrics Form */}
      <Box sx={{ ...panelSx, mb: 4 }}>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, mb: 1 }}>
          Add Body Metrics
        </Typography>

        <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 3 }}>
          Enter your current measurements and goals. BMI is calculated
          automatically based on your height and weight.
        </Typography>

        <Stack spacing={2.2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              label="Height (cm)"
              fullWidth
              value={formData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              sx={inputSx}
            />

            <TextField
              label="Weight (kg)"
              fullWidth
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
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
              label="Age"
              fullWidth
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              sx={inputSx}
            />

            <TextField
              select
              label="Gender"
              fullWidth
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              sx={inputSx}
            >
              {genderOptions.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            label="BMI"
            fullWidth
            value={calculatedBMI}
            InputProps={{ readOnly: true }}
            sx={inputSx}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              label="Daily Step Goal"
              fullWidth
              value={formData.dailyStepGoal}
              onChange={(e) => handleInputChange("dailyStepGoal", e.target.value)}
              sx={inputSx}
            />

            <TextField
              label="Calories Intake Goal"
              fullWidth
              value={formData.caloriesIntakeGoal}
              onChange={(e) =>
                handleInputChange("caloriesIntakeGoal", e.target.value)
              }
              sx={inputSx}
            />
          </Stack>

          <TextField
            label="Water Intake Goal (L)"
            fullWidth
            value={formData.waterIntakeGoal}
            onChange={(e) => handleInputChange("waterIntakeGoal", e.target.value)}
            sx={inputSx}
          />

          {formError && (
            <Typography sx={{ color: "#b42318", fontWeight: 600 }}>
              {formError}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleSubmitMetrics}
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

      {/* Saved Metrics Display */}
      {savedMetrics ? (
        <Box sx={panelSx}>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, mb: 2 }}>
            Saved Body Metrics
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            sx={{ mb: 3 }}
          >
            <Chip label={`Height: ${savedMetrics.height} cm`} />
            <Chip label={`Weight: ${savedMetrics.weight} kg`} />
            <Chip label={`Age: ${savedMetrics.age}`} />
            <Chip label={`Gender: ${savedMetrics.gender}`} />
            <Chip label={`BMI: ${savedBMI}`} />
            <Chip label={`Step Goal: ${savedMetrics.dailyStepGoal}`} />
            <Chip label={`Calories Goal: ${savedMetrics.caloriesIntakeGoal}`} />
            <Chip label={`Water Goal: ${savedMetrics.waterIntakeGoal} L`} />
          </Stack>

          <Stack spacing={1.2}>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Height:</strong> {savedMetrics.height} cm
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Weight:</strong> {savedMetrics.weight} kg
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Age:</strong> {savedMetrics.age}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Gender:</strong> {savedMetrics.gender}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>BMI:</strong> {savedBMI}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Daily Step Goal:</strong> {savedMetrics.dailyStepGoal}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Calories Intake Goal:</strong> {savedMetrics.caloriesIntakeGoal}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.78)" }}>
              <strong>Water Intake Goal:</strong> {savedMetrics.waterIntakeGoal} L
            </Typography>
          </Stack>
        </Box>
      ) : (
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
            No body metrics added yet
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.7)" }}>
            Fill in your body metrics and submit them to start tracking your
            health goals.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BodyLogs;