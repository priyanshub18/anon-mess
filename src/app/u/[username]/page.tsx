"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

const AnonymousMessagePage = () => {
  const { username } = useParams(); // Get the dynamic username from URL
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      console.log("username", username);  
      console.log("message", message);
      await axios.post("/api/send-message", {
        username,
        content : message,
      });
      toast.success("Message sent anonymously!");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 sm:p-12 flex flex-col items-center'>
        <h1 className='text-4xl font-extrabold text-blue-600 text-center mb-4 sm:text-5xl'>Send an Anonymous Message</h1>
        <p className='text-gray-600 text-lg text-center mb-6 sm:text-xl'>
          Sending to <span className='font-semibold'>@{username}</span>
        </p>

        <Textarea className='w-full h-40 text-lg p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500' placeholder='Write your anonymous message...' value={message} onChange={(e) => setMessage(e.target.value)} />

        <Button className='w-full mt-6 bg-gray-900 text-white text-lg py-3 hover:bg-gray-800 transition' onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </div>

      <div className='mt-8 text-center'>
        <p className='text-gray-700 text-lg'>Want to receive anonymous messages?</p>
        <Link href='/sign-up'>
          <Button className='mt-3 bg-gray-800 text-white text-lg px-6 py-3 hover:bg-gray-700 transition'>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default AnonymousMessagePage;
