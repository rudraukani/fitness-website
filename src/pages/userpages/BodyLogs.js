import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import { useAuth } from "../../context/AuthContext";
import { addBodyMetric, getBodyMetrics } from "../../utils/bodyMetrics";


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

const accordionSx = {
  background: "transparent",
  boxShadow: "none",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "18px !important",
  mb: 1.5,
  "&:before": {
    display: "none",
  },
};

const formatMetricValue = (value, unit = "") => {
  if (value === null || value === undefined || value === "") return "-";
  return unit ? `${value} ${unit}` : value;
};

const formatValueForInput = (value, fallback = "") => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const heightUnitOptions = ["cm", "in"];
const weightUnitOptions = ["kg", "lbs"];


const emptyInitialMetricsForm = {
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  age: "",
  gender: "",
};

const emptyGoalsForm = {
  dailyStepGoal: "",
  caloriesIntakeGoal: "",
  waterIntakeGoal: "",
};

const emptyLogForm = {
  weight: "",
  weightUnit: "kg",
};

const BodyLogs = () => {
  const { currentUser } = useAuth();
  const [initialMetricsForm, setInitialMetricsForm] = useState(emptyInitialMetricsForm);
  const [goalsForm, setGoalsForm] = useState(emptyGoalsForm);
  const [logForm, setLogForm] = useState(emptyLogForm);
  const [savedMetrics, setSavedMetrics] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState("initial-metrics");
  const [isInitialEditing, setIsInitialEditing] = useState(true);
  const [isGoalsEditing, setIsGoalsEditing] = useState(true);
  const [formError, setFormError] = useState("");

  const calculatedBMI = useMemo(() => {
    const height = parseFloat(initialMetricsForm.height);
    const weight = parseFloat(initialMetricsForm.weight);

    if (!height || !weight) return "";

    // convert height to meters
    const heightMeters =
      initialMetricsForm.heightUnit === "cm"
        ? height / 100
        : height * 0.0254;

    // convert weight to kg
    const weightKg =
      initialMetricsForm.weightUnit === "kg"
        ? weight
        : weight * 0.453592;

    const bmi = weightKg / (heightMeters * heightMeters);

    return bmi.toFixed(1);
  }, [
    initialMetricsForm.height,
    initialMetricsForm.heightUnit,
    initialMetricsForm.weight,
    initialMetricsForm.weightUnit,
  ]);

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

  useEffect(() => {
    const loadMetrics = async () => {
      if (!currentUser) {
        setSavedMetrics(null);
        setInitialMetricsForm(emptyInitialMetricsForm);
        setGoalsForm(emptyGoalsForm);
        setLogForm(emptyLogForm);
        return;
      }

      try {
        const metrics = await getBodyMetrics(currentUser.uid);
        const latestMetric = metrics[0] || null;
        setSavedMetrics(latestMetric);

        if (latestMetric) {
          setInitialMetricsForm({
            height: formatValueForInput(latestMetric.height),
            heightUnit: latestMetric.heightUnit || "cm",
            weight: formatValueForInput(
              latestMetric.initialWeight ?? latestMetric.weight
            ),
            weightUnit:
              latestMetric.initialWeightUnit ||
              latestMetric.weightUnit ||
              "kg",
            age: formatValueForInput(latestMetric.age),
            gender: latestMetric.gender || "",
          });

          setGoalsForm({
            dailyStepGoal: formatValueForInput(latestMetric.dailyStepGoal),
            caloriesIntakeGoal: formatValueForInput(
              latestMetric.caloriesIntakeGoal
            ),
            waterIntakeGoal: formatValueForInput(latestMetric.waterIntakeGoal),
          });

          setLogForm((prev) => ({
            ...prev,
            weightUnit: latestMetric.weightUnit || "kg",
          }));

          setIsInitialEditing(false);
          setIsGoalsEditing(false);
        }
      } catch (error) {
        console.error("Load metrics error:", error);
      }
    };

    loadMetrics();
  }, [currentUser]);

  const handlePanelChange = (panel) => (_, isExpanded) => {
  setExpandedPanel(isExpanded ? panel : false);
};

  const handleInitialMetricsChange = (field, value) => {
    setInitialMetricsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoalsChange = (field, value) => {
    setGoalsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogChange = (field, value) => {
    setLogForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveInitialMetrics = async () => {
    if (!initialMetricsForm.height || !initialMetricsForm.weight) {
      setFormError("Height and weight are required.");
      return;
    }

    if (!currentUser) {
      setFormError("Please log in to save.");
      return;
    }

    const payload = {
      height: initialMetricsForm.height,
      heightUnit: initialMetricsForm.heightUnit || "cm",
      weight: initialMetricsForm.weight,
      weightUnit: initialMetricsForm.weightUnit || "kg",
      age: initialMetricsForm.age || "",
      gender: initialMetricsForm.gender || "",
      dailyStepGoal: goalsForm.dailyStepGoal || savedMetrics?.dailyStepGoal || "",
      caloriesIntakeGoal:
        goalsForm.caloriesIntakeGoal || savedMetrics?.caloriesIntakeGoal || "",
      waterIntakeGoal:
        goalsForm.waterIntakeGoal || savedMetrics?.waterIntakeGoal || "",
      logWeight: savedMetrics?.weight || "",
      logWeightUnit: savedMetrics?.weightUnit || "kg",
    };

    try {
      await addBodyMetric(currentUser.uid, payload);
      const metrics = await getBodyMetrics(currentUser.uid);
      const latestMetric = metrics[0] || null;
      setSavedMetrics(latestMetric);
      setFormError("");
      setIsInitialEditing(false);
    } catch (error) {
      console.error("Failed to save initial metrics:", error);
      setFormError("Failed to save initial metrics.");
    }
  };


  const handleSaveGoals = async () => {
    if (!currentUser) {
      setFormError("Please log in to save.");
      return;
    }

    const payload = {
      height: initialMetricsForm.height || savedMetrics?.height || "",
      heightUnit: initialMetricsForm.heightUnit || savedMetrics?.heightUnit || "cm",
      weight:
        initialMetricsForm.weight ||
        savedMetrics?.initialWeight ||
        savedMetrics?.weight ||
        "",
      weightUnit:
        initialMetricsForm.weightUnit ||
        savedMetrics?.initialWeightUnit ||
        savedMetrics?.weightUnit ||
        "kg",
      age: initialMetricsForm.age || savedMetrics?.age || "",
      gender: initialMetricsForm.gender || savedMetrics?.gender || "",
      dailyStepGoal: goalsForm.dailyStepGoal || "",
      caloriesIntakeGoal: goalsForm.caloriesIntakeGoal || "",
      waterIntakeGoal: goalsForm.waterIntakeGoal || "",
      logWeight: savedMetrics?.weight || "",
      logWeightUnit: savedMetrics?.weightUnit || "kg",
    };

    try {
      await addBodyMetric(currentUser.uid, payload);
      const metrics = await getBodyMetrics(currentUser.uid);
      const latestMetric = metrics[0] || null;
      setSavedMetrics(latestMetric);
      setFormError("");
      setIsGoalsEditing(false);
    } catch (error) {
      console.error("Failed to save goals:", error);
      setFormError("Failed to save goals.");
    }
  };

  const handleSubmitLog = async () => {
    if (!logForm.weight) {
      setFormError("Weight is required.");
      return;
    }

    if (!currentUser) {
      setFormError("Please log in to save.");
      return;
    }

    const payload = {
      height: initialMetricsForm.height || savedMetrics?.height || "",
      heightUnit: initialMetricsForm.heightUnit || savedMetrics?.heightUnit || "cm",
      weight:
        initialMetricsForm.weight ||
        savedMetrics?.initialWeight ||
        savedMetrics?.weight ||
        "",
      weightUnit:
        initialMetricsForm.weightUnit ||
        savedMetrics?.initialWeightUnit ||
        savedMetrics?.weightUnit ||
        "kg",
      age: initialMetricsForm.age || savedMetrics?.age || "",
      gender: initialMetricsForm.gender || savedMetrics?.gender || "",
      dailyStepGoal:
        goalsForm.dailyStepGoal || savedMetrics?.dailyStepGoal || "",
      caloriesIntakeGoal:
        goalsForm.caloriesIntakeGoal || savedMetrics?.caloriesIntakeGoal || "",
      waterIntakeGoal:
        goalsForm.waterIntakeGoal || savedMetrics?.waterIntakeGoal || "",
      logWeight: logForm.weight,
      logWeightUnit: logForm.weightUnit,
    };

    try {
      await addBodyMetric(currentUser.uid, payload);
      const metrics = await getBodyMetrics(currentUser.uid);
      const latestMetric = metrics[0] || null;

      setSavedMetrics(latestMetric);

      if (latestMetric) {
        setInitialMetricsForm({
          height: formatValueForInput(latestMetric.height),
          heightUnit: latestMetric.heightUnit || "cm",
          weight: formatValueForInput(
            latestMetric.initialWeight ?? latestMetric.weight
          ),
          weightUnit:
            latestMetric.initialWeightUnit ||
            latestMetric.weightUnit ||
            "kg",
          age: formatValueForInput(latestMetric.age),
          gender: latestMetric.gender || "",
        });

        setGoalsForm({
          dailyStepGoal: formatValueForInput(latestMetric.dailyStepGoal),
          caloriesIntakeGoal: formatValueForInput(
            latestMetric.caloriesIntakeGoal
          ),
          waterIntakeGoal: formatValueForInput(latestMetric.waterIntakeGoal),
        });
      }

      setLogForm((prev) => ({
        ...prev,
        weight: "",
      }));

      setFormError("");
    } catch (error) {
      console.error("Failed to save log:", error);
      setFormError("Failed to save log.");
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
            {savedMetrics?.height
              ? `${savedMetrics.height} ${savedMetrics.heightUnit || "cm"}`
              : "-"}
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
            {savedMetrics?.weight
              ? `${savedMetrics.weight} ${savedMetrics.weightUnit || "kg"}`
              : "-"}
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
            {savedMetrics?.waterIntakeGoal
              ? `${savedMetrics.waterIntakeGoal} L`
              : "-"}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
            Daily water intake target
          </Typography>
        </Box>
      </Stack>

            <Box sx={{ ...panelSx, mb: 4 }}>
        <Accordion
          expanded={expandedPanel === "initial-metrics"}
          onChange={handlePanelChange("initial-metrics")}
          sx={accordionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ width: "100%" }}
            >
              <Box>
                <Typography sx={{ fontSize: "1.35rem", fontWeight: 800 }}>
                  Initial Metrics
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
                  Save your baseline height, weight, age, and gender.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`Height: ${formatMetricValue(
                    initialMetricsForm.height,
                    initialMetricsForm.heightUnit
                  )}`}
                  size="small"
                />
                <Chip
                  label={`Weight: ${formatMetricValue(
                    initialMetricsForm.weight,
                    initialMetricsForm.weightUnit
                  )}`}
                  size="small"
                />
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsInitialEditing(true);
                    setExpandedPanel("initial-metrics");
                  }}
                  sx={{
                    background: "rgba(17,17,17,0.06)",
                    borderRadius: "12px",
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2.2}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                useFlexGap
                flexWrap="wrap"
              >
                <TextField
                  label="Height"
                  type="number"
                  fullWidth
                  required
                  value={initialMetricsForm.height}
                  onChange={(e) =>
                    handleInitialMetricsChange("height", e.target.value)
                  }
                  disabled={!isInitialEditing}
                  sx={inputSx}
                />

                <TextField
                  select
                  label="Unit"
                  value={initialMetricsForm.heightUnit}
                  onChange={(e) =>
                    handleInitialMetricsChange("heightUnit", e.target.value)
                  }
                  disabled={!isInitialEditing}
                  sx={{ ...inputSx, minWidth: { xs: "100%", md: "140px" } }}
                >
                  {heightUnitOptions.map((unit) => (
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
                  label="Weight"
                  type="number"
                  fullWidth
                  required
                  value={initialMetricsForm.weight}
                  onChange={(e) =>
                    handleInitialMetricsChange("weight", e.target.value)
                  }
                  disabled={!isInitialEditing}
                  sx={inputSx}
                />

                <TextField
                  select
                  label="Unit"
                  value={initialMetricsForm.weightUnit}
                  onChange={(e) =>
                    handleInitialMetricsChange("weightUnit", e.target.value)
                  }
                  disabled={!isInitialEditing}
                  sx={{ ...inputSx, minWidth: { xs: "100%", md: "140px" } }}
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
                  label="Age"
                  type="number"
                  fullWidth
                  value={initialMetricsForm.age}
                  onChange={(e) =>
                    handleInitialMetricsChange("age", e.target.value)
                  }
                  disabled={!isInitialEditing}
                  sx={inputSx}
                />

                <TextField
                  select
                  label="Gender"
                  fullWidth
                  value={initialMetricsForm.gender}
                  onChange={(e) =>
                    handleInitialMetricsChange("gender", e.target.value)
                  }
                  disabled={!isInitialEditing}
                  sx={inputSx}
                >
                  <MenuItem value="">Select</MenuItem>
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              {isInitialEditing && (
                <Button
                  variant="contained"
                  onClick={handleSaveInitialMetrics}
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
                  Save Initial Metrics
                </Button>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedPanel === "goals"}
          onChange={handlePanelChange("goals")}
          sx={accordionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ width: "100%" }}
            >
              <Box>
                <Typography sx={{ fontSize: "1.35rem", fontWeight: 800 }}>
                  Goals
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
                  Set flexible daily targets for steps, calories, and water.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`Steps: ${formatMetricValue(goalsForm.dailyStepGoal)}`}
                  size="small"
                />
                <Chip
                  label={`Water: ${formatMetricValue(
                    goalsForm.waterIntakeGoal,
                    goalsForm.waterIntakeGoal ? "L" : ""
                  )}`}
                  size="small"
                />
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsGoalsEditing(true);
                    setExpandedPanel("goals");
                  }}
                  sx={{
                    background: "rgba(17,17,17,0.06)",
                    borderRadius: "12px",
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2.2}>
              <TextField
                label="Daily Step Goal"
                type="number"
                fullWidth
                value={goalsForm.dailyStepGoal}
                onChange={(e) =>
                  handleGoalsChange("dailyStepGoal", e.target.value)
                }
                disabled={!isGoalsEditing}
                sx={inputSx}
              />

              <TextField
                label="Calorie Intake Goal"
                type="number"
                fullWidth
                value={goalsForm.caloriesIntakeGoal}
                onChange={(e) =>
                  handleGoalsChange("caloriesIntakeGoal", e.target.value)
                }
                disabled={!isGoalsEditing}
                sx={inputSx}
              />

              <TextField
                label="Water Intake Goal (L)"
                type="number"
                fullWidth
                value={goalsForm.waterIntakeGoal}
                onChange={(e) =>
                  handleGoalsChange("waterIntakeGoal", e.target.value)
                }
                disabled={!isGoalsEditing}
                sx={inputSx}
              />

              {isGoalsEditing && (
                <Button
                  variant="contained"
                  onClick={handleSaveGoals}
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
                  Save Goals
                </Button>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedPanel === "log"}
          onChange={handlePanelChange("log")}
          sx={accordionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ width: "100%" }}
            >
              <Box>
                <Typography sx={{ fontSize: "1.35rem", fontWeight: 800 }}>
                  Log
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
                  Log your weight for progress tracking. 
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`Weight: ${formatMetricValue(
                    logForm.weight,
                    logForm.weightUnit
                  )}`}
                  size="small"
                />
              </Stack>


            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2.2}>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                useFlexGap
                flexWrap="wrap"
              >
                <TextField
                  label="Weight"
                  type="number"
                  fullWidth
                  required
                  value={logForm.weight}
                  onChange={(e) => handleLogChange("weight", e.target.value)}
                  sx={inputSx}
                />

                <TextField
                  select
                  label="Unit"
                  value={logForm.weightUnit}
                  onChange={(e) => handleLogChange("weightUnit", e.target.value)}
                  sx={{ ...inputSx, minWidth: { xs: "100%", md: "140px" } }}
                >
                  {weightUnitOptions.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
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
                Submit Log
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>

    </Box>
  );
};

export default BodyLogs;