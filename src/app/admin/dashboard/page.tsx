"use client";

import PaymentDashboard from "@/components/PaymentDashboard";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface OrderData {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  totalOrders: number;
  totalRevenue: number;
}

interface ChartData {
  name: string;
  orders: number;
  revenue: number;
}

export default function OrdersDashboard() {
  const [chartData, setChartData] = useState<ChartData[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${baseUrl}/analytics`); 
        const result: { success: boolean; data: OrderData[] } = await response.json();

        if (result.success) {
          const formattedData: Record<string, ChartData> = result.data.reduce((acc, order) => {
            const date = new Date(order._id.year, order._id.month - 1, order._id.day);
            const key = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

            if (!acc[key]) {
              acc[key] = { name: key, orders: 0, revenue: 0 };
            }

            acc[key].orders += order.totalOrders;
            acc[key].revenue += order.totalRevenue;

            return acc;
          }, {} as Record<string, ChartData>);

          setChartData(Object.values(formattedData));
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    }

    fetchData();
  }, []);

  if (!chartData) {
    return <p className="text-center text-gray-500">Loading chart...</p>; // Prevents hydration mismatch
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Orders Overview</h2>
      
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#2563eb" name="Orders" />
              <Bar dataKey="revenue" fill="#60a5fa" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <PaymentDashboard />
    </div>
  );
}




