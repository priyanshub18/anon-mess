import React from "react";

const LoadingScreen = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
      {/* Spinning Logo */}
      <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Image src='/logo.svg' alt='Loading' width={80} height={80} />
      </motion.div>

      {/* Fading Text */}
      <p className='mt-4 text-lg font-semibold text-black'>Loading, please wait...</p>
    </div>
  );
};

export default LoadingScreen;
