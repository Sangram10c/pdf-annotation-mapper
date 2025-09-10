import express from 'express';
import FieldMetadata from '../models/FieldMetadata.js';

const router = express.Router();

// POST /app_admin/api/field-metadata  (create or upsert)
router.post('/field-metadata', async (req, res, next) => {
  try {
    const payload = req.body;
    const filter = { process_id: payload.process_id, form_id: payload.form_id, field_id: payload.field_id };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const doc = await FieldMetadata.findOneAndUpdate(filter, payload, opts);
    res.json(doc);
  } catch (err) { next(err); }
});

// GET /app_admin/api/field-metadata?process_id=&form_id=
router.get('/field-metadata', async (req, res, next) => {
  try {
    const { process_id, form_id } = req.query;
    const q = {};
    if (process_id) q.process_id = Number(process_id);
    if (form_id) q.form_id = Number(form_id);
    const items = await FieldMetadata.find(q).lean();
    res.json(items);
  } catch (err) { next(err); }
});

// DELETE /app_admin/api/field-metadata/:id
router.delete('/field-metadata/:id', async (req, res, next) => {
  try {
    await FieldMetadata.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

export default router;
