const FileModel = require('../models/fileModel');
const lasService = require('../routes/lasService');
const path = require('path');
const fs = require('fs');

class UploadController {
  static async uploadPointCloud(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // 解析LAS文件元数据
      const metadata = await lasService.parseLasMetadata(req.file.path);
      
      // 存储到数据库
      const pointCloud = await FileModel.createPointCloud(
        req.file.originalname,
        req.file.path,
        metadata
      );

      res.status(201).json(pointCloud);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listPointClouds(req, res) {
    try {
      const pointClouds = await FileModel.getAllPointClouds();
      res.json(pointClouds);
    } catch (error) {
      console.error('List error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async downloadPointCloud(req, res) {
    try {
      const { id } = req.params;
      const pointCloud = await FileModel.getPointCloudById(id);

      if (!pointCloud) {
        return res.status(404).json({ error: 'Point cloud not found' });
      }

      if (!fs.existsSync(pointCloud.path)) {
        return res.status(404).json({ error: 'File not found on server' });
      }

      res.download(pointCloud.path, pointCloud.name);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deletePointCloud(req, res) {
    try {
      const { id } = req.params;
      const pointCloud = await FileModel.deletePointCloud(id);

      if (!pointCloud) {
        return res.status(404).json({ error: 'Point cloud not found' });
      }

      // 删除物理文件
      if (fs.existsSync(pointCloud.path)) {
        fs.unlinkSync(pointCloud.path);
      }

      res.json({ message: 'Point cloud deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UploadController;