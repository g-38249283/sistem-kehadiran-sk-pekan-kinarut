const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { date } = event.queryStringParameters || {};
    
    let query;
    if (date) {
      // Get attendance for specific date
      query = sql`
        SELECT date, day, pit_class, teacher, student_name, student_gender, original_class, present
        FROM attendance_records 
        WHERE date = ${date}
        ORDER BY pit_class, student_name
      `;
    } else {
      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      query = sql`
        SELECT date, day, pit_class, teacher, student_name, student_gender, original_class, present
        FROM attendance_records 
        WHERE date = ${today}
        ORDER BY pit_class, student_name
      `;
    }
    
    const records = await query;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(records)
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
