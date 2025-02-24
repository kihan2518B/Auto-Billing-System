import prisma  from '@/lib/prisma'

export default async function Dashboard() {

  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { customer: true, organization: true },
  })

  const totalRevenue = await prisma.invoice.aggregate({
    _sum: { totalAmount: true },
  })

  const pendingInvoices = await prisma.invoice.count({
    where: { status: 'PENDING' },
  })

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">${totalRevenue._sum.totalAmount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Pending Invoices</h2>
          <p className="text-3xl font-bold">{pendingInvoices}</p>
        </div>
        {/* Add more summary cards here */}
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Invoice Number</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customer.name}</td>
                <td>${invoice.totalAmount.toFixed(2)}</td>
                <td>{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}