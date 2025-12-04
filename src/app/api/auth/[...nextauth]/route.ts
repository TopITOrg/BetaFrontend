import { handlers } from "@/server/auth";

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const response = await fetch(`${process.env.BACKEND_URL}/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json(
                { error: errorData.message || 'Registration failed' },
                { status: response.status }
            )
        }

        const data = await response.json()

        const nextResponse = NextResponse.json(data, { status: 201 })

        nextResponse.cookies.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15, // 15 минут (как обычно для access token)
        })

        nextResponse.cookies.set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 дней
        })

        return nextResponse
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}