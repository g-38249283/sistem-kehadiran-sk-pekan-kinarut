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

7.2 Update add-teacher.js

Edit 
netlify/functions/add-teacher.js
:

import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { name, addedBy } = await req.json();
    
    await sql`
      INSERT INTO teachers (name, added_by) 
      VALUES (${name}, ${addedBy})
    `;
    
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
