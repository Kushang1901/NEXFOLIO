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

        // Alter existing table to add password, otp_code, and otp_expiry for custom auth
        await sql`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
        `;
        await sql`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10);
        `;
        await sql`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP;
        `;
        await sql`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(50);
        `;
        
        // Create resumes table
        await sql`
            CREATE TABLE IF NOT EXISTS resumes (
                id SERIAL PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
                resume_name VARCHAR(255) DEFAULT 'My Resume',
                resume_data JSONB NOT NULL,
                selected_template VARCHAR(100) DEFAULT 'classic',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        // Add selected_template column if it doesn't exist
        await sql`
            ALTER TABLE resumes ADD COLUMN IF NOT EXISTS selected_template VARCHAR(100) DEFAULT 'classic';
        `;

        // Add sharing columns if they don't exist
        await sql`
            ALTER TABLE resumes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
        `;
        await sql`
            ALTER TABLE resumes ADD COLUMN IF NOT EXISTS shareable_link VARCHAR(500) DEFAULT NULL;
        `;
        
        // Add payment status column if it doesn't exist
        await sql`
            ALTER TABLE resumes ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;
        `;

        // Create cookie_consents table
        await sql`
            CREATE TABLE IF NOT EXISTS cookie_consents (
                id SERIAL PRIMARY KEY,
                consent_id VARCHAR(100) UNIQUE NOT NULL,
                user_email VARCHAR(255),
                consent_status VARCHAR(50) NOT NULL,
                user_agent TEXT,
                ip_address VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create index on user_email for performance optimization
        await sql`
            CREATE INDEX IF NOT EXISTS idx_cookie_consents_email ON cookie_consents(user_email);
        `;

        console.log("✅ Database initialized successfully (users, resumes, and cookie_consents tables checked/created/migrated)");
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
