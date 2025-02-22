"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

import { TypingAnimation } from "@/components/magicui/typing-animation";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";
import React, { use, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { platform } from "os";
import { set } from "mongoose";
const SignIn = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  //TODO: Since we are using the toast new component we will directly use it without useToast hook;
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          console.log(debouncedUsername);
          const res = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
          setIsValid(true);
          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setIsValid(false);
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username unique");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/sign-up", data);
      toast.success("Sign up successful");
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error signing up");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <div className='text-center'>
          <div className='h-20 w-full'>
            <TypingAnimation startOnView className=''>
              Anon-Mess
            </TypingAnimation>
          </div>
          <p className='mb-4 text-gray-900/80'>Sign in continue your anonymous messaging journey. We'll guide you through the process </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name='username'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    placeholder='Type your Username here'
                  />
                  {isCheckingUsername && <Loader2 className='animate-spin' />}
                  {!isCheckingUsername && usernameMessage && <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name='email' placeholder='We will send you a verification code' />
                  {/* <p className='text-muted text-gray-950 text-sm'>We will send you a verification code</p> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type='password' {...field} placeholder='Keep a secured 8 digit password' name='password' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <RainbowButton type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </RainbowButton>
          </form>
        </Form>

        <div className='text-center mt-4'>
          <p>
            Not a member?{" "}
            <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
