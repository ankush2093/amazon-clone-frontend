"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  description: string;
  storeName: string;
}

export interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description?: string;
}

interface CartContextType {
  cart: CartItem[];
  favorites: FavoriteItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (item: FavoriteItem) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// const API_BASE_URL = "http://localhost:4000/api/cart";

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const token = Cookies.get("token");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (token && userId) {
        try {
          const res = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const fetchedCart = res.data.items || [];
          const fetchedFavorites = res.data.favorites || [];

          setCart(fetchedCart);
          setFavorites(fetchedFavorites);
        } catch (error) {
          console.error("Error fetching cart from API:", error);
        }
      } else {
        setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
        setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [token, userId]);
  
  /** Sync local cart to API after login */

  // const syncLocalToApi = async () => {
  //   if (token && userId) {
  //     try {
  //       await axios.post(`${API_BASE_URL}/cart/sync`, { userId, cart, favorites }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //     } catch (error) {
  //       console.error("Error syncing local cart to API:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (token && userId) syncLocalToApi();
  // }, [token, userId]);


  /**  Cart Functions */
  const addToCart = async (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    if (token && userId) {
      try {
        await axios.post(`${API_BASE_URL}/cart/add`, { userId, item }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify([...cart, item]));
    }
  };

  const removeFromCart = async (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (token && userId) {
      try {
        await axios.post(`${API_BASE_URL}/cart/remove`, { userId, itemId: id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const increaseQuantity = async (id: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
    if (token && userId) {
      await axios.post(`${API_BASE_URL}/cart/update-quantity`, { userId, itemId: id, type: "increase" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const decreaseQuantity = async (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
    if (token && userId) {
      await axios.post(`${API_BASE_URL}/cart/update-quantity`, { userId, itemId: id, type: "decrease" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (token && userId) {
      await axios.post(`${API_BASE_URL}/cart/clear`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const toggleFavorite = async (item: FavoriteItem) => {
    setFavorites((prev) => {
      return prev.some((fav) => fav.id === item.id)
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
    });
    if (token && userId) {
      await axios.post(`${API_BASE_URL}/cart/favorite`, { userId, item }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, favorites, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, toggleFavorite }}
    >
      {children}
    </CartContext.Provider>
  );
};