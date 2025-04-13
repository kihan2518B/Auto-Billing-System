// "use client";

// import { User } from "@supabase/supabase-js";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import Link from "next/link";
// import React from "react";
// import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

// async function GetInvoices() {
//   const res = await axios.get("/api/invoices");
//   return res.data.invoices;
// }

// export default function InvoicesList({ user }: { user: User }) {
//   const { data: invoices, isLoading } = useQuery({
//     queryKey: ["invoices"],
//     queryFn: GetInvoices,
//     enabled: !!user,
//   });

//   return (
//     <div className="mt-8 max-w-5xl mx-auto px-4 sm:px-6">
//       <h2 className="text-2xl font-semibold text-neutral-heading mb-4">
//         Recent Invoices
//       </h2>

//       {/* Desktop: Table View */}
//       <div className="hidden sm:block bg-neutral-white shadow rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-neutral-light">
//               <th className="px-4 py-3 text-left text-neutral-text text-sm font-medium">
//                 Invoice Number
//               </th>
//               <th className="px-4 py-3 text-left text-neutral-text text-sm font-medium">
//                 Customer
//               </th>
//               <th className="px-4 py-3 text-left text-neutral-text text-sm font-medium">
//                 Organization
//               </th>
//               <th className="px-4 py-3 text-left text-neutral-text text-sm font-medium">
//                 Type
//               </th>
//               <th className="px-4 py-3 text-left text-neutral-text text-sm font-medium">
//                 Total Amount
//               </th>
//               <th className="px-4 py-3 text-left text-neutral-text text-sm font-medium">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading && (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="px-4 py-4 text-center text-neutral-text"
//                 >
//                   Loading Invoices...
//                 </td>
//               </tr>
//             )}
//             {invoices?.map((invoice: any) => (
//               <tr
//                 key={invoice.id}
//                 className="border-t border-neutral-border hover:bg-neutral-light/50"
//               >
//                 <td className="px-4 py-3 text-neutral-text">
//                   {invoice.invoiceNumber}
//                 </td>
//                 <td className="px-4 py-3 text-neutral-text">
//                   {invoice.customer?.name || "N/A"}
//                 </td>
//                 <td className="px-4 py-3">
//                   <Link
//                     href={`/dashboard/bills/${invoice.id}`}
//                     className="text-primary hover:underline"
//                   >
//                     {invoice.organization.name}
//                   </Link>
//                 </td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
//                       invoice.invoiceType === "Credit"
//                         ? "bg-primary/10 text-primary"
//                         : "bg-accent-red/10 text-accent-red"
//                     }`}
//                   >
//                     {invoice.invoiceType === "Credit" ? (
//                       <ArrowUpCircle className="w-4 h-4" />
//                     ) : (
//                       <ArrowDownCircle className="w-4 h-4" />
//                     )}
//                     {invoice.invoiceType}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-neutral-text">
//                   ₹{invoice.totalAmount.toFixed(2)}
//                 </td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                       invoice.status === "COMPLETED"
//                         ? "bg-accent-green/10 text-accent-green"
//                         : "bg-accent-orange/10 text-accent-orange"
//                     }`}
//                   >
//                     {invoice.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//             {!isLoading && invoices?.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="px-4 py-4 text-center text-neutral-text"
//                 >
//                   No invoices found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile: Card View */}
//       <div className="sm:hidden space-y-4">
//         {isLoading && (
//           <div className="text-center text-neutral-text">
//             Loading Invoices...
//           </div>
//         )}
//         {invoices?.map((invoice: any) => (
//           <div
//             key={invoice.id}
//             className="bg-neutral-white shadow rounded-lg p-4 border border-neutral-border"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <Link
//                 href={`/dashboard/bills/${invoice.id}`}
//                 className="text-primary font-semibold hover:underline"
//               >
//                 #{invoice.invoiceNumber}
//               </Link>
//               <span
//                 className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                   invoice.status === "COMPLETED"
//                     ? "bg-accent-green/10 text-accent-green"
//                     : "bg-accent-orange/10 text-accent-orange"
//                 }`}
//               >
//                 {invoice.status}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 gap-2 text-sm text-neutral-text">
//               <div>
//                 <span className="font-medium">Customer:</span>
//                 <p>{invoice.customer?.name || "N/A"}</p>
//               </div>
//               <div>
//                 <span className="font-medium">Organization:</span>
//                 <p>{invoice.organization.name}</p>
//               </div>
//               <div>
//                 <span className="font-medium">Type:</span>
//                 <p className="inline-flex items-center gap-1">
//                   {invoice.invoiceType === "Credit" ? (
//                     <ArrowUpCircle className="w-4 h-4 text-primary" />
//                   ) : (
//                     <ArrowDownCircle className="w-4 h-4 text-accent-red" />
//                   )}
//                   {invoice.invoiceType}
//                 </p>
//               </div>
//               <div>
//                 <span className="font-medium">Total:</span>
//                 <p>₹{invoice.totalAmount.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//         {!isLoading && invoices?.length === 0 && (
//           <div className="text-center text-neutral-text">
//             No invoices found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Truck,
  Filter,
  X,
} from "lucide-react";

// Import shadcn components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function GetInvoices() {
  const res = await axios.get("/api/invoices");
  return res.data.invoices;
}

export default function InvoicesList({ user }: { user: User }) {
  const { data: rawInvoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: GetInvoices,
    enabled: !!user,
  });

  // State management
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<string[]>([]);

  // Filter states
  const [filters, setFilters] = useState({
    organization: "",
    invoiceType: "",
    status: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Initialize data and extract organization options
  useEffect(() => {
    if (rawInvoices) {
      const sortedInvoices = [...rawInvoices].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setInvoices(sortedInvoices);
      setFilteredInvoices(sortedInvoices);

      // Extract unique organization names for filter dropdown
      const uniqueOrgs = Array.from(
        new Set(sortedInvoices.map((invoice) => invoice.organization.name))
      );
      setOrganizationOptions(uniqueOrgs);
    }
  }, [rawInvoices]);

  // Apply filters
  useEffect(() => {
    if (invoices.length) {
      let result = [...invoices];

      if (filters.organization) {
        if (filters.organization !== "all") {
          result = result.filter(
            (invoice) => invoice.organization.name === filters.organization
          );
        }
      }

      if (filters.invoiceType) {
        if (filters.invoiceType !== "all") {
          result = result.filter(
            (invoice) => invoice.invoiceType === filters.invoiceType
          );
        }
      }

      if (filters.status) {
        if (filters.status !== "all") {
          result = result.filter(
            (invoice) => invoice.status === filters.status
          );
        }
      }

      setFilteredInvoices(result);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [filters, invoices]);

  // Pagination calculation
  const totalPages = filteredInvoices
    ? Math.ceil(filteredInvoices.length / itemsPerPage)
    : 0;
  const currentInvoices = filteredInvoices
    ? filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  // Reset a specific filter
  const clearFilter = (filterName: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: "",
    }));
  };

  // Reset all filters
  const clearAllFilters = () => {
    setFilters({
      organization: "",
      invoiceType: "",
      status: "",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  return (
    <div className="mt-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-navy-800 mb-4 sm:mb-0">
          Recent Invoices
        </h2>

        {/* Filter badges for mobile - show when filters are active */}
        <div className="sm:hidden flex flex-wrap gap-2 mb-4">
          {filters.organization && (
            <Badge
              variant="outline"
              className="bg-neutral-light flex items-center gap-1"
            >
              Org: {filters.organization}
              <button
                onClick={() => clearFilter("organization")}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.invoiceType && (
            <Badge
              variant="outline"
              className="bg-neutral-light flex items-center gap-1"
            >
              Type: {filters.invoiceType}
              <button
                onClick={() => clearFilter("invoiceType")}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge
              variant="outline"
              className="bg-neutral-light flex items-center gap-1"
            >
              Status: {filters.status}
              <button onClick={() => clearFilter("status")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-neutral-white shadow rounded-lg mb-6 p-4 border border-neutral-border">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-navy-800" />
          <h3 className="text-sm font-medium text-navy-800">Filter Invoices</h3>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="ml-auto text-xs text-neutral-text hover:text-accent-red"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Select
              value={filters.organization}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, organization: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizationOptions.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.invoiceType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, invoiceType: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Invoice Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters - desktop view */}
        <div className="hidden sm:flex flex-wrap gap-2 mt-4">
          {filters.organization && (
            <Badge
              variant="outline"
              className="bg-neutral-light flex items-center gap-1"
            >
              Organization: {filters.organization}
              <button
                onClick={() => clearFilter("organization")}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.invoiceType && (
            <Badge
              variant="outline"
              className="bg-neutral-light flex items-center gap-1"
            >
              Type: {filters.invoiceType}
              <button
                onClick={() => clearFilter("invoiceType")}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge
              variant="outline"
              className="bg-neutral-light flex items-center gap-1"
            >
              Status: {filters.status}
              <button onClick={() => clearFilter("status")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Desktop: Table View */}
      <div className="hidden sm:block bg-neutral-white shadow rounded-lg overflow-hidden border border-neutral-border">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-light">
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Invoice #
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Date
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Vehicle
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Type
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-navy-900 text-sm font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-4 text-center text-neutral-text"
                >
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            )}
            {currentInvoices?.map((invoice: any) => (
              <tr
                key={invoice.id}
                className={`border-t border-neutral-border hover:bg-neutral-light/50 ${
                  invoice.invoiceType === "CREDIT"
                    ? "bg-blue-50/50"
                    : "bg-red-50/50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-navy-900">
                  #{invoice.invoiceNumber}
                </td>
                <td className="px-4 py-3 text-neutral-text flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-text/70" />
                  {formatDate(invoice.createdAt)}
                </td>
                <td className="px-4 py-3 text-neutral-text">
                  {invoice.customer?.name || invoice.billerName || "N/A"}
                </td>
                <td className="px-4 py-3 text-neutral-text">
                  {invoice.organization.name}
                </td>
                <td className="px-4 py-3 text-neutral-text flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-text/70" />
                  {invoice.vehicalNumber}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                      invoice.invoiceType === "CREDIT"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent-red/10 text-accent-red"
                    }`}
                  >
                    {invoice.invoiceType === "CREDIT" ? (
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                    )}
                    {invoice.invoiceType}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  <span
                    className={
                      invoice.invoiceType === "CREDIT"
                        ? "text-primary"
                        : "text-accent-red"
                    }
                  >
                    ₹
                    {invoice.grandTotal?.toFixed(2) ||
                      invoice.totalAmount.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/bills/${invoice.id}`}>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                        invoice.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
            {!isLoading &&
              (!filteredInvoices || filteredInvoices.length === 0) && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-neutral-text"
                  >
                    {hasActiveFilters
                      ? "No invoices match your filters. Try adjusting your criteria."
                      : "No invoices found."}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card View */}
      <div className="sm:hidden space-y-4">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {currentInvoices?.map((invoice: any) => (
          <div
            key={invoice.id}
            className={`rounded-lg p-4 border shadow ${
              invoice.invoiceType === "CREDIT"
                ? "bg-blue-50/30 border-blue-200"
                : "bg-red-50/30 border-red-200"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-navy-800">
                  #{invoice.invoiceNumber}
                </span>
                <span className="text-xs text-neutral-text">
                  {formatDate(invoice.createdAt)}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  invoice.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-xs text-neutral-text">Customer</span>
                <p className="font-medium">
                  {invoice.customer?.name || invoice.billerName || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-xs text-neutral-text">Organization</span>
                <p className="font-medium">{invoice.organization.name}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-text">Vehicle</span>
                <p className="font-medium">{invoice.vehicalNumber}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-text">GST Amount</span>
                <p className="font-medium">
                  ₹{invoice.gstAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-neutral-border pt-3">
              <div className="flex items-center gap-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                    invoice.invoiceType === "CREDIT"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent-red/10 text-accent-red"
                  }`}
                >
                  {invoice.invoiceType === "CREDIT" ? (
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                  )}
                  {invoice.invoiceType}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-text">Total Amount</span>
                <p
                  className={`font-semibold ${
                    invoice.invoiceType === "CREDIT"
                      ? "text-primary"
                      : "text-accent-red"
                  }`}
                >
                  ₹
                  {invoice.grandTotal?.toFixed(2) ||
                    invoice.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <Link
              href={`/dashboard/bills/${invoice.id}`}
              className="mt-3 w-full block text-center text-sm font-medium text-primary hover:text-primary-hover py-2 border border-primary/20 rounded-md"
            >
              View Details
            </Link>
          </div>
        ))}
        {!isLoading && (!filteredInvoices || filteredInvoices.length === 0) && (
          <div className="text-center py-8 text-neutral-text">
            {hasActiveFilters
              ? "No invoices match your filters. Try adjusting your criteria."
              : "No invoices found."}
          </div>
        )}
      </div>

      {/* shadcn Pagination */}
      {totalPages > 0 && (
        <div className="mt-6">
          <div className="text-sm text-neutral-text text-center mb-2">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} entries
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* First page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {currentPage > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Page numbers */}
              {Array.from({ length: totalPages })
                .map((_, i) => i + 1)
                .filter((pageNum) => {
                  if (totalPages <= 5) return true;
                  return (
                    pageNum >= Math.max(currentPage - 1, 1) &&
                    pageNum <= Math.min(currentPage + 1, totalPages)
                  );
                })
                .map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Ellipsis if needed */}
              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
