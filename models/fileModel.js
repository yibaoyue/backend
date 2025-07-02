const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.postgres);

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('LAS', '3DTiles'),
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB // 用于存储LAS文件的元数据
  }
}, {
  tableName: 'files',
  timestamps: true
});

// 测试连接
sequelize.authenticate()
  .then(() => console.log('PostgreSQL连接成功'))
  .catch(err => console.error('PostgreSQL连接失败:', err));

module.exports = File;