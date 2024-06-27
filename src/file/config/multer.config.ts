import { Request } from 'express';
import { FileFilterCallback, diskStorage } from 'multer';

const fileStorage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');

    // const ext = file.mimetype.split("/")[0];
    // if (ext === "image") {
    //   cb(null, "uploads/images");
    // } else {
    //   cb(null, "uploads/files");
    // }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const multerOptions = {
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000 * 2 }, // maximum 2 MB
};
