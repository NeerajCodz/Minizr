import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const GetClients = () => {
  const [clients, setClients] = useState([]); // Array to store client names

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const q = query(collection(db, 'clients'), where('Active', '==', true));
        const querySnapshot = await getDocs(q);
        const activeClients = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.default) {
            activeClients.unshift(doc.id); // Add default client to the beginning of the array
          } else {
            activeClients.push(doc.id); // Add non-default clients to the end of the array
          }
        });

        setClients(activeClients); // Update the clients array with active client names

      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    
    fetchClients();
  }, []);
  console.log(clients)
  return clients; // Return the clients array once it's fetched
};

export default GetClients;
