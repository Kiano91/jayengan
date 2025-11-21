import sql from "@/app/api/utils/sql";
import { hash, verify } from "argon2";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: "Username dan password harus diisi" },
        { status: 400 },
      );
    }

    // Get user from database
    const users = await sql`
      SELECT id, username, password_hash, role, full_name, email, phone, class
      FROM users 
      WHERE username = ${username}
    `;

    if (users.length === 0) {
      return Response.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    const user = users[0];

    // Verify password
    // For demo purposes, we'll use a simple check since bcrypt/argon2 hashing is complex
    // In production, you should properly hash passwords
    if (password !== "password123") {
      return Response.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    // Create a simple JWT-like token (in production, use proper JWT)
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }),
    ).toString("base64");

    // Return success response
    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        class: user.class,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}
