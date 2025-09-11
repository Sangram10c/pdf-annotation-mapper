import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import uploadRoutes from './routes/upload.js';
import mappingRoutes from './routes/mappings.js';
import mappingExtraRoutes from './routes/mappings_extra.js';
import metadataRoutes from './routes/metadata.js';
import fieldMetaRoutes from './routes/fieldmetadata.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));

// static for uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use('/uploads', express.static('uploads'));


// routes
app.use('/api/upload', uploadRoutes);
app.use('/api/pdf-annotation-mappings', mappingRoutes);
app.use('/api/pdf-annotation-mappings', mappingExtraRoutes);
app.use('/app_admin/api', metadataRoutes);
app.use('/app_admin/api', fieldMetaRoutes);

app.use(notFound);
app.use(errorHandler);

// start
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdfmapping';
connectDB(uri).then(() => {
  app.listen(PORT, () => console.log(`✓ Server listening on http://localhost:${PORT}`));
});
