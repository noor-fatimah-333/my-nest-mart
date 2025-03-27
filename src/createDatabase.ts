// createDatabase.js
import { Client } from 'pg';

export async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE "my_nest_mart"');
    console.log('Database "nest_mart" created successfully.');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database "nest_mart" already exists.');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
