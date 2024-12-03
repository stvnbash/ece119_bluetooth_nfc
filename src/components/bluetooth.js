// code largely written by the honorable ChatGPT and modified by Steven to get things working

import React, { useState, useEffect } from 'react';

const Bluetooth = ({ bleDeviceName, bleSecret, hostName, bluetoothstatusupdate }) => {
    const [connectionStatus, setConnectionStatus] = useState('Not connected');
    const [device, setDevice] = useState(null);
    const [gattServer, setGattServer] = useState(null);
    const [receivedData, setReceivedData] = useState([]);

    const connectToBluetoothDevice = async () => {
        try {
            // Request Bluetooth device based on device name
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ name: bleDeviceName }],
                optionalServices: ['0000aaaa-0000-1000-8000-00805f9b34fb', '0000acce-0000-1000-8000-00805f9b34fb'], // Optional UUID for service (replace with actual UUID)
            });

            setDevice(device);
            setConnectionStatus('Connecting...');

             // Listen for disconnection
             device.addEventListener('gattserverdisconnected', handleDeviceDisconnected);

            // Connect to the device
            const gattServer = await device.gatt.connect();
            setGattServer(gattServer);

            // Get the service and characteristic
            // const service = await server.getPrimaryService('0000EEEE-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID
            const serviceAuth = await gattServer.getPrimaryService('0000aaaa-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID
            const characteristicAuth = await serviceAuth.getCharacteristic('0000eeee-0000-1000-8000-00805f9b34fb'); // Replace with the correct characteristic UUID

            // Prepare message
            const message = `${bleSecret}:${hostName}`;
            const encoder = new TextEncoder();
            const messageBuffer = encoder.encode(message);

            // Send message to the characteristic
            await characteristicAuth.writeValue(messageBuffer);
            console.log("sent to characteristicAuth:", messageBuffer)

            setConnectionStatus('Connected and message sent to characteristicAuth');

            // Get the service and characteristic for notifications
            const serviceIMU = await gattServer.getPrimaryService('0000acce-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID
            const characteristicIMU = await serviceIMU.getCharacteristic('000010a1-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID

            // Enable notifications
            await characteristicIMU.startNotifications();
            setConnectionStatus('Listening for notifications from characteristic IMU');

            // Add event listener for characteristic value changes
            characteristicIMU.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

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

    const handleDeviceDisconnected = () => {
        console.log('Device disconnected');
        setDevice(null);
        setGattServer(null);
        setConnectionStatus('Disconnected');
        bluetoothstatusupdate(false);
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

    const handleCharacteristicValueChanged = (event) => {

        const value = event.target.value;
        // const decoder = new TextDecoder();
        // const data = decoder.decode(value);

        // Log the raw bytes to inspect:
        // console.log('Raw data:', Array.from(new Uint8Array(value.buffer)));

        const dataView = new DataView(value.buffer); // Create a DataView for parsing
        const floatValue = dataView.getFloat32(0, true); // Read the float value (little-endian)

        // Append the new data to the receivedData array
        // setReceivedData((prevData) => [...prevData, data]);
        setReceivedData((prevData) => [...prevData, `Ax: ${floatValue}`]);
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
                        {/* <button onClick={() => { bluetoothstatusupdate(false); }} className='btn'>cancel</button> */}
                    </div>
                    <div>
                        <h3 className="text-2xl pt-4">Received Data</h3>
                        <textarea className="text-black"
                            rows="10"
                            cols="50"
                            readOnly
                            // value={receivedData.join('\n')}
                            value={receivedData.slice().reverse().join('\n')} // Reverse the list for rendering
                            style={{ resize: 'none' }}
                        ></textarea>
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
