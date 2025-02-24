"use client";

import MessageCard from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AuroraText } from "@/components/magicui/aurora-text";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const DashBoard = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const { data: session } = useSession();

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

      toast.success("Showing latest messages");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  const handleDeleteMessage = (messageId: string) => {
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

  if (!session?.user) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Image src='/logo.svg' alt='Loading' width={80} height={80} />
        </motion.div>
        <p className='mt-4 text-lg font-semibold text-black'>Loading, please wait...</p>
        <p className='mt-4 text-sm font-light text-black/80'>If this takes too long, please signIn again</p>
      </div>
    );
  }

  const { username } = session.user;
  const profileUrl = `${window.location.origin}/u/${username}`;

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl '>
      {/* <AuroraText className='text-center'> */}
      <h1 className='text-4xl font-extrabold text-blue-600 text-center mb-4 sm:text-5xl'>User Dashboard</h1>
      {/* </AuroraText> */}

      {/* Copy Link Section */}
      <div className='mb-4 mt-3'>
        <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
        <div className='flex items-center'>
          <input type='text' value={profileUrl} disabled className='input input-bordered w-full p-2 mr-2 bg-gray-200 rounded-lg' />
          <Button
            className=' hover:text-gray-50 font-bold text-white'
            onClick={() => {
              navigator.clipboard.writeText(profileUrl);
              toast.success("Copied to clipboard");
            }}
          >
            Copy
          </Button>
        </div>
      </div>

      <Separator className='my-6 bg-black' />

      {/* Toggle Switch */}
      <div className='flex gap-4 items-center mb-6'>
        <span className='text-lg font-semibold'>Accept Messages</span>
        <div className='flex items-center gap-2'>
          {isSwitchLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          <Switch checked={acceptMessages} onCheckedChange={handleToggleSwitch} disabled={isSwitchLoading} className='bg-blue-500' />
        </div>
      </div>

      {/* Refresh Button */}
      <Button className='mt-4' variant='outline' onClick={() => fetchMessages(true)}>
        {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCcw className='h-4 w-4' />}
        {isLoading ? "Refreshing..." : "Refresh Messages"}
      </Button>

      {/* Messages List */}
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>{messages.length > 0 ? messages.map((message) => <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />) : <p>No messages to display.</p>}</div>
    </div>
  );
};

export default DashBoard;
