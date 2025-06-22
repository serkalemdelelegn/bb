import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    username: "subcity_admin",
    password: "password123", // In a real app, this would be hashed
    role: "sub-city",
    name: "Sub-City Admin",
  },
  {
    id: "2",
    username: "trade_admin",
    password: "password123",
    role: "trade-bureau",
    name: "Trade Bureau Admin",
  },
  {
    id: "3",
    username: "woreda_admin",
    password: "password123",
    role: "woreda",
    name: "Woreda Admin",
  },
  {
    id: "4",
    username: "coop_admin",
    password: "password123",
    role: "cooperative",
    name: "Cooperative Admin",
  },
  {
    id: "5",
    username: "shop_admin",
    password: "password123",
    role: "shop",
    name: "Shop Admin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Find user by username
    const user = users.find((u) => u.username === username)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // In a real app, you would generate a JWT token here
    // For demo purposes, we'll just return the user info
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // This would validate a token in a real app
  // For demo purposes, we'll just return a 200 status
  return NextResponse.json({ message: "Token is valid" })
}
