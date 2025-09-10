import express from 'express';
import AnnotationMapping from '../models/AnnotationMapping.js';
import FieldMetadata from '../models/FieldMetadata.js';

const router = express.Router();

// POST /app_admin/api/fetch-create-table
router.post('/fetch-create-table', async (req, res, next) => {
  try {
    const { process_id, form_id } = req.body || {};
    if (process_id == null || form_id == null) {
      return res.status(400).json({ error: 'process_id and form_id are required' });
    }

    const mappings = await AnnotationMapping.find({ process: process_id, form_id }).lean();
    const metas = await FieldMetadata.find({ process_id, form_id }).lean();
    const metaByField = new Map(metas.map((m) => [m.field_id, m]));

    const result = mappings.map((m) => {
      const meta = metaByField.get(m.field_id) || {};
      return {
        id: m._id,
        annotation: {
          bbox: m.normalized_bbox,
          page: m.page,
          field_id: m.field_id,
          field_name: m.field_name,
          field_header: m.field_header,
          process: m.process,
          form_id: m.form_id,
        },
        table_name: meta.table_name || '',
        field_name: meta.field_name || m.field_name,
        field_type: meta.field_type || m.field_type,
        max_length: meta.max_length ?? 0,
        relation_type: meta.relation_type || '',
        related_table_name: meta.related_table_name || '',
        related_field: meta.related_field || '',
        group: meta.group ?? 1,
        field_header: meta.field_header || m.field_header || '',
        placeholder: meta.placeholder || '',
        required: meta.required ?? false,
        field_options: meta.field_options || '[]',
        types: meta.types || '',
        validation_code: meta.validation_code || null,
        required_if: meta.required_if || null,
        regex_ptn: meta.regex_ptn || null,
        form_id: m.form_id,
        process_id: String(m.process),
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
