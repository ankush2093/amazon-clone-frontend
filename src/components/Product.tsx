"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../lib/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  storeName: string;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart, favorites, toggleFavorite } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/product/products");
        const productData = response.data.products.map((p: any) => ({
          ...p,
          id: p._id, // Assign _id to id
        }));
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.image,
      quantity: 1,
      description: product.description,
      storeName: product.storeName,
    });

    toast.success(`${product.title} added to cart successfully! 🛒`);
  };

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.image,
      description: product.description,
    });

    const isFav = favorites.some((fav) => fav.id === product.id);
    toast.success(
      isFav ? `${product.title} removed from favorites 💔` : `${product.title} added to favorites ❤️`
    );
  };

  if (loading)
    return <p className="text-center text-lg font-semibold mt-10">🚀 Loading Products... Please wait!</p>;

  return (
    <div className="p-1 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-2xl font-bold mb-6 text-center">🛍️ Product List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
          >
            {/* Link to product details page */}
            <Link href={`/product/${product.id}`} className="block">
              <div className="w-full h-48 flex justify-center items-center cursor-pointer">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>

            <h3 className="text-lg font-semibold mt-3">{product.title}</h3>
            <p className="text-gray-700 mt-1">
              Price: <span className="font-bold">₹{product.price}</span>
            </p>
            <p className="text-sm text-gray-500">Category: {product.category}</p>
            <p className="text-sm text-yellow-500">
              ⭐ {product.rating.rate} ({product.rating.count} reviews)
            </p>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent link navigation
                  handleAddToCart(product);
                }}
                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition w-full justify-center"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent link navigation
                  handleToggleFavorite(product);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition w-full justify-center ${
                  favorites.some((fav) => fav.id === product.id) ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                <FaHeart /> {favorites.some((fav) => fav.id === product.id) ? "Favorited" : "Mark Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;








