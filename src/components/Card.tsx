"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/user";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import Link from "next/link";
type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [randomIndex, setRandomIndex] = useState(0);
  const adviceSynonyms = ["Suggestion", "Recommendation", "Guidance", "Tip", "Pointer", "Insight", "Counsel", "Direction", "Hint", "Proposal", "Opinion", "Wisdom", "Instruction", "Strategy", "Perspective", "Solution", "Idea", "Coaching", "Consultation"];
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>("/api/delete-message/" + message._id);
    if (response.status === 200) {
      toast.success("Message deleted successfully");
      onMessageDelete(message._id as string);
    } else {
      toast.error("Error deleting message");
    }
  };
  function formatReadableDateTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert if it's not already a Date object
    }

    const options = {
      weekday: "short", // e.g., "Mon"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "February"
      day: "numeric", // e.g., "24"
      hour: "2-digit", // e.g., "10"
      minute: "2-digit", // e.g., "30"
      second: "2-digit", // e.g., "15"
      hour12: true, // 12-hour format with AM/PM
    };

    return date.toLocaleString("en-US", options);
  }
  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * adviceSynonyms.length));
  }, []);
  return (
    <Card>
      <CardHeader className='flex content-center'>
        <div className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl'>{adviceSynonyms[randomIndex]}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='w-fit  hover:text-gray-50 font-bold text-white'>
                <X className='h-5 w-5' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete the message from our servers.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className='text-md'>{message.content}</CardDescription>
        <div>{formatReadableDateTime(message.createdAt)}</div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
