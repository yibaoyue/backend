const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../../middlewares/uploadMiddleware');
const UploadController = require('../../controllers/uploadController');

router.post('/upload', uploadMiddleware.single('file'), UploadController.uploadPointCloud);
router.get('/list', UploadController.listPointClouds);
router.get('/download/:id', UploadController.downloadPointCloud);
router.delete('/delete/:id', UploadController.deletePointCloud);

module.exports = router;