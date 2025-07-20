import { neon } from '@netlify/neon';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const sql = neon();
  
  try {
    const { date, day, pitClass, teacher, students } = await req.json();
    
    // Delete existing records for this date and class
    await sql`
      DELETE FROM attendance_records 
      WHERE date = ${date} AND pit_class = ${pitClass}
    `;
    
    // Insert new attendance records
    for (const student of students) {
      await sql`
        INSERT INTO attendance_records 
        (date, day, pit_class, teacher, student_name, student_gender, original_class, present)
        VALUES (${date}, ${day}, ${pitClass}, ${teacher}, ${student.name}, ${student.gender}, ${student.originalClass}, ${student.present})
      `;
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
