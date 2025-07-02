const express = require('express');
const router = express.Router(); // 使用Express原生Router
const UploadController = require('../../controllers/uploadController');
const uploadMiddleware = require('../../middlewares/uploadMiddleware');

// 点云文件上传
router.post('/api/upload/las', uploadLAS.single('lasFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "未上传文件" });
        }

        // 这里可以添加LAS文件解析逻辑
        // 例如使用las-js库解析文件头信息
        const fileInfo = {
            originalName: req.file.originalname,
            storedPath: `/uploads/las/${req.file.filename}`,
            size: req.file.size,
            uploadDate: new Date()
        };

        // 将元数据存入PostgreSQL
        const insertQuery = `
            INSERT INTO point_clouds (name, path, metadata, uploaded_at)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const result = await db.query(insertQuery, [
            fileInfo.originalName,
            fileInfo.storedPath,
            JSON.stringify({
                size: fileInfo.size,
                type: 'LAS'
            }),
            fileInfo.uploadDate
        ]);

        res.json({
            success: true,
            fileId: result.rows[0].id,
            fileName: fileInfo.originalName,
            filePath: fileInfo.storedPath
        });
    } catch (error) {
        console.error("LAS文件上传失败：", error);
        res.status(500).json({ 
            error: "文件上传处理失败",
            details: error.message 
        });
    }
});

// 获取已上传点云文件列表
router.get('/api/upload/list', UploadController.listPointClouds);

// 下载点云文件
router.get('/api/upload/download/:id', UploadController.downloadPointCloud);
module.exports = router;