export interface DatabaseEnv {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`The environment variable ${key} is not set.s`);
  }
  return value;
}

export function getDatabaseEnv(): DatabaseEnv {
  return {
    host: requireEnv('DB_HOST'),
    port: Number(process.env.DB_PORT) || 3306,
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_NAME'),
  };
}

export function buildDatabaseUrl(env: DatabaseEnv = getDatabaseEnv()): string {
  const user = encodeURIComponent(env.user);
  const password = encodeURIComponent(env.password);
  return `mysql://${user}:${password}@${env.host}:${env.port}/${env.database}`;
}
