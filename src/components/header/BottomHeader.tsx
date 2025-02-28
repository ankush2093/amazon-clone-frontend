
"use client";

import React, { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import { logoutUser } from "@/lib/auth";
import Cookies from "js-cookie";
import router from "next/router";
import Link from "next/link";

const BottomHeader = () => {
  
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const token = Cookies.get("token"); // Get token from cookies
      const storedUsername = localStorage.getItem("username"); // Get username from localStorage
  
      if (token && storedUsername) {
        setUser(storedUsername); // Set actual username from backend
      } else {
        setUser(null);
      }
    };
  
    checkUser(); // Run on component mount
  
    const interval = setInterval(checkUser, 1000); // Check for updates every second
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  

  const handleLogout = () => {
    logoutUser(); // Calls the logout function
    setUser(null); // Update state to reflect logout
    router.push("/login");
  };

  return (
    <div className="w-full h-12 bg-slate-800 text-sm text-white px-4 flex items-center">
      {/* All menu item */}
      <p className="flex items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        <LuMenu className="text-xl" /> All
      </p>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-3">
        <p className="h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
          Today's Deals
        </p>
        <p className="h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
          Customer Service
        </p>
        <p className="h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
          Registry
        </p>
        <p className="h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
          Gift Cards
        </p>
        <p className="h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
          Sell
        </p>
      </div>

      {/* User Status */}
      <div className="ml-auto flex items-center gap-4">
       <Link href="/my-orders" className="cursor-pointer duration-300 h-8 px-3 border border-transparent hover:border-yellow-600 hover:text-yellow-400"> <p>My Orders</p></Link>
        {user ? (
          <>
            <p className="text-green-500">Hello: {user}</p>
            <button
              onClick={handleLogout}
              className="h-8 px-3 border border-transparent hover:border-red-600 hover:text-red-400 cursor-pointer duration-300"
            >
              Sign Out
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="h-8 px-3 border border-transparent text-blue-400 hover:underline"
          >
            Login
          </a>
        )}
      </div>
    </div>
  );
};

export default BottomHeader;
