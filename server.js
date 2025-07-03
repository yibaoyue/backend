const express = require('express');
const { query, pool } = require('./server/db');
const diameterRouter = require('./server/routes/diameter');
const deleteRoutes = require('./server/routes/deleteRoutes');
const cors = require('cors');  // 确保这行存在
const config = require('./config/config');
const uploadRoutes = require('./server/routes/uploadRoutes');

// 创建Express应用
const app = express();

// 中间件
app.use(cors()); // 确保CORS中间件在其他路由之前
app.use(express.json());

// 挂载路由
app.use('/api', diameterRouter);
app.use('/api', deleteRoutes); // 挂载删除路由
app.use('/api', uploadRoutes);

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

// 添加一个错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = config.port || 3001;
app.listen(PORT, () => {
    console.log(`后端服务器已启动，端口：${PORT}`);
});