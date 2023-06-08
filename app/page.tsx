'use client';
// landing page | event listing
import {useState, useEffect, Suspense} from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, where,query, orderBy} from "firebase/firestore";
import { firebaseConfig } from "../settings/firebase";
import  Image  from 'next/image';
import Link from 'next/link';
import { Container, ImageList, ImageListItem, Avatar } from '@mui/material';

type Event = {
  id: string;
  [key: string]: any;
}

export default function Home() {

  const [events, setEvents] = useState<Event[]>([]); 

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  useEffect ( () => {
      getEvents();

  }, []);

  const getEvents = async () => {
    const eventsResult = await getDocs(query(collection(firestore, "events"), where("isLive", "==", true), where("isActive", "==", true), orderBy("eventDate", "desc")));

    if(eventsResult.docs.length > 0){
      const tempEvents = eventsResult.docs.map( (doc) => {
        return {id: doc.id, ...doc.data()};
      });
      setEvents(tempEvents);
      
    }
  }



  return <main>
     <Container maxWidth="xl" id="events-view">
    { events.length === 0 && <center><h1>There's currently no live setEvents</h1></center>}
    <ImageList cols={1} gap={5}>
    {events.map ( (event) => {
     
      return <ImageListItem key={event.id} className="event-item" >
        <Suspense fallback={<div>Loading...</div>}>
                  <Link href={`/live/${event.id}?host=${event.host}`} passHref>
                  
                  <div className="event-image">
                 <Image src={event.image !== "" ?  event.image : "/appicon_black_1024.png"} alt={event.name} width="800" height="800" />
                 <div className="event-host">
                    <Avatar className="host-avatar" src={event.hostAvatar !== "" ?  event.hostAvatar : "/appicon_black_1024.png"} alt={event.hostname} sx={{ width: 30, height: 30 }} />
                    
                    <h3>{event.hostname}</h3>
                 </div>
                 </div>
                  <div className="event-description">
                      <h2>{event.name}</h2>
                      <p>{event.description}</p>
                  </div>
                 </Link></Suspense>
            </ImageListItem>
    })}
    
    </ImageList>
    </Container>
  </main>
}