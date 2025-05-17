'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Web } from "sip.js";

// const server = "ws://161.35.57.104:5066";
const server = "ws://freeswitch.myrealmarket.com:5066";
const destinations = {
  "1002": "sip:1002@161.35.57.104",
  "1003": "sip:1003@161.35.57.104"
};

const SIPPage = () => {
  const audioRef = useRef(null);
  const userRef = useRef(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [callStatus, setCallStatus] = useState("Idle");
  const [incomingCall, setIncomingCall] = useState(false);

  const registerUser = async (aor, username, password) => {
    const options = {
      aor,
      media: {
        remote: {
          audio: audioRef.current
        }
      },
      userAgentOptions: {
        authorizationPassword: password,
        authorizationUsername: username,
      }
    };

    const simpleUser = new Web.SimpleUser(server, options);

    simpleUser.delegate = {
      onCallReceived: async () => {
        console.log("Incoming call received...");
        setCallStatus("Incoming Call...");
        setIncomingCall(true);
      },
      onCallHangup: () => {
        console.log("Call ended.");
        setCallStatus("Idle");
        setIncomingCall(false);
      },
      onCallAnswered: () => {
        console.log("Call answered.");
        setCallStatus("Connected");
        setIncomingCall(false);
      },
      onRegistered: () => {
        console.log("Registered");
      },
      onUnregistered: () => {
        console.log("Unregistered");
      }
    };

    try {
      await simpleUser.connect();
      await simpleUser.register();
      userRef.current = simpleUser;
      setRegisteredUser(username);
      console.log(username, 'is connected and registered',simpleUser.id);
    } catch (error) {
      console.error("Registration Failed", error);
      alert("Registration Failed. Check console for details.");
    }
  };

  const handleCall = async (destination) => {
    if (userRef.current) {
      setCallStatus("Ringing...");
      await userRef.current.call(destination);
    } else {
      console.log("Register a user before making a call.");
    }
  };

  const handleAnswer = async () => {
    if (userRef.current && incomingCall) {
      await userRef.current.answer();
      setCallStatus("Connected");
      setIncomingCall(false);
    }
  };

  const handleHangUp = async () => {
    if (userRef.current) {
      await userRef.current.hangup();
      setCallStatus("Idle");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">SIP.js Multi-User Call</h1>
      <div className="space-x-2">
        <button onClick={() => registerUser("sip:1002@161.35.57.104", "1002", "123456")} 
                className="bg-blue-500 text-white px-4 py-2 rounded">
          Register as 1002
      </button>
        <button onClick={() => registerUser("sip:1003@161.35.57.104", "1003", "1234")} 
                className="bg-green-500 text-white px-4 py-2 rounded">
          Register as 1003
        </button>
      </div>

      {registeredUser && (
        <div className="space-x-2 mt-4">
          <button onClick={() => handleCall(destinations["1002"])} 
                  className="bg-purple-500 text-white px-4 py-2 rounded">
            Call 1002
          </button>
          <button onClick={() => handleCall(destinations["1003"])} 
                  className="bg-purple-500 text-white px-4 py-2 rounded">
            Call 1003
          </button>
          <button onClick={handleHangUp} 
                  className="bg-red-500 text-white px-4 py-2 rounded">
            Hang Up
          </button>
        </div>
      )}

      {incomingCall && (
        <div className="mt-4">
          <button onClick={handleAnswer} 
                  className="bg-green-600 text-white px-4 py-2 rounded">
            Answer Call
          </button>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl">Call Status: {callStatus}</h2>
      </div>

      <audio ref={audioRef} controls className="mt-4"></audio>
    </div>
  );
};

export default SIPPage;
