import express from 'express';
import AnnotationMapping from '../models/AnnotationMapping.js';

const router = express.Router();

// GET /api/pdf-annotation-mappings/?pdfId=&process=&form_id=
router.get('/', async (req, res, next) => {
  try {
    const { pdfId, process, form_id } = req.query;
    const q = {};
    if (pdfId) q.pdfId = pdfId;
    if (process) q.process = Number(process);
    if (form_id) q.form_id = Number(form_id);
    const items = await AnnotationMapping.find(q).lean();
    res.json(items);
  } catch (err) { next(err); }
});

// PUT /api/pdf-annotation-mappings/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const doc = await AnnotationMapping.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
});

// DELETE /api/pdf-annotation-mappings/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await AnnotationMapping.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

export default router;
