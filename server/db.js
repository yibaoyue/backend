const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.postgres); // 确保和 config.js 一致

// 测试数据库连接
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('PostgreSQL连接失败:', err);
  } else {
    console.log('PostgreSQL连接成功');
  }
});

// 封装查询方法
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  query,
  pool
};