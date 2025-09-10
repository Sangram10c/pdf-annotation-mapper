import express from 'express';
import AnnotationMapping from '../models/AnnotationMapping.js';
import Pdf from '../models/PdfMapping.js';
import { assertMapping } from '../utils/validatePayload.js';

const router = express.Router();

// POST /api/pdf-annotation-mappings/bulk
router.post('/bulk', async (req, res, next) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : req.body?.mappings;
    if (!Array.isArray(payload) || payload.length === 0) {
      return res.status(400).json({ error: 'Payload must be a non-empty array' });
    }

    // ensure all records reference the same pdfId (recommended)
    const pdfIds = new Set(payload.map((p) => String(p.pdfId)));
    if (pdfIds.size > 1) {
      return res.status(400).json({ error: 'All mappings in a bulk request must use the same pdfId' });
    }

    const pdfId = payload[0].pdfId;
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) return res.status(400).json({ error: 'Invalid pdfId' });

    const docs = payload.map((item) => {
      assertMapping(item);
      const [x1, y1, x2, y2] = item.bbox;
      const n = item.normalized_bbox || item.normalizedBBox || null;

      const normalized_bbox = n
        ? { x1: n.x1, y1: n.y1, x2: n.x2, y2: n.y2 }
        : { x1: 0, y1: 0, x2: 0, y2: 0 }; // fallback

      return {
        pdfId,
        process: item.process,
        form_id: item.form_id,
        field_id: item.field_id,
        field_name: item.field_name,
        field_header: item.field_header,
        field_type: item.field_type,
        page: item.page,
        bbox: { x1, y1, x2, y2 },
        normalized_bbox,
        scale: item.scale,
        metadata: item.metadata || {},
      };
    });

    const created = await AnnotationMapping.insertMany(docs, { ordered: false });
    res.status(201).json({ inserted: created.length, items: created });
  } catch (err) {
    next(err);
  }
});

export default router;
