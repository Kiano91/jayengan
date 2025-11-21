import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID diperlukan" }, { status: 400 });
    }

    // Get appointments for the specific user
    const appointments = await sql`
      SELECT 
        a.id,
        a.scheduled_date,
        a.scheduled_time,
        a.duration_minutes,
        a.reason,
        a.status,
        a.notes,
        a.created_at,
        u_teacher.full_name as teacher_name
      FROM appointments a
      LEFT JOIN users u_teacher ON a.teacher_id = u_teacher.id
      WHERE a.student_id = ${userId}
      ORDER BY a.scheduled_date DESC, a.scheduled_time DESC
    `;

    return Response.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
