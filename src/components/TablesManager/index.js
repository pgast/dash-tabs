import React, { useState, useEffect } from 'react';

export default function TablesManager({ createQR, qrCode, tables }) {

  useEffect(() => {
    console.log(tables);
  }, [1]);

  return (
    <>
    <h2>Tables Manager</h2>


    {/* TABLES 
      num de mesa input 
      descripcion de ubicacion o mesa
      tiene orden actual = true / false
    */}



    {/* GENERATE QR CODE WITH PUSH OF A BUTTON and display qr code here */}
    <h3>QR Code</h3>
    <button onClick={() => createQR()}>Generate Code</button>

    {qrCode !== '' && (
      <img 
        src={qrCode}
        alt="" 
        title="" 
        />
    )}
    </>
  );
};