import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import type { ResumeData } from "@/types";

export async function getResumeData(uid: string): Promise<ResumeData | null> {
  if (!uid) return null;
  const resumeDocRef = doc(db, "resumes", uid);
  const resumeDocSnap = await getDoc(resumeDocRef);
  if (resumeDocSnap.exists()) {
    return resumeDocSnap.data() as ResumeData;
  }
  return null;
}

export async function getResumeDataByUsername(
  username: string
): Promise<ResumeData | null> {
  if (!username) return null;

  const usernameRef = doc(db, "usernames", username);
  const usernameSnap = await getDoc(usernameRef);

  if (!usernameSnap.exists()) {
    return null;
  }

  const { uid } = usernameSnap.data();
  const resumeRef = doc(db, "resumes", uid);
  const resumeSnap = await getDoc(resumeRef);

  return resumeSnap.exists() ? (resumeSnap.data() as ResumeData) : null;
}

export async function saveResumeData(
  uid: string,
  newData: ResumeData
): Promise<{ success: boolean; message: string }> {
  const batch = writeBatch(db);
  const resumeDocRef = doc(db, "resumes", uid);

  const newUsername = newData.personalInfo.username?.trim();

  const existingDataSnap = await getDoc(resumeDocRef);
  const oldUsername = existingDataSnap.exists()
    ? existingDataSnap.data().personalInfo.username
    : null;

  if (newUsername && newUsername !== oldUsername) {
    const newUsernameRef = doc(db, "usernames", newUsername);
    const usernameSnap = await getDoc(newUsernameRef);
    if (usernameSnap.exists() && usernameSnap.data().uid !== uid) {
      return { success: false, message: "Username is already taken." };
    }

    if (oldUsername) {
      const oldUsernameRef = doc(db, "usernames", oldUsername);
      batch.delete(oldUsernameRef);
    }

    batch.set(newUsernameRef, { uid });
  }

  batch.set(resumeDocRef, newData, { merge: true });

  try {
    await batch.commit();
    return { success: true, message: "Data saved successfully." };
  } catch (e: any) {
    console.error("Error saving data:", e);
    return { success: false, message: "Failed to save data." };
  }
}
