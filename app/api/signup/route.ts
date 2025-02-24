import prisma from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

type Data = {
    email: string,
    password: string
}

export async function POST(req: Request) {
    const supabase = await createClient()
    try {
        const data: Data = await req.json()
        const { error, data: User } = await supabase.auth.signUp({ email: data.email, password: data.password })
        if (error) throw error

        const PrismaUser = await prisma.user.create({
            data: {
                email: data.email,
                id: User.user?.id
            }
        })
        return NextResponse.json({ user: User, message: "User created successfully" }, {
            status: 201
        })
    } catch (error) {
        console.log("Error creating user:", error)
        return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
    }
}