"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

function NavBar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    console.log("session", session);
  }, [session]);

  return (
    <nav className='bg-gray-50 w-full shadow-lg'>
      <div className='flex items-center justify-between px-6 py-4 md:px-12'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' width={40} height={40} className='h-10 w-10' />
          <span className='text-lg font-bold sm:text-xl'>Anon-Mess</span>
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-6'>
          {session ? (
            <>
              <span className='text-gray-700'>
                Welcome, <span className='font-bold'>{user?.username}</span>
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='hover:text-gray-50 font-bold text-white'>Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-xl font-medium'>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => signOut()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button className='font-medium text-white'>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className='h-7 w-7' /> : <Menu className='h-7 w-7' />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden flex flex-col items-center gap-4 py-4 bg-gray-100 border-t'>
          {session ? (
            <>
              <span className='text-gray-700'>
                Welcome, <span className='font-bold'>{user?.username}</span>
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='hover:text-gray-50 font-bold text-white'>Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-xl font-medium'>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => signOut()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button className='font-medium text-white'>Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
