"use client";

import { useState, useEffect } from "react";
import MessageCard from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Copy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";

const DashBoard = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch message acceptance status
  async function fetchAcceptMessage() {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      setAcceptMessages(response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError;
      //@ts-ignore
      toast.error(axiosError.response?.data?.message || "Failed to fetch message status.");
    } finally {
      setIsSwitchLoading(false);
    }
  }

  // Fetch all messages
  async function fetchMessages(refresh = false) {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.messages || []);

      if (refresh) {
        toast.success("Showing latest messages");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
  };

  // Handle toggle switch for accepting messages
  async function handleToggleSwitch() {
    setIsSwitchLoading(true);
    try {
      await axios.post("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setAcceptMessages(!acceptMessages);
      toast.success(`Message receiving ${!acceptMessages ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update message status.");
    } finally {
      setIsSwitchLoading(false);
    }
  }

  // Fetch data on mount
  useEffect(() => {
    if (!session?.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session]);

  if (!mounted) return null;

  if (!session?.user) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Image src='/logo.svg' alt='Loading' width={80} height={80} />
        </motion.div>
        <p className='mt-4 text-lg font-semibold'>Loading, please wait...</p>
        <p className={`mt-4 text-sm font-light ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>If this takes too long, please sign in again</p>
      </div>
    );
  }

  const { username } = session.user;
  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/u/${username}` : "";

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} bg-gray-200`}>
      {/* Header Section with Gradient Background */}
      <section className='relative'>
        {/* Background gradient */}
        <div className='absolute inset-0  opacity-90'></div>

        {/* Header content */}
        <div className='relative container mx-auto px-6 py-20 text-center z-10'>
          <h1 className='font-extrabold text-4xl md:text-6xl  mb-4 tracking-normal'>
            Your <span className='text-yellow-300'>Dashboard</span>
          </h1>
          <p className='text-lg md:text-2xl font-bold text-blue-700/50 max-w-3xl mx-auto'>Manage your messages and profile settings</p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className='py-12 px-6 -mt-10'>
        <div className='container mx-auto max-w-6xl'>
          <Card className={`border-none shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 mb-8`}>
            <CardContent className='p-4'>
              <h2 className='text-2xl font-bold mb-4'>Share Your Profile</h2>
              <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Share this link to receive anonymous messages from anyone around the world.</p>

              <div className='flex flex-col sm:flex-row items-center gap-3'>
                <input type='text' value={profileUrl} disabled className={`p-3 rounded-md w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`} />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(profileUrl);
                    toast.success("Copied to clipboard");
                  }}
                  className='bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-semibold whitespace-nowrap'
                >
                  <Copy className='h-4 w-4 mr-2' />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-none shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 mb-8`}>
            <CardContent className='p-4'>
              <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Message Settings</h2>
                <div className='flex items-center gap-3 mt-4 sm:mt-0'>
                  <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{acceptMessages ? "Accepting messages" : "Not accepting messages"}</span>
                  <div className='flex items-center gap-2'>
                    {isSwitchLoading && <Loader2 className='w-4 h-4 animate-spin' />}
                    <Switch checked={acceptMessages} onCheckedChange={handleToggleSwitch} disabled={isSwitchLoading} className='bg-blue-500' />
                  </div>
                </div>
              </div>

              <Separator className={`my-6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />

              <div className='flex justify-between items-center mb-8'>
                <h2 className='text-2xl font-bold'>Your Messages</h2>
                <Button onClick={() => fetchMessages(true)} variant='outline' className={`rounded-full ${theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`}>
                  {isLoading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : <RefreshCcw className='h-4 w-4 mr-2' />}
                  {isLoading ? "Refreshing..." : "Refresh Messages"}
                </Button>
              </div>

              {/* Messages Grid */}
              {messages.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {messages.map((message) => (
                    <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />
                  ))}
                </div>
              ) : (
                <Card className={`border-none shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-6 text-center`}>
                  <CardContent className='p-4 flex flex-col items-center'>
                    <p className={`text-lg mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>No messages to display yet.</p>
                    <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Share your profile link to start receiving anonymous messages!</p>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(profileUrl);
                        toast.success("Copied to clipboard");
                      }}
                      className='bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-semibold'
                    >
                      <Copy className='h-4 w-4 mr-2' />
                      Copy Profile Link
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative py-16 px-6  mt-auto'>
        <div className='relative bg-gray-200 rounded-xl overflow-hidden p-10 m-5 shadow-md text-center'>
          <div className='absolute top-5 left-5 bg-red-500 text-white px-4 py-2 font-bold text-base rounded-md shadow-sm'>Coming Soon !!!</div>

          <h1 className='text-3xl font-bold text-gray-800 mb-5'>Want to Customize Your Profile?</h1>

          <p className='text-lg text-blue-500 max-w-xl mx-auto mb-8 leading-relaxed'>Personalize your profile page to make it uniquely yours and attract more anonymous messages.</p>

          <button className='inline-flex items-center justify-center bg-white text-blue-500 text-lg font-semibold py-3 px-6 rounded-full border-none cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-1'>
            Customize Profile
            <span className='ml-2'>→</span>
          </button>
        </div>
        {/* <div
          className='relative overflow-hidden p-10 m-5 shadow-lg text-center rounded-xl'
          style={{
            background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientAnimation 15s ease infinite",
          }}
        >
          {/* CSS Animation for the gradient */}
        {/* <style jsx>{`
            @keyframes gradientAnimation {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style> */}

        {/* <div className='absolute top-5 left-5 bg-red-500 text-white px-4 py-2 font-bold text-base rounded-md shadow-sm'>Coming Soon !!!</div>

          <h1 className='text-3xl font-bold text-gray-800 mb-5'>Want to Customize Your Profile?</h1>

          <p className='text-lg text-blue-600 max-w-xl mx-auto mb-8 leading-relaxed font-medium'>Personalize your profile page to make it uniquely yours and attract more anonymous messages.</p>

          <button className='inline-flex items-center justify-center bg-white text-blue-500 text-lg font-semibold py-3 px-6 rounded-full cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 hover:bg-blue-50'>
            Customize Profile
            <span className='ml-2'>→</span>
          </button>
        </div> */}
      </section>

      {/* Footer */}
    </div>
  );
};

export default DashBoard;
