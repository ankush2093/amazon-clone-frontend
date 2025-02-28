

// "use client";

// import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// export interface CartItem {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   quantity: number;
//   description: string;
//   storeName: string;
// }

// export interface FavoriteItem {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   description?: string;
// }

// interface CartContextType {
//   cart: CartItem[];
//   favorites: FavoriteItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: number) => void;
//   increaseQuantity: (id: number) => void;
//   decreaseQuantity: (id: number) => void;
//   clearCart: () => void;
//   toggleFavorite: (item: FavoriteItem) => void;
// }

// const CartContext = createContext<CartContextType | null>(null);

// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

// export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const isUserLoggedIn = !!Cookies.get("token");
//   const updateTimeout = useRef<NodeJS.Timeout | null>(null);

//   const API_URL = "http://localhost:4000/api";

//   /** 🟢 Fetch cart and favorites on mount */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (isUserLoggedIn) {
//           const [cartResponse, favoritesResponse] = await Promise.all([
//             axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }),
//             axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }),
//           ]);

//           setCart(cartResponse.data || []);
//           setFavorites(Array.isArray(favoritesResponse.data) ? favoritesResponse.data : []);
//         } else {
//           setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
//           setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
//         }
//       } catch (error) {
//         console.error("Error fetching cart and favorites:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [isUserLoggedIn]);

//   /** 🟢 Debounced API update for cart */
//   const updateCart = () => {
//     if (!isLoading && isUserLoggedIn) {
//       if (updateTimeout.current) clearTimeout(updateTimeout.current);
//       updateTimeout.current = setTimeout(() => {
//         axios
//           .put(`${API_URL}/cart`, { cart }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } })
//           .catch((err) => console.error("Error updating cart:", err));
//       }, 1000);
//     } else {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   };

//   useEffect(() => {
//     updateCart();
//   }, [cart]);

//   /** 🟢 Debounced API update for favorites */
//   const updateFavorites = () => {
//     if (!isLoading && isUserLoggedIn) {
//       if (updateTimeout.current) clearTimeout(updateTimeout.current);
//       updateTimeout.current = setTimeout(() => {
//         axios
//           .put(`${API_URL}/favorites`, { favorites }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } })
//           .catch((err) => console.error("Error updating favorites:", err));
//       }, 1000);
//     } else {
//       localStorage.setItem("favorites", JSON.stringify(favorites));
//     }
//   };

//   useEffect(() => {
//     updateFavorites();
//   }, [favorites]);

//   /** 🛒 Cart Functions */
//   const addToCart = async (item: CartItem) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.post(`${API_URL}/cart/add`, { productId: item.id, quantity: 1 }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error adding to cart:", error);
//         return;
//       }
//     }
//     setCart((prev) => {
//       const existingItem = prev.find((cartItem) => cartItem.id === item.id);
//       return existingItem
//         ? prev.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem))
//         : [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = async (id: number) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.delete(`${API_URL}/cart/${id}`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error removing from cart:", error);
//         return;
//       }
//     }
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const increaseQuantity = async (id: number) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.patch(`${API_URL}/cart/${id}/increase`, {}, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error increasing quantity:", error);
//         return;
//       }
//     }
//     setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
//   };

//   const decreaseQuantity = async (id: number) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.patch(`${API_URL}/cart/${id}/decrease`, {}, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error decreasing quantity:", error);
//         return;
//       }
//     }
//     setCart((prev) =>
//       prev
//         .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const clearCart = async () => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.delete(`${API_URL}/cart/clear`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error clearing cart:", error);
//         return;
//       }
//     }
//     setCart([]);
//   };

//   const toggleFavorite = (item: FavoriteItem) => {
//     setFavorites((prev) => {
//       const favArray = Array.isArray(prev) ? prev : [];
//       return favArray.some((fav) => fav.id === item.id) ? favArray.filter((fav) => fav.id !== item.id) : [...favArray, item];
//     });
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return <CartContext.Provider value={{ cart, favorites, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, toggleFavorite }}>{children}</CartContext.Provider>;
// };








// "use client";

// import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// export interface CartItem {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   quantity: number;
//   description: string;
//   storeName: string;
// }

// export interface FavoriteItem {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   description?: string;
// }

// interface CartContextType {
//   cart: CartItem[];
//   favorites: FavoriteItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: number) => void;
//   increaseQuantity: (id: number) => void;
//   decreaseQuantity: (id: number) => void;
//   clearCart: () => void;
//   toggleFavorite: (item: FavoriteItem) => void;
// }

// const CartContext = createContext<CartContextType | null>(null);

// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

// export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const isUserLoggedIn = !!Cookies.get("token");
//   const updateTimeout = useRef<NodeJS.Timeout | null>(null);

//   const API_URL = "http://localhost:4000/api";

//   /** 🟢 Fetch cart and favorites on mount */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (isUserLoggedIn) {
//           console.log("Fetching cart, token:", Cookies.get("token"));

//           const [cartResponse, favoritesResponse] = await Promise.all([
//             axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }),
//             // axios.get(`${API_URL}/cart`, { withCredentials: true });
//             axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }),
//           ]);

//           setCart(cartResponse.data || []);
//           setFavorites(Array.isArray(favoritesResponse.data) ? favoritesResponse.data : []);
//         } else {
//           setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
//           setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
//         }
//       } catch (error) {
//         console.error("Error fetching cart and favorites:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [isUserLoggedIn]);

//   /** 🟢 Debounced API update for cart */
//   const updateCart = () => {
//     if (!isLoading && isUserLoggedIn) {
//       if (updateTimeout.current) clearTimeout(updateTimeout.current);
//       updateTimeout.current = setTimeout(() => {
//         axios
//           .put(`${API_URL}/cart`, { cart }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } })
//           .catch((err) => console.error("Error updating cart:", err));
//       }, 1000);
//     } else {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   };

//   useEffect(() => {
//     updateCart();
//   }, [cart]);

//   /** 🟢 Debounced API update for favorites */
//   const updateFavorites = () => {
//     if (!isLoading && isUserLoggedIn) {
//       if (updateTimeout.current) clearTimeout(updateTimeout.current);
//       updateTimeout.current = setTimeout(() => {
//         axios
//           .put(`${API_URL}/favorites`, { favorites }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } })
//           .catch((err) => console.error("Error updating favorites:", err));
//       }, 1000);
//     } else {
//       localStorage.setItem("favorites", JSON.stringify(favorites));
//     }
//   };

//   useEffect(() => {
//     updateFavorites();
//   }, [favorites]);

//   /** 🛒 Cart Functions */
//   const addToCart = async (item: CartItem) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.post(`${API_URL}/cart/add`, { productId: item.id, quantity: 1 }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error adding to cart:", error);
//         return;
//       }
//     }
//     setCart((prev) => {
//       const existingItem = prev.find((cartItem) => cartItem.id === item.id);
//       return existingItem
//         ? prev.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem))
//         : [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = async (id: number) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.delete(`${API_URL}/cart/${id}`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error removing from cart:", error);
//         return;
//       }
//     }
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const increaseQuantity = async (id: number) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.patch(`${API_URL}/cart/${id}/increase`, {}, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error increasing quantity:", error);
//         return;
//       }
//     }
//     setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
//   };

//   const decreaseQuantity = async (id: number) => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.patch(`${API_URL}/cart/${id}/decrease`, {}, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error decreasing quantity:", error);
//         return;
//       }
//     }
//     setCart((prev) =>
//       prev
//         .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const clearCart = async () => {
//     if (isUserLoggedIn) {
//       try {
//         await axios.delete(`${API_URL}/cart/clear`, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
//       } catch (error) {
//         console.error("Error clearing cart:", error);
//         return;
//       }
//     }
//     setCart([]);
//   };

//   const toggleFavorite = (item: FavoriteItem) => {
//     setFavorites((prev) => {
//       const favArray = Array.isArray(prev) ? prev : [];
//       return favArray.some((fav) => fav.id === item.id) ? favArray.filter((fav) => fav.id !== item.id) : [...favArray, item];
//     });
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return <CartContext.Provider value={{ cart, favorites, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, toggleFavorite }}>{children}</CartContext.Provider>;
// };





"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  /** 🟢 Fetch cart and favorites from local storage on mount */
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
  }, []);

  /** 🟢 Save cart and favorites to local storage on change */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  /** 🛒 Cart Functions */
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      return existingItem
        ? prev.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      return prev.some((fav) => fav.id === item.id)
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, favorites, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, toggleFavorite }}
    >
      {children}
    </CartContext.Provider>
  );
};

