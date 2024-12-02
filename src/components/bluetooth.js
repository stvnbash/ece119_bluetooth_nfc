// code largely written by the honorable ChatGPT and modified by Steven to get things working

import React, { useState, useEffect } from 'react';

const Bluetooth = ({ bleDeviceName, bleSecret, hostName, bluetoothstatusupdate }) => {
    const [connectionStatus, setConnectionStatus] = useState('Not connected');
    const [device, setDevice] = useState(null);
    const [gattServer, setGattServer] = useState(null);

    const connectToBluetoothDevice = async () => {
        try {
            // Request Bluetooth device based on device name
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ name: bleDeviceName }],
                optionalServices: ['0000aaaa-0000-1000-8000-00805f9b34fb'], // Optional UUID for service (replace with actual UUID)
            });

            setDevice(device);
            setConnectionStatus('Connecting...');

            // Connect to the device
            const gattServer = await device.gatt.connect();
            setGattServer(gattServer);

            // Get the service and characteristic
            // const service = await server.getPrimaryService('0000EEEE-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID
            const service = await gattServer.getPrimaryService('0000aaaa-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID
            const characteristic = await service.getCharacteristic('0000eeee-0000-1000-8000-00805f9b34fb'); // Replace with the correct characteristic UUID

            // Prepare message
            const message = `${bleSecret}:${hostName}`;
            const encoder = new TextEncoder();
            const messageBuffer = encoder.encode(message);

            // Send message to the characteristic
            await characteristic.writeValue(messageBuffer);
            console.log("sent to characteristic:", messageBuffer)

            setConnectionStatus('Connected and message sent');
        } catch (error) {
            console.error('Error connecting to Bluetooth device:', error);
            setConnectionStatus(`Connection failed: ${error}`);
        }
    };

    const disconnectFromBluetoothDevice = () => {
        if (gattServer && gattServer.connected) {
            gattServer.disconnect();
            setDevice(null);
            setGattServer(null);
            setConnectionStatus('Disconnected');
            bluetoothstatusupdate(false);
        }
    };

    const sendMessageToCharacteristic = async (gattServer, value) => {
        try {
            // Ensure the value is either 0 or 1
            if (value !== 0 && value !== 1) {
                throw new Error('Value must be 0 or 1');
            }

            // Get the service and characteristic
            const service = await gattServer.getPrimaryService('0000aaaa-0000-1000-8000-00805f9b34fb'); // Replace with the correct service UUID
            const characteristic = await service.getCharacteristic('0000ffff-0000-1000-8000-00805f9b34fb'); // Replace with the correct characteristic UUID

            // Prepare the message as a Uint8Array (0 or 1)
            const messageBuffer = new Uint8Array([value]);

            // Write the value to the characteristic
            await characteristic.writeValue(messageBuffer);
            console.log(`Message sent: ${value}`);
        } catch (error) {
            console.error('Error sending message to characteristic:', error);
        }
    };


    // Use effect to handle initial connection attempt on mount
    useEffect(() => {
        if (bleDeviceName) {
            console.log("attempting to connect to:", bleDeviceName);
            connectToBluetoothDevice();
        }
    }, [bleDeviceName]);

    return (
        <div>
            {!device && (
                <>
                    <p>{connectionStatus}</p>
                    <button onClick={() => { bluetoothstatusupdate(false); }} className='btn'>cancel</button>
                </>
            )
            }
            {device && (
                <>
                    <p>Connected to device: {device.name}</p>
                    <div className='flex'>
                        <button onClick={disconnectFromBluetoothDevice} className='btn'>Disconnect</button>
                        <button onClick={() => sendMessageToCharacteristic(gattServer, 1)} className='btn'>No New Devices</button>
                        <button onClick={() => sendMessageToCharacteristic(gattServer, 0)} className='btn'>Allow New Devices</button>
                        <button onClick={() => { bluetoothstatusupdate(false); }} className='btn'>cancel</button>
                    </div>
                </>
            )}
            {/* {device && <p>Connected to device: {device.name}</p>} */}
            {/* <p>bleDeviceName: {bleDeviceName}</p>
      <p>bleSecret: {bleSecret}</p>
      <p>hostName: {hostName}</p> */}
        </div>
    );
};

export default Bluetooth;


// import React from 'react';

// const Bluetooth = ({ bleDeviceName, bleSecret, hostName }) => {
//     return (
//         <div>
//             <p>connecting to bluetooth!!!</p>
//             <p>bleDeviceName: {bleDeviceName}</p>
//             <p>bleSecret: {bleSecret}</p>
//             <p>hostName: {hostName}</p>
//         </div>
//     );
// };

// export default Bluetooth;
