import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import AnnotationLayer from './AnnotationLayer.jsx';
import FieldForm from './FieldForm.jsx';
import FieldList from './FieldList.jsx';
import { ENDPOINTS } from '../api/endpoints.js';
import { http } from '../api/http.js';
import { rectToBBox, normalizeBBox } from '../utils/coords.js';

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PdfMapper({ pdfId, url, processId, formId }) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.3);
  const [pageDims, setPageDims] = useState({});
  const [pageBoxes, setPageBoxes] = useState({});
  const [selected, setSelected] = useState(null); // { page, id }
  const [fieldDetails, setFieldDetails] = useState(null);
  const [saved, setSaved] = useState([]);

  function onLoadSuccess({ numPages }) { setNumPages(numPages); }

  function onRenderSuccess(pageNumber, { width, height }) {
    setPageDims((d) => ({ ...d, [pageNumber]: { width, height } }));
  }

  function setBoxesFor(page, updater) {
    setPageBoxes((prev) => ({ ...prev, [page]: updater(prev[page] || []) }));
  }

  const addFieldFromSelection = (page) => {
    if (!selected) return;
    const boxes = pageBoxes[page] || [];
    const sel = boxes.find((b) => b.id === selected.id);
    if (!sel) return;
    const dims = pageDims[page];
    const bbox = rectToBBox(sel);
    const normalized = normalizeBBox(bbox, dims.width, dims.height);

    const payloadItem = {
      pdfId,
      process: Number(processId),
      form_id: Number(formId),
      field_id: Number(fieldDetails?.field_id || Date.now() % 100000),
      field_name: fieldDetails?.field_name || 'Field',
      field_header: fieldDetails?.field_header || '',
      bbox,
      page,
      scale,
      field_type: fieldDetails?.field_type || 'CharField',
      metadata: {
        required: !!fieldDetails?.required,
        max_length: Number(fieldDetails?.max_length || 0),
      },
      normalized_bbox: normalized,
    };

    setSaved((arr) => [
      ...arr,
      { id: `${page}-${sel.id}`, page, ...payloadItem }
    ]);
  };

  const bulkSave = async () => {
    const mappings = saved.map(({ id, ...rest }) => rest);
    const { data } = await http.post(ENDPOINTS.SAVE_MAPPINGS, mappings);
    alert(`Saved ${data.inserted} mappings`);
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="label">PDF Mapper</div>
            <div className="small">pdfId: {pdfId}</div>
          </div>
          <div className="flex">
            <button className="btn" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>-</button>
            <div className="box">Zoom: {scale.toFixed(1)}x</div>
            <button className="btn" onClick={() => setScale((s) => Math.min(3, s + 0.1))}>+</button>
          </div>
        </div>

        <div className="scroll">
          <Document file={url} onLoadSuccess={onLoadSuccess} loading={<div>Loading PDF…</div>}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
              <div key={p} style={{ marginBottom: 24 }}>
                <Page pageNumber={p} scale={scale} renderTextLayer={false} renderAnnotationLayer={false}
                  onRenderSuccess={(page) => onRenderSuccess(p, { width: page.width, height: page.height })}
                />
                {pageDims[p] && (
                  <AnnotationLayer
                    pageWidth={pageDims[p].width}
                    pageHeight={pageDims[p].height}
                    boxes={pageBoxes[p] || []}
                    setBoxes={(updater) => setBoxesFor(p, typeof updater === 'function' ? updater : () => updater)}
                    selectedId={selected?.id}
                    setSelectedId={(id) => setSelected(id ? { page: p, id } : null)}
                  />
                )}
                <div className="flex" style={{ marginTop: 8 }}>
                  <button className="btn" onClick={() => addFieldFromSelection(p)} disabled={!selected || !fieldDetails}>Link selection to field</button>
                </div>
              </div>
            ))}
          </Document>
        </div>
      </div>

      <div>
        <div className="card">
          <FieldForm selectedBox={selected && (pageBoxes[selected.page] || []).find(b => b.id === selected.id)} onChange={setFieldDetails} />
          <div style={{ height: 12 }} />
          <button className="btn" onClick={bulkSave} disabled={saved.length === 0}>Save All ({saved.length})</button>
        </div>
        <div style={{ height: 16 }} />
        <FieldList fields={saved} onSelect={(f) => setSelected({ page: f.page, id: f.id.split('-')[1] })} />
      </div>
    </div>
  );
}
