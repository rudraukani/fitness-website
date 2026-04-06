import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const addWorkoutLog = async (uid, logData) => {
  const logsRef = collection(db, "users", uid, "workoutLogs");

  const payload = {
    logDate: logData.logDate || "",
    routineId: logData.routineId || "",
    routineTitle: logData.routineTitle || "",
    routineSnapshot: {
      title: logData.routineSnapshot?.title || "",
      level: logData.routineSnapshot?.level || "",
      duration: logData.routineSnapshot?.duration || "",
      frequency: logData.routineSnapshot?.frequency || "",
      focus: logData.routineSnapshot?.focus || "",
      notes: logData.routineSnapshot?.notes || "",
      exercises: Array.isArray(logData.routineSnapshot?.exercises)
        ? logData.routineSnapshot.exercises.map((exercise) => ({
            id: exercise?.id || "",
            name: exercise?.name || "",
            sets: exercise?.sets || "",
            reps: exercise?.reps || "",
            timeValue: exercise?.timeValue || "",
            timeUnit: exercise?.timeUnit || "",
            equipment: exercise?.equipment || "",
          }))
        : [],
    },
    exercisePerformance: Array.isArray(logData.exercisePerformance)
      ? logData.exercisePerformance.map((exercise) => ({
          exerciseName: exercise?.exerciseName || "",
          equipment: exercise?.equipment || "",
          sets: exercise?.sets || "",
          reps: exercise?.reps || "",
          timeValue: exercise?.timeValue || "",
          timeUnit: exercise?.timeUnit || "",
          weight: Number(exercise?.weight || 0),
          weightUnit: exercise?.weightUnit || "",
        }))
      : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(logsRef, payload);
  return docRef.id;
};

export const updateWorkoutLog = async (uid, logId, logData) => {
  const logRef = doc(db, "users", uid, "workoutLogs", logId);

  const payload = {
    logDate: logData.logDate || "",
    routineId: logData.routineId || "",
    routineTitle: logData.routineTitle || "",
    routineSnapshot: {
      title: logData.routineSnapshot?.title || "",
      level: logData.routineSnapshot?.level || "",
      duration: logData.routineSnapshot?.duration || "",
      frequency: logData.routineSnapshot?.frequency || "",
      focus: logData.routineSnapshot?.focus || "",
      notes: logData.routineSnapshot?.notes || "",
      exercises: Array.isArray(logData.routineSnapshot?.exercises)
        ? logData.routineSnapshot.exercises.map((exercise) => ({
            id: exercise?.id || "",
            name: exercise?.name || "",
            sets: exercise?.sets || "",
            reps: exercise?.reps || "",
            timeValue: exercise?.timeValue || "",
            timeUnit: exercise?.timeUnit || "",
            equipment: exercise?.equipment || "",
          }))
        : [],
    },
    exercisePerformance: Array.isArray(logData.exercisePerformance)
      ? logData.exercisePerformance.map((exercise) => ({
          exerciseName: exercise?.exerciseName || "",
          equipment: exercise?.equipment || "",
          sets: exercise?.sets || "",
          reps: exercise?.reps || "",
          timeValue: exercise?.timeValue || "",
          timeUnit: exercise?.timeUnit || "",
          weight: Number(exercise?.weight || 0),
          weightUnit: exercise?.weightUnit || "",
        }))
      : [],
    updatedAt: serverTimestamp(),
  };

  await updateDoc(logRef, payload);
};

export const deleteWorkoutLog = async (uid, logId) => {
  const logRef = doc(db, "users", uid, "workoutLogs", logId);
  await deleteDoc(logRef);
};

export const getWorkoutLogs = async (uid) => {
  try {
    const logsRef = collection(db, "users", uid, "workoutLogs");
    const q = query(logsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error("Get workout logs error:", error);
    return [];
  }
};

export const getSingleWorkoutLog = async (uid, logId) => {
  try {
    const logRef = doc(db, "users", uid, "workoutLogs", logId);
    const snap = await getDoc(logRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error("Get single workout log error:", error);
    return null;
  }
};