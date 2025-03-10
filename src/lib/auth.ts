"use client";
import axios from "axios";
import Cookies from "js-cookie";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/users/login`, {
      email,
      password,
    });

    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 1 }); // 1 day expiry
      localStorage.setItem("username", response.data.user); 
      localStorage.setItem("userId", response.data.userId); // Use the correct key name
      console.log(localStorage.getItem("cart"));
      return { success: true, message: "Login successful!" };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return { success: false, message: "Server error, try again!" };
  }
};

export const registerUser = async (email: string, password: string, username: string) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, {
      email,
      password,
      username,
    });

    return { success: true, message: response.data.message }; // Handle success case
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return { success: false, message: error.response.data.message }; // User already exists
    }
    return { success: false, message: "Server error. Please try again!" }; // General error
  }
};


export const logoutUser = () => {
  Cookies.remove("token"); // Ensure token is removed
  localStorage.removeItem("username"); // Clear stored username if used
  window.location.href = "/login"; // Force UI update
};