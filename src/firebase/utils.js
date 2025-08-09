import { signOut } from "firebase/auth";
import { auth, db, googleProvider, getCountFromServer } from "./firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  setDoc,
} from "firebase/firestore";

// const REPORTS_COLLECTION = import.meta.env.VITE_REACT_DATABASE;
const REPORTS_COLLECTION = import.meta.env.VITE_COLLECTION;

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const addData = async (data) => {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, data.id);
    // Use setDoc to create or overwrite the doc
    await setDoc(docRef, data);

    return {
      status: 200,
      message: "Report saved successfully!",
      id: data.id,
    };
  } catch (error) {
    console.error("Error adding report:", error);
    return { status: 500, message: error.message };
  }
};

export const getData = async (user, pageSize = 10, lastDocRef = null) => {
  try {
    let q = query(
      collection(db, REPORTS_COLLECTION),
      where("email", "==", user.email),
      orderBy("createdAt", "desc"),
      limit(pageSize + 1) // Get one extra to check if there are more
    );

    if (lastDocRef) {
      q = query(
        collection(db, REPORTS_COLLECTION),
        where("email", "==", user.email),
        orderBy("createdAt", "desc"),
        startAfter(lastDocRef),
        limit(pageSize + 1)
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { reports: [], hasMore: false, lastDoc: null };
    }

    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;
    const reports = docs.slice(0, pageSize).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastDoc = docs[pageSize - 1] || null;

    return { reports, hasMore, lastDoc };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { status: 500, error: error.message };
  }
};

export const getUserReportCount = async (user) => {
  try {
    if (!user || !user.email) {
      throw new Error("User not found");
    }
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("email", "==", user.email)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting user report count:", error);
    // Return 0 or null, depending on your preference
    return 0;
  }
};

export const getAllData = async () => {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const reports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reports;
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return { status: 500, error: error.message };
  }
};

export const deleteData = async (reportId, userId) => {
  try {
    // First verify the report belongs to the user
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await deleteDoc(reportRef);
    return { status: 200, message: "Report deleted successfully!" };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { status: 500, error: error.message };
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    return { status: 200, message: "Sign out successful" };
  } catch (error) {
    console.error("Error signing out:", error);
    return { status: 500, error: error.message };
  }
};
