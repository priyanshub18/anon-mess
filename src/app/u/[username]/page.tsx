"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Sparkles, Clipboard, ArrowRight, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const AnonymousMessagePage = () => {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(["What is your biggest fear?", "Describe your perfect day.", "What motivates you the most?", "Who has inspired you the most?", "If you had one wish, what would it be?"]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { theme } = useTheme();

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
    setIsSuggestionLoading(true);
    try {
      const response = await axios.get("/api/gemini-suggest-message");
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
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Hero Section */}
      <section className='relative'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90'></div>

        {/* Hero content */}
        <div className='relative container mx-auto px-6 py-20 flex flex-col items-center text-center z-10'>
          <h1 className='font-extrabold text-4xl md:text-6xl text-white mb-4 tracking-tight'>
            Send an <span className='text-yellow-300'>Anonymous Message</span>
          </h1>
          <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mb-4'>
            to <span className='font-semibold'>@{username}</span>
          </p>
        </div>
      </section>

      {/* Message Form Section */}
      <section className='py-12 px-6'>
        <div className='container mx-auto max-w-4xl'>
          <Card className={`border-none shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 mb-8`}>
            <CardContent className='p-6'>
              <Textarea className={`w-full h-40 text-lg p-4 mb-6 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`} placeholder='Write your anonymous message...' value={message} onChange={(e) => setMessage(e.target.value)} />

              {showSuggestions && (
                <Card className={`w-full mb-6 ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-lg`}>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-center mb-4'>
                      <h3 className={`font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>AI Message Suggestions</h3>
                      <Button variant='ghost' size='sm' onClick={() => setShowSuggestions(false)} className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='space-y-3 max-h-64 overflow-y-auto'>
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className={`p-3 rounded border-l-4 border-blue-500 flex justify-between items-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                          <p className={`mr-2 text-left text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{suggestion}</p>
                          <div className='flex space-x-2 flex-shrink-0'>
                            <Button onClick={() => handleApplySuggestion(suggestion)} className={`px-3 py-1 rounded-full text-xs ${theme === "dark" ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                              Use
                            </Button>
                            <Button onClick={() => handleCopy(suggestion, index)} className={`px-3 py-1 rounded-full flex items-center text-xs ${copiedIndex === index ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
                              {copiedIndex === index ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className='flex flex-col sm:flex-row gap-4 w-full'>
                <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full' onClick={sendMessage} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
                <Button className='w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full' onClick={getSuggestion} disabled={isSuggestionLoading}>
                  <Sparkles className='w-5 h-5 mr-2' />
                  {isSuggestionLoading ? "Loading..." : showSuggestions ? "Refresh Suggestions" : "Get AI Suggestions"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 px-6 bg-gradient-to-br from-purple-700 to-blue-600 mt-auto'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>Want to Receive Anonymous Messages?</h2>
          <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>Create your own anonymous messaging link and start receiving thoughtful messages from anyone around the world.</p>
          <Link href='/sign-up'>
            <Button size='lg' className='bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-full font-semibold'>
              Create Your Own Link
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-6 ${theme === "dark" ? "bg-gray-900 border-t border-gray-800" : "bg-gray-100 border-t border-gray-200"}`}>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
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

export default AnonymousMessagePage;
