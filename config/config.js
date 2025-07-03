module.exports = {
  port: process.env.PORT || 3001,
  postgres: {  // 统一命名，避免混淆
    user: 'postgres',
    host: 'localhost',
    database: 'GIS',
    password: 'postgres',
    port: 5432,
  },
  uploads: {
    las: 'uploads/las',
    tiles: 'uploads/3dtiles'
  }
};