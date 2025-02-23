import type { Invoice } from "@prisma/client"

interface InvoiceListProps {
  invoices: Invoice[]
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul className="space-y-4">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="border p-4 rounded">
              <h3 className="font-semibold">Invoice #{invoice.invoiceNumber}</h3>
              <p>Customer: {invoice.customer.name}</p>
              <p>Total Amount: ₹{invoice.totalAmount.toFixed(2)}</p>
              <p>GST Amount: ₹{invoice.gstAmount.toFixed(2)}</p>
              <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

