const File = require('../models/fileModel');
const path = require('path');
const fs = require('fs');
const lasService = require('../server/lasService');

exports.uploadPointCloud = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    // 解析LAS文件元数据
    const { valid, metadata } = await lasService.validateLas(req.file.path);
    if (!valid) {
      return res.status(400).json({ error: `Invalid LAS file: ${metadata.error}` });
    }

    // 创建数据库记录
    const newFile = await File.create({
      name: req.file.originalname,
      path: `/uploads/las/${req.file.filename}`,
      type: 'LAS',
      metadata: {
        ...metadata,
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

exports.listPointClouds = async (req, res) => {
  try {
    const pointClouds = await File.findAll();
    res.json(pointClouds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadPointCloud = async (req, res) => {
  try {
    const { id } = req.params;
    const pointCloud = await File.findByPk(id);

    if (!pointCloud) {
      return res.status(404).json({ error: '点云文件未找到' });
    }

    const filePath = path.join(__dirname, '../..', pointCloud.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件在服务器上未找到' });
    }

    res.download(filePath, pointCloud.name);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePointCloud = async (req, res) => {
  try {
    const { id } = req.params;
    const pointCloud = await File.findByPk(id);

    if (!pointCloud) {
      return res.status(404).json({ error: '点云文件未找到' });
    }

    // 删除物理文件
    const filePath = path.join(__dirname, '../..', pointCloud.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除数据库记录
    await pointCloud.destroy();

    res.json({ message: '点云文件删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};