const multer = require("multer");
const path = require("path");

// 🔹 Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images");
    } else if (file.mimetype.startsWith("video")) {
      cb(null, "uploads/videos");
    } else {
      cb(new Error("Invalid file type"), null);
    }
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 🔹 File filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

// ✅ Multer instance
const upload = multer({ storage, fileFilter });

module.exports = { upload };
