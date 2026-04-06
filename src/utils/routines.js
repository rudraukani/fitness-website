import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const addRoutine = async (uid, routineData) => {
  const routinesRef = collection(db, "users", uid, "routines");

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

  const docRef = await addDoc(routinesRef, payload);
  return docRef.id;
};

export const updateRoutine = async (uid, routineId, routineData) => {
  const routineRef = doc(db, "users", uid, "routines", routineId);

  const payload = {
    ...routineData,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(routineRef, payload);
};

export const deleteRoutine = async (uid, routineId) => {
  const routineRef = doc(db, "users", uid, "routines", routineId);
  await deleteDoc(routineRef);
};

export const getRoutines = async (uid) => {
  try {
    const routinesRef = collection(db, "users", uid, "routines");
    const q = query(routinesRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error("Get routines error:", error);
    return [];
  }
};

export const getSingleRoutine = async (uid, routineId) => {
  try {
    const routineRef = doc(db, "users", uid, "routines", routineId);
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