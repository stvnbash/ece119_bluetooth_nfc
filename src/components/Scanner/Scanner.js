import React, { useContext } from 'react';
import './Scanner.css'
// import Spinner from '../../spinner.gif';
import { ActionsContext } from '../../contexts/context';
import Image from "next/image";

const Scanner = () => {
    const { actions, setActions } = useContext(ActionsContext);
    return (
        <div className="scanner">
            <p className="scanner-exit" onClick={() => setActions({ ...actions, scan: null })}>X</p>
            <div className="scanner-container">
                {/* <img src={Spinner} alt="spinning log" className="scanner-image"/> */}
                <div className=''>
                    <Image src="/nfc/spinner.gif" alt="spinning logo" fill={true} className="scanner-image max-w-[180px] max-h-[180px] mx-auto" />
                </div>
                <p className="scanner-text">
                    Scanning...
                </p>
            </div>
        </div>
    );
};

export default Scanner;
