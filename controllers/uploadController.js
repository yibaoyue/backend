const File = require('../models/fileModel');
const path = require('path');

exports.uploadLas = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    // 创建数据库记录
    const newFile = await File.create({
      name: req.file.originalname,
      path: `/uploads/las/${req.file.filename}`,
      type: 'LAS',
      metadata: {
        // 这里可以添加从LAS文件解析的元数据
        size: req.file.size,
        uploadedAt: new Date()
      }
    });

    res.json({
      success: true,
      file: {
        id: newFile.id,
        name: newFile.name,
        path: newFile.path,
        type: newFile.type,
        metadata: newFile.metadata
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};