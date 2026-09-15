export interface DatabaseConfig {
  url: string;
  maxConnections: number;
}

export const getDatabaseConfig = (): DatabaseConfig => ({
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/techwise_db',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
});
