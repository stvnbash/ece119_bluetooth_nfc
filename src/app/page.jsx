/* eslint-disable @typescript-eslint/ */

'use client'

import Image from "next/image";
import Scan from '../containers/Scan';
import Write from '../containers/Write';
import Bluetooth from '../components/bluetooth'
import { useState } from 'react';
import { Actions, ActionsContext } from '../contexts/context';
import './App.css';

// type Actions = {
//     scan?: () => void;
//     write?: () => void;
// } | null;

export default function Home() {
    // const [actions, setActions] = useState<Actions>(null);
    const [actions, setActions] = useState(null);
    const { scan, write } = actions || {};

    const actionsValue = { actions, setActions };

    //name for bluetooth
    const [deviceName, setDeviceName] = useState("HelloWorld");
    const [bleDevice, setBleDevice] = useState("");
    const [nfcMessage, setNfcMessage] = useState("");
    const [bleSecretId, setBleSecretId] = useState("");
    // const [nfcDevice, setNfcDevice] = useState("");
    const [bluetoothConnection, setBluetoothConnection] = useState(false)

    const onHandleAction = (actions) => {
        setActions({ ...actions });
    }


    const handleMessageUpdate = (message) => {
        // Update the NFC message state
        setNfcMessage(message);

        // Parse the JSON message
        try {
            const parsedMessage = JSON.parse(message);

            // Update nfcId and nfcDevice
            setBleSecretId(parsedMessage.id);
            setBleDevice(parsedMessage.device);
        } catch (error) {
            console.error('Failed to parse NFC message:', error);
        }
    };

    return (
        <div className="max-w-screen-lg min-h-[90vh] overflow-auto border-black border-4 rounded-3xl flex flex-col gap-4 m-8 mx-auto justify-between">
            <div className="flex flex-col gap-4 place-items-center">
                {/* <Image src='/nfc/nfc.svg' alt="nfc logo" width={200} height={200} className="App-logo" /> */}
                <h1 className="text-4xl font-bold pt-8 text-yellow-500">Touch Secure BLE</h1>
                <div className="App-container">
                    <button onClick={() => onHandleAction({ scan: 'scanning', write: null })} className="btn">Scan</button>
                    <button onClick={() => onHandleAction({ scan: null, write: 'writing' })} className="btn">Write</button>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-2xl font-bold pt-8">Bluetooth</h3>
                    <div className="flex flex-row">
                        <p>Local Device name:</p>
                        <input className="text-black" type="text" value={deviceName} onChange={(e) => setDeviceName(e.target.value)}></input>
                    </div>
                    {/* <button onClick={handleMessageUpdate('{"id":4b7b0, "device": "SecureBLE"}')}>set nfc message - temp for dev</button> */}
                    <button className="btn" onClick={() => handleMessageUpdate('{"id":"4b7b0", "device": "SecureBLE"}')}>Update NFC Message (dev)</button>
                    <div className="flex flex-row">
                        <p>NFC Message:</p>
                        <input className="text-black" type="text" value={nfcMessage} readOnly></input>
                    </div>
                    <p>BLE Secret ID: {bleSecretId}</p>
                    <p>Bluetooth device to connect to: {bleDevice}</p>
                    {/* <div className="flex flex-row">
                        <p>Bluetooth device to connect to:</p>
                        <input className="text-black" type="text" value={bleDevice} onChange={(e) => setBleDevice(e.target.value)}></input>
                    </div> */}
                    {!bluetoothConnection && <button className="btn" onClick={() => setBluetoothConnection(true)}>Bluetooth</button>}
                    {/* {bluetoothConnection && <button className="btn" onClick={() => setBluetoothConnection(false)}>Disconnect Bluetooth</button>} */}
                    {bluetoothConnection && <Bluetooth bleDeviceName={bleDevice} bleSecret={bleSecretId} hostName={deviceName}/>}
                </div>
                <ActionsContext.Provider value={actionsValue}>
                    {scan !== null && scan && <Scan messageWriter={handleMessageUpdate} />}
                    {write !== null && write && <Write />}
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
