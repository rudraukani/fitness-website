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

export const addBodyMetric = async (userId, metricData) => {
  const ref = collection(db, "users", userId, "bodyMetrics");
  await addDoc(ref, {
    ...metricData,
    createdAt: serverTimestamp(),
  });
};

export const getBodyMetrics = async (userId) => {
  const ref = collection(db, "users", userId, "bodyMetrics");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

export const deleteBodyMetric = async (userId, metricId) => {
  const ref = doc(db, "users", userId, "bodyMetrics", metricId);
  await deleteDoc(ref);
};