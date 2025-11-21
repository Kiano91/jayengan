import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Get recent appointments with student details
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
        u.full_name as student_name,
        u.class as student_class
      FROM appointments a
      JOIN users u ON a.student_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `;

    return Response.json({ appointments });
  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    return Response.json(
      { error: "Failed to fetch recent appointments" },
      { status: 500 },
    );
  }
}
