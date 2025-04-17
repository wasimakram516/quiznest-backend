const multer = require("multer");

// ✅ Allowed file types
const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime"];
const allowedExcelTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

const allowedTypes = [
  ...allowedImageTypes,
  ...allowedVideoTypes,
  ...allowedExcelTypes,
];

// ✅ Multer storage (stores file in memory)
const storage = multer.memoryStorage();

// ✅ File filter for allowed types
const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Allowed: JPG, PNG, MP4, MOV, XLSX, XLS"),
      false
    );
  }
  cb(null, true);
};

// ✅ Allow multiple files (max 5 at a time)
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Max 100MB per file
  fileFilter,
});

module.exports = upload;
