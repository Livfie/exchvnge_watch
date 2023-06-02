'use client';

import {useState, useEffect} from 'react';
import { firebaseConfig } from "../../../settings/firebase";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, where,query, orderBy, DocumentData, onSnapshot, limit } from "firebase/firestore";

import  Image  from 'next/image';
import { Container, List, ListItem, ListItemIcon, ListItemText, Avatar} from '@mui/material';

type LiveProps = {
    eventid: string;
}

export default function Live( {params} : LiveProps) {

    const [host, setHost] = useState("");
    const [layout, setLayout] = useState("grid"); // gird | pip
    const [event, setEvent] = useState<DocumentData | null>(null);
    const [chats, setChats] = useState<DocumentData[]>([]);

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    useEffect( () => {
        if(params.eventid) {
            getEventInfo();
        }
    }, []);

    const getEventInfo = async () => {
        const eventResult = await getDoc(doc(firestore, "events", params.eventid));
        if(eventResult.exists()) {
          
            setEvent(eventResult.data());
        }
    }

    useEffect( () => {
        const chatSub = onSnapshot(query(collection(firestore, "event-chat"), where("eventid", "==", params.eventid), orderBy("timestamp", "desc"), limit(100)), (snapshot) => {
            if(!snapshot.empty) {

                const docs = snapshot.docs;
                
                const messages: DocumentData[] =[];

                docs.forEach( (chat, index) => {
                    const chatData = chat.data();
                    chatData.id = chat;
                    messages.push(chatData);
                });
                setChats(messages.reverse());
                var ele = document.getElementById("chat-log");
                if (ele !== null ){
                  
                 ele.scrollTop = ele.scrollHeight;
                }
                
            } 

        });
    }, [firestore]);

    useEffect( () => {
        const settingsFromURL = new URLSearchParams(window.location.search);

        if( settingsFromURL.get("layout") ) {
            setLayout(settingsFromURL.get("layout")!);
        }

        if( settingsFromURL.get("host") ) {
            setHost(settingsFromURL.get("host")!);
        }

    }, [window.location.search]);


    return <main>
        <Container maxWidth="xl" id="live-view">

            <h1>{event != null ?  `${event["name"]} @ Exchvnge` : "Exchvnge" }</h1>
            <List id="chat-log">
                {chats.map( (chat, index) => {
                    if(chat.isDeleted != true) {
                   return  <ListItem key={index} className={chat.isPinned ? "pinned-chat" : "chat"}>
                     <ListItemIcon className="chat-avatar"><Avatar alt={chat.sender} src={chat.sender_avatar} sx={{width:20,height:20}}>{chat.sender.substring(0,1)}</Avatar></ListItemIcon>
                    <ListItemText >
                        <span className="sender ">{chat.sender}</span> <span className="message">{chat.message}</span>
                    </ListItemText>
                   </ListItem>
                    }
                })}
            </List>
        </Container>
    </main>
} 