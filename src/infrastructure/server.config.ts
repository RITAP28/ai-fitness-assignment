const serverConfig = {
    DEV_URL: process.env.DEV_URL as string,
    PROD_URL: process.env.PROD_URL as string,

    DEV_DB_URL: process.env.DEV_DB_URL as string,
    PROD_DB_URL: process.env.PROD_DB_URL as string,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY_TWO,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    BCRYPT_SALT_ROUNDS: 12,

    // BETTER AUTH CREDENTIALS
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    // SUPABASE CREDENTIALS
    SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL,
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY
};

export default serverConfig;