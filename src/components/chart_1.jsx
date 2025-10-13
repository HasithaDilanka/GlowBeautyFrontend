import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

// Enhanced color palette with gradients
const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16"  // Lime
];

// Enhanced custom tooltip with animations
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/50 transform transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-semibold text-gray-800">{data.payload.name}</p>
        </div>
        <p className="text-sm text-gray-600">Count: <span className="font-bold text-blue-600">{data.value}</span></p>
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(data.value / 100) * 100}%` }}
          />
        </div>
      </div>
    );
  }
  return null;
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-[420px]">
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div 
              className="bg-gradient-to-t from-gray-200 to-gray-100 rounded-t"
              style={{ 
                height: `${Math.random() * 200 + 50}px`,
                width: '60px'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function Chart1() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const fetchProductAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/products/analytics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.log("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned HTML instead of JSON. Please check if the analytics endpoint exists.");
      }

      const analyticsData = await response.json();
      setData(analyticsData && analyticsData.length > 0 ? analyticsData : []);
    } catch (error) {
      console.error("Error fetching product analytics:", error);
      setError(error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAnalytics();
  }, []);

  const totalProducts = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = data.length > 0 ? Math.max(...data.map(item => item.value)) : 100;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-[420px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-500 text-2xl">⚠️</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Data</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{error}</p>
          <button
            onClick={fetchProductAnalytics}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-[420px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">📊</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">Add some products to see the analytics</p>
          <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            Waiting for data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-[360px] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-50 to-blue-50 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Products
          </h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{totalProducts}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Total Products</div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative z-10" style={{ height: 'calc(100% - 10px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            onMouseEnter={() => setHoveredBar(true)}
            onMouseLeave={() => setHoveredBar(false)}
          >
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            />
            <YAxis 
              domain={[0, Math.max(maxValue + 10, 100)]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
            <Legend />
            
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              className="transition-all duration-300"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{
                    filter: hoveredBar ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 'none'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
