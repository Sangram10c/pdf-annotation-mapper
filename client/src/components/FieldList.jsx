import React from 'react';

export default function FieldList({ fields, onSelect }) {
  return (
    <div className="card scroll">
      <div className="label">Mapped Fields</div>
      {fields.length === 0 && <div className="small">No fields yet.</div>}
      {fields.map((f) => (
        <div key={f.id} className="box" onClick={() => onSelect(f)} style={{ cursor: 'pointer' }}>
          <div><strong>{f.field_name}</strong> <span className="small">(#{f.field_id})</span></div>
          <div className="small">{f.field_header} · {f.field_type}</div>
          <div className="small">page {f.page}</div>
        </div>
      ))}
    </div>
  );
}
