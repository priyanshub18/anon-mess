"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Sparkles, Clipboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AnonymousMessagePage = () => {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(["What is your biggest fear?", "Describe your perfect day.", "What motivates you the most?", "Who has inspired you the most?", "If you had one wish, what would it be?"]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    // Copy to clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        toast.success("Copied to clipboard");
      })

      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy");
      });
  };

  const handleApplySuggestion = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  const router = useRouter();

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/send-message", { username, content: message });
      toast.success("Message sent anonymously!");
      setMessage("");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestion = async () => {
    if (isSuggestionLoading) return;
    console.log("getSuggestion");
    setIsSuggestionLoading(true);
    try {
      const response = await axios.get("/api/gemini-suggest-message");
      console.log(response.data);
      const res = response.data;
      const ans = new Array(7).fill(null).map((_, i) => res.split("\n")[i]);
      setSuggestions(ans);
      setShowSuggestions(true);
    } catch (error) {
      toast.error("Failed to get a suggestion.");
    }
    setIsSuggestionLoading(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 p-6'>
      <div className='w-full max-w-4xl bg-white shadow-xl rounded-lg p-10 flex flex-col items-center text-center'>
        <h1 className='text-5xl font-extrabold text-blue-600 mb-6'>Send an Anonymous Message</h1>
        <p className='text-gray-600 text-xl mb-6'>
          Sending to <span className='font-semibold'>@{username}</span>
        </p>

        <Textarea className='w-full h-40 text-lg p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500' placeholder='Write your anonymous message...' value={message} onChange={(e) => setMessage(e.target.value)} />

        {showSuggestions && (
          <div className='w-full mt-4 border border-gray-200 rounded-lg bg-gray-50 p-4'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='font-semibold text-gray-700'>Message Suggestions</h3>
              <Button variant='ghost'  size='sm' onClick={() => setShowSuggestions(false)} className='text-gray-500 hover:text-gray-700'>
                Close
              </Button>
            </div>
            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {suggestions.map((suggestion, index) => (
                <div key={index} className='p-3 bg-white rounded border-l-4 border-blue-500 flex justify-between items-center'>
                  <p className='text-gray-800 mr-2 text-left text-sm'>{suggestion}</p>
                  <div className='flex space-x-2 flex-shrink-0'>
                    <Button onClick={() => handleApplySuggestion(suggestion)} className='px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300 text-xs'>
                      Use
                    </Button>
                    <Button onClick={() => handleCopy(suggestion, index)} className={`px-2 py-1 rounded flex items-center ${copiedIndex === index ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"} transition-colors duration-300 text-xs`}>
                      {copiedIndex === index ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex gap-4 w-full mt-6'>
          <Button className='w-full bg-gray-900 text-white text-lg py-3 hover:bg-gray-800 transition' onClick={sendMessage} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
          <Button className='w-full flex items-center justify-center bg-gray-700 text-white text-lg py-3 hover:bg-gray-600 transition' onClick={getSuggestion} disabled={isSuggestionLoading}>
            <Sparkles className='w-5 h-5 mr-2' />
            {isSuggestionLoading ? "Loading..." : showSuggestions ? "Refresh Suggestions" : "Get AI Suggestion"}
          </Button>
        </div>
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
