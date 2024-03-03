import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

const BannedHosts = () => {
  const [CreatorIP, setcreatorIP] = useState('');
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const fetchcreatorIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setcreatorIP(data.ip);
      } catch (error) {
        setcreatorIP('NaN')
        console.error('Error fetching user IP:', error);
      }
    };

    fetchcreatorIP();
  }, []);

  useEffect(() => {
    const checkBannedHosts = async () => {
      if (CreatorIP) {
        try {
          const docRef = doc(db, 'banned-hosts', CreatorIP);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log(`User IP ${CreatorIP} exists in banned-hosts collection.`);
            setExists(true);
          } else {
            console.log(`User IP ${CreatorIP} does not exist in banned-hosts collection.`);
            setExists(false);
          }
        } catch (error) {
          if (error.code === 'not-found') {
            console.log('banned-hosts collection not found.');
          } else {
            console.error('Error checking banned hosts:', error);
          }
          setExists(false); // Set exists to false in case of error
        }
      }
    };

    checkBannedHosts();
  }, [CreatorIP]);

  // Return an object with both CreatorIP and exists
  return { CreatorIP, exists };
};

export default BannedHosts;
