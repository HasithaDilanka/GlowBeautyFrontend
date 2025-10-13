import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Colors for the 5 categories only
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a020f0"];

export default function Chart2() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProductsSold: 0,
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login.");
      }

      const response = await fetch(
        "http://localhost:3000/api/sales/chart-data", 
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        } else if (response.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        } else {
          throw new Error(`Failed to fetch sales data: ${response.statusText}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        // Backend already ensures we get the exact 5 categories
        setData(result.chartData);
        setDateRange(result.dateRange);
        setSummary(result.summary);

        console.log("Chart data from backend:", result.chartData);
      } else {
        throw new Error(result.message || "Failed to fetch sales data");
      }
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setError(err.message);

      setData([
        { product: "Cream", count: 0 },
        { product: "Face Wash", count: 0 },
        { product: "Powder", count: 0 },
        { product: "Serum", count: 0 },
        { product: "Lipstick", count: 0 },
      ]);
      setSummary({ totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 });
    } finally {
      setLoading(false);
    }
  };

  const formatTooltipContent = (value, name) => {
    return [`${value} units sold`, "Quantity"];
  };

  const handleRetry = () => {
    fetchSalesData();
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full h-[450px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <div className="text-gray-500">Loading sales data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full h-[360px]">
      {/* Header with title and date range */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Products Sold (Past 7 Days)
        </h2>
        {dateRange.startDate && dateRange.endDate && (
          <p className="text-sm text-gray-500">
            {dateRange.startDate} to {dateRange.endDate}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      {!error && summary && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Total Orders</p>
            <p className="text-lg font-semibold text-blue-700">
              {summary.totalOrders}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Products Sold</p>
            <p className="text-lg font-semibold text-green-700">
              {summary.totalProductsSold}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Total Revenue</p>
            <p className="text-lg font-semibold text-purple-700">
              Rs.{summary.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
            {error.includes("Authentication") && (
              <button
                onClick={handleLogin}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="relative" style={{ height: error ? "200px" : "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={50}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="product"
              tick={{ fontSize: 12, fill: "#666" }}
              angle={-15}
              textAnchor="end"
              height={60}
              stroke="#ccc"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666" }}
              stroke="#ccc"
              label={{
                value: "Units Sold",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                style: { fill: "#374151", fontSize: 12, fontWeight: 500 },
              }}
            />
            <Tooltip
              formatter={formatTooltipContent}
              labelStyle={{ color: "#374151", fontWeight: "500" }}
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="count" name="Units Sold" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {data.every((item) => item.count === 0) && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">
              No sales data available for the past 7 days
            </p>
          </div>
        )}
      </div>
    </div>
  );
}