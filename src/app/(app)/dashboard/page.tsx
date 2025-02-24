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
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header Section with Gradient Background */}
      <section className='relative'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90'></div>

        {/* Header content */}
        <div className='relative container mx-auto px-6 py-20 text-center z-10'>
          <h1 className='font-extrabold text-4xl md:text-5xl text-white mb-4 tracking-tight'>
            Your <span className='text-yellow-300'>Dashboard</span>
          </h1>
          <p className='text-lg md:text-xl text-blue-100 max-w-3xl mx-auto'>Manage your messages and profile settings</p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className='py-12 px-6'>
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
      <section className='relative py-16 px-6 bg-gradient-to-br from-purple-700 to-blue-600 mt-auto'>
        <div className='container mx-auto max-w-4xl text-center'>
          <div className='absolute top-0 left-0 bg-red-500 text-white text-xl font-bold px-3 py-1 rounded-br-lg'>Coming Soon !!!</div>
          <h2 className='text-3xl font-bold text-white mb-4'>Want to Customize Your Profile?</h2>
          <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>Personalize your profile page to make it uniquely yours and attract more anonymous messages.</p>
          <Button size='lg' className='bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 rounded-full font-semibold text-lg'>
            Customize Profile
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-6 ${theme === "dark" ? "bg-gray-900 border-t border-gray-800" : "bg-gray-100 border-t border-gray-200"}`}>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row justify-center items-center'>
            <div className='mb-6 md:mb-0'>
              <p className='font-bold text-2xl'>AnonymousMessage</p>
              <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>© {new Date().getFullYear()} All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashBoard;
