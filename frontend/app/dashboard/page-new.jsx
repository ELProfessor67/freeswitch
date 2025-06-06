"use client"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function GoogleVoiceClone() {
  const [activeTab, setActiveTab] = useState("calls")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
//   <"idle" | "dialing" | "incoming" | "connected">
  const [callState, setCallState] = useState("idle")
  const [currentCall, setCurrentCall] = useState(null)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isOnHold, setIsOnHold] = useState(false)
  const [showDialpad, setShowDialpad] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  const recentCalls = [
    {
      id: 1,
      name: "Sarah Johnson",
      number: "+1 (555) 123-4567",
      type: "incoming",
      time: "2 min ago",
      duration: "5:23",
      missed: false,
    },
    {
      id: 2,
      name: "Mike Chen",
      number: "+1 (555) 987-6543",
      type: "outgoing",
      time: "1 hour ago",
      duration: "12:45",
      missed: false,
    },
    {
      id: 3,
      name: "Unknown",
      number: "+1 (555) 456-7890",
      type: "incoming",
      time: "3 hours ago",
      duration: "0:00",
      missed: true,
    },
    {
      id: 4,
      name: "Emma Wilson",
      number: "+1 (555) 234-5678",
      type: "outgoing",
      time: "Yesterday",
      duration: "8:12",
      missed: false,
    },
    {
      id: 5,
      name: "David Brown",
      number: "+1 (555) 345-6789",
      type: "incoming",
      time: "Yesterday",
      duration: "3:45",
      missed: false,
    },
  ]

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
    {
      id: 3,
      name: "Emma Wilson",
      number: "+1 (555) 234-5678",
      lastMessage: "Perfect, see you then",
      time: "Yesterday",
      unread: 1,
    },
    {
      id: 4,
      name: "David Brown",
      number: "+1 (555) 345-6789",
      lastMessage: "Got it, thanks!",
      time: "2 days ago",
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
    {
      id: 2,
      name: "Unknown",
      number: "+1 (555) 456-7890",
      time: "3 hours ago",
      duration: "0:45",
      transcription: "This is regarding your car warranty...",
      unread: true,
    },
    {
      id: 3,
      name: "Emma Wilson",
      number: "+1 (555) 234-5678",
      time: "Yesterday",
      duration: "2:15",
      transcription: "Hey, I left my keys at your place. Can you let me know when I can pick them up?",
      unread: false,
    },
  ]

  const contacts = [
    { id: 1, name: "Sarah Johnson", number: "+1 (555) 123-4567", email: "sarah@example.com" },
    { id: 2, name: "Mike Chen", number: "+1 (555) 987-6543", email: "mike@example.com" },
    { id: 3, name: "Emma Wilson", number: "+1 (555) 234-5678", email: "emma@example.com" },
    { id: 4, name: "David Brown", number: "+1 (555) 345-6789", email: "david@example.com" },
  ]

  const DialerPad = () => {
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

    const handleCall = () => {
      if (dialNumber.trim()) {
        setCurrentCall({
          name: "Unknown",
          number: dialNumber,
          type: "outgoing",
        })
        setCallState("dialing")
        setDialNumber("")

        // Simulate call connecting after 3 seconds
        setTimeout(() => {
          setCallState("connected")
          setCallDuration(0)
        }, 3000)
      }
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
          <Button size="lg" className="rounded-full h-14 w-14 bg-green-500 text-white hover:bg-green-600 cursor-pointer" onClick={handleCall}>
            <PhoneCall className="h-6 w-6" />
          </Button>
        </div>
      </div>
    )
  }

  // Call duration timer effect
  useEffect(() => {
    let interval
    if (callState === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  // Simulate incoming call
  const simulateIncomingCall = () => {
    setCurrentCall({
      name: "Sarah Johnson",
      number: "+1 (555) 123-4567",
      type: "incoming",
    })
    setCallState("incoming")
  }

  // Handle call actions
  const handleAnswerCall = () => {
    setCallState("connected")
    setCallDuration(0)
  }

  const handleDeclineCall = () => {
    setCallState("idle")
    setCurrentCall(null)
  }

  const handleEndCall = () => {
    setCallState("idle")
    setCurrentCall(null)
    setCallDuration(0)
    setIsMuted(false)
    setIsOnHold(false)
    setShowDialpad(false)
    setIsRecording(false)
  }

  // Format call duration
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Call control components
  const CallControls = () => (
    <div className="flex justify-center space-x-6 mt-8">
      <Button
        variant={isMuted ? "default" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>

      <Button
        variant={isOnHold ? "default" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16"
        onClick={() => setIsOnHold(!isOnHold)}
      >
        {isOnHold ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
      </Button>

      <Button
        variant={showDialpad ? "default" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16"
        onClick={() => setShowDialpad(!showDialpad)}
      >
        <Grid3X3 className="h-6 w-6" />
      </Button>

      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className="rounded-full h-16 w-16"
        onClick={() => setIsRecording(!isRecording)}
      >
        {isRecording ? <StopCircle className="h-6 w-6" /> : <Square className="h-6 w-6" />}
      </Button>
    </div>
  )

  const InCallDialpad = () => (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((number) => (
          <Button key={number} variant="outline" size="lg" className="h-12 text-lg font-semibold">
            {number}
          </Button>
        ))}
      </div>
    </div>
  )

  // Sidebar content component to reuse in both desktop and mobile views
  const SidebarContent = () => (
    <div className="p-4">
      <Button className="w-full mb-6" size="lg">
        <Plus className="h-4 w-4 mr-2" />
        New conversation
      </Button>

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
          <TabsTrigger value="calls" className="justify-start w-full mb-2">
            <Phone className="h-4 w-4 mr-2" />
            Calls
          </TabsTrigger>
          <TabsTrigger value="messages" className="justify-start w-full mb-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          {/* <TabsTrigger value="voicemail" className="justify-start w-full mb-2">
            <Voicemail className="h-4 w-4 mr-2" />
            Voicemail
            <Badge variant="secondary" className="ml-auto">
              {voicemails.filter((v) => v.unread).length}
            </Badge>
          </TabsTrigger> */}
        </TabsList>
      </Tabs>
    </div>
  )

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
      <Button
        variant={activeTab === "voicemail" ? "default" : "ghost"}
        size="sm"
        className="flex flex-col items-center py-2 px-1 h-auto"
        onClick={() => setActiveTab("voicemail")}
      >
        <Voicemail className="h-5 w-5 mb-1" />
        <span className="text-xs">Voicemail</span>
        {voicemails.filter((v) => v.unread).length > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
          >
            {voicemails.filter((v) => v.unread).length}
          </Badge>
        )}
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 ">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-20 border-gray-300">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
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
            {/* Add this button for testing incoming calls */}
            <Button variant="ghost" size="sm" onClick={simulateIncomingCall} className="hidden md:block">
              Test Call
            </Button>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile search - expandable */}
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
          <nav className="w-64 !bg-gray-50 border-r min-h-[calc(100vh-73px)] hidden md:block">
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
                <div className="border-r overflow-y- border-gray-300">
                  <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10 border-gray-300">
                    <h2 className="text-xl md:text-2xl font-semibold">Recent calls</h2>
                  </div>
                  <div className="overflow-y-auto">
                    {recentCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-300">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
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
                            onClick={() => {
                              setCurrentCall({
                                name: call.name,
                                number: call.number,
                                type: "outgoing",
                              })
                              setCallState("dialing")
                              setTimeout(() => {
                                setCallState("connected")
                                setCallDuration(0)
                              }, 3000)
                            }}
                          >
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Call back</DropdownMenuItem>
                              <DropdownMenuItem>Send message</DropdownMenuItem>
                              <DropdownMenuItem>Add to contacts</DropdownMenuItem>
                              <DropdownMenuItem>Block number</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
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

            {/* Voicemail Tab */}
            <TabsContent value="voicemail" className="m-0">
              <div className="p-4 md:p-6 overflow-y-auto h-[calc(100vh-73px-64px)] md:h-[calc(100vh-73px)]">
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">Voicemail</h2>
                  <p className="text-gray-600">{voicemails.filter((v) => v.unread).length} new voicemails</p>
                </div>

                <div className="space-y-4">
                  {voicemails.map((voicemail) => (
                    <Card key={voicemail.id} className={voicemail.unread ? "border-blue-200 bg-blue-50" : ""}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {voicemail.name === "Unknown"
                                  ? "?"
                                  : voicemail.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{voicemail.name}</p>
                                {voicemail.unread && (
                                  <Badge variant="default" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{voicemail.number}</p>
                              <p className="text-xs text-gray-400">
                                {voicemail.time} • {voicemail.duration}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Play
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{voicemail.transcription}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
      <Dialog open={callState === "dialing"} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-white shadow-md border-none">
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
            <p className="text-sm text-gray-500 mb-8">Calling...</p>

            <Button variant="destructive" size="lg" className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 text-white" onClick={handleEndCall}>
              <PhoneCall className="h-6 w-6 rotate-180" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incoming Call Dialog */}
      <Dialog open={callState === "incoming"} onOpenChange={() => {}}>
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
              <Button variant="destructive" size="lg" className="rounded-full h-16 w-16 text-white bg-red-500 hover:bg-red-600 cursor-pointer" onClick={handleDeclineCall}>
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
      <Dialog open={callState === "connected"} onOpenChange={() => {}}>
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
            <p className="text-lg font-mono text-green-600 mb-4">{formatCallDuration(callDuration)}</p>

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
              <Button variant="destructive" size="lg" className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-500" onClick={handleEndCall}>
                <PhoneCall className="h-6 w-6 rotate-180" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}



