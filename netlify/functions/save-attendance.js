const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { date, day, pitClass, teacher, students } = JSON.parse(event.body);
    
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
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
