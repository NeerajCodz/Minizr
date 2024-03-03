import { useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

function Open({ shortcode }) {
  useEffect(() => {
    const fetchURL = async () => {
      try {
        // Get the document from Firestore using the provided shortcode
        const docRef = doc(db, 'urls', shortcode);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If the document exists, extract the LongURL and Clicks field
          const { LongURL } = docSnap.data();
          
          // Increment the Clicks field by 1
          await updateDoc(docRef, { Clicks: increment(1) });

          // Redirect to the extracted URL
          window.location.href = LongURL;
        } else {
          console.log("No such document!");
          // Redirect to '/home' if document doesn't exist
          window.location.href = '/home';
        }
      } catch (error) {
        console.error("Error getting document:", error);
        // Handle error
      }
    };

    fetchURL();
  }, [shortcode]);

  // This component doesn't render anything directly,
  // as it redirects to another page.
  return null;
}

export default Open;
