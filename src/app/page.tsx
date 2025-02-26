"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Shield, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { convertToObject } from "typescript";

const testimonials = [
  {
    name: "Alex Johnson",
    message: "I've received so many thoughtful messages. It's like having a secret pen pal network!",
    role: "Influencer",
  },
  {
    name: "Jamie Smith",
    message: "This platform helped me get honest feedback from my audience without the fear of judgment.",
    role: "Content Creator",
  },
  {
    name: "Taylor Reed",
    message: "The AI suggestions are brilliant! Makes it easy to start meaningful conversations.",
    role: "Community Manager",
  },
  {
    name: "Morgan Chen",
    message: "A safe space to share thoughts that would otherwise remain unspoken. Absolutely love it!",
    role: "Student",
  },
  {
    name: "Jordan Williams",
    message: "The simplicity of the interface combined with powerful features makes this my go-to platform.",
    role: "Social Media Enthusiast",
  },
];

const features = [
  {
    title: "Anonymous Messaging",
    description: "Send thoughtful messages without revealing your identity",
    icon: <MessageSquare className='h-8 w-8 text-blue-500' />,
  },
  {
    title: "AI-Powered Suggestions",
    description: "Stuck for words? Our AI helps craft the perfect message",
    icon: <Shield className='h-8 w-8 text-blue-500' />,
  },
  {
    title: "Safe & Secure",
    description: "Advanced security measures protect both senders and receivers",
    icon: <Shield className='h-8 w-8 text-blue-500' />,
  },
];

export default function LandingPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (session && status === "authenticated") {
      console.log("From here i am redirecting the user")
      setIsSignedIn(true);
    }
  }, [session, status]);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Hero Section */}
      <section className='relative'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90'></div>

        {/* Hero content */}
        <div className='relative container mx-auto px-6 py-32 flex flex-col items-center text-center z-10'>
          <h1 className='font-extrabold text-5xl md:text-7xl text-white mb-6 tracking-tight leading-tight'>
            Share Your Thoughts <span className='text-yellow-300'>Anonymously</span>
          </h1>
          <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mb-10'>Express yourself freely. Connect authentically. Stay anonymous.</p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link href={!isSignedIn ? "/sign-in" : "/dashboard"}>
              <Button size='lg' className='bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-full font-semibold'>
                Get Started
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link href='#learn'>
              <Button size='lg' variant='outline' className='text-black border-white hover:bg-white/10 text-lg px-8 py-6 rounded-full font-semibold'>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className='py-20 px-6'>
        <div className='container mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-16'>Why Choose Our Platform?</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {features.map((feature, index) => (
              <Card key={index} className={`border-none shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <CardContent className='p-8 flex flex-col items-center text-center'>
                  <div className='mb-6 p-4 rounded-full bg-blue-100 dark:bg-blue-900'>{feature.icon}</div>
                  <h3 className='text-xl font-semibold mb-3'>{feature.title}</h3>
                  <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section id='learn' className={`py-20 px-6 ${theme === "dark" ? "bg-gray-800" : "bg-blue-50"}`}>
        <div className='container mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-16'>What Our Users Say</h2>

          <div className='relative max-w-4xl mx-auto'>
            {/* Carousel navigation */}
            <div className='absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6 z-10'>
              <Button variant='outline' size='icon' className='rounded-full' onClick={prevTestimonial}>
                <ChevronLeft className='h-6 w-6' />
              </Button>
            </div>

            <div className='overflow-hidden'>
              <div className='flex transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className='min-w-full px-4'>
                    <Card className={`border-none shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
                      <CardContent className='p-10 flex flex-col items-center text-center'>
                        <p className={`text-xl italic mb-8 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>"{testimonial.message}"</p>
                        <div className='mt-auto'>
                          <p className='font-semibold text-lg'>{testimonial.name}</p>
                          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className='absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-6 z-10'>
              <Button variant='outline' size='icon' className='rounded-full' onClick={nextTestimonial}>
                <ChevronRight className='h-6 w-6' />
              </Button>
            </div>

            {/* Carousel indicators */}
            <div className='flex justify-center mt-8 space-x-2'>
              {testimonials.map((_, index) => (
                <button key={index} className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? "bg-blue-600" : `${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} hover:bg-blue-400`}`} onClick={() => setCurrentTestimonial(index)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6 bg-gradient-to-br from-purple-700 to-blue-600'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='text-3xl md:text-5xl font-bold text-white mb-6'>Ready to Join The Conversation?</h2>
          <p className='text-xl text-blue-100 mb-10 max-w-2xl mx-auto'>Create your profile today and start receiving anonymous messages from anyone around the world.</p>
          <Link href='/sign-up'>
            <Button size='lg' className='bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 rounded-full font-semibold'>
              Get Your Anonymous Link
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-10 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row justify-center items-center'>
            <div className='mb-6 md:mb-0'>
              <p className='font-bold text-2xl'>AnonymousMessage</p>
              <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>© {new Date().getFullYear()} All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
