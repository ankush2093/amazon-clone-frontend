// "use client"
// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';

// interface Product {
//   quantity: number;
// }

// interface Order {
//   date: string;
//   order_id: string;
//   order_status: string;
//   quantity: number;
//   price: number;
//   products: Product[];
// }

// const MyOrders: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const userToken = Cookies.get('token');
//     if (userToken) {
//       setToken(userToken);
//       fetchOrders(userToken);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchOrders = async (userToken: string) => {
//     try {
//       const response = await fetch('http://localhost:4000/api/my-orders', {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
//       console.log('API Response:', data); // Debugging
//       if (data.success) {
//         setOrders(data.orders);
//       } else {
//         console.error('Failed to fetch orders:', data);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (!token) return <div className="text-center py-4">Please log in to view your orders.</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         orders.map(order => (
//           <div key={order.order_id} className="border p-4 mb-4 rounded shadow-md">
//             <p className="text-lg font-medium">Order ID: {order.order_id}</p>
//             <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleString()}</p>
//             <p className="text-sm font-semibold">Status: {order.order_status}</p>
//             <p className="text-sm">Total Quantity: {order.quantity}</p>
//             <p className="text-sm">Total Price: ₹{order.price.toFixed(2)}</p>
//             <div className="mt-2">
//               <h4 className="font-semibold">Products:</h4>
//               <ul className="list-disc list-inside">
//                 {order.products.map((product, index) => (
//                   <li key={index}>Quantity: {product.quantity}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyOrders;


"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Product {
  product_id: string;
  title: string;
  image: string;
  quantity: number;
}

interface Order {
  date: string;
  order_id: string;
  order_status: string;
  quantity: number;
  price: number;
  products: Product[];
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userToken = Cookies.get("token");
    if (userToken) {
      setToken(userToken);
      fetchOrders(userToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (userToken: string) => {
    try {
      const response = await fetch("http://localhost:4000/api/my-orders", {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Failed to fetch orders:", data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!token) return <div className="text-center py-4">Please log in to view your orders.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="border p-4 mb-4 rounded shadow-md">
            <p className="text-lg font-medium">Order ID: {order.order_id}</p>
            <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleString()}</p>
            <p className="text-sm font-semibold">Status: {order.order_status}</p>
            <p className="text-sm">Total Quantity: {order.quantity}</p>
            <p className="text-sm">Total Price: ₹{order.price.toFixed(2)}</p>

            <div className="mt-4">
              <h4 className="font-semibold">Products:</h4>
              <ul className="space-y-3">
                {order.products.map((product, index) => (
                  <li key={index} className="flex items-center space-x-4 p-3 border rounded-md">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm">Quantity: {product.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
