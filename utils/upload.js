const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

module.exports = multer({
  dest: tmpDir,
  limits: { fileSize: 50 * 1024 * 1024 }
});