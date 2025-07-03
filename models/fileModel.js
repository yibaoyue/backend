const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

// 明确指定方言为 postgres
const sequelize = new Sequelize({
  username: config.postgres.user,
  host: config.postgres.host,
  database: config.postgres.database,
  password: config.postgres.password,
  port: config.postgres.port,
  dialect: 'postgres'
});

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER, // 改为 INTEGER 以匹配 SERIAL
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  path: DataTypes.STRING,
  metadata: DataTypes.JSONB
}, {
  tableName: 'point_clouds',  
  timestamps: false // 禁用Sequelize自动时间戳
});

// 测试连接
sequelize.authenticate()
  .then(() => console.log('PostgreSQL连接成功'))
  .catch(err => console.error('PostgreSQL连接失败:', err));

module.exports = File;