import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Get recent anonymous reports
    const reports = await sql`
      SELECT 
        id,
        title,
        description,
        category,
        attachment_url,
        status,
        priority,
        created_at,
        updated_at
      FROM anonymous_reports
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return Response.json({ reports });
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    return Response.json(
      { error: "Failed to fetch recent reports" },
      { status: 500 },
    );
  }
}
