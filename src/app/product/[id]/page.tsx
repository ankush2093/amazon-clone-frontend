"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCart } from "../../../lib/CartContext";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductComponent from "../../../components/ProductComponent";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Product {
  id: number;
  storeName: string;
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

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart, favorites, toggleFavorite } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl }/product/${id}`);
        setProduct({ ...response.data, id: response.data._id });
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center text-lg font-semibold mt-10">🔄 Loading Product...</p>;

  if (!product) return <p className="text-center text-lg font-semibold mt-10">❌ Product not found!</p>;

  const handleAddToCart = () => {
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

  const handleToggleFavorite = () => {
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

  return (
    <>
    <div className="p-4 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-96 flex justify-center items-center">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-md" />
        </div>

        <div>
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <h3 className="text-1xl font-bold text-blue-600 cursor: pointer">Store: {product.storeName}</h3>
          <p className="text-xl text-gray-700 mt-2">Price: <span className="font-bold">₹{product.price}</span></p>
          <p className="text-gray-500 mt-2">{product.description}</p>
          <p className="text-sm text-yellow-500 mt-2">⭐ {product.rating.rate} ({product.rating.count} reviews)</p>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full justify-center"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition w-full justify-center ${
                favorites.some((fav) => fav.id === product.id) ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <FaHeart /> {favorites.some((fav) => fav.id === product.id) ? "Favorited" : "Mark Favorite"}
            </button>
          </div>
        </div>
      </div>


   
    </div>
    <ProductComponent />
      
    </>
  );
};

export default ProductDetail;
