
// "use client";

// import { useCart } from "../lib/CartContext";
// import Link from "next/link";

// export default function CartPage() {
//   const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

//   const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);



//   return (
//     <section className="p-4">
//       <Link href="/">
//         <button className="text-blue-500 text-x  h-10 w-28 bg-white mb-4"> Home</button>
//       </Link>

//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {/* Cart Items */}
//           {cart.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center gap-4 mb-4 border-b pb-4"
//             >
//               <img
//                 src={item.thumbnail}
//                 alt={item.title}
//                 className="w-16 h-16 object-cover"
//               />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p className="text-gray-700">
//                   ₹{(item.price * item.quantity).toFixed(2)}
//                 </p>
//                  <p className="text-blue-600"> sotre name :{item.storeName}</p>
//                 <p>Description: {item.description}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <button
//                     className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
//                     onClick={() => decreaseQuantity(item.id)}
//                   >
//                     -
//                   </button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <button
//                     className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
//                     onClick={() => increaseQuantity(item.id)}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <button
//                   className="text-red-500 mt-2 block text-sm hover:underline"
//                   onClick={() => removeFromCart(item.id)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}

//           {/* Subtotal and Checkout Section */}
//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">Subtotal:</span>
//               <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <button
//               className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useCart } from "../lib/CartContext";
// import Link from "next/link";
// import Cookies from "js-cookie";

// export default function CartPage() {
//   const { cart: localCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
//   const [subtotal, setSubtotal] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const token = Cookies.get("token");
//     if (token) {
//       setIsLoggedIn(true);
//       fetchCartFromAPI(token);
//     } else {
//       setCart(localCart);
//       calculateSubtotal(localCart);
//     }
//   }, [localCart]);

//   const fetchCartFromAPI = async (token: string) => {
//     try {
//       const response = await fetch("http://localhost:4000/api/cart", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch cart");

//       const data = await response.json();

//       const formattedCart = data.products.map((item) => ({
//         id: item.product._id,
//         title: item.product.title,
//         price: item.product.price,
//         description: item.product.description,
//         thumbnail: item.product.image,
//         storeName: item.product.storeName,
//         quantity: item.quantity,
//       }));

//       setCart(formattedCart);
//       calculateSubtotal(formattedCart);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     }
//   };

//   const updateCartItemQuantity = async (productId: string, action: "increase" | "decrease") => {
//     if (!isLoggedIn) return;

//     try {
//       const response = await fetch(`http://localhost:4000/api/cart/${productId}/${action}`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("token")}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to update cart");

//       const updatedCart = await response.json();
//       setCart(
//         updatedCart.products.map((item) => ({
//           id: item.product._id,
//           title: item.product.title,
//           price: item.product.price,
//           description: item.product.description,
//           thumbnail: item.product.image,
//           storeName: item.product.storeName,
//           quantity: item.quantity,
//         }))
//       );
//       calculateSubtotal(updatedCart.products);
//     } catch (error) {
//       console.error("Error updating cart:", error);
//     }
//   };

//   const calculateSubtotal = (cartData) => {
//     const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     setSubtotal(total);
//   };

//   return (
//     <section className="p-4">
//       <Link href="/">
//         <button className="text-blue-500 h-10 w-28 bg-white mb-4">Home</button>
//       </Link>

//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cart.map((item) => (
//             <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
//               <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover" />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
//                 <p className="text-blue-600">Store name: {item.storeName}</p>
//                 <p>Description: {item.description}</p>

//                 {/* Quantity Controls */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <button
//                     className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
//                     onClick={() =>
//                       isLoggedIn
//                         ? updateCartItemQuantity(item.id, "decrease")
//                         : decreaseQuantity(item.id)
//                     }
//                     disabled={item.quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <button
//                     className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
//                     onClick={() =>
//                       isLoggedIn
//                         ? updateCartItemQuantity(item.id, "increase")
//                         : increaseQuantity(item.id)
//                     }
//                   >
//                     +
//                   </button>
//                 </div>

//                 {/* Remove Button */}
//                 {!isLoggedIn && (
//                   <button
//                     className="text-red-500 mt-2 block text-sm hover:underline"
//                     onClick={() => removeFromCart(item.id)}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Subtotal */}
//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">Subtotal:</span>
//               <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }





// "use client";

// import { useCart } from "../lib/CartContext";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function CartPage() {
//   const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
//   const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);

//   useEffect(() => {
//     // Load Razorpay script dynamically
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => setRazorpayLoaded(true);
//     document.body.appendChild(script);
//   }, []);

//   const handleCheckout = async () => {
//     if (!razorpayLoaded) {
//       alert("Razorpay SDK not loaded. Please try again.");
//       return;
//     }

//     const amountInPaisa = Math.round(subtotal * 100); // Convert amount to paisa

//     const response = await fetch("http://localhost:4000/api/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: amountInPaisa }),
//     });

//     const data = await response.json();
//     if (!data.success) {
//       alert("Error processing payment");
//       return;
//     }

//     const options = {
//       key: "rzp_test_R6FOPHx1TKb5wC",
//       amount: data.amount,
//       currency: "INR",
//       name: "My Store",
//       description: "Order Payment",
//       order_id: data.orderId,
//       handler: async function (response: any) {
//         const verifyResponse = await fetch("http://localhost:4000/api/payment-verify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(response),
//         });

//         const verifyData = await verifyResponse.json();
//         if (verifyData.success) {
//           alert("Payment successful!");
//         } else {
//           alert("Payment verification failed!");
//         }
//       },
//       prefill: { name: "Ankush Kumar", email: "ankush@example.com", contact: "9876543210" },
//       theme: { color: "#3399cc" },
//     };

//     const razor = new (window as any).Razorpay(options);
//     razor.open();
//   };


//   return (
//     <section className="p-4">
//       <Link href="/">
//         <button className="text-blue-500 text-x h-10 w-28 bg-white mb-4">Home</button>
//       </Link>

//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cart.map((item) => (
//             <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
//               <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover" />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
//                 <p className="text-blue-600">Store name: {item.storeName}</p>
//                 <p>Description: {item.description}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <button className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => decreaseQuantity(item.id)}> - </button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <button className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => increaseQuantity(item.id)}> + </button>
//                 </div>
//                 <button className="text-red-500 mt-2 block text-sm hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
//               </div>
//             </div>
//           ))}

//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">Subtotal:</span>
//               <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={handleCheckout}>
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }




// "use client";

// import { useCart } from "../lib/CartContext";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function CartPage() {
//   const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
//   const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => setRazorpayLoaded(true);
//     document.body.appendChild(script);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
//   };


//   const handleCheckout = async () => {
//     if (!razorpayLoaded) {
//       alert("Razorpay SDK not loaded. Please try again.");
//       return;
//     }

//     if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.address) {
//       alert("Please fill in all user details before proceeding.");
//       return;
//     }

//     const amountInPaisa = Math.round(subtotal * 100);
    
//     const response = await fetch("http://localhost:4000/api/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: amountInPaisa, userDetails, cart }),
//     });

//     const data = await response.json();
//     if (!data.success) {
//       alert("Error processing payment");
//       return;
//     }

//     const options = {
//       key: "rzp_test_R6FOPHx1TKb5wC",
//       amount: data.amount,
//       currency: "INR",
//       name: "My Store",
//       description: "Order Payment",
//       order_id: data.orderId,
//       handler: async function (response: any) {
//         const verifyResponse = await fetch("http://localhost:4000/api/payment-verify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...response, orderId: data.orderId }),
//         });

//         const verifyData = await verifyResponse.json();
//         if (verifyData.success) {
//           alert("Payment successful! Order confirmed.");
//         } else {
//           alert("Payment verification failed!");
//         }
//       },
//       prefill: { name: userDetails.name, email: userDetails.email, contact: userDetails.phone },
//       theme: { color: "#3399cc" },
//     };

//     const razor = new (window as any).Razorpay(options);
//     razor.open();
//   };

//   return (
//     <section className="p-4">
//       <Link href="/">
//         <button className="text-blue-500 text-x h-10 w-28 bg-white mb-4">Home</button>
//       </Link>

//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cart.map((item) => (
//             <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
//               <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover" />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
//                 <p className="text-blue-600">Store name: {item.storeName}</p>
//                 <p>Description: {item.description}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <button className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => decreaseQuantity(item.id)}> - </button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <button className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => increaseQuantity(item.id)}> + </button>
//                 </div>
//                 <button className="text-red-500 mt-2 block text-sm hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
//               </div>
//             </div>
//           ))}

//           {/* User Details Form */}
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
//             <input type="text" name="name" placeholder="Full Name" value={userDetails.name} onChange={handleChange} className="w-full p-2 border mb-2" />
//             <input type="email" name="email" placeholder="Email" value={userDetails.email} onChange={handleChange} className="w-full p-2 border mb-2" />
//             <input type="tel" name="phone" placeholder="Phone Number" value={userDetails.phone} onChange={handleChange} className="w-full p-2 border mb-2" />
//             <textarea name="address" placeholder="Shipping Address" value={userDetails.address} onChange={handleChange} className="w-full p-2 border mb-4"></textarea>
//           </div>

//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">Subtotal:</span>
//               <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={handleCheckout}>
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }




// "use client";

// import { useCart } from "../lib/CartContext";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function CartPage() {
//   const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
//   const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   const router = useRouter();

//   const handleCheckout = () => {
//     const query = new URLSearchParams();
//     query.append("subtotal", subtotal.toFixed(2));

//     cart.forEach((item, index) => {
//       query.append(`product[${index}][title]`, item.title);
//       query.append(`product[${index}][image]`, item.thumbnail);
//       query.append(`product[${index}][quantity]`, item.quantity.toString());
//     });

//     router.push(`/checkout?${query.toString()}`);
//   };

//   return (
//     <section className="p-4">
//       <Link href="/">
//         <button className="text-blue-500 text-x h-10 w-28 bg-white mb-4">Home</button>
//       </Link>

//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cart.map((item) => (
//             <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
//               <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover" />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
//                 <p className="text-blue-600">Store name: {item.storeName}</p>
//                 <p>Description: {item.description}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <button className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => decreaseQuantity(item.id)}> - </button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <button className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => increaseQuantity(item.id)}> + </button>
//                 </div>
//                 <button className="text-red-500 mt-2 block text-sm hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
//               </div>
//             </div>
//           ))}

//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">Subtotal:</span>
//               <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <button onClick={handleCheckout} className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
//               Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }






"use client";

import { useCart } from "../lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return; // Prevent checkout on empty cart

    const query = new URLSearchParams();
    query.append("subtotal", subtotal.toFixed(2));

    cart.forEach((item, index) => {
      query.append(`product[${index}][title]`, item.title);
      query.append(`product[${index}][image]`, item.thumbnail);
      query.append(`product[${index}][quantity]`, String(item.quantity)); // Convert to string explicitly
    });

    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <section className="p-6 max-w-3xl mx-auto">
      {/* Home Button */}
      <Link href="/">
        <button className="text-blue-600 text-sm font-semibold h-10 w-32 bg-white border border-blue-500 rounded-md hover:bg-blue-50">
          ⬅ Home
        </button>
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <Link href="/">
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 mb-6 border-b pb-4">
              <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-700 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-blue-600 text-sm">🏪 {item.storeName}</p>
                <p className="text-gray-500 text-sm">{item.description}</p>

                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => decreaseQuantity(item.id)}> - </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200" onClick={() => increaseQuantity(item.id)}> + </button>
                </div>

                <button className="text-red-500 mt-3 text-sm hover:underline" onClick={() => removeFromCart(item.id)}>
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}

          {/* Subtotal & Checkout */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className={`mt-4 w-full py-3 rounded text-white font-semibold ${cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`} 
              disabled={cart.length === 0}
            >
              ✅ Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
