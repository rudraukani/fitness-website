import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
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
    duration: routineData.duration || "",
    frequency: routineData.frequency || "",
    focus: routineData.focus || "",
    description: routineData.description || "",
    exercises: Array.isArray(routineData.exercises) ? routineData.exercises : [],
    saved: Boolean(routineData.saved),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(routinesRef, payload);
  return docRef.id;
};

export const updateRoutine = async (uid, routineId, routineData) => {
  const routineRef = doc(db, "users", uid, "routines", routineId);

  await updateDoc(routineRef, {
    ...routineData,
    updatedAt: serverTimestamp(),
  });
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