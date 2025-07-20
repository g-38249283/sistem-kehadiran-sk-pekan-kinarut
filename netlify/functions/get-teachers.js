import { neon } from '@netlify/neon';

export default async (req, context) => {
  const sql = neon();
  
  try {
    const teachers = await sql`SELECT name FROM teachers ORDER BY name`;
    
    return new Response(JSON.stringify(teachers.map(row => row.name)), {
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
