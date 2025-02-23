import type { Customer } from "@prisma/client"

interface CustomerListProps {
  customers: Customer[]
}

export default function CustomerList({ customers }: CustomerListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customers</h2>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <ul className="space-y-4">
          {customers.map((customer) => (
            <li key={customer.id} className="border p-4 rounded">
              <h3 className="font-semibold">{customer.name}</h3>
              <p>Address: {customer.address}</p>
              <p>GST Number: {customer.gstNumber}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

