const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/uploadController');
const uploadMiddleware = require('../../middlewares/uploadMiddleware');

// LAS文件上传
// LAS文件上传
router.post('/upload/las', 
  uploadMiddleware.handleLasUpload,
  uploadController.uploadLas
);

// 3DTiles文件上传
router.post('/upload/3dtiles', 
  uploadMiddleware.handle3DTilesUpload,
  uploadController.upload3DTiles
);

// 获取已上传文件列表
router.get('/files', uploadController.getFiles);

module.exports = router;