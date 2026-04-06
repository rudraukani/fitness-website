import { db } from "../firebase";
import { getDoc } from "firebase/firestore";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

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
    saved: Boolean(routineData.saved),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  console.log("Saving routine for uid:", userId);
  console.log("Payload:", payload);

  const docRef = await addDoc(routinesCollection, payload);
  console.log("Routine saved with id:", docRef.id);
  console.log("Routine saved at path:", docRef.path);
  const snap = await getDoc(docRef);
  console.log("exists after save:", snap.exists());
  console.log("data after save:", snap.data());

  return { id: docRef.id, ...payload };
};

export const getRoutines = async (userId) => {
  const routinesCollection = getRoutinesCollection(userId);
  const q = query(routinesCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

export const updateRoutine = async (userId, routineId, routineData) => {
  const routineRef = doc(db, "users", userId, "routines", routineId);

  await updateDoc(routineRef, {
    ...routineData,
    updatedAt: serverTimestamp(),
  });

  return routineId;
};

export const deleteRoutine = async (userId, routineId) => {
  const routineRef = doc(db, "users", userId, "routines", routineId);
  await deleteDoc(routineRef);
  return routineId;
};