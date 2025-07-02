module.exports = {
  port: 3001,
  postgres: {
    user: 'postgres',
    host: 'localhost',
    database: 'GIS',
    password: 'postgres',
    port: 5432,
    max: 20,            // 连接池最大连接数
    idleTimeoutMillis: 30000, // 连接空闲超时时间
    connectionTimeoutMillis: 2000 // 连接超时时间
  }
};