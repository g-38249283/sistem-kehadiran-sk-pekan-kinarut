:

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const teachers = await sql`SELECT name FROM teachers ORDER BY name`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(teachers.map(row => row.name))
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message,
        details: 'Check database connection'
      })
    };
  }
};
