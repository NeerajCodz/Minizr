import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import AskBeforeRedirect from './askbeforeredirect';

function Open({ shortcode }) {
  const [longUrl, setLongUrl] = useState(null);
  const [askBeforeRedirect, setAskBeforeRedirect] = useState(false);

  useEffect(() => {
    const fetchURL = async () => {
      try {
        const docRef = doc(db, 'urls', shortcode);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { LongURL, AskBeforeRedirect } = docSnap.data();
          setLongUrl(LongURL);
          setAskBeforeRedirect(AskBeforeRedirect);

          // Increment the Clicks field by 1
          await updateDoc(docRef, { Clicks: increment(1) });

        } else {
          console.log("No such document!");
          window.location.href = '/home';
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchURL();
  }, [shortcode]);

  if (askBeforeRedirect && longUrl) {
    return <AskBeforeRedirect longUrl={longUrl} />;
  } else if (longUrl) {
    window.location.href = longUrl;
    return null; // Redirecting, so don't render anything
  }

  return null; // Initial loading state
}

export default Open;
