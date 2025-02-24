"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import Image from "next/image";
function NavBar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className='bg-gray-50 w-full h-full rounded-b-lg shadow-lg  '>
      <div className='flex flex-row items-center justify-between md:px-20 py-3 w-full h-full px-8 sticky'>
        <a href='' className='flex flex-row items-center gap-1'>
          <Image src='/logo.svg' alt='logo' width={50} height={50} className='h-10 w-10' />
          <span className='text-md font-extrabold sm:text-2xl'>Anon-Mess</span>
        </a>

        {session ? (
          <div className='flex flex-row items-center gap-4'>
            <span className='font-xs md:font-md'>
              Welcome, <span className='font-bold'>{user?.username}</span>
            </span>
            <AlertDialog>
              <AlertDialogTrigger>
                {" "}
                <Button>Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-2xl font-bold'>Confirm logout?</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to log out? Any unsaved changes will be lost.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => signOut()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>
            <Button className='w-full py-2 px-5'>
              <span className='font-extrabold'>Sign In</span>
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
