import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const getRoutinesCollection = (userId) =>
  collection(db, "users", userId, "routines");

export const addRoutine = async (userId, routineData) => {
  const routinesCollection = getRoutinesCollection(userId);

  const payload = {
    title: routineData.title || "",
    level: routineData.level || "",
    durationValue: routineData.durationValue || "",
    durationUnit: routineData.durationUnit || "",
    frequencyValue: routineData.frequencyValue || "",
    frequencyUnit: routineData.frequencyUnit || "",
    focus: routineData.focus || "",
    notes: routineData.notes || "",
    exercises: Array.isArray(routineData.exercises) ? routineData.exercises : [],
    saved: routineData.saved !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(routinesCollection, payload);
  return { id: docRef.id, ...payload };
};

export const getRoutines = async (userId) => {
  try {
    const routinesCollection = getRoutinesCollection(userId);
    const q = query(routinesCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Get routines error:", error);
    return [];
  }
};

export const updateRoutine = async (userId, routineId, routineData) => {
  const routineRef = doc(db, "users", userId, "routines", routineId);

  const payload = {
    ...routineData,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(routineRef, payload);
  return routineId;
};

export const deleteRoutine = async (userId, routineId) => {
  const routineRef = doc(db, "users", userId, "routines", routineId);
  await deleteDoc(routineRef);
};

export const getSingleRoutine = async (userId, routineId) => {
  try {
    const routineRef = doc(db, "users", userId, "routines", routineId);
    const snap = await getDoc(routineRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error("Get single routine error:", error);
    return null;
  }
};