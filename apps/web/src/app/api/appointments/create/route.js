import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, date, time, reason, notes } = body;

    if (!token || !date || !time || !reason) {
      return Response.json(
        { error: "Token, tanggal, waktu, dan alasan harus diisi" },
        { status: 400 },
      );
    }

    // Verify token and get user
    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, "base64").toString());

      // Check if token is expired
      if (Date.now() > decoded.exp) {
        return Response.json(
          { error: "Token telah kadaluarsa" },
          { status: 401 },
        );
      }
    } catch (error) {
      return Response.json({ error: "Token tidak valid" }, { status: 401 });
    }

    // Check if user exists
    const userCheck = await sql`
      SELECT id, role FROM users WHERE id = ${decoded.userId}
    `;

    if (userCheck.length === 0) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Only students can create appointments
    if (userCheck[0].role !== "student") {
      return Response.json(
        { error: "Hanya siswa yang dapat membuat jadwal konsultasi" },
        { status: 403 },
      );
    }

    // Get a teacher (BK counselor) to assign appointment to
    const teachers = await sql`
      SELECT id FROM users WHERE role = 'teacher' LIMIT 1
    `;

    if (teachers.length === 0) {
      return Response.json(
        { error: "Tidak ada guru BK yang tersedia" },
        { status: 404 },
      );
    }

    const teacherId = teachers[0].id;

    // Check for conflicting appointments on same date/time
    const conflictCheck = await sql`
      SELECT id FROM appointments 
      WHERE scheduled_date = ${date} 
      AND scheduled_time = ${time}
      AND teacher_id = ${teacherId}
      AND status IN ('pending', 'confirmed')
    `;

    if (conflictCheck.length > 0) {
      return Response.json(
        {
          error:
            "Waktu tersebut sudah tidak tersedia. Silakan pilih waktu lain.",
        },
        { status: 409 },
      );
    }

    // Create the appointment
    const appointment = await sql`
      INSERT INTO appointments (
        student_id, 
        teacher_id, 
        scheduled_date, 
        scheduled_time, 
        reason, 
        notes, 
        status,
        duration_minutes,
        created_at,
        updated_at
      ) VALUES (
        ${decoded.userId}, 
        ${teacherId}, 
        ${date}, 
        ${time}, 
        ${reason}, 
        ${notes || null}, 
        'pending',
        60,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING id
    `;

    return Response.json({
      success: true,
      message: "Jadwal konsultasi berhasil dibuat",
      appointment: {
        id: appointment[0].id,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
