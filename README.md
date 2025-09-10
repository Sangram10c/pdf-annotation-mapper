# PDF Field Mapping & Annotation Management

## 📌 Project Overview
This project provides functionality to:
- Upload PDF files to the server.
- Render PDFs on the frontend for interactive field mapping.
- Allow users to draw/select bounding boxes (BBoxes) for fields.
- Save mappings and annotations in the database.
- Fetch saved mappings for reuse.

The system is built with **Node.js (Express)** for the backend and **React.js** for the frontend.  
It uses **MongoDB** for database storage and **Multer** for handling file uploads.

---

## 🚀 Features
1. **PDF Upload**
   - Upload PDFs from the frontend.
   - Files are stored in the `/uploads` folder.
   - Auto-generated unique filename.

2. **PDF Preview & Mapping**
   - Frontend renders the PDF (via `react-pdf` & `pdfjs-dist`).
   - Users can zoom, draw/select bounding boxes.
   - Map fields to form data.

3. **Save Mappings**
   - Save field annotations (BBox, field name, type, etc.) to MongoDB.

4. **Static PDF Access**
   - PDFs are accessible via `/uploads/:filename`.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, Multer, MongoDB, Mongoose
- **Frontend:** React.js, react-konva, react-pdf, pdfjs-dist
- **Database:** MongoDB
- **Other Tools:** dotenv for config, nodemon for development

---

## 📂 Folder Structure

### Backend (`/server`)
```
server/
│── models/
│   └── PdfMapping.js       # MongoDB schema for PDF metadata
│── routes/
│   └── upload.js           # Handles file upload
│── server.js               # Main Express server
│── .env                    # Environment variables (UPLOAD_DIR, DB_URI, etc.)
```

### Frontend (`/client`)
```
client/
│── src/
│   ├── components/
│   │   ├── PdfMapper.jsx   # Main PDF field mapping UI
│   │   └── PdfViewer.jsx   # Handles rendering the PDF
│   ├── api/
│   │   └── endpoints.js    # Central API endpoints config
│   ├── App.js
│   └── main.jsx
│── vite.config.js
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone <repo-url>
cd project-root
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
```
Create a `.env` file:
```env
PORT=5000
UPLOAD_DIR=uploads
DB_URI=mongodb://localhost:27017/pdf-mapper
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd client
npm install
npm run dev
```

---

## ▶️ Running the Project
- Start **backend**: `npm run dev` (on port `5000`)
- Start **frontend**: `npm run dev` (on port `5173` by default)
- Upload PDF → Map fields → Save annotations → Fetch later

---

## 🔑 API Endpoints

### Upload PDF
```http
POST /api/upload/pdf
```
**Form-data field:** `file`  
**Response:**
```json
{
  "pdfId": "68c1b145c960c888d3ec2391",
  "url": "http://localhost:5000/uploads/1757504011131_file.pdf"
}
```

### Save Annotations
```http
POST /api/pdf-annotation-mappings/bulk
```

### Fetch Table Schema
```http
GET /app_admin/api/fetch-create-table
```

---

## ⚠️ Common Issues

1. **PDF Asks for Password**
   - The PDF might be corrupted or not fully loaded. Ensure upload works properly.

2. **Fake Worker Error**
   - Fix by importing worker explicitly in React:
   ```js
   import { pdfjs } from "react-pdf";
   import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
   pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
   ```

3. **404 File Not Found**
   - Ensure backend serves static files:
   ```js
   app.use("/uploads", express.static(path.join(__dirname, "uploads")));
   ```

---


