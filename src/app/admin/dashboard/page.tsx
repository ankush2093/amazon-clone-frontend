"use client";

import PaymentDashboard from "@/components/PaymentDashboard";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

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
        const response = await fetch("https://amazon-colone-api.onrender.com/api/analytics"); // Adjust API path
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
      <h2 className="text-xl font-bold mb-4">Monthly & Daily Orders Overview</h2>
      <BarChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#2563eb" name="Orders" />
        <Bar dataKey="revenue" fill="#60a5fa" name="Revenue" />
      </BarChart>
      <PaymentDashboard/>
    </div>
  );
}






// "use client";

// import * as React from "react";
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";


// interface OrderData {
//   _id: {
//     year: number;
//     month: number;
//     day: number;
//   };
//   totalOrders: number;
//   totalRevenue: number;
// }

// interface ChartData {
//   date: string;
//   orders: number;
//   revenue: number;
// }

// const chartConfig = {
//   orders: {
//     label: "Orders",
//     color: "hsl(var(--chart-1))",
//   },
//   revenue: {
//     label: "Revenue",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig;

// export function OrdersDashboard() {
//   const [timeRange, setTimeRange] = React.useState("90d");
//   const [chartData, setChartData] = React.useState<ChartData[]>([]);

//   React.useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch("http://localhost:4000/api/analytics");
//         const result: { success: boolean; data: OrderData[] } = await response.json();

//         if (result.success) {
//           const formattedData: Record<string, ChartData> = result.data.reduce((acc, order) => {
//             const date = new Date(order._id.year, order._id.month - 1, order._id.day);
//             const key = date.toISOString().split("T")[0];

//             if (!acc[key]) {
//               acc[key] = { date: key, orders: 0, revenue: 0 };
//             }

//             acc[key].orders += order.totalOrders;
//             acc[key].revenue += order.totalRevenue;

//             return acc;
//           }, {} as Record<string, ChartData>);

//           setChartData(Object.values(formattedData));
//         }
//       } catch (error) {
//         console.error("Error fetching analytics:", error);
//       }
//     }

//     fetchData();
//   }, []);

//   const filteredData = chartData.filter((item) => {
//     const date = new Date(item.date);
//     const referenceDate = new Date();
//     let daysToSubtract = 90;
//     if (timeRange === "30d") {
//       daysToSubtract = 30;
//     } else if (timeRange === "7d") {
//       daysToSubtract = 7;
//     }
//     const startDate = new Date(referenceDate);
//     startDate.setDate(startDate.getDate() - daysToSubtract);
//     return date >= startDate;
//   });

//   return (
//     <Card>
//       <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
//         <div className="grid flex-1 gap-1 text-center sm:text-left">
//           <CardTitle>Orders & Revenue Overview</CardTitle>
//           <CardDescription>Showing data for the selected time range</CardDescription>
//         </div>
//         <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
//             <SelectValue placeholder="Last 3 months" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
//             <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
//             <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
//           <AreaChart data={filteredData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
//               }}
//             />
//             <YAxis />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//             <ChartLegend>
//               <ChartLegendContent className="flex flex-row gap-4" />
//             </ChartLegend>
//             <Area type="monotone" dataKey="orders" stroke="var(--color-orders)" fill="var(--color-orders)" />
//             <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
