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
  Play,
  Volume,
  PhoneCallIcon,
  DeleteIcon,
  MicOff,
  Check,
  Cross,
  Wifi,
  WifiOff,
  WifiHigh,
} from "lucide-react"
import { useUser } from '@/providers/UserProvider'
import React, { useEffect, useState, useRef } from 'react'
import { Web } from "sip.js";
import { CallCounter } from "@/components/CallCounterComponent";
import { logoutRequest } from "@/http/authHttp";
import { useRouter } from "next/navigation";
import DTMFKeyboard from "@/components/DTMFKeyboard";
import { toast } from "react-toastify";
import Recorder from 'recorder-js';
import { measureDownloadSpeedAndCandle } from "@/lib/utils";


const labels = {
  "ringing": "Ringing...",
  "connecting": "Connecting...",
  "process": "Connected",
}
export default function Page() {
  const [activeTab, setActiveTab] = useState("contacts")
  const [activeFilter, setActiveFilter] = useState("all")
  const { user, setUser, setIsAuth } = useUser();
  const audioRef = useRef(null);
  const incomingToneRef = useRef(null);
  const outgoingToneRef = useRef(null);
  const userRef = useRef(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callInfo, setCallInfo] = useState({
    host: "",
    port: "",
    schema: "",
    user: ""
  });
  const [number, setNumber] = useState('')

  // idle , ringing, process, incoming
  const [callStatus, setCallStatus] = useState("idle");
  const [isMute, setIsMute] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [isKeybordOpen, setIsKeyBoardOpen] = useState(false);
  const [dtmf, setdtmf] = useState('');
  const [connected, setConnected] = useState(false)
  const router = useRouter();
  const contextRef = useRef();
  const recorderRef = useRef();
  const recordedChunksRef = useRef();
  const [signalStatistics, setSignalStatistics] = useState({
    candleLength: 0,
    speedMbps: 0
  })



  useEffect(() => {
    setInterval(async () => {
      const statistics = await measureDownloadSpeedAndCandle();
      setSignalStatistics(statistics);
    }, 5000)
  }, [])

  const registerUser = async (aor, username, password,server) => {
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
        setCallInfo(simpleUser.session.remoteIdentity.uri.normal)
        setCallStatus('incoming')
        setIncomingCall(true);
        incomingToneRef.current.play();
      },
      onCallHangup: () => {
        console.log("Call ended.");
        setCallStatus("idle");
        setdtmf('')
        setIncomingCall(false);
        setCallInfo({})
        outgoingToneRef.current.pause();
        incomingToneRef.current.pause();
      },
      onCallAnswered: () => {
        console.log("Call answered.");
        setCallStatus("process");
        setIncomingCall(false);
        outgoingToneRef.current.pause();
        incomingToneRef.current.pause();
        setupRecorder();
      },
      onRegistered: () => {
        console.log("Registered");
      },
      onUnregistered: () => {
        console.log("Unregistered");
      },
      onRefer: (referral) => {
        console.log(referral, "referral")
      },
      onCallCreated: () => {
        console.log("Call created successfully")
      },
      onServerConnect: () => {
        console.log("Server Connected");
        setConnected(true);
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
    try {
      if (userRef.current) {

        setCallInfo({
          host: user?.pbx?.SIP_HOST,
          user: number,
          schema: "sip",
          port: undefined
        });

        setCallStatus("connecting")
        await userRef.current.call(`sip:${number}@${user?.pbx?.SIP_HOST}`);
        outgoingToneRef.current.play();
        setCallStatus("ringing")

      } else {
        toast.error("Register a user before making a call.");
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAnswer = async () => {
    if (userRef.current && incomingCall) {
      await userRef.current.answer();
      setCallStatus("Connected");
      setCallStatus('process')
      setIncomingCall(false);
      outgoingToneRef.current.pause();
      incomingToneRef.current.pause();
      setupRecorder();
    }
  };

  const handleHangUp = async () => {
    if (userRef.current) {
      await userRef.current.hangup();
      setCallStatus("idle");
      setCallInfo({});
      setdtmf('')
      outgoingToneRef.current.pause();
      incomingToneRef.current.pause();
    }
  };

  const handleMuteAndUnmute = async () => {
    if (isMute) {
      setIsMute(false);
      if (userRef.current) {
        await userRef.current.unmute();
      }
    } else {
      setIsMute(true);
      if (userRef.current) {
        await userRef.current.mute();
      }
    }
  }

  const handleHoldAndUnHold = async () => {
    if (isOnHold) {
      setIsOnHold(false);
      if (userRef.current) {
        await userRef.current.unhold();
      }
    } else {
      setIsOnHold(true);
      if (userRef.current) {
        await userRef.current.hold();
      }
    }
  }

  useEffect(() => {
    if (user) {
      const {extension_number,extension_password,pbx} = user;
      const wss = `wss://${user?.pbx?.SIP_HOST}:${user?.pbx?.WSS_PORT || ""}`;
      const SIP = `sip:${extension_number}@${user?.pbx?.SIP_HOST}` + (user?.pbx?.SIP_PORT ? user?.pbx?.SIP_PORT : "");
      registerUser(SIP, extension_number, extension_password,wss);
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

      if (userRef.current) {
        await userRef.current.unregister();
        await userRef.current.disconnect();
      }

      setIsAuth(false);
      setUser(null);
      router.push("/")
    } catch (error) {
      alert(error.message)
    }
  }


  const handleSendDTMF = async (num) => {
    setdtmf(prev => `${prev}${num}`)
    await userRef.current.sendDTMF(num);
  }

  const handleTransfer = async () => {
    console.log(userRef.current.session.state)
    await userRef.current.session?.refer("sip:1006@161.35.57.104", {});
  }


  const getStream = async () => {
    const track1 = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: true
      }
    })

    const track2 = audioRef.current.srcObject;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create MediaStream sources from each track
    const source1 = audioContext.createMediaStreamSource(track1);
    const source2 = audioContext.createMediaStreamSource(track2);

    // Create a destination node to mix the tracks into one output stream
    const destination = audioContext.createMediaStreamDestination();

    // Connect both sources to the destination (mixing happens here)
    source1.connect(destination);
    source2.connect(destination);

    // The mixed stream containing both tracks
    const mixedStream = destination.stream;

    contextRef.current = audioContext;
    return mixedStream;
  }

  const setupRecorder = async () => {
    const stream = await getStream();
    const recorder = new Recorder(contextRef.current)
    recorderRef.current = recorder;

    recorder.init(stream);
  };



  const handleRecord = async () => {
    try {
      if (isRecordingStarted) {
        const data = await recorderRef.current.stop();
        Recorder.download(data.blob, "call-recording");
        setIsRecordingStarted(false);
        toast.success("Recording Stoped");
      } else {
        await recorderRef.current.start();
        setIsRecordingStarted(true);
        toast.success("Recording Started");
      }
    } catch (error) {
      console.log(error)
      setIsRecordingStarted(false)
      toast.error(error.message)
    }
  }


  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Top bar with IP and settings */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          {user?.extension_number &&
            <span className="text-sm text-gray-500 flex items-center">{connected ? <Wifi className="text-green-500 mr-2" /> : <WifiOff className="text-red-500 mr-2" />} {user?.extension_number}@{user?.pbx?.SIP_HOST}</span>
          }
          <Settings className="w-5 h-5 text-gray-500" />
          <button className="bg-none border-none" onClick={handleLogout}>
            <DoorOpen />
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
          <div className="px-4 py-2 font-medium text-gray-700">Incoming Call</div>

          {/* Contact item */}
          {
            incomingCall &&
            <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium">{callInfo?.user}</div>
                <div className="text-xs text-gray-500">{callInfo?.user}@{callInfo?.host}{callInfo?.port}</div>
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
          {/* <div className="flex border-b border-gray-200">
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
          </div> */}

          {/* Add contact hint */}
          <div className="flex flex-col items-center justify-center p-6 text-center flex-1">
            <div className="text-sm text-gray-600 mb-1">Click here to add a new contact</div>
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
        <div className="flex-1 flex flex-col bg-black relative">
          <div className="h-full w-full flex flex-col p-8 justify-end">
            <input className="bg-none border-none text-2xl mb-5 text-white outline-none" value={number} onChange={(e) => setNumber(e.target.value)} />
            <div className="grid grid-cols-3 h-[50%] gap-4">
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${1}`)}>1</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${2}`)}>2</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${3}`)}>3</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${4}`)}>4</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${5}`)}>5</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${6}`)}>6</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${7}`)}>7</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${8}`)}>8</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${9}`)}>9</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => handleCall(number)}><PhoneCallIcon /></button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => `${prev}${0}`)}>0</button>
              <button className="text-white bg-orange-400 flex items-center justify-center rounded-md cursor-pointer" onClick={() => setNumber(prev => prev.slice(0, prev.length - 1))}><DeleteIcon /></button>
            </div>
          </div>
        </div>
      }

      {
        (callStatus != "idle" && callStatus != "incoming") &&
        <div className="flex-1 flex flex-col bg-black">
          {/* Top toolbar */}
          <div className="flex justify-center py-2 border-b border-gray-700">
            <div className="flex space-x-2">
              <button className={`flex flex-col items-center justify-center px-4 py-1 ${isMute ? "text-red-500" : "text-white"} cursor-pointer`} onClick={handleMuteAndUnmute}>

                <MicOff className="w-5 h-5 mb-1" />
                <span className="text-xs">Mute</span>
              </button>
              <button className={`flex flex-col items-center justify-center px-4 py-1 ${isOnHold ? "text-red-500" : "text-white"} cursor-pointer`} onClick={handleHoldAndUnHold}>
                <Pause className="w-5 h-5 mb-1" />
                <span className="text-xs">Hold</span>
              </button>
              {/* <button className={`flex flex-col items-center justify-center px-4 py-1 text-white cursor-pointer`}>
                <Volume2 className="w-5 h-5 mb-1" />
                <span className="text-xs">Speaker</span>
              </button> */}
              <button className={`flex flex-col items-center justify-center px-4 py-1 text-white cursor-pointer`} onClick={() => setIsKeyBoardOpen(true)}>
                <Grid3x3 className="w-5 h-5 mb-1" />
                <span className="text-xs">Keypad</span>
              </button>
              <div className="flex flex-col items-center justify-center px-4 py-1 text-white cursor-pointer">
                {/* 👇 Signal Bars */}
                <div className="flex flex-row justify-end items-end h-12 space-y-0.5 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-2 rounded-sm ${signalStatistics.candleLength >= level ? "bg-green-500" : "bg-gray-500"
                        }`}
                      style={{ height: `${level * 5}px` }}
                    />
                  ))}
                </div>

                {/* 👇 Speed Text */}
                <div className="text-[10px] text-center text-gray-300">
                  {signalStatistics.speedMbps.toFixed(2)} Mbps
                </div>
              </div>

              {/* On click recording toggle  */}
              <button className={`flex flex-col items-center justify-center px-4 py-1 cursor-pointer  ${isRecordingStarted ? "text-red-500" : "text-white"}`} onClick={handleRecord}>
                <Circle className="w-5 h-5 mb-1" />
                <span className="text-xs">Record</span>
              </button>
              {/* <button className={`flex flex-col items-center justify-center px-4 py-1 text-white cursor-pointer`}>
                <Video className="w-5 h-5 mb-1" />
                <span className="text-xs">Video</span>
              </button> */}

              {/* <button className={`flex flex-col items-center justify-center px-4 py-1 text-white cursor-pointer`} onClick={handleTransfer}>
                <ArrowRightLeft className="w-5 h-5 mb-1" />
                <span className="text-xs">Transfer</span>
              </button>
              <button className={`flex flex-col items-center justify-center px-4 py-1 text-white cursor-pointer`}>
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs">Add call</span>
              </button> */}
            </div>
          </div>

          {/* Call content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-3xl text-white mb-8">{labels[callStatus]}</div>

            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>

            {/* Contact info */}
            <div className="text-center">
              <div className="text-xl text-white">{callInfo?.user}</div>
              <div className="text-sm text-white">{callInfo?.user}@{callInfo?.host}{callInfo?.port}</div>
              {
                (callStatus != "ringing" && callStatus != "connecting") &&
                <div className="text-sm text-green-500"><CallCounter /></div>
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

      <DTMFKeyboard
        dtmf={dtmf}
        handleSendDTMF={handleSendDTMF}
        onOpenChange={() => setIsKeyBoardOpen(false)}
        open={isKeybordOpen}
        setdtmf={setdtmf}
      />


      <audio ref={audioRef}></audio>
      <audio src="/call-coming-rintone.mp3" ref={incomingToneRef} loop hidden></audio>
      <audio src="/calling-ringtone.wav" ref={outgoingToneRef} loop hidden></audio>
    </div>
  )
}
