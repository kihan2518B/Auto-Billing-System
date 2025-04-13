"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface DashboardChartsProps {
  barChartData: { name: string; count: number; color: string }[];
  pieChartData: { name: string; value: number; color: string }[];
  lineChartData: { month: string; Credit: number; Debit: number }[];
}

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.dataKey === "count"
              ? entry.value
              : formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({
  barChartData,
  pieChartData,
  lineChartData,
}: DashboardChartsProps) {
  // Fix and sort the line chart data chronologically
  const processedLineChartData = useMemo(() => {
    // Convert month string to Date objects for proper sorting
    const monthOrder = lineChartData.map((item) => {
      const [month, year] = item.month.split(" ");
      const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getTime();
      return { ...item, monthIndex };
    });

    // Sort by date (oldest to newest)
    return monthOrder
      .sort((a, b) => a.monthIndex - b.monthIndex)
      .map(({ month, Credit, Debit }) => ({
        month,
        Credit,
        Debit,
        Total: Credit + Debit,
      }));
  }, [lineChartData]);

  // Calculate total for the pie chart for percentage calculation
  const totalPieValue = pieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Bar Chart: Pending Invoices */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Pending Invoices
        </h2>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 20, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {barChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    fillOpacity={0.9}
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Revenue Distribution */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Revenue Distribution
        </h2>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                animationDuration={1500}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Revenue Over Time (replacing Line Chart) */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 lg:col-span-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Revenue Over Time
        </h2>
        <div className="h-72 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedLineChartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Area
                type="monotone"
                dataKey="Credit"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorCredit)"
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="Debit"
                stroke="#DC2626"
                fillOpacity={1}
                fill="url(#colorDebit)"
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
