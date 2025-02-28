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
