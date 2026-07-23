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

        // Create payments table
        await sql`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                resume_id INT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                payment_status VARCHAR(50) DEFAULT 'paid',
                payment_id VARCHAR(255) UNIQUE NOT NULL,
                order_id VARCHAR(255) UNIQUE NOT NULL,
                amount NUMERIC(10, 2) DEFAULT 150.00,
                paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create testimonials table
        await sql`
            CREATE TABLE IF NOT EXISTS testimonials (
                id SERIAL PRIMARY KEY,
                user_name VARCHAR(150) NOT NULL,
                user_email VARCHAR(255),
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                feedback TEXT,
                is_public BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create cover_letters table
        await sql`
            CREATE TABLE IF NOT EXISTS cover_letters (
                id SERIAL PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
                letter_name VARCHAR(255) DEFAULT 'My Cover Letter',
                job_title VARCHAR(255) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                hiring_manager VARCHAR(255),
                tone VARCHAR(100) DEFAULT 'Professional',
                selected_template VARCHAR(100) DEFAULT 'classic',
                letter_text TEXT NOT NULL,
                candidate_data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log("✅ Database initialized successfully (users, resumes, cookie_consents, payments, testimonials, and cover_letters tables checked/created/migrated)");
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
