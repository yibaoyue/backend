const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const diameterRouter = require('./server/routes/diameter');
const config = require('./config/config');

// 创建Express应用
const app = express();

// 创建PostgreSQL连接池
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'GIS',
  password: 'postgres',
  port: 5432,
});

// 中间件
app.use(cors());
app.use(express.json());

// 挂载路由
app.use('/api', diameterRouter);

// 保留原有的树木数据接口
app.get('/api/trees', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM huangfushan_chm_segmentation_5m ORDER BY treeid ASC');
        res.json(rows);
    } catch (error) {
        console.error('数据库查询出错：', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = config.port || 3001;
app.listen(PORT, () => {
    console.log(`后端服务器已启动，端口：${PORT}`);
});

// 测试数据库连接
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('PostgreSQL连接失败:', err);
  } else {
    console.log('PostgreSQL连接成功');
  }
});