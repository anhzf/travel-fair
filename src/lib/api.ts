import { initializeApp } from 'firebase/app';
import { addDoc, doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore/lite';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import * as v from 'valibot';
import { GuestCreateSchema, GuestPath, GuestSchema } from '../models/guest';

const config = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);

export const getGuest = async (id: string) => {
  const docRef = doc(db, GuestPath.resolve({ guest: id }));
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return Object.assign(v.parse(GuestSchema, data), { id });
};

export const createGuest = async (data: v.InferInput<typeof GuestCreateSchema>) => {
  const coll = doc(db, GuestPath.path).parent;
  const {
    proofFollow,
    proofStory,
    proofComment,
    ...payload
  } = v.parse(GuestCreateSchema, data);

  const uploadResults = await Promise.all(
    Object.entries({ proofFollow, proofStory, proofComment })
      .map(async ([key, file]) => {
        const objRef = ref(storage, GuestPath.resolve({ guest: `questions/${key}_${Date.now()}_${file.name}` }));
        const task = await uploadBytes(objRef, file);

        return [key, task] as const;
      }),
  );

  const parsed = v.parse(GuestSchema, {
    ...payload,
    questions: Object.fromEntries(uploadResults.map(([key, upload]) => [key, upload.ref.toString()])),
    createdAt: Timestamp.now(),
  });

  try {
    const result = await addDoc(coll, parsed);

    return result.id;
  } catch (err) {
    uploadResults.forEach(([, upload]) => {
      deleteObject(upload.ref);
    });

    throw err;
  }
};