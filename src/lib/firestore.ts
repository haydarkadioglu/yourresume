import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import type { ResumeData, LoginHistory } from "@/types";

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

  try {
    const resumesRef = collection(db, "resumes");
    const q = query(
      resumesRef,
      where("personalInfo.username", "==", username),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const resumeDoc = querySnapshot.docs[0];
    return resumeDoc.data() as ResumeData;
  } catch (error) {
    console.error("Error fetching resume by username:", error);
    // Firestore'un oluşturulması gereken bir dizin önermesi durumunda,
    // hata mesajında genellikle bir URL bulunur. Bu URL'yi tarayıcınızda
    // açarak dizini kolayca oluşturabilirsiniz.
    return null;
  }
}

export async function saveResumeData(
  uid: string,
  newData: ResumeData
): Promise<{ success: boolean; message: string }> {
  const resumeDocRef = doc(db, "resumes", uid);
  const newUsername = newData.personalInfo.username?.trim();

  // Check if username is already taken by another user
  if (newUsername) {
    const resumesRef = collection(db, "resumes");
    const q = query(
      resumesRef,
      where("personalInfo.username", "==", newUsername)
    );
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      if (doc.id !== uid) {
        return { success: false, message: "Username is already taken." };
      }
    }
  }

  try {
    // Use setDoc with merge to create or update the document.
    await setDoc(resumeDocRef, newData, { merge: true });
    return { success: true, message: "Data saved successfully." };
  } catch (e: any) {
    console.error("Error saving data:", e);
    return { success: false, message: "Failed to save data." };
  }
}

export async function saveLoginHistory(
  uid: string,
  loginData: Omit<LoginHistory, "timestamp">
): Promise<{ success: boolean; message?: string }> {
  if (!uid) return { success: false, message: "User ID is missing." };

  const historyCollectionRef = collection(db, "resumes", uid, "loginHistory");
  const HISTORY_LIMIT = 25;

  try {
    const batch = writeBatch(db);

    // 1. Add the new login document with a timestamp-based ID.
    const newDocId = new Date().toISOString();
    const newDocRef = doc(historyCollectionRef, newDocId);
    batch.set(newDocRef, {
      ...loginData,
      timestamp: serverTimestamp(),
    });

    // 2. Query existing documents to enforce the limit.
    const q = query(historyCollectionRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const historyDocs = querySnapshot.docs;

    // 3. If the limit is exceeded, schedule the oldest documents for deletion.
    if (historyDocs.length >= HISTORY_LIMIT) {
      const docsToDeleteCount = historyDocs.length - HISTORY_LIMIT + 1;
      const docsToDelete = historyDocs.slice(0, docsToDeleteCount);
      docsToDelete.forEach((docToDelete) => {
        batch.delete(docToDelete.ref);
      });
    }

    // 4. Commit all atomic operations.
    await batch.commit();

    return { success: true };
  } catch (e: any) {
    console.error("Error saving login history:", e);
    return { success: false, message: "Failed to save login history." };
  }
}
