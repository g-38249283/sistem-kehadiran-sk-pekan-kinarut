:

import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
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
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check database connection'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
