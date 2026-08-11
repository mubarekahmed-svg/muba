import { 
  collection, 
  doc, 
  onSnapshot, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { Publication, ExperienceItem, ProfileData, ContactMessage } from '../types';
import { PERSONAL_INFO, WORK_EXPERIENCES, PUBLICATIONS_LIST } from '../data/profileData';

// ----------------------------------------------------
// SEED INITIAL DATA IF FIRESTORE COLLECTIONS ARE EMPTY
// ----------------------------------------------------
async function seedInitialDataIfEmpty() {
  try {
    // 1. Publications
    const pubSnap = await getDocs(collection(db, 'publications'));
    if (pubSnap.empty) {
      console.log('Seeding initial publications to Firestore...');
      const batch = writeBatch(db);
      PUBLICATIONS_LIST.forEach((pub) => {
        const pubRef = doc(db, 'publications', String(pub.id));
        batch.set(pubRef, pub);
      });
      await batch.commit();
    }

    // 2. Experiences
    const expSnap = await getDocs(collection(db, 'experiences'));
    if (expSnap.empty) {
      console.log('Seeding initial experiences to Firestore...');
      const batch = writeBatch(db);
      WORK_EXPERIENCES.forEach((exp) => {
        const expRef = doc(db, 'experiences', exp.id);
        batch.set(expRef, exp);
      });
      await batch.commit();
    }

    // 3. Profile
    const profRef = doc(db, 'profile', 'main');
    const profSnap = await getDocs(collection(db, 'profile'));
    if (profSnap.empty) {
      console.log('Seeding initial profile to Firestore...');
      await setDoc(profRef, PERSONAL_INFO);
    }
  } catch (error) {
    console.warn('Initial Firestore seeding warning (ignoring if unauthenticated):', error);
  }
}

// Trigger initial seed
seedInitialDataIfEmpty();

// ----------------------------------------------------
// REALTIME FIRESTORE SUBSCRIBERS
// ----------------------------------------------------

export function subscribeToPublications(onData: (pubs: Publication[]) => void) {
  const path = 'publications';
  const q = query(collection(db, path));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Publication[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: Number(docSnap.id) || data.id,
          title: data.title || '',
          authors: data.authors || '',
          journal: data.journal || '',
          year: Number(data.year) || new Date().getFullYear(),
          volumeIssue: data.volumeIssue,
          doi: data.doi,
          link: data.link,
          category: data.category || 'maternal',
          abstractPreview: data.abstractPreview,
        };
      });
      // Sort descending by year
      items.sort((a, b) => b.year - a.year);
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeToExperiences(onData: (exps: ExperienceItem[]) => void) {
  const path = 'experiences';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ExperienceItem[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        role: docSnap.data().role || '',
        institution: docSnap.data().institution || '',
        period: docSnap.data().period || '',
        location: docSnap.data().location || '',
        responsibilities: docSnap.data().responsibilities || [],
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeToProfile(onData: (profile: ProfileData) => void) {
  const path = 'profile/main';
  return onSnapshot(
    doc(db, 'profile', 'main'),
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as ProfileData);
      } else {
        onData(PERSONAL_INFO);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeToContactMessages(onData: (msgs: ContactMessage[]) => void) {
  const path = 'contactMessages';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ContactMessage[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name || '',
        email: docSnap.data().email || '',
        subject: docSnap.data().subject || '',
        category: docSnap.data().category || 'General',
        message: docSnap.data().message || '',
        createdAt: docSnap.data().createdAt || new Date().toISOString(),
        read: Boolean(docSnap.data().read),
      }));
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ----------------------------------------------------
// FIRESTORE MUTATIONS (MUTATABLE CRUD)
// ----------------------------------------------------

export async function addPublicationInFirestore(pub: Omit<Publication, 'id'>): Promise<Publication> {
  const path = 'publications';
  try {
    const snap = await getDocs(collection(db, path));
    const existingIds = snap.docs.map(d => Number(d.id)).filter(n => !isNaN(n));
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const newDoc: Publication = {
      ...pub,
      id: nextId
    };

    await setDoc(doc(db, path, String(nextId)), newDoc);
    return newDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePublicationInFirestore(id: number, pub: Partial<Publication>): Promise<void> {
  const path = `publications/${id}`;
  try {
    await updateDoc(doc(db, 'publications', String(id)), pub);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePublicationFromFirestore(id: number): Promise<void> {
  const path = `publications/${id}`;
  try {
    await deleteDoc(doc(db, 'publications', String(id)));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addExperienceInFirestore(exp: Omit<ExperienceItem, 'id'>): Promise<ExperienceItem> {
  const path = 'experiences';
  try {
    const newId = `exp-${Date.now()}`;
    const newExp: ExperienceItem = {
      ...exp,
      id: newId
    };
    await setDoc(doc(db, path, newId), newExp);
    return newExp;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteExperienceFromFirestore(id: string): Promise<void> {
  const path = `experiences/${id}`;
  try {
    await deleteDoc(doc(db, 'experiences', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateProfileInFirestore(data: Partial<ProfileData>): Promise<void> {
  const path = 'profile/main';
  try {
    await setDoc(doc(db, 'profile', 'main'), data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addContactMessageToFirestore(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
  const path = 'contactMessages';
  try {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: ContactMessage = {
      ...msg,
      id,
      createdAt: new Date().toISOString(),
      read: false
    };
    await setDoc(doc(db, path, id), newMsg);
    return newMsg;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function toggleMessageReadInFirestore(id: string, currentReadStatus: boolean): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await updateDoc(doc(db, 'contactMessages', id), {
      read: !currentReadStatus
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessageFromFirestore(id: string): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// FIREBASE AUTHENTICATION HELPERS
// ----------------------------------------------------

export async function signInWithGoogleAuth() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function signOutFirebaseUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

export function subscribeToAuthState(onUserChanged: (user: User | null) => void) {
  return onAuthStateChanged(auth, onUserChanged);
}
