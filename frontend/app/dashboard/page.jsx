// 'use client'
// import { useUser } from '@/providers/UserProvider'
// import React, { useEffect, useState,useRef } from 'react'
// import { Web } from "sip.js";

// const server = "ws://freeswitch.myrealmarket.com:5066";
// const page = () => {
//   const { user } = useUser();
//   const audioRef = useRef(null);
//   const userRef = useRef(null);
//   const [registeredUser, setRegisteredUser] = useState(null);
//   const [callStatus, setCallStatus] = useState("Idle");
//   const [incomingCall, setIncomingCall] = useState(false);
//   const [dialnumber,setDialnumber] = useState();

//   const registerUser = async (aor, username, password) => {
//     const options = {
//       aor,
//       media: {
//         remote: {
//           audio: audioRef.current
//         }
//       },
//       userAgentOptions: {
//         authorizationPassword: password,
//         authorizationUsername: username,
//       }
//     };

//     const simpleUser = new Web.SimpleUser(server, options);

//     simpleUser.delegate = {
//       onCallReceived: async () => {
//         console.log("Incoming call received...");
//         setCallStatus("Incoming Call...");
//         setIncomingCall(true);
//       },
//       onCallHangup: () => {
//         console.log("Call ended.");
//         setCallStatus("Idle");
//         setIncomingCall(false);
//       },
//       onCallAnswered: () => {
//         console.log("Call answered.");
//         setCallStatus("Connected");
//         setIncomingCall(false);
//       },
//       onRegistered: () => {
//         console.log("Registered");
//       },
//       onUnregistered: () => {
//         console.log("Unregistered");
//       }
//     };

//     try {
//       await simpleUser.connect();
//       await simpleUser.register();
//       userRef.current = simpleUser;
//       setRegisteredUser(username);
//       console.log(username, 'is connected and registered', simpleUser.id);
//     } catch (error) {
//       console.error("Registration Failed", error);
//       alert("Registration Failed. Check console for details.");
//     }
//   };

//   const handleCall = async (number) => {
//     if (userRef.current) {
//       setCallStatus("Ringing...");
//       await userRef.current.call(`sip:${number}@161.35.57.104`);
//     } else {
//       console.log("Register a user before making a call.");
//     }
//   };

//   const handleAnswer = async () => {
//     if (userRef.current && incomingCall) {
//       await userRef.current.answer();
//       setCallStatus("Connected");
//       setIncomingCall(false);
//     }
//   };

//   const handleHangUp = async () => {
//     if (userRef.current) {
//       await userRef.current.hangup();
//       setCallStatus("Idle");
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       registerUser(user.SIP, user.username, user.password)
//     }
//   }, [user]);
//   return (
//     <div>
//       <h1>Login as {user?.username}</h1>
//       {incomingCall && (
//         <div className="mt-4">
//           <button onClick={handleAnswer}
//             className="bg-green-600 text-white px-4 py-2 rounded">
//             Answer Call
//           </button>
//         </div>
//       )}
//       <div className="mt-4">
//         <h2 className="text-xl">Call Status: {callStatus}</h2>
//       </div>
//       <button onClick={handleHangUp}
//         className="bg-red-500 text-white px-4 py-2 rounded">
//         Hang Up
//       </button>

//       <input placeholder='Enter Number' value={dialnumber} onChange={(e) => setDialnumber(e.target.value)}/>
//       <button onClick={() => handleCall(dialnumber)} 
//                   className="bg-purple-500 text-white px-4 py-2 rounded">
//             Call
//           </button>
//       <audio ref={audioRef} controls className="mt-4"></audio>
//     </div>

//   )
// }

// export default page







"use client"
import {
  Search,
  Grid,
  VolumeX,
  Volume2,
  Grid3x3,
  BarChart2,
  Circle,
  Video,
  Pause,
  ArrowRightLeft,
  Plus,
  MessageSquare,
  Mail,
  BellOff,
  Phone,
  ChevronLeft,
  Settings,
  ArrowRight,
  DoorOpen,
} from "lucide-react"
import { useUser } from '@/providers/UserProvider'
import React, { useEffect, useState, useRef } from 'react'
import { Web } from "sip.js";
import { CallCounter } from "@/components/CallCounterComponent";
import { logoutRequest } from "@/http/authHttp";
import { useRouter } from "next/navigation";


const server = "ws://freeswitch.myrealmarket.com:5066";

export default function Page() {
  const [activeTab, setActiveTab] = useState("contacts")
  const [activeFilter, setActiveFilter] = useState("all")
  const { user, setUser, setIsAuth } = useUser();
  const audioRef = useRef(null);
  const userRef = useRef(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);

  // idle , ringing, process, incoming
  const [callStatus, setCallStatus] = useState("idle");
  const router = useRouter()

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
        setCallStatus('incoming')
        setIncomingCall(true);
      },
      onCallHangup: () => {
        console.log("Call ended.");
        setCallStatus("idle");
        setIncomingCall(false);
      },
      onCallAnswered: () => {
        console.log("Call answered.");
        setCallStatus("process");
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
      console.log(username, 'is connected and registered', simpleUser.id);
    } catch (error) {
      console.error("Registration Failed", error);
      alert("Registration Failed. Check console for details.");
    }
  };

  const handleCall = async (number) => {
    if (userRef.current) {
      await userRef.current.call(`sip:${number}@161.35.57.104`);
      ringing("ringing")
    } else {
      console.log("Register a user before making a call.");
    }
  };

  const handleAnswer = async () => {
    if (userRef.current && incomingCall) {
      await userRef.current.answer();
      setCallStatus("Connected");
      setCallStatus('process')
      setIncomingCall(false);
    }
  };

  const handleHangUp = async () => {
    if (userRef.current) {
      await userRef.current.hangup();
      setCallStatus("idle");
    }
  };

  useEffect(() => {
    if (user) {
      registerUser(user.SIP, user.username, user.password)
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formdata = new FormData(e.target);
      const number = formdata.get("number");
      handleCall(number)
    } catch (error) {
      console.log("Error: ", error.message)
    }
  }


  const handleLogout = async () => {
    try {
      const res = await logoutRequest();
      setIsAuth(false);
      setUser(null);
      router.push("/")
    } catch (error) {
      alert(error.message)
    }
  }


  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left sidebar */}
      <div className="w-60 border-r border-gray-200 flex flex-col">
        {/* Top bar with IP and settings */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          {user?.username &&
            <span className="text-sm text-gray-600">{user?.username}@157.245.141.163</span>
          }
          <Settings className="w-5 h-5 text-gray-500" />
          <button className="bg-none border-none" onClick={handleLogout}>
            <DoorOpen/>
          </button>
        </div>

        {/* Search bar */}
        <div className="p-2 border-b border-gray-200">
          <form className="relative" onSubmit={handleSubmit}>
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="number"
              placeholder="Find a contact..."
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button className="bg-none border-none" type="submit">
              <Grid className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </button>
          </form>
        </div>

        {/* Calls section */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-2 font-medium text-gray-700">Calls</div>

          {/* Contact item */}
          {
            incomingCall &&
            <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium">5000</div>
                <div className="text-xs text-gray-500">1001@157.245.141.163</div>
                <div className="text-xs text-gray-500">00:01</div>
              </div>
              <button onClick={handleAnswer} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Pick UP</button>
            </div>
          }


          {/* Tab navigation */}
          <div className="flex border-t border-b border-gray-200 mt-2">
            <button
              className={`flex-1 py-2 text-center text-sm ${activeTab === "contacts" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("contacts")}
            >
              Contacts
            </button>
            <button
              className={`flex-1 py-2 text-center text-sm ${activeTab === "recent" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent
            </button>
          </div>

          {/* Filters */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 text-center text-sm ${activeFilter === "all" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`flex-1 py-2 text-center text-sm ${activeFilter === "online" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
              onClick={() => setActiveFilter("online")}
            >
              Online
            </button>
            <button
              className={`flex-1 py-2 text-center text-sm ${activeFilter === "favorites" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
              onClick={() => setActiveFilter("favorites")}
            >
              Favorites
            </button>
            <button className="w-10 flex items-center justify-center text-gray-500">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add contact hint */}
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-sm text-gray-600 mb-1">Click here to add a new contact</div>
            <div className="relative">
              <div className="w-16 h-16 bg-orange-100 rounded-full"></div>
              <div className="absolute -right-4 -top-4 transform rotate-45">
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom icons */}
        <div className="flex justify-between p-2 border-t border-gray-200 bg-gray-50">
          <button className="p-1.5 rounded-full hover:bg-gray-200">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-200">
            <Mail className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-200">
            <BellOff className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-200">
            <Phone className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-200">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main content area */}
      {
        (callStatus == "idle" || callStatus == "incoming") &&
        <div className="flex-1 flex flex-col bg-black">
          <h1>No Call</h1>
        </div>
      }

      {
        (callStatus != "idle" && callStatus != "incoming") &&
        <div className="flex-1 flex flex-col bg-black">
          {/* Top toolbar */}
          <div className="flex justify-center py-2 border-b border-gray-700">
            <div className="flex space-x-2">
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <VolumeX className="w-5 h-5 mb-1" />
                <span className="text-xs">Mute</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <Volume2 className="w-5 h-5 mb-1" />
                <span className="text-xs">Speaker</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <Grid3x3 className="w-5 h-5 mb-1" />
                <span className="text-xs">Keypad</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <BarChart2 className="w-5 h-5 mb-1" />
                <span className="text-xs">Statistics</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <Circle className="w-5 h-5 mb-1" />
                <span className="text-xs">Record</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <Video className="w-5 h-5 mb-1" />
                <span className="text-xs">Video</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <Pause className="w-5 h-5 mb-1" />
                <span className="text-xs">Hold</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <ArrowRightLeft className="w-5 h-5 mb-1" />
                <span className="text-xs">Transfer</span>
              </button>
              <button className="flex flex-col items-center justify-center px-4 py-1 text-white">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs">Add call</span>
              </button>
            </div>
          </div>

          {/* Call content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-3xl text-white mb-8">{callStatus}</div>

            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>

            {/* Contact info */}
            <div className="text-center">
              <div className="text-xl text-white">5000</div>
              <div className="text-sm text-white">5000</div>
              <div className="text-sm text-white">1001@157.245.141.163</div>
              {
                callStatus != "ringing" &&
                <div className="text-sm text-green-500"><CallCounter/></div>
              }
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex justify-center pb-8">
            <button onClick={handleHangUp} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-white transform rotate-135" />
            </button>
          </div>

          {/* Chat button */}
          <div className="absolute bottom-4 left-4">
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      }


      <audio ref={audioRef}></audio>
    </div>
  )
}
