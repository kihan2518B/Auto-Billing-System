import prisma from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

type Data = {
    email: string,
    password: string
}

export async function POST(req: Request) {
    try {
        const data:Data = await req.json()
        const { error,data:User } = await supabase.auth.signUp({ email:data.email, password:data.password })
        if (error) throw error

        const PrismaUser = await prisma.user.create({
            data:{
                email:data.email,
                id:User.user?.id
            }
        })
        return NextResponse.json({user:User,message:"User created successfully"},{
            status:201
        })
    } catch (error) {
        console.log("Error creating user:",error)
        return NextResponse.json({ message:"Failed to create user" }, { status:500 })
    }
}