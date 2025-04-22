import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  ClipboardList,
} from "lucide-react";
import DashboardCharts from "@/components/DashboardCharts";

export default async function Dashboard() {
  // Fetch recent invoices
  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true, organization: true },
  });

  // Fetch pending invoices count
  const pendingInvoices = await prisma.invoice.count({
    where: { status: "PENDING" },
  });

  // Fetch pending credit invoices
  const pendingCreditInvoices = await prisma.invoice.count({
    where: { status: "PENDING", invoiceType: "CREDIT" },
  });

  // Fetch pending debit invoices
  const pendingDebitInvoices = await prisma.invoice.count({
    where: { status: "PENDING", invoiceType: "DEBIT" },
  });

  // Fetch income (Debit - Credit)
  const debitTotal = await prisma.invoice.aggregate({
    _sum: { totalAmount: true },
    where: { invoiceType: "DEBIT" },
  });
  const creditTotal = await prisma.invoice.aggregate({
    _sum: { totalAmount: true },
    where: { invoiceType: "CREDIT" },
  });
  const income =
    (debitTotal._sum.totalAmount || 0) - (creditTotal._sum.totalAmount || 0);

  // Fetch monthly revenue for charts
  const monthlyRevenue = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "createdAt") AS month,
      "invoiceType",
      SUM("totalAmount") AS total
    FROM "Invoice"
    WHERE "createdAt" > NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', "createdAt"), "invoiceType"
    ORDER BY month ASC
  `;

  // Fix the line chart data processing
  const monthlyData = new Map();

  // First properly format each date and initialize structure
  for (const row of monthlyRevenue) {
    const date = new Date(row.month);
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData.has(monthYear)) {
      monthlyData.set(monthYear, { month: monthYear, Credit: 0, Debit: 0 });
    }

    // Add values
    const entry = monthlyData.get(monthYear);
    if (row.invoiceType === "CREDIT") {
      entry.Credit += Number(row.total);
    } else if (row.invoiceType === "DEBIT") {
      entry.Debit += Number(row.total);
    }
  }

  // Convert map to array and ensure chronological order
  const lineChartData = Array.from(monthlyData.values());

  // Data for bar chart
  const barChartData = [
    { name: "Credit", count: pendingCreditInvoices, color: "#4F46E5" },
    { name: "Debit", count: pendingDebitInvoices, color: "#DC2626" },
  ];

  // Data for pie chart
  const pieChartData = [
    {
      name: "Credit",
      value: creditTotal._sum.totalAmount || 0,
      color: "#4F46E5",
    },
    {
      name: "Debit",
      value: debitTotal._sum.totalAmount || 0,
      color: "#15803D",
    },
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Financial Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">
              Pending Invoices
            </h2>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            {pendingInvoices}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total pending approval</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">
              Pending Credit
            </h2>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ArrowUpCircle className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            {pendingCreditInvoices}
          </p>
          <p className="text-xs text-gray-500 mt-1">Receivables pending</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Pending Debit</h2>
            <div className="p-2 bg-[#15803D]/20 rounded-lg">
              <ArrowDownCircle className="w-5 h-5 text-[#15803D]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            {pendingDebitInvoices}
          </p>
          <p className="text-xs text-gray-500 mt-1">Payables pending</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Net Income</h2>
            <div
              className={`p-2 ${
                income >= 0 ? "bg-green-50" : "bg-red-50"
              } rounded-lg`}
            >
              {income >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-[#15803D]" />
              )}
            </div>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-bold ${
              income >= 0 ? "text-gray-800" : "text-red-600"
            }`}
          >
            {formatCurrency(income)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Debit - Credit</p>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts
        barChartData={barChartData}
        pieChartData={pieChartData}
        lineChartData={lineChartData}
      />

      {/* Recent Invoices */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Invoices
          </h2>
          <Link
            href="/dashboard/bills"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/bills/${invoice.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {invoice.customer?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        invoice.invoiceType === "CREDIT"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-[#15803D]/20 text-[#15803D]"
                      }`}
                    >
                      {invoice.invoiceType === "CREDIT" ? (
                        <ArrowUpCircle className="w-3 h-3" />
                      ) : (
                        <ArrowDownCircle className="w-3 h-3" />
                      )}
                      {invoice.invoiceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        invoice.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-[#15803D]"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card View */}
        <div className="sm:hidden space-y-4">
          {recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <Link
                  href={`/dashboard/bills/${invoice.id}`}
                  className="text-indigo-600 font-medium hover:text-indigo-900"
                >
                  #{invoice.invoiceNumber}
                </Link>
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    invoice.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-[#15803D]"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Customer</p>
                  <p className="font-medium text-gray-800">
                    {invoice.customer?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Type</p>
                  <p className="flex items-center gap-1 font-medium">
                    {invoice.invoiceType === "CREDIT" ? (
                      <ArrowUpCircle className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-[#15803D]" />
                    )}
                    <span
                      className={
                        invoice.invoiceType === "CREDIT"
                          ? "text-indigo-600"
                          : "text-[#15803D]"
                      }
                    >
                      {invoice.invoiceType}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Amount</p>
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(invoice.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
