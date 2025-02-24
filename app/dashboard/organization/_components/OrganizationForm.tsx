'use client'

import { useState } from 'react'
import { supabaseClient } from '@/utils/supabase'
import Image from 'next/image'
import { UploadFile } from '@/lib/supabase'

export default function OrganizationForm() {
  const [name, setName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [address, setAddress] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIFSCCode] = useState('')
  const [logo, setLogo] = useState<File>(null as unknown as File)
  const [previewImage, setPreviewImage] = useState<string>("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files[0]: ", e.target.files)
    if (!e.target.files) return
    const file = e.target.files[0]
    setLogo(file)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    }
    reader.readAsDataURL(file);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await supabaseClient.auth.getUser()

    console.log(data)
    const { publicUrl, error } = await UploadFile(logo, 'images', 'images')
    if (error) {
      console.log(error);

    }
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gstNumber, address, bankName, accountNumber, ifscCode, userId: data.user?.id, logo: publicUrl }),
      })
      console.log("response: ", response)
      if (!response.ok) throw new Error('Failed to create organization')
      setName('')
      setGstNumber('')
      setAddress('')
      setBankName('')
      setAccountNumber('')
      setIFSCCode('')
      setLogo(null as unknown as File)
      setPreviewImage("")
    } catch (error) {
      console.error('Error creating organization:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Add New Organization</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            type="text"
            id="gstNumber"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            id="bank-name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            id="bank-account-number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            IFSC Code
          </label>
          <input
            type="text"
            id="ifsc"
            value={ifscCode}
            onChange={(e) => setIFSCCode(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            Upload Company Logo
          </label>
          <input
            type="file"
            id="logo"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {previewImage && (
            <Image src={previewImage} alt="Logo" width={100} height={100} />
          )}
        </div>
        {/* Add more form fields for address, bank details, etc. */}
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Organization
      </button>
    </form>
  )
}