// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


// interface Product {
//     title: string;
//     image: string;
//     quantity: number;
//     storeName: string;
//     price: number;

// }

// interface Address {
//     fullName: string;
//     email: string;
//     phone: string;
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
// }

// export default function CheckoutPage() {
//     const searchParams = useSearchParams();
//     const subtotal = parseFloat(searchParams.get("subtotal") || "0.00");
//     const [token, setToken] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
//     const [products, setProducts] = useState<Product[]>([]);
//     const [address, setAddress] = useState<Address>({
//         fullName: "",
//         email: "",
//         phone: "",
//         street: "",
//         city: "",
//         state: "",
//         zipCode: "",
//         country: "",
//     });

//     useEffect(() => {
//         const storedToken = Cookies.get("token");
//         if (storedToken) {
//             setToken(storedToken);
//         } else {
//             toast.error("You need to log in to proceed with checkout.");
//         }

//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => setRazorpayLoaded(true);
//         document.body.appendChild(script);

//         const fetchedProducts: Product[] = [];
//         let index = 0;
//         while (searchParams.get(`product[${index}][title]`)) {
//             console.log("Sore:", searchParams.get(`product[${index}][storeName]`));
//             console.log("Price", searchParams.get(`product[${index}][price]`));
//             console.log("cartvalue"+localStorage.getItem("cart"));
//             fetchedProducts.push({
//                 title: searchParams.get(`product[${index}][title]`) || "",
//                 image: searchParams.get(`product[${index}][image]`) || "",
//                 quantity: Number(searchParams.get(`product[${index}][quantity]`) || 0),
//                 storeName: searchParams.get(`product[${index}][storeName]`) || "",
//                 price: parseFloat(searchParams.get(`product[${index}][price]`) || "0.00"),
//             });
//             index++;
//         }
//         setProducts(fetchedProducts);
//     }, [searchParams]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setAddress((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleProceedToPayment = async () => {
//         if (!razorpayLoaded) {
//             toast.error("Razorpay SDK not loaded. Please try again.");
//             return;
//         }
//         if (!token) {
//             toast.error("User is not authenticated. Please log in.");
//             return;
//         }
//         if (!Object.values(address).every((value) => value.trim() !== "")) {
//             toast.error("Please fill in all address details before proceeding.");
//             return;
//         }
//         if (products.length === 0) {
//             toast.error("No products found in the cart.");
//             return;
//         }

//         setLoading(true);

//         try {
//             const amount = Math.round(subtotal * 100);

//             if (isNaN(amount) || amount <= 0) {
//                 toast.error("Invalid amount. Please check your subtotal.");
//                 setLoading(false);
//                 return;
//             }

//             console.log("Amount sent to backend:", amount);
//             console.log("Cart:", products);
//             console.log("Address:", address);

//             const { data } = await axios.post(
//                 `${baseUrl}/checkout`,
//                 { amount, cart: products, address },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                     withCredentials: true,
//                 }
//             );

//             if (!data.success) {
//                 toast.error("Failed to create order");
//                 setLoading(false);
//                 return;
//             }

//             const { orderId } = data;

//             const razorpay = new (window as any).Razorpay({
//                 key: "rzp_test_R6FOPHx1TKb5wC",
//                 amount,
//                 currency: "INR",
//                 name: "My Store",
//                 description: "Order Payment",
//                 order_id: orderId,
//                 handler: async function (response: any) {
//                     const verifyRes = await axios.post(
//                         `${baseUrl}/payment-verify`,
//                         {
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                         },
//                         {
//                             headers: { Authorization: `Bearer ${token}` },
//                             withCredentials: true,
//                         }
//                     );

//                     if (verifyRes.data.success) {
//                         toast.success("Payment successful! Order placed.");
//                         window.location.href = "/my-orders"; // Redirect after successful payment
//                     } else {
//                         toast.error("Payment verification failed.");
//                     }
//                     // if (verifyRes.data.success) {
//                     //     toast.success("Payment successful! Order placed.");
//                     // } else {
//                     //     toast.error("Payment verification failed.");
//                     // }
//                 },
//                 prefill: { name: address.fullName, email: address.email, contact: address.phone },
//                 theme: { color: "#3399cc" },
//             });

//             razorpay.open();
//         } catch (error) {
//             console.error("Checkout Error:", error);
//             toast.error("Something went wrong!");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <section className="p-4">
//             <ToastContainer position="top-right" autoClose={3000} />
//             <h1 className="text-2xl font-bold mb-4">Checkout</h1>
//             <div className="border p-4 rounded-lg mb-6">
//                 <h2 className="text-lg font-semibold">Order Summary</h2>
//                 {products.length > 0 ? (
//                     products.map((product, i) => (
//                         <div key={i} className="flex items-center gap-4 border-b pb-4 mt-4">
//                             <img src={product.image} alt={product.title} className="w-16 h-16 object-cover" />
//                             <div>
//                                 <h3 className="font-semibold">{product.title}</h3>
//                                 <p className="text-gray-700">Quantity: {product.quantity}</p>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-gray-500">No products in the cart.</p>
//                 )}
//                 <div className="flex justify-between mt-4">
//                     <span className="text-lg font-semibold">Subtotal:</span>
//                     <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
//                 </div>
//             </div>
//             <div className="border p-4 rounded-lg">
//                 <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.keys(address).map((key) => (
//                         <input
//                             key={key}
//                             type="text"
//                             name={key === "zip" ? "zipCode" : key}
//                             placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                             value={(address as any)[key]}
//                             onChange={handleChange}
//                             className="border p-2 rounded w-full"
//                             required
//                         />
//                     ))}
//                 </div>
//                 <button
//                     onClick={handleProceedToPayment}
//                     className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                     disabled={loading}
//                 >
//                     {loading ? "Processing..." : "Proceed to Payment"}
//                 </button>
//             </div>
//         </section>
//     );
// }






"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


interface Product {
    title: string;
    image: string;
    quantity: number;
    price: number;
    storeName: string;

}

interface Address {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const subtotal = parseFloat(searchParams.get("subtotal") || "0.00");
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [address, setAddress] = useState<Address>({
        fullName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

    useEffect(() => {
        const storedToken = Cookies.get("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            toast.error("You need to log in to proceed with checkout.");
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        const fetchedProducts: Product[] = [];
        let index = 0;
        while (searchParams.get(`product[${index}][title]`)) {
            fetchedProducts.push({
                title: searchParams.get(`product[${index}][title]`) || "",
                image: searchParams.get(`product[${index}][image]`) || "",
                quantity: Number(searchParams.get(`product[${index}][quantity]`) || 0),
                storeName: searchParams.get(`product[${index}][storeName]`) || "",
                price: parseFloat(searchParams.get(`product[${index}][price]`) || "0.00"),

            });
            index++;
        }
        setProducts(fetchedProducts);
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleProceedToPayment = async () => {
        if (!razorpayLoaded) {
            toast.error("Razorpay SDK not loaded. Please try again.");
            return;
        }
        if (!token) {
            toast.error("User is not authenticated. Please log in.");
            return;
        }
        if (!Object.values(address).every((value) => value.trim() !== "")) {
            toast.error("Please fill in all address details before proceeding.");
            return;
        }
        if (products.length === 0) {
            toast.error("No products found in the cart.");
            return;
        }

        setLoading(true);

        try {
            const amount = Math.round(subtotal * 100);
            console.log("Amount being sent to Razorpay:", amount);
            if (isNaN(amount) || amount <= 0) {
                toast.error("Invalid amount. Please check your subtotal.");
                setLoading(false);
                return;
            }

            // console.log("Amount sent to backend:", amount);
            // console.log("Cart:", products);
            // console.log("Address:", address);

            const { data } = await axios.post(
                `${baseUrl}/checkout`,
                { amount, cart: products, address },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (!data.success) {
                toast.error("Failed to create order");
                setLoading(false);
                return;
            }

            const { orderId } = data;

            const razorpay = new (window as any).Razorpay({
                key: "rzp_test_R6FOPHx1TKb5wC",
                amount,
                currency: "INR",
                name: "My Store",
                description: "Order Payment",
                order_id: orderId,
                handler: async function (response: any) {
                    const verifyRes = await axios.post(
                        `${baseUrl}/payment-verify`,
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );

                    if (verifyRes.data.success) {
                        toast.success("Payment successful! Order placed.");
                        window.location.href = "/my-orders"; // Redirect after successful payment
                    } else {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: { name: address.fullName, email: address.email, contact: address.phone },
                theme: { color: "#3399cc" },
            });

            razorpay.open();
        } catch (error) {
            console.error("Checkout Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="border p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                {products.length > 0 ? (
                    products.map((product, i) => (
                        <div key={i} className="flex items-center gap-4 border-b pb-4 mt-4">
                            <img src={product.image} alt={product.title} className="w-16 h-16 object-cover" />
                            <div>
                                <h3 className="font-semibold">{product.title}</h3>
                                <p className="text-gray-700">Quantity: {product.quantity}</p>
                                <p className="text-gray-700">Price: {product.price}</p>

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No products in the cart.</p>
                )}
                <div className="flex justify-between mt-4">
                    <span className="text-lg font-semibold">Subtotal:</span>
                    <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
            </div>
            <div className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(address).map((key) => (
                        <input
                            key={key}
                            type="text"
                            name={key === "zip" ? "zipCode" : key}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={(address as any)[key]}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    ))}
                </div>
                <button
                    onClick={handleProceedToPayment}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Proceed to Payment"}
                </button>
            </div>
        </section>
    );
}