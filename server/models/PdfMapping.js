import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    mimetype: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Pdf', PdfSchema);
