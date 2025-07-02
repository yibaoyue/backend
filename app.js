const express = require('express');
const cors = require('cors');
const diameterRouter = require('./server/routes/diameter');
const uploadRouter = require('./server/routes/uploadRoutes');
const config = require('./config/config');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/diameter', diameterRouter);
app.use('/api/pointclouds', uploadRouter);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;