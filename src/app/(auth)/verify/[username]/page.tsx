"use client";
import React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import axios, { AxiosError } from "axios";

import { AuroraText } from "@/components/magicui/aurora-text";
import { ApiResponse } from "@/types/ApiResponse";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { set } from "mongoose";
const VerifyAccount = () => {
  const { username } = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log(value);
      const res = await axios.post(`/api/verify-code`, {
        username: username,
        otp: value,
      });
      toast.success("Verification successful");
      setIsSubmitting(false);
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error verifying account");
    }
    setIsSubmitting(false);
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <div className='text-center'>
          <AuroraText>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify your Account</h1>
          </AuroraText>
          <p>Enter the verification code sent to your email address to verify your account.</p>
        </div>
        <div className='flex flex-col items-center'>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-center text-md'>One-Time Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...form}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>

                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>Submit</Button>
            </form>
          </Form> */}

          <h1 className='text-xl font-extrabold tracking-tight lg:text-xl mb-6'>One-Time Verification Code</h1>
          <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className='text-center text-md pt-3'>{value === "" ? <>Enter your one-time password.</> : <>You entered: {value}</>}</div>
          <RainbowButton type='submit' className='w-full mt-5 font-extrabold' disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </RainbowButton>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
