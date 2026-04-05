import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const collectionRef = collection(db, "workoutLogs");

export const addWorkoutLog = async (log) => {
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
    createdAt: new Date(),
  });
};

export const getWorkoutLogs = async () => {
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const deleteWorkoutLog = async (logId) => {
  const logRef = doc(db, "workoutLogs", logId);
  await deleteDoc(logRef);
};