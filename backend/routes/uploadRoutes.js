import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const UPLOADS_FOLDER = "./frontend/public/uploads";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 4000000, // 4MB
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  console.log("uploaded path ", `/${req.file.path}`);
  const strippedPath = `/${req.file.path}`.split("uploads")[1];
  const finalPath = `/uploads${strippedPath}`;
  console.log("final path ", finalPath);
  res.send(finalPath);
});

export default router;
