// import bcrypt from 'bcryptjs'
import postgres from "postgres";
import { requests } from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function ensureExtension() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

/* async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `
    })
  )

  return insertedUsers
} */

async function seedRequests() {
  await sql`
    CREATE TABLE IF NOT EXISTS requests (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      trackName VARCHAR(255) NULL,
      artist VARCHAR(255) NULL,
      isPremium BOOLEAN NOT NULL,
      date TIMESTAMPTZ NOT NULL
    );
  `;

  const insertedRequests = await Promise.all(
    requests.map(
      (request) => sql`
        INSERT INTO requests (trackName, artist, isPremium, date)
        VALUES (${request.trackName}, ${request.artist}, ${request.isPremium}, ${request.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedRequests;
}

/* async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  )

  return insertedCustomers
} */

/* async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  )

  return insertedRevenue
} */

export async function GET() {
  try {
    await ensureExtension();
    // eslint-disable-next-line
    const result = await sql.begin((sql) => [seedRequests()]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

/* export async function GET() {
  try {
    await ensureExtension()
    // eslint-disable-next-line
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
    ]) // eslint-disable-line

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
} */
