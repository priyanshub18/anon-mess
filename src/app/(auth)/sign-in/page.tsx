"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

import { TypingAnimation } from "@/components/magicui/typing-animation";
import { toast } from "sonner";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { RainbowButton } from "@/components/magicui/rainbow-button";

import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //TODO: Since we are using the toast new component we will directly use it without useToast hook;
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log("hello Bro");
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      toast.error(result?.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Sign In Successful");
    setIsSubmitting(false);

    router.push("/");
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <div className='text-center'>
          <div className='h-20 w-full'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
              {/* <AuroraText className=''> */}
              <TypingAnimation className='text-4xl text-blue-700 font-extrabold tracking-tight lg:text-5xl mb-6'>Anon-Mess</TypingAnimation> {/* </AuroraText> */}
            </h1>
          </div>
          <p className='mb-4 text-gray-900/80'>Sign in continue your anonymous messaging journey. We&apos;ll guide you through the process </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name='identifier'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
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
            <Button type='submit' className='w-full my-2 font-bold text-lg' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
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
