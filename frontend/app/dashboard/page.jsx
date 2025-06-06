"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import {
  Phone,
  MessageSquare,
  Voicemail,
  Settings,
  Search,
  Plus,
  PhoneCall,
  Video,
  MoreVertical,
  Menu,
  Mic,
  MicOff,
  Pause,
  Play,
  Grid3X3,
  Square,
  StopCircle,
  Wifi,
  WifiOff,
  DoorOpen,
  Circle,
  Volume2,
  ArrowRightLeft,
  DeleteIcon,
  PhoneCallIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useUser } from '@/providers/UserProvider'
import { Web } from "sip.js"
import { CallCounter } from "@/components/CallCounterComponent"
import { logoutRequest } from "@/http/authHttp"
import { useRouter } from "next/navigation"
import DTMFKeyboard from "@/components/DTMFKeyboard"
import { toast } from "react-toastify"
import Recorder from 'recorder-js'
import { measureDownloadSpeedAndCandle } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const labels = {
  "ringing": "Ringing...",
  "connecting": "Connecting...",
  "process": "Connected",
}

export default function GoogleVoiceClone() {
  const [activeTab, setActiveTab] = useState("calls")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  // SIP and Call related state
  const { user, setUser, setIsAuth } = useUser()
  const audioRef = useRef(null)
  const incomingToneRef = useRef(null)
  const outgoingToneRef = useRef(null)
  const userRef = useRef(null)
  const contextRef = useRef()
  const recorderRef = useRef()
  const router = useRouter()

  const [registeredUser, setRegisteredUser] = useState(null)
  const [incomingCall, setIncomingCall] = useState(false)
  const [callInfo, setCallInfo] = useState({
    host: "",
    port: "",
    schema: "",
    user: ""
  })
  const [number, setNumber] = useState('')
  const [callState, setCallState] = useState("idle") // idle, ringing, connecting, process, incoming
  const [currentCall, setCurrentCall] = useState(null)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isOnHold, setIsOnHold] = useState(false)
  const [showDialpad, setShowDialpad] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [connected, setConnected] = useState(false)
  const [dtmf, setdtmf] = useState('')
  const [isKeybordOpen, setIsKeyBoardOpen] = useState(false)
  const [recentCalls, setRecentCalls] = useState([])
  const [signalStatistics, setSignalStatistics] = useState({
    candleLength: 0,
    speedMbps: 0
  })
  const currentCallRef = useRef(null);
  const callDurationRef = useRef(null);


  useEffect(() => {
    currentCallRef.current = currentCall;
  },[currentCall]);

  useEffect(() => {
    callDurationRef.current = callDuration;
  },[callDuration]);

  // Load call history from localStorage on component mount
  useEffect(() => {
    const savedCalls = localStorage.getItem('voiceAppCallHistory')
    if (savedCalls) {
      try {
        setRecentCalls(JSON.parse(savedCalls));
      } catch (error) {
        console.error('Error loading call history:', error)
      }
    }
  }, [])

  // Save call history to localStorage whenever recentCalls changes
  useEffect(() => {
    if (recentCalls.length > 0) {
      localStorage.setItem('voiceAppCallHistory', JSON.stringify(recentCalls))
    }
  }, [recentCalls])

  // Add call to history
  const addCallToHistory = (callData) => {
    const newCall = {
      id: Date.now(),
      name: callData.name || "Unknown",
      number: callData.number,
      type: callData.type, // incoming, outgoing
      time: new Date().toLocaleString(),
      duration: formatCallDuration(callDurationRef.current),
      missed: callData.missed || false,
      timestamp: Date.now()
    }

    setRecentCalls(prev => [newCall, ...prev.slice(0, 49)]) // Keep only last 50 calls
  }

  // Signal statistics monitoring
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const statistics = await measureDownloadSpeedAndCandle()
        setSignalStatistics(statistics)
      } catch (error) {
        console.error('Error measuring signal:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  // SIP User Registration
  const registerUser = async (aor, username, password, server) => {
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
    }

    const simpleUser = new Web.SimpleUser(server, options)

    simpleUser.delegate = {
      onCallReceived: async () => {
        console.log("Incoming call received...")
        const remoteUri = simpleUser.session.remoteIdentity.uri.normal
        setCallInfo({
          host: user?.pbx?.SIP_HOST,
          user: remoteUri.user || "Unknown",
          schema: "sip",
          port: undefined
        })
        setCurrentCall({
          name: remoteUri.user || "Unknown",
          number: remoteUri.user || "Unknown",
          type: "incoming"
        })
        setCallState('incoming')
        setIncomingCall(true)
        if (incomingToneRef.current) {
          incomingToneRef.current.play()
        }
      },
      onCallHangup: () => {
        // Add to call history before resetting
        if (currentCallRef.current) {
          addCallToHistory({
            ...currentCallRef.current,
            missed: callState === 'incoming'
          })
        }

        setCallState("idle")
        setdtmf('')
        setIncomingCall(false)
        setCurrentCall(null)
        setCallInfo({})
        setCallDuration(0)
        setIsMuted(false)
        setIsOnHold(false)
        setShowDialpad(false)
        setIsRecording(false)

        if (outgoingToneRef.current) outgoingToneRef.current.pause()
        if (incomingToneRef.current) incomingToneRef.current.pause()
      },
      onCallAnswered: () => {
        console.log("Call answered.");
        setCallState("process")
        setIncomingCall(false)
        if (outgoingToneRef.current) outgoingToneRef.current.pause()
        if (incomingToneRef.current) incomingToneRef.current.pause()
        setupRecorder()
      },
      onRegistered: () => {
        console.log("Registered")
      },
      onUnregistered: () => {
        console.log("Unregistered")
      },
      onServerConnect: () => {
        console.log("Server Connected")
        setConnected(true)
      }
    }

    try {
      await simpleUser.connect()
      await simpleUser.register()
      userRef.current = simpleUser
      setRegisteredUser(username)
      console.log(username, 'is connected and registered', simpleUser.id)
    } catch (error) {
      console.error("Registration Failed", error)
      toast.error("Registration Failed. Check console for details.")
    }
  }



  // Handle Call
  const handleCall = async (number) => {
    try {
      if (userRef.current) {
        setCallInfo({
          host: user?.pbx?.SIP_HOST,
          user: number,
          schema: "sip",
          port: undefined
        })

        setCurrentCall({
          name: number,
          number: number,
          type: "outgoing"
        })

        setCallState("connecting")
        await userRef.current.call(`sip:${number}@${user?.pbx?.SIP_HOST}`)
        if (outgoingToneRef.current) {
          outgoingToneRef.current.play()
        }
        setCallState("ringing");
      } else {
        toast.error("Register a user before making a call.")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Handle Answer Call
  const handleAnswerCall = async () => {
    if (userRef.current && incomingCall) {
      await userRef.current.answer()
      setCallState("process")
      setIncomingCall(false)
      if (outgoingToneRef.current) outgoingToneRef.current.pause()
      if (incomingToneRef.current) incomingToneRef.current.pause()
      setupRecorder()
    }
  }

  // Handle Decline/End Call
  const handleEndCall = async () => {
    if (userRef.current) {
      await userRef.current.hangup()
    }
    // The onCallHangup delegate will handle the rest
  }

  // Handle Mute/Unmute
  const handleMuteToggle = async () => {
    if (isMuted) {
      setIsMuted(false)
      if (userRef.current) {
        await userRef.current.unmute()
      }
    } else {
      setIsMuted(true)
      if (userRef.current) {
        await userRef.current.mute()
      }
    }
  }

  // Handle Hold/Unhold
  const handleHoldToggle = async () => {
    if (isOnHold) {
      setIsOnHold(false)
      if (userRef.current) {
        await userRef.current.unhold()
      }
    } else {
      setIsOnHold(true)
      if (userRef.current) {
        await userRef.current.hold()
      }
    }
  }

  // Recording functionality
  const getStream = async () => {
    const track1 = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: true
      }
    })

    const track2 = audioRef.current.srcObject
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const source1 = audioContext.createMediaStreamSource(track1)
    const source2 = audioContext.createMediaStreamSource(track2)
    const destination = audioContext.createMediaStreamDestination()

    source1.connect(destination)
    source2.connect(destination)

    const mixedStream = destination.stream
    contextRef.current = audioContext
    return mixedStream
  }

  const setupRecorder = async () => {
    try {
      const stream = await getStream()
      const recorder = new Recorder(contextRef.current)
      recorderRef.current = recorder
      recorder.init(stream)
    } catch (error) {
      console.error('Error setting up recorder:', error)
    }
  }

  const handleRecord = async () => {
    try {
      if (isRecording) {
        const data = await recorderRef.current.stop()
        Recorder.download(data.blob, "call-recording")
        setIsRecording(false)
        toast.success("Recording Stopped")
      } else {
        await recorderRef.current.start()
        setIsRecording(true)
        toast.success("Recording Started")
      }
    } catch (error) {
      console.log(error)
      setIsRecording(false)
      toast.error(error.message)
    }
  }

  // DTMF handling
  const handleSendDTMF = async (num) => {
    setdtmf(prev => `${prev}${num}`)
    if (userRef.current) {
      await userRef.current.sendDTMF(num)
    }
  }

  // Logout functionality
  const handleLogout = async () => {
    try {
      const res = await logoutRequest()

      if (userRef.current) {
        await userRef.current.unregister()
        await userRef.current.disconnect()
      }

      setIsAuth(false)
      setUser(null)
      router.push("/")
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Initialize SIP when user is available
  useEffect(() => {
    if (user) {
      const { extension_number, extension_password, pbx } = user
      const wss = `wss://${user?.pbx?.SIP_HOST}:${user?.pbx?.WSS_PORT || ""}`
      const SIP = `sip:${extension_number}@${user?.pbx?.SIP_HOST}` + (user?.pbx?.SIP_PORT ? user?.pbx?.SIP_PORT : "")
      registerUser(SIP, extension_number, extension_password, wss)
    }
  }, [user])

  // Call duration timer effect
  useEffect(() => {
    let interval
    if (callState === "process") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  const DialerPad = useMemo(() => () => {
    const [dialNumber, setDialNumber] = useState("")
    const dialPadNumbers = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["*", "0", "#"],
    ]

    const handleDialPadClick = (value) => {
      setDialNumber((prev) => prev + value)
    }

    const handleCallFromDialer = () => {
      if (dialNumber.trim()) {
        handleCall(dialNumber.trim())
        setDialNumber("")
      }
    }

    const handleDelete = () => {
      setDialNumber(prev => prev.slice(0, -1))
    }

    return (
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center">
          <Input
            value={dialNumber}
            onChange={(e) => setDialNumber(e.target.value)}
            placeholder="Enter phone number"
            className="text-center text-xl h-12"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {dialPadNumbers.flat().map((number) => (
            <Button
              key={number}
              variant="outline"
              size="lg"
              className="h-16 text-xl font-semibold border border-gray-300 rounded-sm cursor-pointer"
              onClick={() => handleDialPadClick(number)}
            >
              {number}
            </Button>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-14 w-14"
            onClick={handleDelete}
            disabled={!dialNumber}
          >
            <DeleteIcon className="h-6 w-6" />
          </Button>
          <Button
            size="lg"
            className="rounded-full h-14 w-14 bg-green-500 text-white hover:bg-green-600 cursor-pointer"
            onClick={handleCallFromDialer}
            disabled={!dialNumber.trim()}
          >
            <PhoneCall className="h-6 w-6" />
          </Button>
        </div>
      </div>
    )
  }, []);

  // Format call duration
  const formatCallDuration = useMemo(() => (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  },[])

  // Call control components
  const CallControls = useMemo(() => () => (
    <div className="flex justify-center space-x-6 mt-8">
      <Button
        variant={isMuted ? "default" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16 cursor-pointer bg-gray-50"
        onClick={handleMuteToggle}
      >
        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>

      <Button
        variant={isOnHold ? "default" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16 cursor-pointer bg-gray-50"
        onClick={handleHoldToggle}
      >
        {isOnHold ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
      </Button>

      <Button
        variant={showDialpad ? "default" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16 cursor-pointer bg-gray-50"
        onClick={() => setShowDialpad(!showDialpad)}
      >
        <Grid3X3 className="h-6 w-6" />
      </Button>

      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className={`rounded-full h-16 w-16 cursor-pointer ${isRecording ? 'bg-red-500 text-white hover:bg-red-600 hover:text-white' : 'bg-gray-50 text-gray-800'}`}
        onClick={handleRecord}
      >
        {isRecording ? <StopCircle className="h-6 w-6" /> : <Square className="h-6 w-6" />}
      </Button>

      {/* Signal Statistics Display */}
      {/* <div className="flex flex-col items-center justify-center px-4 py-1 text-gray-600">
        <div className="flex flex-row justify-end items-end h-12 space-y-0.5 mb-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-2 rounded-sm ${signalStatistics.candleLength >= level ? "bg-green-500" : "bg-gray-300"}`}
              style={{ height: `${level * 5}px` }}
            />
          ))}
        </div>
        <div className="text-[10px] text-center text-gray-500">
          {signalStatistics.speedMbps.toFixed(2)} Mbps
        </div>
      </div> */}
    </div>
  ),[isMuted,isOnHold,showDialpad,isRecording,signalStatistics])

  const InCallDialpad = useMemo(() => () => (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((number) => (
          <Button
            key={number}
            variant="outline"
            size="lg"
            className="h-12 text-lg font-semibold cursor-pointer"
            onClick={() => handleSendDTMF(number)}
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  ),[])

  // Messages and voicemail data (keeping from original)
  const messages = [
    {
      id: 1,
      name: "Sarah Johnson",
      number: "+1 (555) 123-4567",
      lastMessage: "Thanks for the call earlier!",
      time: "10 min ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Mike Chen",
      number: "+1 (555) 987-6543",
      lastMessage: "Can we reschedule for tomorrow?",
      time: "2 hours ago",
      unread: 0,
    },
  ]

  const voicemails = [
    {
      id: 1,
      name: "Sarah Johnson",
      number: "+1 (555) 123-4567",
      time: "1 hour ago",
      duration: "1:23",
      transcription: "Hi, just wanted to follow up on our meeting. Give me a call back when you get a chance.",
      unread: true,
    },
  ]

  // Sidebar content component
  const SidebarContent = useMemo(() => () => (
    <div className="p-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          if (isMobile) setSidebarOpen(false)
        }}
        orientation="vertical"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
          <TabsTrigger value="calls" className="justify-start w-full mb-2 cursor-pointer">
            <Phone className="h-4 w-4 mr-2" />
            Calls
          </TabsTrigger>
          <TabsTrigger value="messages" className="justify-start w-full mb-2 cursor-pointer hover:shadow-md">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  ), [activeTab]);

  // Mobile bottom navigation
  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around items-center p-2 md:hidden z-10">
      <Button
        variant={activeTab === "calls" ? "default" : "ghost"}
        size="sm"
        className="flex flex-col items-center py-2 px-1 h-auto"
        onClick={() => setActiveTab("calls")}
      >
        <Phone className="h-5 w-5 mb-1" />
        <span className="text-xs">Calls</span>
      </Button>
      <Button
        variant={activeTab === "messages" ? "default" : "ghost"}
        size="sm"
        className="flex flex-col items-center py-2 px-1 h-auto"
        onClick={() => setActiveTab("messages")}
      >
        <MessageSquare className="h-5 w-5 mb-1" />
        <span className="text-xs">Messages</span>
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-20 border-gray-300">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} className="border-gray-300">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-white border-none shadow-md">
                  <div className="flex items-center mb-6">
                    <Phone className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold">Voice</h2>
                  </div>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-600 md:h-8 md:w-8" />
              <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">Voice</h1>
            </div>
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search calls, messages, and voicemail"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              {connected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className={"cursor-pointer"}>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className={"bg-blue-400 text-white"}>
                    {user?.email ? user.email.slice(0, 2).toUpperCase() : "JD"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-none shadow-md" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                  
                  {
                    user?.role == "ADMIN" &&
                    <Link href={"/admin"}>
                      <DropdownMenuItem className={"cursor-pointer"}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  }

                  <DropdownMenuItem className={"cursor-pointer"} onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>

              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* Mobile search */}
        {isMobile && searchQuery !== null && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop only */}
        {!isMobile && (
          <nav className="w-64 border-r min-h-[calc(100vh-73px)] hidden md:block border-gray-300 bg-white">
            <SidebarContent />
          </nav>
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Calls Tab */}
            <TabsContent value="calls" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-73px-64px)] md:h-[calc(100vh-73px)]">
                {/* Call History */}
                <div className="border-r overflow-y-auto border-gray-300">
                  <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10 border-gray-300">
                    <h2 className="text-xl md:text-2xl font-semibold">Recent calls</h2>
                  </div>
                  <div className="overflow-y-auto">
                    {/* Show incoming call if active */}
                    {incomingCall && currentCall && (
                      <div className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-200">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {currentCall.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{currentCall.name}</p>
                              <Badge variant="default" className="text-xs bg-blue-500">
                                Incoming
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{currentCall.number}</p>
                            <p className="text-xs text-blue-600">Ringing...</p>
                          </div>
                        </div>
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={handleAnswerCall}
                        >
                          Answer
                        </Button>
                      </div>
                    )}

                    {recentCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-300">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={"bg-gray-50 to-gray-800"}>
                              {call.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{call.name}</p>
                              {call.missed && (
                                <Badge variant="destructive" className="text-xs">
                                  Missed
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{call.number}</p>
                            <p className="text-xs text-gray-400">
                              {call.time} • {call.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={"cursor-pointer"}
                            onClick={() => handleCall(call.number)}
                          >
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                          {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleCall(call.number)}>
                                Call back
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send message</DropdownMenuItem>
                              <DropdownMenuItem>Add to contacts</DropdownMenuItem>
                              <DropdownMenuItem>Block number</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                        </div>
                      </div>
                    ))}

                    {recentCalls.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Phone className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500">No recent calls</p>
                        <p className="text-sm text-gray-400">Your call history will appear here</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dialer - Hidden on mobile when viewing call history */}
                <div className="p-4 md:p-8 hidden lg:block">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Make a call</h2>
                    <p className="text-gray-600 text-md">Enter a number or select a contact</p>
                  </div>
                  <DialerPad />
                </div>

                {/* Mobile Dialer Button - Fixed at bottom right */}
                <div className="lg:hidden fixed bottom-20 right-4 z-10">
                  <Button size="lg" className="rounded-full h-14 w-14 shadow-lg bg-blue-500 text-white">
                    <PhoneCall className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-73px-64px)] md:h-[calc(100vh-73px)]">
                {/* Message List */}
                <div className="border-r overflow-y-auto border-gray-300">
                  <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10 border-gray-300">
                    <h2 className="text-lg md:text-xl font-semibold">Messages</h2>
                  </div>
                  <div className="overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 border-b cursor-pointer border-gray-300"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {message.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{message.name}</p>
                              {message.unread > 0 && (
                                <Badge variant="default" className="text-xs">
                                  {message.unread}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                            <p className="text-xs text-gray-400">{message.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Conversation - Hidden on mobile when viewing message list */}
                <div className="hidden lg:flex flex-col h-full">
                  <div className="p-4 md:p-6 border-b border-gray-300">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                        Hey, how did the meeting go?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                        It went really well! Thanks for asking.
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">Thanks for the call earlier!</div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-300">
                    <div className="flex space-x-2">
                      <Input placeholder="Type a message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>

                {/* Mobile New Message Button - Fixed at bottom right */}
                <div className="lg:hidden fixed bottom-20 right-4 z-10">
                  <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
                    <MessageSquare className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Call Dialogs */}
      {/* Outgoing Call Dialog */}
      <Dialog open={callState === "ringing" || callState === "connecting"} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md bg-white shadow-md border-none">
          <div className="text-center py-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl bg-gray-50">
                {currentCall?.name === "Unknown"
                  ? "?"
                  : currentCall?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{currentCall?.name}</h2>
            <p className="text-gray-600 mb-2">{currentCall?.number}</p>
            <p className="text-sm text-gray-500 mb-8">
              {callState === "connecting" ? "Connecting..." : "Calling..."}
            </p>

            <Button
              variant="destructive"
              size="lg"
              className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              onClick={handleEndCall}
            >
              <PhoneCall className="h-6 w-6 rotate-180" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incoming Call Dialog */}
      <Dialog open={callState === "incoming"} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md bg-white border-none shadow-md">
          <div className="text-center py-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl">
                {currentCall?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{currentCall?.name}</h2>
            <p className="text-gray-600 mb-2">{currentCall?.number}</p>
            <p className="text-sm text-gray-500 mb-8">Incoming call...</p>

            <div className="flex justify-center space-x-8">
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full h-16 w-16 text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                onClick={handleEndCall}
              >
                <PhoneCall className="h-6 w-6 rotate-180" />
              </Button>
              <Button
                variant="default"
                size="lg"
                className="rounded-full h-16 w-16 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                onClick={handleAnswerCall}
              >
                <PhoneCall className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connected Call Dialog */}
      <Dialog open={callState === "process"} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-lg border-none shadow-md bg-white">
          <div className="text-center py-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl">
                {currentCall?.name === "Unknown"
                  ? "?"
                  : currentCall?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{currentCall?.name}</h2>
            <p className="text-gray-600 mb-2">{currentCall?.number}</p>
            <div className="text-lg font-mono text-green-600 mb-4">
              <CallCounter />
            </div>

            {isOnHold && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mb-4">Call on hold</div>
            )}

            {isRecording && (
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mb-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                Recording
              </div>
            )}

            <CallControls />

            {showDialpad && <InCallDialpad />}

            <div className="mt-8">
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-500 cursor-pointer"
                onClick={handleEndCall}
              >
                <PhoneCall className="h-6 w-6 rotate-180" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DTMF Keyboard */}
      <DTMFKeyboard
        dtmf={dtmf}
        handleSendDTMF={handleSendDTMF}
        onOpenChange={() => setIsKeyBoardOpen(false)}
        open={isKeybordOpen}
        setdtmf={setdtmf}
      />

      {/* Audio elements */}
      <audio ref={audioRef} hidden></audio>
      <audio src="/call-coming-rintone.mp3" ref={incomingToneRef} loop hidden></audio>
      <audio src="/calling-ringtone.wav" ref={outgoingToneRef} loop hidden></audio>
    </div>
  )
}