import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({ error: "Token tidak ditemukan" }, { status: 401 });
    }

    try {
      // Decode the token
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());

      // Check if token is expired
      if (Date.now() > decoded.exp) {
        return Response.json(
          { error: "Token telah kadaluarsa" },
          { status: 401 },
        );
      }

      // Get user from database to ensure they still exist
      const users = await sql`
        SELECT id, username, role, full_name, email, phone, class
        FROM users 
        WHERE id = ${decoded.userId}
      `;

      if (users.length === 0) {
        return Response.json(
          { error: "User tidak ditemukan" },
          { status: 401 },
        );
      }

      const user = users[0];

      return Response.json({
        success: true,
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
    } catch (decodeError) {
      return Response.json({ error: "Token tidak valid" }, { status: 401 });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return Response.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}
