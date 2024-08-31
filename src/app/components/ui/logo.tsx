"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LogoProps {
  ultrasonic: number;
}

export default function Logo({ ultrasonic }: LogoProps) {
  const [showLogo, setShowLogo] = useState(ultrasonic == 0);

  useEffect(() => {
    setShowLogo(ultrasonic == 0);
  }, [ultrasonic]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-green-400 via-blue-500 to-purple-600">
      <Head>
        <title>Unique IoT Animation</title>
      </Head>
      {showLogo ? (
        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute inset-0 w-50 h-50 bg-gradient-to-tr from-yellow-400 to-red-500 rounded-full opacity-75 animate-zoom group-hover:animate-wiggle"></div>
            <div className="relative">
              <Image
                src="/iot.png" // replace with your IoT logo path
                alt="IoT Logo"
                className="w-50 h-50 transform group-hover:scale-110 transition-transform duration-700 ease-out"
                width={160}
                height={160}
              />
            </div>
          </div>
          {/* <h1 className="text-5xl text-white font-bold mt-8 animate-fade-in">
            IoT
          </h1> */}
        </div>
      ) : (
        <div className="opacity-0 transition-opacity duration-1000 ease-out"></div>
      )}
    </div>
  );
}
