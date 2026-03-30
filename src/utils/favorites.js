import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export const addFavoriteExercise = async (uid, exercise) => {
  const favRef = doc(db, 'users', uid, 'favorites', exercise.id);

  await setDoc(favRef, {
    id: exercise.id,
    name: exercise.name,
    bodyPart: exercise.bodyPart || '',
    target: exercise.target || '',
    equipment: exercise.equipment || '',
    gifUrl: exercise.gifUrl || '',
    createdAt: serverTimestamp(),
  });
};

export const removeFavoriteExercise = async (uid, exerciseId) => {
  const favRef = doc(db, 'users', uid, 'favorites', exerciseId);
  await deleteDoc(favRef);
};

export const getUserFavorites = async (uid) => {
  try {
    const favsRef = collection(db, 'users', uid, 'favorites');
    const snap = await getDocs(favsRef);

    return snap.docs.map((docItem) => ({
      docId: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error('Get favorites error:', error);
    return [];
  }
};