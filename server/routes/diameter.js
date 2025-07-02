const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置LAS文件上传
const lasStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/las');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadLAS = multer({
  storage: lasStorage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.las') {
      cb(null, true);
    } else {
      cb(new Error('只允许上传LAS格式文件'));
    }
  },
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB限制
});

// 保留原有的直径计算接口
router.get("/estimated-diameter", async (req, res) => {
    try {
        const query = `
            SELECT height_m, crown_width_m, crown_area_sqm 
            FROM huangfushan_chm_segmentation_5m
        `;
        const result = await db.query(query);

        const estimatedDiameters = result.rows.map((row) => {
            // 计算直径（米）并保留2位小数
            const diameter = (row.height_m + row.crown_width_m + Math.sqrt(row.crown_area_sqm))/3;
            return parseFloat(diameter.toFixed(2));
        });
        
        res.json({
            unit: "meters",
            data: estimatedDiameters
        });
    } catch (error) {
        console.error("推算直径参数失败：", error);
        res.status(500).json({ 
            error: "服务器内部错误",
            details: error.message 
        });
    }
});

// 新增LAS文件上传接口
// 新增LAS文件上传接口
router.post('/upload/las', uploadLAS.single('lasFile'), async (req, res) => {
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
// 新增获取已上传LAS文件列表接口
router.get("/las-files", async (req, res) => {
    try {
        const query = `
            SELECT id, name, path, uploaded_at 
            FROM point_clouds 
            WHERE metadata->>'type' = 'LAS'
            ORDER BY uploaded_at DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("获取LAS文件列表失败：", error);
        res.status(500).json({ 
            error: "获取文件列表失败",
            details: error.message 
        });
    }
});
// 删除点云文件
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // 从数据库中删除记录
        const deleteQuery = `
            DELETE FROM point_clouds 
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(deleteQuery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: '文件未找到' });
        }

        // 可以在这里添加删除实际文件的逻辑

        res.json({ success: true, message: '文件删除成功' });
    } catch (error) {
        console.error('删除点云文件失败：', error);
        res.status(500).json({ 
            error: '文件删除处理失败',
            details: error.message 
        });
    }
});
module.exports = router;