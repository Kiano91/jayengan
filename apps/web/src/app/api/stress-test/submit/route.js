import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { answers, totalScore, stressPercentage, userId } =
      await request.json();

    if (!answers || !totalScore || stressPercentage === undefined || !userId) {
      return Response.json(
        { error: "Data tes tidak lengkap" },
        { status: 400 },
      );
    }

    // Generate recommendations based on stress level
    let recommendations = "";
    if (stressPercentage <= 40) {
      recommendations =
        "Pertahankan pola hidup sehat. Lanjutkan aktivitas positif dan jaga keseimbangan belajar-istirahat.";
    } else if (stressPercentage <= 60) {
      recommendations =
        "Cobalah teknik relaksasi, atur jadwal belajar lebih baik, dan lakukan aktivitas fisik teratur.";
    } else {
      recommendations =
        "Sangat disarankan untuk segera konsultasi dengan guru BK. Praktikkan mindfulness dan jangan ragu meminta bantuan.";
    }

    // Save stress test result to database
    const result = await sql`
      INSERT INTO stress_tests (
        user_id, 
        test_date, 
        scores, 
        total_score, 
        stress_percentage, 
        recommendations
      )
      VALUES (
        ${userId}, 
        CURRENT_TIMESTAMP, 
        ${JSON.stringify(answers)}, 
        ${totalScore}, 
        ${stressPercentage}, 
        ${recommendations}
      )
      RETURNING id, test_date
    `;

    // Create notification for high stress levels
    if (stressPercentage > 60) {
      await sql`
        INSERT INTO notifications (
          user_id,
          title,
          message,
          notification_type,
          related_id,
          related_type
        )
        VALUES (
          ${userId},
          'Tingkat Stres Tinggi Terdeteksi',
          'Hasil tes menunjukkan tingkat stres yang cukup tinggi. Kami menyarankan untuk segera berkonsultasi dengan guru BK.',
          'stress_alert',
          ${result[0].id},
          'stress_test'
        )
      `;

      // Also notify teachers/counselors about high stress student
      const teachers = await sql`
        SELECT id FROM users WHERE role = 'teacher'
      `;

      for (const teacher of teachers) {
        await sql`
          INSERT INTO notifications (
            user_id,
            title,
            message,
            notification_type,
            related_id,
            related_type
          )
          VALUES (
            ${teacher.id},
            'Siswa dengan Tingkat Stres Tinggi',
            'Seorang siswa menunjukkan tingkat stres ${stressPercentage}% pada tes terbaru. Pertimbangkan untuk memberikan perhatian khusus.',
            'teacher_alert',
            ${result[0].id},
            'stress_test'
          )
        `;
      }
    }

    return Response.json({
      success: true,
      message: "Hasil tes berhasil disimpan",
      testId: result[0].id,
      testDate: result[0].test_date,
    });
  } catch (error) {
    console.error("Error saving stress test:", error);
    return Response.json(
      { error: "Terjadi kesalahan saat menyimpan hasil tes" },
      { status: 500 },
    );
  }
}
