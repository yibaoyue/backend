const File = require('../models/fileModel');
const path = require('path');
const LasService = require('../server/lasService');

exports.uploadLas = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    // 解析LAS文件元数据
    let metadata = {
      size: req.file.size,
      uploadedAt: new Date()
    };

    try {
      // 添加LAS文件特有的元数据
      const lasMetadata = await LasService.parseLasMetadata(req.file.path);
      metadata = { ...metadata, ...lasMetadata };
    } catch (parseError) {
      console.error('解析LAS元数据失败:', parseError);
      // 即使解析失败也继续，只使用基本元数据
    }

    // 使用统一路径格式
    const filePath = `/uploads/las/${req.file.filename}`;

    // 创建数据库记录
    const newFile = await File.create({
      name: req.file.originalname,
      path: filePath,
      type: 'LAS',
      metadata: metadata
    });

    res.json({
      success: true,
      file: {
        id: newFile.id,
        name: newFile.name,
        path: filePath,
        type: newFile.type,
        metadata: newFile.metadata
      }
    });
  } catch (err) {
    console.error('上传处理错误:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.upload3DTiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    const filePath = `/uploads/3dtiles/${req.file.filename}`;
    
    const newFile = await File.create({
      name: req.file.originalname,
      path: filePath,
      type: '3DTiles',
      metadata: {
        size: req.file.size,
        uploadedAt: new Date()
      }
    });

    res.json({
      success: true,
      file: {
        id: newFile.id,
        name: newFile.name,
        path: filePath,
        type: newFile.type,
        metadata: newFile.metadata
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};