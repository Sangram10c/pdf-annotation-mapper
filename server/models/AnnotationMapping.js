import mongoose from 'mongoose';

const BBoxSchema = new mongoose.Schema(
  {
    x1: { type: Number, required: true },
    y1: { type: Number, required: true },
    x2: { type: Number, required: true },
    y2: { type: Number, required: true },
  },
  { _id: false }
);

const AnnotationMappingSchema = new mongoose.Schema(
  {
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pdf', required: true },

    // Business identifiers
    process: { type: Number, required: true },
    form_id: { type: Number, required: true },

    // Field details
    field_id: { type: Number, required: true },
    field_name: { type: String, required: true },
    field_header: { type: String },
    field_type: { type: String, required: true },

    // Page and geometry
    page: { type: Number, required: true },
    bbox: { type: BBoxSchema, required: true },
    normalized_bbox: { type: BBoxSchema, required: true }, // 0..1 in page space
    scale: { type: Number, required: true },

    // arbitrary extra
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('AnnotationMapping', AnnotationMappingSchema);
