import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { full_name, email, password } = await req.json()

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if the owner already exists (assuming only one owner or unique email)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    const password_hash = await bcrypt.hash(password, 10)

    const owner = await prisma.user.create({
      data: {
        full_name,
        email,
        password_hash,
        pin_code: "0000",
        role: Role.OWNER,
      },
    })

    // Remove sensitive data before returning
    const { password_hash: _, ...safeUser } = owner

    return NextResponse.json({ user: safeUser }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
