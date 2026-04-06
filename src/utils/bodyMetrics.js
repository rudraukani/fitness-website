import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : "";
};

const convertHeightToCm = (height, unit = "cm") => {
  const parsedHeight = toNumber(height);
  if (parsedHeight === "") return "";

  return unit === "in" ? +(parsedHeight * 2.54).toFixed(2) : parsedHeight;
};

const convertWeightToKg = (weight, unit = "kg") => {
  const parsedWeight = toNumber(weight);
  if (parsedWeight === "") return "";

  return unit === "lbs" ? +(parsedWeight * 0.45359237).toFixed(2) : parsedWeight;
};

const normalizeMetricForStorage = (metricData = {}) => {
  const heightUnit = metricData.heightUnit || "cm";
  const initialWeightUnit = metricData.weightUnit || "kg";
  const logWeightUnit = metricData.logWeightUnit || "kg";

  const normalizedHeight = convertHeightToCm(metricData.height, heightUnit);
  const normalizedInitialWeight = convertWeightToKg(
    metricData.weight,
    initialWeightUnit
  );
  const normalizedLogWeight = convertWeightToKg(
    metricData.logWeight,
    logWeightUnit
  );

  return {
    height: normalizedHeight,
    heightUnit: "cm",

    // save the latest logged weight as the main weight used by BodyLogs display/BMI
    weight:
      normalizedLogWeight !== ""
        ? normalizedLogWeight
        : normalizedInitialWeight,
    weightUnit: "kg",

    age: toNumber(metricData.age),
    gender: metricData.gender || "",

    dailyStepGoal: toNumber(metricData.dailyStepGoal),
    caloriesIntakeGoal: toNumber(metricData.caloriesIntakeGoal),
    waterIntakeGoal: toNumber(metricData.waterIntakeGoal),

    // keep extra fields for history/reference
    initialWeight: normalizedInitialWeight,
    initialWeightUnit: "kg",
    logWeight: normalizedLogWeight,
    logWeightUnit: "kg",
  };
};

const normalizeMetricFromFirestore = (metric = {}) => {
  const height = convertHeightToCm(metric.height, metric.heightUnit || "cm");

  const weightSource =
    metric.weight !== undefined && metric.weight !== null && metric.weight !== ""
      ? metric.weight
      : metric.logWeight !== undefined &&
        metric.logWeight !== null &&
        metric.logWeight !== ""
      ? metric.logWeight
      : metric.initialWeight;

  const weightUnitSource =
    metric.weightUnit || metric.logWeightUnit || metric.initialWeightUnit || "kg";

  return {
    ...metric,
    height,
    heightUnit: "cm",
    weight: convertWeightToKg(weightSource, weightUnitSource),
    weightUnit: "kg",
    age: toNumber(metric.age),
    dailyStepGoal: toNumber(metric.dailyStepGoal),
    caloriesIntakeGoal: toNumber(metric.caloriesIntakeGoal),
    waterIntakeGoal: toNumber(metric.waterIntakeGoal),
  };
};

export const addBodyMetric = async (userId, metricData) => {
  const ref = collection(db, "users", userId, "bodyMetrics");
  const normalizedMetric = normalizeMetricForStorage(metricData);

  await addDoc(ref, {
    ...normalizedMetric,
    createdAt: serverTimestamp(),
  });
};

export const addBodyMetricLog = async (userId, logData) => {
  const ref = collection(db, "users", userId, "bodyMetricLogs");

  const normalizedWeight = convertWeightToKg(
    logData.weight,
    logData.weightUnit || "kg"
  );

  await addDoc(ref, {
    weight: normalizedWeight,
    weightUnit: "kg",
    date: logData.date || "",
    createdAt: serverTimestamp(),
  });
};

export const getBodyMetrics = async (userId) => {
  const ref = collection(db, "users", userId, "bodyMetrics");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...normalizeMetricFromFirestore(docItem.data()),
  }));
};

export const deleteBodyMetric = async (userId, metricId) => {
  const ref = doc(db, "users", userId, "bodyMetrics", metricId);
  await deleteDoc(ref);
};

export const getBodyMetricLogs = async (userId) => {
  const ref = collection(db, "users", userId, "bodyMetricLogs");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

export const deleteBodyMetricLog = async (userId, logId) => {
  const ref = doc(db, "users", userId, "bodyMetricLogs", logId);
  await deleteDoc(ref);
};