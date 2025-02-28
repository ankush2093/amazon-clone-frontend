"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import cartIcon from "../../../public/images/cartIcon.png";
import logo from "../../../public/images/logo.png";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineSearch } from "react-icons/hi";
import { BiCaretDown } from "react-icons/bi";
import { useCart } from "@/lib/CartContext"; 
import axios from "axios";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  title: string;
}

const Header = () => {
  const { cart, favorites } = useCart();
  const cartCount = Array.isArray(cart) ? new Set(cart.map(item => item.id)).size : 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/product/products");
        setProducts(response.data.products.map((p: any) => ({ id: p._id, title: p.title })));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const matchedProduct = products.find((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedProduct) {
        router.push(`/product/${matchedProduct.id}`);
        setShowSuggestions(false);
      } else {
        alert("Product not found!");
      }
    }
  };

  const handleSuggestionClick = (product: Product) => {
    router.push(`/product/${product.id}`);
    setSearchQuery(product.title);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full h-20 bg-amazon_blue text-lightText sticky top-0 z-50 bg-slate-950">
      <div className="h-full w-full mx-auto flex items-center justify-between px-4 gap-2">
        {/* Logo */}
        <Link href="/" className="px-2 border-transparent hover:border-white cursor-pointer duration-300 flex items-center">
          <Image className="object-cover mt-1" src={logo} alt="logoImg" width={112} height={28} />
        </Link>

        {/* Delivery Location */}
        <div className="px-2 border-transparent hover:border-white cursor-pointer hidden xl:flex gap-1 items-center">
          <SlLocationPin className="text-blue-100 text-xl" />
          <div className="text-xs">
            <p className="text-slate-400 font-semibold">Deliver to</p>
            <p className="text-white font-bold">India</p>
          </div>
        </div>

        {/* Search Bar with Suggestions */}
        <div className="flex-1 h-10 hidden md:flex items-center relative">
          <input
            className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-3 border-transparent outline-none focus:border-amazon_yellow"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delayed to allow click event
          />
          <span className="w-12 h-full bg-yellow-500 flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md text-2xl">
            <HiOutlineSearch />
          </span>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <ul className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 max-h-40 overflow-y-auto z-50">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-black"
                  onMouseDown={() => handleSuggestionClick(product)} // onMouseDown to prevent blur before click
                >
                  {product.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Account */}
        <div className="text-xs text-gray-100 flex flex-col justify-center px-2 border-transparent hover:border-white cursor-pointer duration-300">
          <p>Hello, sign in</p>
          <p className="text-white font-bold flex items-center">
            Account & Lists <BiCaretDown />
          </p>
        </div>

        {/* Favorites */}
        <Link href="/favorite" className="text-xs text-gray-100 flex flex-col justify-center px-2 border-transparent hover:border-white cursor-pointer duration-300 relative">
          <p>Marked</p>
          <p className="text-white font-bold">Favorite</p>
          {favorites.length > 0 && (
            <span className="absolute right-0 top-0 w-4 h-4 bg-yellow-500 text-black text-xs flex items-center justify-center rounded-full">
              {favorites.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link href="/cart" className="flex items-center px-2 border-transparent hover:border-white cursor-pointer duration-300 relative">
          <Image className="object-cover h-8" src={cartIcon} alt="cartImg" width={32} height={32} />
          <p className="text-xs text-white font-bold mt-3">Cart</p>
          {cartCount > 0 && (
            <span className="absolute text-yellow-600 text-lg bottom-2 left-[22px] font-semibold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Header;


