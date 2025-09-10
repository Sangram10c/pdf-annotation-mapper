import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Pdf from '../models/PdfMapping.js';

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/upload/pdf
router.post('/pdf', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const doc = await Pdf.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.filename, 
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // const publicUrl = `${req.protocol}://${req.get('host')}/${doc.path}`;
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${doc.path}`;

    res.status(201).json({ pdfId: doc._id, url: publicUrl });
  } catch (err) {
    next(err);
  }
});

export default router;
