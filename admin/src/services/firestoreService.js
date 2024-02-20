//src/services/firestoreService.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const addUrlToFirestore = async (longUrl, shortCode, analyticsID, timestamp) => {
  try {
    const urlRef = doc(db, 'urls', shortCode); // Reference to the document with the shortcode
    await setDoc(urlRef, {
      longUrl: longUrl,
      AnalyticsID: analyticsID,
      timestamp: timestamp,
      click: 0,
    });
    console.log('URL added to Firestore:', { longUrl, shortCode, timestamp });
    return true; // Return true if successful
  } catch (error) {
    console.error('Error adding URL to Firestore:', error);
    return false; // Return false if an error occurs
  }
};
