const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

// 删除点云文件及其数据库记录
router.get('/api/delete/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        // 从数据库中查询文件信息
        const query = `
            SELECT path FROM point_clouds WHERE id = $1
        `;
        const result = await db.query(query, [fileId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: '文件记录未找到' });
        }

        const filePath = path.join(__dirname, '../..', result.rows[0].path);

        // 删除文件
        fs.unlinkSync(filePath);

        // 从数据库中删除记录
        const deleteQuery = `
            DELETE FROM point_clouds WHERE id = $1
        `;
        await db.query(deleteQuery, [fileId]);

        res.json({ success: true, message: '文件删除成功' });
    } catch (error) {
        console.error('文件删除失败：', error);
        res.status(500).json({ 
            error: '文件删除处理失败',
            details: error.message 
        });
    }
});

module.exports = router;