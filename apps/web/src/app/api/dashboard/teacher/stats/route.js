import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Get total students count
    const studentsResult = await sql`
      SELECT COUNT(*) as total_students 
      FROM users 
      WHERE role = 'student'
    `;

    // Get pending appointments count
    const pendingAppointmentsResult = await sql`
      SELECT COUNT(*) as pending_appointments 
      FROM appointments 
      WHERE status = 'pending'
    `;

    // Get completed sessions count for this month
    const completedSessionsResult = await sql`
      SELECT COUNT(*) as completed_sessions 
      FROM appointments 
      WHERE status = 'completed' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;

    // Get anonymous reports count that are pending
    const anonymousReportsResult = await sql`
      SELECT COUNT(*) as anonymous_reports 
      FROM anonymous_reports 
      WHERE status = 'pending'
    `;

    const stats = {
      totalStudents: parseInt(studentsResult[0].total_students),
      pendingAppointments: parseInt(
        pendingAppointmentsResult[0].pending_appointments,
      ),
      completedSessions: parseInt(
        completedSessionsResult[0].completed_sessions,
      ),
      anonymousReports: parseInt(anonymousReportsResult[0].anonymous_reports),
    };

    return Response.json(stats);
  } catch (error) {
    console.error("Error fetching teacher dashboard stats:", error);
    return Response.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
