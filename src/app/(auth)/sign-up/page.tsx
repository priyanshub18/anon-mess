"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuroraText } from "@/components/magicui/aurora-text";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { RainbowButton } from "@/components/magicui/rainbow-button";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);
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

          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
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
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.status === 200) {
        toast.success("Sign up successful!");
        const url = `/verify/${username}`;
        router.push(url);
      }
      // toast.success("Sign up successful!");
      // const url = `/verify/${username}`;
      // router.push(url);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");
      toast.error(errorMessage ?? "Error signing up");

      setIsSubmitting(false);
    }
  };
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <div className='text-center'>
          <div className='h-20 w-full'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
              <span>Join </span>
              <AuroraText className=''>
                <TypingAnimation className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Anon-Mess</TypingAnimation>{" "}
              </AuroraText>
            </h1>
          </div>
          <p className='mb-4 text-gray-900/80'>Sign up to start your anonymous messaging journey. We'll guide you through the process </p>
        </div>
        {/* @ ts-expect-error */}
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
                    placeholder='ghostrider_99'
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
                  <Input {...field} name='email' placeholder='yourname@email.com' />
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
                  <Input type='password' {...field} placeholder='priy@nitj' name='password' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <RainbowButton type='submit' className='w-full font-bold' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </RainbowButton>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member?{" "}
            <a href='/sign-in' className='text-blue-600 hover:text-blue-800'>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
