const express = require('express');
const cors = require('cors');
const diameterRouter = require('./server/routes/diameter');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', diameterRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误！');
});

module.exports = app;