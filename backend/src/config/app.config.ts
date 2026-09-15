export interface AppConfig {
  port: number;
  environment: string;
  corsOrigins: string[];
}

export const getAppConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '4000', 10),
  environment: process.env.NODE_ENV || 'development',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001').split(','),
});
