// 'use client'

// import { useState } from 'react'
// import { supabaseClient } from '@/utils/supabase'
// import Image from 'next/image'
// import { UploadFile } from '@/lib/supabase'

// export default function OrganizationForm() {
//   const [name, setName] = useState('')
//   const [gstNumber, setGstNumber] = useState('')
//   const [address, setAddress] = useState('')
//   const [bankName, setBankName] = useState('')
//   const [accountNumber, setAccountNumber] = useState('')
//   const [ifscCode, setIFSCCode] = useState('')
//   const [logo, setLogo] = useState<File>(null as unknown as File)
//   const [previewImage, setPreviewImage] = useState<string>("")

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log("e.target.files[0]: ", e.target.files)
//     if (!e.target.files) return
//     const file = e.target.files[0]
//     setLogo(file)
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (e.target?.result) {
//         setPreviewImage(e.target.result as string);
//       }
//     }
//     reader.readAsDataURL(file);
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const { data } = await supabaseClient.auth.getUser()

//     console.log(data)
//     const { publicUrl, error } = await UploadFile(logo, 'images', 'images')
//     if (error) {
//       console.log(error);
//     }
//     try {
//       const response = await fetch('/api/organizations', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, gstNumber, address, bankName, accountNumber, ifscCode, userId: data.user?.id, logo: publicUrl }),
//       })
//       console.log("response: ", response)
//       if (!response.ok) throw new Error('Failed to create organization')
//       setName('')
//       setGstNumber('')
//       setAddress('')
//       setBankName('')
//       setAccountNumber('')
//       setIFSCCode('')
//       setLogo(null as unknown as File)
//       setPreviewImage("")
//     } catch (error) {
//       console.error('Error creating organization:', error)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full">
//       <h2 className="text-2xl font-semibold mb-4">Add New Organization</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//             Organization Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>
//         <div>
//           <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
//             GST Number
//           </label>
//           <input
//             type="text"
//             id="gstNumber"
//             value={gstNumber}
//             onChange={(e) => setGstNumber(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>
//         <div>
//           <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
//             Address
//           </label>
//           <input
//             type="text"
//             id="address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>
//         <div>
//           <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
//             Bank Name
//           </label>
//           <input
//             type="text"
//             id="bank-name"
//             value={bankName}
//             onChange={(e) => setBankName(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>
//         <div>
//           <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
//             Account Number
//           </label>
//           <input
//             type="text"
//             id="bank-account-number"
//             value={accountNumber}
//             onChange={(e) => setAccountNumber(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>
//         <div>
//           <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
//             IFSC Code
//           </label>
//           <input
//             type="text"
//             id="ifsc"
//             value={ifscCode}
//             onChange={(e) => setIFSCCode(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//         </div>
//         <div>
//           <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
//             Upload Company Logo
//           </label>
//           <input
//             type="file"
//             id="logo"
//             onChange={handleFileChange}
//             required
//             className="mt-1 block w-full rounded-md border-black border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//           {previewImage && (
//             <Image src={previewImage} alt="Logo" width={100} height={100} />
//           )}
//         </div>
//         {/* Add more form fields for address, bank details, etc. */}
//       </div>
//       <button
//         type="submit"
//         className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//       >
//         Add Organization
//       </button>
//     </form>
//   )
// }

"use client";

import React, { useState } from "react";
import { supabaseClient } from "@/utils/supabase";
import Image from "next/image";
import { UploadFile } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Plus, Upload } from "lucide-react";

export default function OrganizationForm() {
  const [name, setName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image must be smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setLogo(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await supabaseClient.auth.getUser();

      // Validate form fields
      if (
        !name ||
        !gstNumber ||
        !address ||
        !bankName ||
        !accountNumber ||
        !ifscCode ||
        !logo
      ) {
        toast({
          title: "Incomplete Form",
          description: "Please fill in all fields and upload a logo.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Upload logo
      const { publicUrl, error: uploadError } = await UploadFile(
        logo,
        "images",
        "images"
      );
      console.log("publicUrl: ", publicUrl);
      if (uploadError) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit organization data
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          gstNumber,
          address,
          bankName,
          accountNumber,
          ifscCode,
          userId: data.user?.id,
          logo: publicUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create organization");
      }

      // Success toast
      toast({
        title: "Organization Added",
        description: "New organization created successfully.",
        variant: "default",
      });

      // Reset form
      setName("");
      setGstNumber("");
      setAddress("");
      setBankName("");
      setAccountNumber("");
      setIFSCCode("");
      setLogo(null);
      setPreviewImage("");
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full md:w-auto 
              bg-navy-600 
              hover:bg-navy-700 
              focus:border-navy-500 
              focus:ring-2 
              focus:ring-navy-500 
              focus:ring-opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add New Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy-800 text-xl font-bold">
              Add New Organization
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-navy-900">
                  Organization Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter organization name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gstNumber" className="text-navy-900">
                  GST Number
                </Label>
                <Input
                  type="text"
                  id="gstNumber"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="Enter GST number"
                  required
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-navy-900">
                  Address
                </Label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bank-name" className="text-navy-900">
                  Bank Name
                </Label>
                <Input
                  type="text"
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bank-account-number" className="text-navy-900">
                  Account Number
                </Label>
                <Input
                  type="text"
                  id="bank-account-number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ifsc" className="text-navy-900">
                  IFSC Code
                </Label>
                <Input
                  type="text"
                  id="ifsc"
                  value={ifscCode}
                  onChange={(e) => setIFSCCode(e.target.value)}
                  placeholder="Enter IFSC code"
                  required
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="logo" className="text-navy-900">
                  Company Logo
                </Label>
                <div className="flex items-center gap-4 mt-1">
                  <Input
                    type="file"
                    id="logo"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif"
                    className="flex-grow"
                  />
                  {previewImage && (
                    <div className="relative w-16 h-16">
                      <Image
                        src={previewImage}
                        alt="Logo Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full 
                bg-navy-600 
                hover:bg-navy-700 
                focus:border-navy-500 
                focus:ring-2 
                focus:ring-navy-500 
                focus:ring-opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Organization..." : "Add Organization"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
