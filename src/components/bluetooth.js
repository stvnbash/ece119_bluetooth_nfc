import React, { useState, useEffect } from 'react';

const Bluetooth = ({ bleDeviceName, bleSecret, hostName }) => {
  const [connectionStatus, setConnectionStatus] = useState('Not connected');
  const [device, setDevice] = useState(null);

  const connectToBluetoothDevice = async () => {
    try {
      // Request Bluetooth device based on device name
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: bleDeviceName }],
        optionalServices: ['0000EEEE-0000-1000-8000-00805f9b34fb'], // Optional UUID for service (replace with actual UUID)
      });

      setDevice(device);
      setConnectionStatus('Connecting...');
      
      // Connect to the device
      const server = await device.gatt.connect();

      // Get the service and characteristic
      const service = await server.getPrimaryService('0000EEEE-0000-1000-8000-00805f9b34fb'); // Replace with the correct UUID
      const characteristic = await service.getCharacteristic('EEEE'); // Replace with the correct characteristic UUID

      // Prepare message
      const message = `${bleSecret}:${hostName}`;
      const encoder = new TextEncoder();
      const messageBuffer = encoder.encode(message);

      // Send message to the characteristic
      await characteristic.writeValue(messageBuffer);
      
      setConnectionStatus('Connected and message sent');
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
      setConnectionStatus('Connection failed');
    }
  };

  // Use effect to handle initial connection attempt on mount
  useEffect(() => {
    if (bleDeviceName) {
      connectToBluetoothDevice();
    }
  }, [bleDeviceName]);

  return (
    <div>
      <p>{connectionStatus}</p>
      {device && <p>Connected to device: {device.name}</p>}
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
