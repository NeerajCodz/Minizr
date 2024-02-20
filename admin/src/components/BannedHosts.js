import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

const BannedHosts = () => {
  const [userIP, setUserIP] = useState('');
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const fetchUserIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error('Error fetching user IP:', error);
      }
    };

    fetchUserIP();
  }, []);

  useEffect(() => {
    const checkBannedHosts = async () => {
      if (userIP) {
        try {
          const docRef = doc(db, 'banned-hosts', userIP);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log(`User IP ${userIP} exists in banned-hosts collection.`);
            setExists(true);
          } else {
            console.log(`User IP ${userIP} does not exist in banned-hosts collection.`);
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
  }, [userIP]);

  // Return an object with both userIP and exists
  return { userIP, exists };
};

export default BannedHosts;
