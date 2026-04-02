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
} from 'firebase/firestore';
import { db } from '../firebase';

export const addWorkoutLog = async (uid, logData) => {
  const logsRef = collection(db, 'users', uid, 'workoutLogs');

  const payload = {
    logDate: logData.logDate || '',
    exercise: logData.exercise || null,
    equipment: logData.equipment || '',
    category: logData.category || '',
    sets: Number(logData.sets) || 0,
    reps: Number(logData.reps) || 0,
    weight: Number(logData.weight) || 0,
    weightUnit: logData.weightUnit || '',
    minutes: Number(logData.minutes) || 0,
    seconds: Number(logData.seconds) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(logsRef, payload);
  return docRef.id;
};

export const updateWorkoutLog = async (uid, logId, logData) => {
  const logRef = doc(db, 'users', uid, 'workoutLogs', logId);

  const payload = {
    logDate: logData.logDate || '',
    exercise: logData.exercise || null,
    equipment: logData.equipment || '',
    category: logData.category || '',
    sets: Number(logData.sets) || 0,
    reps: Number(logData.reps) || 0,
    weight: Number(logData.weight) || 0,
    weightUnit: logData.weightUnit || '',
    minutes: Number(logData.minutes) || 0,
    seconds: Number(logData.seconds) || 0,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(logRef, payload);
};

export const deleteWorkoutLog = async (uid, logId) => {
  const logRef = doc(db, 'users', uid, 'workoutLogs', logId);
  await deleteDoc(logRef);
};

export const getWorkoutLogs = async (uid) => {
  try {
    const logsRef = collection(db, 'users', uid, 'workoutLogs');
    const q = query(logsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error('Get workout logs error:', error);
    return [];
  }
};

export const getSingleWorkoutLog = async (uid, logId) => {
  try {
    const logRef = doc(db, 'users', uid, 'workoutLogs', logId);
    const snap = await getDoc(logRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error('Get single workout log error:', error);
    return null;
  }
};