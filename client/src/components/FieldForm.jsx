import React, { useState, useEffect } from 'react';

export default function FieldForm({ selectedBox, onChange }) {
  const [state, setState] = useState({ field_id: '', field_name: '', field_header: '', field_type: 'CharField', required: false, max_length: 50 });

  useEffect(() => {
    if (!selectedBox) return;
    setState((s) => ({ ...s, field_id: s.field_id || Date.now() % 100000 }));
  }, [selectedBox]);

  const update = (k, v) => setState((s) => ({ ...s, [k]: v }));

  useEffect(() => { onChange && onChange(state); }, [state]);

  if (!selectedBox) return <div className="small">Select or draw a box to edit field details.</div>;

  return (
    <div className="box">
      <div className="label">Field Details</div>
      <div className="small">Box at x:{Math.round(selectedBox.x)}, y:{Math.round(selectedBox.y)}, w:{Math.round(selectedBox.width)}, h:{Math.round(selectedBox.height)}</div>

      <div style={{ display: 'grid', gap: 8 }}>
        <input className="input" placeholder="Field ID (number)" value={state.field_id} onChange={e => update('field_id', Number(e.target.value))} />
        <input className="input" placeholder="Field Name" value={state.field_name} onChange={e => update('field_name', e.target.value)} />
        <input className="input" placeholder="Field Header" value={state.field_header} onChange={e => update('field_header', e.target.value)} />
        <select className="input" value={state.field_type} onChange={e => update('field_type', e.target.value)}>
          <option>CharField</option>
          <option>DateField</option>
          <option>NumberField</option>
          <option>BoolField</option>
        </select>
        <label className="small">
          <input type="checkbox" checked={state.required} onChange={e => update('required', e.target.checked)} /> Required
        </label>
        <input className="input" type="number" placeholder="Max length" value={state.max_length} onChange={e => update('max_length', Number(e.target.value))} />
      </div>
    </div>
  );
}
