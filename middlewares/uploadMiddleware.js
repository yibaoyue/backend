const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const ensureUploadsDir = (subdir) => {
  const dir = path.join(__dirname, '../uploads', subdir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// LAS文件上传配置
const lasStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureUploadsDir('las'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 3DTiles上传配置
const tilesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureUploadsDir('3dtiles'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 文件类型验证
const checkFileType = (file, cb, allowedTypes) => {
  const filetypes = new RegExp(allowedTypes.join('|'));
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(`Error: 只允许上传 ${allowedTypes.join(', ')} 格式文件!`);
  }
};

module.exports = {
  handleLasUpload: multer({
    storage: lasStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB限制
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb, ['.las']);
    }
  }).single('file'),

  handle3DTilesUpload: multer({
    storage: tilesStorage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB限制
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb, ['.json', '.3dtiles']);
    }
  }).single('file')
};