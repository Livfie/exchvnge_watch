'use client';

import {useState, useEffect} from 'react';
import { firebaseConfig } from "../../../settings/firebase";
import { AgoraAppID } from "../../../settings/agora";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, where,query, orderBy, DocumentData, onSnapshot, limit } from "firebase/firestore";

import  Image  from 'next/image';
import { Container, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import AgoraRTC , {ClientConfig, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import AgoraUIKit, { layout, RtcPropsInterface } from "agora-react-uikit";


type LiveProps = {
    eventid: string;
}

export default function Live( {params} : LiveProps) {

    const [host, setHost] = useState("");
   // const [layout, setLayout] = useState("grid"); // gird | pip
    const [event, setEvent] = useState<DocumentData | null>(null);
    const [chats, setChats] = useState<DocumentData[]>([]);
    const [liveHosts, setLiveHosts] = useState<IAgoraRTCRemoteUser[]>([]);
    const [joined, setJoined] = useState(false);
    const [hideChat, setHideChat] = useState(false);
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    let agoraEngine: any;

    const agoraConfig : RtcPropsInterface = {
        appId: AgoraAppID,
        channel: params.eventid,
        token: null,
        role: 'audience',
        layout: layout.pin,
    }

    const callbacks = {
        EndCall: () => {

        }
    }

    const rtcStyles =  {
        localBtnContainer: {backgroundColor: "#000" , }
      }

    const getEventInfo = async () => {
        const eventResult = await getDoc(doc(firestore, "events", params.eventid));
        if(eventResult.exists()) {
          
            setEvent(eventResult.data());
        }
    }

    // on database update
    useEffect( () => {
        if(!hideChat === true) {
        const chatSub = onSnapshot(query(collection(firestore, "event-chat"), where("eventid", "==", params.eventid), orderBy("timestamp", "desc"), limit(200)), (snapshot) => {
            if(!snapshot.empty) {

                const docs = snapshot.docs;
                
                const messages: DocumentData[] =[];

                docs.forEach( (chat, index) => {
                    const chatData = chat.data();
                    chatData.id = chat;
                    messages.push(chatData);
                });
                setChats(messages.reverse());
              
                
            } 

        });
        }
    }, [firestore]);

    // on initial render
    useEffect( () => {

        if(params.eventid) {
            getEventInfo();
        }

        const settingsFromURL = new URLSearchParams(window.location.search);

        if( settingsFromURL.get("layout") ) {
            setLayout(settingsFromURL.get("layout")!);
        }

        if( settingsFromURL.get("host") ) {
            setHost(settingsFromURL.get("host")!);
        }
 
        if( settingsFromURL.get("hideChat") ) {
            const hideChat = settingsFromURL.get("hideChat") == "true" ? true : false;
          
            setHideChat(hideChat);
        }
            

        initAgora();

        // on cleanup
        return () => {
            console.log("exchvnge clean up ");
            leaveChannel();
            
        };

    }, []);

    // on rerender
    useEffect( () => {
        const lastIndex = chats.length - 1;
        var ele = document.getElementById("chat-item-" + lastIndex);
        if(ele !== null) {
            ele.scrollIntoView({behavior: "smooth"});
        }
        
       
    });

   

    const initAgora = async () => {
        try {
            
            const clientConfig: ClientConfig = {
                mode: "live",
                codec: "vp8",
                role: "audience"
            };
            agoraEngine= AgoraRTC.createClient( clientConfig );
            
            agoraEngine.on("user-joined", async (user : IAgoraRTCRemoteUser) => {
                setLiveHosts(agoraEngine.remoteUsers);
                console.log("exchvnge remote users joined:" , agoraEngine.remoteUsers);
            });

            agoraEngine.on("user-left", async (user : IAgoraRTCRemoteUser) => {
                setLiveHosts(agoraEngine.remoteUsers);
                console.log("exchvnge remote users left:" , agoraEngine.remoteUsers);
            });

            agoraEngine.on("user-published", async (user : IAgoraRTCRemoteUser , mediaType: String) => {
                await agoraEngine.subscribe(user, mediaType);
              //  console.log("exchvnge remote users:" , agoraEngine.remoteUsers);
              //  setLiveHosts(agoraEngine.remoteUsers);
                

                if(mediaType === "video") {
                  setupHosts(agoraEngine.remoteUsers);
                }
                if(mediaType === "audio") {
                    user.audioTrack?.play();
                }
            });

            agoraEngine.on("user-unpublished", (user : IAgoraRTCRemoteUser) => {
                agoraEngine.unsubscribe(user);
                setupHosts(agoraEngine.remoteUsers);

            }); 

            const uid = await agoraEngine.join(AgoraAppID, params.eventid, null, null);

           
            setJoined(true);
            setLiveHosts(agoraEngine.remoteUsers);
        } catch(err){
            console.error(err);
        }
    }


    const setupHosts = (users : IAgoraRTCRemoteUser [] ) => {
        setLiveHosts(agoraEngine.remoteUsers);
        const container =  document.getElementById("remote-videos-container");
        container!.innerHTML = "";
        users.forEach( (user, index) => {
            const videoContainer = document.createElement("div");
            videoContainer.id = `remote-video-${user.uid}`;
            videoContainer.className = "remote-video";
            container?.appendChild(videoContainer);
            user.videoTrack?.play(`remote-video-${user.uid}`);

        });
    }
    

    const leaveChannel = async () => {
        try {
            agoraEngine && agoraEngine.leave();
        } catch (err){ 
            console.error(err);
        }
    }


    return <main>
        <Container maxWidth="xl" id="live-view">

            <h1>{event != null ?  event["name"] : "Exchvnge" }</h1>
            <Container maxWidth="xl" id="stream-container">
            <Container maxWidth="md" id="chat-log-container">
       <List id="chat-log">
                {chats.map( (chat, index) => {
                    if(chat.deleted != true) {
                   return  <ListItem key={`chat-item-${index}`} id={`chat-item-${index}`} className={chat.isPinned ? "pinned-chat" : "chat"}>
                     <ListItemIcon className="chat-avatar"><Avatar alt={chat.sender} src={chat.sender_avatar} sx={{width:20,height:20}}>{chat.sender.substring(0,1)}</Avatar></ListItemIcon>
                    <ListItemText >
                        <span className="sender ">{chat.sender}</span> <span className="message">{chat.message}</span>
                    </ListItemText>
                   </ListItem>
                    }
                })}
            </List>
            </Container>
            
            <Grid container maxWidth="md" id="remote-videos-container" className={`remote-videos-container host-count-${liveHosts.length}`} >
            
            </Grid>
            </Container>
        </Container>
    </main>
} 

// <AgoraUIKit rtcProps={agoraConfig} callbacks={callbacks} styleProps={ rtcStyles } />