/* eslint-disable @typescript-eslint/ */

'use client'

import Image from "next/image";
import Scan from '../containers/Scan';
import Write from '../containers/Write';
import { useState } from 'react';
import { ActionsContext } from '../contexts/context';
import './App.css';

type Actions = {
    scan?: () => void;
    write?: () => void;
} | null;

export default function Home() {
    const [actions, setActions] = useState<Actions>(null);
    const { scan, write } = actions || {};

    const actionsValue = { actions, setActions };

    const onHandleAction = (actions: any) => {
        setActions({ ...actions });
    }
    return (
        <div className="max-w-screen-lg h-[90vh] overflow-auto border-black border-4 rounded-3xl flex flex-col gap-4 m-8 mx-auto justify-between">
            <div className="flex flex-col gap-4 place-items-center">
                <Image src='/nfc/nfc.svg' alt="nfc logo" width={200} height={200} className="App-logo" />
                <h1 className="text-4xl font-bold">NFC Tool</h1>
                <div className="App-container">
                    <button onClick={() => onHandleAction({ scan: 'scanning', write: null })} className="btn">Scan</button>
                    <button onClick={() => onHandleAction({ scan: null, write: 'writing' })} className="btn">Write</button>
                </div>
                <ActionsContext.Provider value={actionsValue}>
                    {scan && <Scan />}
                    {write && <Write />}
                </ActionsContext.Provider>
            </div>
            <footer className="p-4 bg-blue-700 text-white">
                <div>
                    <p>NFC portions of this application, including the UI, were borrowed and adapted from https://github.com/devpato/react-NFC-sample and the live app https://react-nfc-90146.web.app/ as this project is to implement a secure Bluetooth connection using NFC, not implementing web NFC.</p>
                </div>
            </footer>
        </div>
    );
}
