"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface CustomerFormProps {
  user: User;
}

export default function CustomerForm({ user }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/customers", {
        name,
        gstNumber,
        address,
        userId: user?.id,
      });

      if (res.status === 201) {
        toast({
          title: "Customer Added",
          description: "New organization created successfully.",
          className: "bg-green-100 border-green-500 text-green-700",
        });

        // Reset form
        setName("");
        setGstNumber("");
        setAddress("");
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to create organization");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        className: "bg-red-100 border-red-500 text-red-700",
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
            Add New Organization
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[475px] w-full p-6 
            bg-white 
            border-gray-300"
        >
          <DialogHeader>
            <DialogTitle
              className="text-navy-800 
                text-xl 
                font-bold"
            >
              Add New Organization
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name" className="text-navy-900">
                Customer Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
                required
                disabled={isSubmitting}
                className="
                  border-gray-300 
                  focus:border-navy-500 
                  focus:ring-2 
                  focus:ring-navy-500 
                  text-navy-900 
                  placeholder-gray-600"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="gst" className="text-navy-900">
                GST Number
              </Label>
              <Input
                id="gst"
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="Enter GST number"
                required
                disabled={isSubmitting}
                className="
                  border-gray-300 
                  focus:border-navy-500 
                  focus:ring-2 
                  focus:ring-navy-500 
                  text-navy-900 
                  placeholder-gray-600"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="address" className="text-navy-900">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address"
                required
                disabled={isSubmitting}
                className="
                  border-gray-300 
                  focus:border-navy-500 
                  focus:ring-2 
                  focus:ring-navy-500 
                  text-navy-900 
                  placeholder-gray-600"
              />
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
              {isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
