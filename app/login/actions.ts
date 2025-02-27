'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const userData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error, data } = await supabase.auth.signInWithPassword(userData)
    if (error) {
        console.log("error: ", error.message);
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const userData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                role: formData.get('role') || "admin",
            },
        }
    }

    const { error, data } = await supabase.auth.signUp(userData)
    console.log("data: ", data);
    await prisma.user.create({
        data: {
            email: userData.email,
            id: data.user?.id,
        }
    })

    if (error) {
        console.log("error: ", error);
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
}
