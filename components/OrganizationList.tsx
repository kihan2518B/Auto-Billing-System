import type { Organization } from "@prisma/client"

interface OrganizationListProps {
  organizations: Organization[]
}

export default function OrganizationList({ organizations }: OrganizationListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Organizations</h2>
      {organizations.length === 0 ? (
        <p>You haven't created any organizations yet.</p>
      ) : (
        <ul className="space-y-4">
          {organizations.map((org) => (
            <li key={org.id} className="border p-4 rounded">
              <h3 className="font-semibold">{org.name}</h3>
              <p>GST Number: {org.gstNumber}</p>
              <p>Address: {org.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

