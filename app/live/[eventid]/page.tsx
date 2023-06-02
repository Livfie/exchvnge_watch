'use client';

import {useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, where,query, orderBy} from "firebase/firestore";

import  Image  from 'next/image';
import { Container } from '@mui/material';

type LiveProps = {
    eventid: string;
}

export default function Live( {params} : LiveProps) {
    
    console.log(params);

    return <main>
        <Container maxWidth="md">
            <h1>{params.eventid}</h1>
        </Container>
    </main>
}