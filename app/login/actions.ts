'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

// app/login/actions.ts
export async function login(formData: FormData): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const supabase = await createClient();
  
    const userData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
  
    const { error, data } = await supabase.auth.signInWithPassword(userData);
  
    if (error) {
      return {
        success: false,
        message: error.message || "Invalid email or password",
      };
    }
  
    return {
      success: true,
      message: "Login successful",
      data,
    };
  }
  

export async function signup(formData: FormData): Promise<{
    success: boolean;
    message: string;
    data?: any;
}> {
    const supabase = await createClient()

    const userData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data } = await supabase.auth.signUp(userData)

    if (error) {
        return {
            success: false,
            message: error.message || 'Signup failed',
        }
    }

    try {
        await prisma.user.create({
            data: {
                email: userData.email,
                id: data.user?.id as string,
            },
        })
    } catch (prismaError) {
        console.error("Prisma error:", prismaError)
        return {
            success: false,
            message: 'Failed to create user record in database',
        }
    }

    return {
        success: true,
        message: 'Signup successful! Please check your email to verify.',
        data,
    }
}

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    console.log("error : ", error)
    revalidatePath('/', 'layout')
    redirect('/')

}
