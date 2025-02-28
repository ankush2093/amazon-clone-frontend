"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  title: string;
  image: string;
  quantity: number;
};

type Address = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Order = {
  order_id: string;
  order_status: string;
  price: number;
  user: {
    email: string;
  };
  products: Product[];
  address: Address;
};

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");

  const handleAddProduct = async () => {
    try {
      const response = await fetch("https://amazon-colone-api.onrender.com/api/product", {
        method: "GET",
      });

      const data = await response.json();
      setMessage(data.message); // Set message from API response
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Failed to add product.");
    }
  };

  useEffect(() => {
    fetch('https://amazon-colone-api.onrender.com/api/all-orders')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 overflow-x-auto">
      <div className="bg-slate-500 p-4 flex justify-between items-center flex-wrap">
        <Link href="/admin/add-product">
          <button className="bg-green-700 text-white px-4 py-2 rounded-lg">Product Management</button>
        </Link>
        <Link href="/admin/dashboard">
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg">Dashboard</button>
        </Link>

        <div>
          <button
            onClick={handleAddProduct}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Product From API
          </button>

          {message && <p className="mt-2 text-green-500">{message}</p>}
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User Email</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total Price (INR)</th>
                <th className="border p-2">Products</th>
                <th className="border p-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="border">
                  <td className="border p-2">{order.order_id}</td>
                  <td className="border p-2">{order.user.email}</td>
                  <td className="border p-2">{order.order_status}</td>
                  <td className="border p-2">₹{order.price.toFixed(2)}</td>
                  <td className="border p-2">
                    <ul>
                 
                      {order.products.map((product, index) => (
                        
                        <li key={index} className="flex items-center gap-2">
                          {/* <img src={product.image} alt={product.title} className="w-12 h-12" /> */}
                          <Image
                            className="h-12 w-12 hr"
                            src={product.image}
                            alt={product.title}
                            width={40}
                            height={40}
                          />
                             <hr className="w-4 h-0.5 my-8 bg-blue-800 border-0 rounded-sm dark:bg-gray-700"></hr>
                          {product.title} ({product.quantity})
                        </li>
                      ))}
                     
                    </ul>
                  </td>
                  <td className="border p-2">
                    Name: {order.address.fullName}, Mobile:{order.address.phone}, Address: {order.address.street}, City: {order.address.city}, State: {order.address.state}, PinCode: {order.address.zipCode},Country: {order.address.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
