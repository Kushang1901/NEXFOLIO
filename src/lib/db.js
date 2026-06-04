import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export const sql = neon(process.env.DATABASE_URL);

let dbInitialized = false;

// Helper function to initialize database tables
export async function initDb() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                provider VARCHAR(50) DEFAULT 'email',
                photo_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Alter existing table to add photo_url if it doesn't exist
        await sql`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url TEXT;
        `;
        console.log("✅ Database initialized successfully (users table checked/created/migrated)");
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
        throw error;
    }
}

export async function getDb() {
    if (!dbInitialized) {
        await initDb();
        dbInitialized = true;
    }
    return sql;
}
