// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadFolder = "uploads/";

// // Auto-create folder if it doesn't exist
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder, { recursive: true });
// }

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadFolder),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({ storage });

// module.exports = upload;




const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
