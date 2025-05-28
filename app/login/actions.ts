'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers';

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

    // Store session in cookies (persistently)
    const cookieStore = cookies();

    const user = data.user;
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    // Store minimal user info in a cookie
    cookieStore.set('user', JSON.stringify({
        id: user?.id,
        email: user?.email,
        accessToken,
        refreshToken,
    }), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return {
        success: true,
        message: "Login successful",
        data,
    };
}

export async function signup(formData: FormData) {
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
        login(formData)
    } catch (prismaError) {
        console.error("Prisma error:", prismaError)
        return {
            success: false,
            message: 'Failed to create user record in database',
        }
    }
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const cookieStore = cookies();
    cookieStore.delete('user');

    revalidatePath('/', 'layout');
    redirect('/login');
}
