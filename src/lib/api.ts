import { initializeApp } from 'firebase/app';
import { addDoc, arrayUnion, doc, FieldPath, getDoc, getDocs, getFirestore, query, runTransaction, Timestamp, where } from 'firebase/firestore/lite';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import * as v from 'valibot';
import { BOOTHS } from '../contents';
import { GuestCreateSchema, GuestPath, GuestSchema } from '../models/guest';
import { SummaryPath, SummarySchemaMap, VisitsSummarySchema } from '../models/summary';

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

export const getGuests = async () => {
  const collRef = doc(db, GuestPath.path).parent;
  const result = await getDocs(collRef);

  return result.docs.map((doc) => Object.assign(
    v.parse(GuestSchema, doc.data()),
    { id: doc.id },
  ));
}

export const createGuest = async (data: v.InferInput<typeof GuestCreateSchema>) => {
  const coll = doc(db, GuestPath.path).parent;
  const {
    proofFollow,
    proofStory,
    proofComment,
    ...payload
  } = v.parse(GuestCreateSchema, data);

  // Store the files in the storage
  const uploadResults = await Promise.all(
    Object.entries({ proofFollow, proofStory, proofComment })
      .map(async ([key, file]) => {
        if (!file) return [key] as const;

        const objRef = ref(storage, GuestPath.resolve({ guest: `questions/${key}_${Date.now()}_${file.name}` }));
        const task = await uploadBytes(objRef, file);

        return [key, task] as const;
      }),
  );

  const parsed = v.parse(GuestSchema, {
    ...payload,
    questions: Object.assign(Object.fromEntries(uploadResults.map(([key, upload]) => [key, upload?.ref.toString() ?? ''])), {
      age: payload.age,
    }),
    createdAt: Timestamp.now(),
  });

  try {
    const result = await addDoc(coll, parsed);

    return result.id;
  } catch (err) {
    // Clean up the storage if the database operation fails
    uploadResults.forEach(([, upload]) => {
      if (!upload) return;
      deleteObject(upload.ref);
    });

    throw err;
  }
};

export const checkIn = async (guest: string, name: string) => {
  if (!BOOTHS.includes(name)) {
    throw new Error('Booth not found');
  }

  return runTransaction(db, async (t) => {
    const guestRef = doc(db, GuestPath.resolve({ guest }));
    const summaryRef = doc(db, SummaryPath.resolve({ summary: 'visits' }));

    const [summarySnap, guestSnap] = await Promise.all([
      t.get(summaryRef),
      t.get(guestRef),
    ]);

    if (!guestSnap.exists()) throw new Error('Unauthorized');

    const guestD = v.parse(GuestSchema, guestSnap.data(), { abortEarly: true });

    t.update(guestRef,
      'visits.list', arrayUnion(name),
      new FieldPath('visits', 'details', name, 'count'), (guestD.visits.details[name]?.count ?? 0) + 1,
      new FieldPath('visits', 'details', name, 'timestamp'), Timestamp.now(),
      new FieldPath('visits', 'details', name, 'timestamps'), arrayUnion(Timestamp.now()),
    );

    if (summarySnap.exists()) {
      const summaryD = v.parse(VisitsSummarySchema, summarySnap.data(), { abortEarly: true });

      const isAlreadyVisit = guestD.visits.list.includes(name);

      t.update(summaryRef,
        'total', summaryD.total + 1,
        'unique', summaryD.unique + (isAlreadyVisit ? 0 : 1),
        'timestamp', Timestamp.now(),
        new FieldPath('details', name, 'count'), (summaryD.details[name]?.count ?? 0) + 1,
        new FieldPath('details', name, 'unique'), (summaryD.details[name]?.count ?? 0) + (isAlreadyVisit ? 0 : 1),
        new FieldPath('details', name, 'timestamp'), Timestamp.now(),
      );
    } else {
      const summaryPlaceholder = v.parse(VisitsSummarySchema, {
        total: 1,
        unique: 1,
        timestamp: Timestamp.now(),
        details: {
          [name]: {
            count: 1,
            unique: 1,
            timestamp: Timestamp.now(),
          },
        },
      } satisfies v.InferInput<typeof VisitsSummarySchema>);

      t.set(summaryRef, summaryPlaceholder);
    }
  });
};

export const getSummary = async <K extends keyof typeof SummarySchemaMap>(key: K) => {
  const docRef = doc(db, SummaryPath.resolve({ summary: key }));
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return v.parse(SummarySchemaMap[key], data);
};

export const getAttachment = async (gsUrl: string) => {
  const objRef = ref(storage, gsUrl);
  const url = await getDownloadURL(objRef);

  return {
    url,
    name: objRef.name,
  };
};

export const getGuestsByBooth = async (name: string) => {
  const guestColl = doc(db, GuestPath.path).parent;
  const q = query(guestColl, where('visits.list', 'array-contains', name));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => Object.assign(
    v.parse(GuestSchema, doc.data()),
    { id: doc.id },
  ));
};