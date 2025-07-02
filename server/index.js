const express = require("express");
const cors = require("cors");
const diameterRouter = require("./routes/diameter.js");

const app = express();
app.use(cors());
app.use(express.json());

// 挂载路由
app.use(diameterRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});