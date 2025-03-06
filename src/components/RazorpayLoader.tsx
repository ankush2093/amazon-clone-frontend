"use client";
import { useEffect } from "react";

const RazorpayLoader = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null; // No UI needed
};

export default RazorpayLoader;
