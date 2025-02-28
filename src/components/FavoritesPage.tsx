"use client";

import { useCart } from "../lib/CartContext";
import Link from "next/link";

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useCart();

    return (
        <section className="p-4 max-w-4xl mx-auto">

            <h1 className="text-2xl font-bold mb-4 text-center">Your Favorites</h1>

            {favorites.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-500 text-center">No favorite items yet.</p><Link href="/">
                    <button className="text-white h-10 max-w-max items-center rounded-md bg-black hover:bg-slate-500 transition mb-4">
                        Continew Shopping
                    </button>
                </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {favorites.map((item) => (
                        <div
                            key={item.id}
                            className="w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition"
                        >
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full sm:w-32 h-32 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                    <p className="font-bold text-lg text-green-600 mt-2">₹{item.price}</p>
                                </div>
                                <button
                                    onClick={() => toggleFavorite(item)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                                >
                                    Remove
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
