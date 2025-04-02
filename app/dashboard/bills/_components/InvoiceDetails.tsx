// 'use client';

// import React from 'react';
// import { User } from '@supabase/supabase-js';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { useParams } from 'next/navigation';
// import { Download, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';

// const fetchInvoices = async (id: string) => {
//     const res = await axios.get(`/api/invoices/${id}`);
//     return res.data.invoice;
// };

// const downloadInvoice = async (invoice: any) => {
//     const res = await axios.post('/api/invoices/download', invoice, {
//         responseType: 'blob', // For downloading a file
//     });
//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `invoice-${invoice.invoiceNumber}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
// };

// const updatePaymentStatus = async ({ id, status }: { id: string; status: string }) => {
//     const res = await axios.patch(`/api/invoices/${id}`, { status });
//     return res.data.invoice;
// };

// export default function InvoiceDetails({ user }: { user: User }) {
//     const { id } = useParams();
//     const queryClient = useQueryClient();

//     const { data: invoice, isError, isLoading } = useQuery({
//         queryKey: ['invoice', id],
//         queryFn: () => fetchInvoices(id as string),
//         enabled: !!user,
//     });

//     const mutation = useMutation({
//         mutationFn: updatePaymentStatus,
//         onSuccess: (updatedInvoice) => {
//             queryClient.setQueryData(['invoice', id], updatedInvoice);
//             toast.success('Payment Status Updated\nInvoice marked as paid successfully.', {
//                 style: {
//                     background: '#neutral-white',
//                     color: '#primary',
//                     fontFamily: 'inherit',
//                     fontSize: '0.875rem',
//                     fontWeight: '500',
//                     border: '1px solid #primary',
//                 },
//             });
//         },
//         onError: () => {
//             toast.error('Error\nFailed to update payment status. Please try again.', {
//                 style: {
//                     background: '#neutral-white',
//                     color: '#accent-red',
//                     fontFamily: 'inherit',
//                     fontSize: '0.875rem',
//                     fontWeight: '500',
//                     border: '1px solid #accent-red',
//                 },
//             });
//         },
//     });

//     const handleDownload = () => {
//         if (!invoice) return;
//         downloadInvoice(invoice)
//             .then(() => {
//                 toast.success('Invoice Downloaded\nDownload completed successfully.', {
//                     style: {
//                         background: '#neutral-white',
//                         color: '#primary',
//                         fontFamily: 'inherit',
//                         fontSize: '0.875rem',
//                         fontWeight: '500',
//                         border: '1px solid #primary',
//                     },
//                 });
//             })
//             .catch(() => {
//                 toast.error('Download Failed\nFailed to download invoice. Please try again.', {
//                     style: {
//                         background: '#neutral-white',
//                         color: '#accent-red',
//                         fontFamily: 'inherit',
//                         fontSize: '0.875rem',
//                         fontWeight: '500',
//                         border: '1px solid #accent-red',
//                     },
//                 });
//             });
//     };

//     const handleConfirmPayment = async () => {
//         if (!invoice) return;
//         mutation.mutate({ id: invoice.id, status: 'COMPLETED' });
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-neutral-text text-lg">Loading...</p>
//             </div>
//         );
//     }

//     if (isError || !invoice) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-accent-red text-lg">Error loading invoice details.</p>
//             </div>
//         );
//     }

//     const items = invoice.items || [];

//     return (
//         <div className="w-full mx-auto p-4 sm:p-6">
//             <div className="bg-neutral-white p-4 sm:p-6 rounded-lg shadow-md space-y-6">
//                 <h2 className="text-2xl font-semibold text-neutral-heading">
//                     Invoice #{invoice.invoiceNumber}
//                 </h2>

//                 {/* Invoice Header */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <p className="text-neutral-text text-sm font-medium">Organization</p>
//                         <p className="text-neutral-heading">{invoice.organization.name}</p>
//                     </div>
//                     <div>
//                         <p className="text-neutral-text text-sm font-medium">Customer</p>
//                         <p className="text-neutral-heading">{invoice.customer?.name || 'N/A'}</p>
//                     </div>
//                     <div>
//                         <p className="text-neutral-text text-sm font-medium">Invoice Type</p>
//                         <p className="text-neutral-heading">{invoice.invoiceType}</p>
//                     </div>
//                     <div>
//                         <p className="text-neutral-text text-sm font-medium">Vehicle Number</p>
//                         <p className="text-neutral-heading">{invoice.vehicalNumber || 'N/A'}</p>
//                     </div>
//                     <div>
//                         <p className="text-neutral-text text-sm font-medium">Biller Name</p>
//                         <p className="text-neutral-heading">{invoice.billerName || 'N/A'}</p>
//                     </div>
//                     <div>
//                         <p className="text-neutral-text text-sm font-medium">Created At</p>
//                         <p className="text-neutral-heading">
//                             {new Date(invoice.createdAt).toLocaleDateString()}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Payment Status */}
//                 <div className="flex items-center gap-2">
//                     <p className="text-neutral-text text-sm font-medium">Payment Status:</p>
//                     <span
//                         className={`px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'PAID'
//                             ? 'bg-primary text-white'
//                             : 'bg-neutral-light text-neutral-text'
//                             }`}
//                     >
//                         {invoice.status}
//                     </span>
//                 </div>

//                 {/* Invoice Items */}
//                 <div>
//                     <h3 className="text-lg font-medium text-neutral-heading mb-3">Items</h3>
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="bg-neutral-light">
//                                     <th className="p-2 text-neutral-text text-sm font-medium">Name</th>
//                                     <th className="p-2 text-neutral-text text-sm font-medium">HSN Code</th>
//                                     <th className="p-2 text-neutral-text text-sm font-medium">Quantity</th>
//                                     <th className="p-2 text-neutral-text text-sm font-medium">Price</th>
//                                     <th className="p-2 text-neutral-text text-sm font-medium">Unit</th>
//                                     <th className="p-2 text-neutral-text text-sm font-medium">Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {items.map((item: any, index: number) => (
//                                     <tr key={index} className="border-b border-neutral-border">
//                                         <td className="p-2 text-neutral-text">{item.name}</td>
//                                         <td className="p-2 text-neutral-text">{item.hsnCode || 'N/A'}</td>
//                                         <td className="p-2 text-neutral-text">{item.quantity}</td>
//                                         <td className="p-2 text-neutral-text">₹{item.price.toFixed(2)}</td>
//                                         <td className="p-2 text-neutral-text">{item.unit || 'N/A'}</td>
//                                         <td className="p-2 text-neutral-text">₹{item.amount.toFixed(2)}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Totals */}
//                 <div className="border-t pt-4">
//                     <div className="flex justify-between text-neutral-text">
//                         <span>Subtotal:</span>
//                         <span>₹{invoice.totalAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-neutral-text">
//                         <span>GST Amount:</span>
//                         <span>₹{invoice.gstAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-lg font-semibold text-neutral-heading mt-2">
//                         <span>Grand Total:</span>
//                         <span>₹{invoice.grandTotal.toFixed(2)}</span>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-4">
//                     <Button
//                         onClick={handleDownload}
//                         className="w-full sm:w-auto px-6 py-2.5 text-white bg-primary hover:bg-primary-hover focus:ring-2 focus:ring-primary-ring transition-colors"
//                     >
//                         <Download className="w-4 h-4 mr-2" />
//                         Download Invoice
//                     </Button>
//                     {invoice.status === 'PENDING' && (
//                         <Button
//                             onClick={handleConfirmPayment}
//                             disabled={mutation.isPending}
//                             className="w-full sm:w-auto px-6 py-2.5 text-white bg-primary hover:bg-primary-hover disabled:bg-primary-disabled focus:ring-2 focus:ring-primary-ring transition-colors"
//                         >
//                             <CheckCircle className="w-4 h-4 mr-2" />
//                             {mutation.isPending ? 'Confirming...' : 'Confirm Payment'}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }




'use client';

import React from 'react';
import { User } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const fetchInvoices = async (id: string) => {
    const res = await axios.get(`/api/invoices/${id}`);
    return res.data.invoice;
};

const downloadInvoice = async (invoice: any) => {
    const res = await axios.post(
        '/api/invoices/generate',
        {
            invoiceNumber: invoice.invoiceNumber,
            items: invoice.items,
            totalAmount: invoice.totalAmount,
            customer: invoice.customer || {}, // Handle nullable customer
            invoiceDate: invoice.createdAt,
            vehicalNumber: invoice.vehicalNumber,
            gstAmount: invoice.gstAmount,
            organization: invoice.organization,
        },
        {
            responseType: 'blob', // Expect binary data
        }
    );

    const fileName = `invoice-${invoice.invoiceNumber}-${invoice.organization.name.replace(/\s+/g, '')}.pdf`;
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

const updatePaymentStatus = async ({ id, status }: { id: string; status: string }) => {
    const res = await axios.patch(`/api/invoices/${id}`, { status });
    return res.data.invoice;
};

export default function InvoiceDetails({ user }: { user: User }) {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: invoice, isError, isLoading } = useQuery({
        queryKey: ['invoice', id],
        queryFn: () => fetchInvoices(id as string),
        enabled: !!user,
    });

    const mutation = useMutation({
        mutationFn: updatePaymentStatus,
        onSuccess: (updatedInvoice) => {
            queryClient.setQueryData(['invoice', id], updatedInvoice);
            toast.success('Payment Status Updated\nInvoice marked as paid successfully.', {
                style: {
                    background: '#neutral-white',
                    color: '#primary',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid #primary',
                },
            });
        },
        onError: () => {
            toast.error('Error\nFailed to update payment status. Please try again.', {
                style: {
                    background: '#neutral-white',
                    color: '#accent-red',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid #accent-red',
                },
            });
        },
    });

    const handleDownload = () => {
        if (!invoice) return;
        downloadInvoice(invoice)
            .then(() => {
                toast.success('Invoice Downloaded\nDownload completed successfully.', {
                    style: {
                        background: '#neutral-white',
                        color: '#primary',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        border: '1px solid #primary',
                    },
                });
            })
            .catch(() => {
                toast.error('Download Failed\nFailed to download invoice. Please try again.', {
                    style: {
                        background: '#neutral-white',
                        color: '#accent-red',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        border: '1px solid #accent-red',
                    },
                });
            });
    };

    const handleConfirmPayment = () => {
        if (!invoice) return;
        mutation.mutate({ id: invoice.id, status: 'PAID' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-neutral-text text-lg">Loading...</p>
            </div>
        );
    }

    if (isError || !invoice) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-accent-red text-lg">Error loading invoice details.</p>
            </div>
        );
    }

    const items = invoice.items || [];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="bg-neutral-white p-4 sm:p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-semibold text-neutral-heading">
                    Invoice #{invoice.invoiceNumber}
                </h2>

                {/* Invoice Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-neutral-text text-sm font-medium">Organization</p>
                        <p className="text-neutral-heading">{invoice.organization.name}</p>
                    </div>
                    <div>
                        <p className="text-neutral-text text-sm font-medium">Customer</p>
                        <p className="text-neutral-heading">{invoice.customer?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-neutral-text text-sm font-medium">Invoice Type</p>
                        <p className="text-neutral-heading">{invoice.invoiceType}</p>
                    </div>
                    <div>
                        <p className="text-neutral-text text-sm font-medium">Vehicle Number</p>
                        <p className="text-neutral-heading">{invoice.vehicalNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-neutral-text text-sm font-medium">Biller Name</p>
                        <p className="text-neutral-heading">{invoice.billerName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-neutral-text text-sm font-medium">Created At</p>
                        <p className="text-neutral-heading">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-2">
                    <p className="text-neutral-text text-sm font-medium">Payment Status:</p>
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'PAID'
                                ? 'bg-primary text-white'
                                : 'bg-neutral-light text-neutral-text'
                            }`}
                    >
                        {invoice.status}
                    </span>
                </div>

                {/* Invoice Items */}
                <div>
                    <h3 className="text-lg font-medium text-neutral-heading mb-3">Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-light">
                                    <th className="p-2 text-neutral-text text-sm font-medium">Name</th>
                                    <th className="p-2 text-neutral-text text-sm font-medium">HSN Code</th>
                                    <th className="p-2 text-neutral-text text-sm font-medium">Quantity</th>
                                    <th className="p-2 text-neutral-text text-sm font-medium">Price</th>
                                    <th className="p-2 text-neutral-text text-sm font-medium">Unit</th>
                                    <th className="p-2 text-neutral-text text-sm font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any, index: number) => (
                                    <tr key={index} className="border-b border-neutral-border">
                                        <td className="p-2 text-neutral-text">{item.name}</td>
                                        <td className="p-2 text-neutral-text">{item.hsnCode || 'N/A'}</td>
                                        <td className="p-2 text-neutral-text">{item.quantity}</td>
                                        <td className="p-2 text-neutral-text">₹{item.price.toFixed(2)}</td>
                                        <td className="p-2 text-neutral-text">{item.unit || 'N/A'}</td>
                                        <td className="p-2 text-neutral-text">₹{item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                    <div className="flex justify-between text-neutral-text">
                        <span>Subtotal:</span>
                        <span>₹{invoice.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-text">
                        <span>GST Amount:</span>
                        <span>₹{invoice.gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-neutral-heading mt-2">
                        <span>Grand Total:</span>
                        <span>₹{invoice.grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={handleDownload}
                        className="w-full sm:w-auto px-6 py-2.5 text-white bg-primary hover:bg-primary-hover focus:ring-2 focus:ring-primary-ring transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                    </Button>
                    {invoice.status === 'PENDING' && (
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={mutation.isPending}
                            className="w-full sm:w-auto px-6 py-2.5 text-white bg-primary hover:bg-primary-hover disabled:bg-primary-disabled focus:ring-2 focus:ring-primary-ring transition-colors"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {mutation.isPending ? 'Confirming...' : 'Confirm Payment'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}