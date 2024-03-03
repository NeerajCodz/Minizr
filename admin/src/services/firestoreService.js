//src/services/firestoreService.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const addUrlToFirestore = async (LongURL, shortCode, AnalyticsID, timestamp, CreatorIP ) => {
  try {
    const urlRef = doc(db, 'urls', shortCode); // Reference to the document with the shortcode
    await setDoc(urlRef, {
      LongURL: LongURL,
      AnalyticsID: (AnalyticsID) ? AnalyticsID : '',
      timestamp: timestamp,
      Clicks: 0,
      CreatorIP : CreatorIP,
    });
    console.log('URL added to Firestore:', { LongURL, shortCode, timestamp });
    return true; // Return true if successful
  } catch (error) {
    console.error('Error adding URL to Firestore:', error);
    return false; // Return false if an error occurs
  }
};
