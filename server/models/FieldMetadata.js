import mongoose from 'mongoose';

const FieldMetadataSchema = new mongoose.Schema(
  {
    process_id: { type: Number, required: true },
    form_id: { type: Number, required: true },
    field_id: { type: Number, required: true },

    table_name: { type: String },
    field_name: { type: String, required: true },
    field_type: { type: String },
    max_length: { type: Number, default: 0 },
    relation_type: { type: String, default: '' },
    related_table_name: { type: String, default: '' },
    related_field: { type: String, default: '' },
    group: { type: Number, default: 1 },
    field_header: { type: String },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    field_options: { type: String, default: '[]' },
    types: { type: String },
    validation_code: { type: String, default: null },
    required_if: { type: String, default: null },
    regex_ptn: { type: String, default: null },
  },
  { timestamps: true }
);

FieldMetadataSchema.index({ process_id: 1, form_id: 1, field_id: 1 }, { unique: true });

export default mongoose.model('FieldMetadata', FieldMetadataSchema);
