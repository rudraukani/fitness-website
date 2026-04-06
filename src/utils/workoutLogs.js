import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const getWorkoutLogsCollection = (userId) =>
  collection(db, "users", userId, "workoutLogs");

export const addWorkoutLog = async (userId, log) => {
  const collectionRef = getWorkoutLogsCollection(userId);

  await addDoc(collectionRef, {
    logDate: log.logDate || "",
    routineId: log.routineId || "",
    routineTitle: log.routineTitle || "",
    routineSnapshot: {
      title: log.routineSnapshot?.title || "",
      level: log.routineSnapshot?.level || "",
      duration: log.routineSnapshot?.duration || "",
      frequency: log.routineSnapshot?.frequency || "",
      focus: log.routineSnapshot?.focus || "",
      notes: log.routineSnapshot?.notes || "",
      exercises: Array.isArray(log.routineSnapshot?.exercises)
        ? log.routineSnapshot.exercises
        : [],
    },
    exercisePerformance: Array.isArray(log.exercisePerformance)
      ? log.exercisePerformance.map((exercise) => ({
          exerciseName: exercise.exerciseName || "",
          equipment: exercise.equipment || "",
          sets: exercise.sets || "",
          reps: exercise.reps || "",
          timeValue: exercise.timeValue || "",
          timeUnit: exercise.timeUnit || "",
          weight: Number(exercise.weight) || 0,
          weightUnit: exercise.weightUnit || "",
        }))
      : [],
    createdAt: serverTimestamp(),
  });
};

export const getWorkoutLogs = async (userId) => {
  const collectionRef = getWorkoutLogsCollection(userId);
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

export const deleteWorkoutLog = async (userId, logId) => {
  const logRef = doc(db, "users", userId, "workoutLogs", logId);
  await deleteDoc(logRef);
};