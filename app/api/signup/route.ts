// app/api/signup/route.ts
import prisma from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

type Data = {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const supabase = await createClient()
  try {
    const data: Data = await req.json()
    const { error, data: userData } = await supabase.auth.signUp({ 
      email: data.email, 
      password: data.password 
    })
    
    if (error) {
      return NextResponse.json({ 
        success: false,
        message: error.message || "Signup failed"
      }, { status: 400 })
    }

    await prisma.user.create({
      data: {
        email: data.email,
        id: userData.user?.id as string,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: "Signup successful! Please check your email to verify.",
      data: userData 
    }, { status: 201 })
  } catch (error) {
    console.log("Error creating user:", error)
    return NextResponse.json({ 
      success: false,
      message: "Failed to create user" 
    }, { status: 500 })
  }
}