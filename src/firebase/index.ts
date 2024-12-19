// Import the functions you need from the SDKs you need
import * as Firestore from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { IProject } from "../classes/Project";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZwSxpgG9TW_jffLRwqC9o2sJosxK0bIE",
  authDomain: "bim-dev-master-arlya.firebaseapp.com",
  projectId: "bim-dev-master-arlya",
  storageBucket: "bim-dev-master-arlya.firebasestorage.app",
  messagingSenderId: "663862565655",
  appId: "1:663862565655:web:ba1b0b206ff6e656b87552",
  measurementId: "G-FB1ZCCX7R0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const fireBaseDB = Firestore.getFirestore()

export function getCollection<T>(path: string) {
    return Firestore.collection(fireBaseDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(path: string, id: string) {
    const doc = Firestore.doc(fireBaseDB, `${path}/${id}`)
    await Firestore.deleteDoc(doc)
}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T) {
    const doc = Firestore.doc(fireBaseDB, `${path}/${id}`)
    await Firestore.updateDoc(doc, data)
}

export async function getDocument<T extends Record<string, any> & { finishDate?: string | Date }>(path: string, id: string): Promise<T> {
    const doc = Firestore.doc(fireBaseDB, `${path}/${id}`)
    const docSnapshot = await Firestore.getDoc(doc)
    if (docSnapshot.exists()) {
        const data = docSnapshot.data() as T;
        // Convert finishDate to Date object
        if ('finishDate' in data && typeof data.finishDate === 'string') {
          data.finishDate = new Date(data.finishDate);
        }
        return data;
      } else {
        throw new Error("Document not found");
      }
}

//
// updateDocument<Partial<IProject>>("/Projects", "adsfsa", {
//     name: "New name",
//     description: "New description"
// })