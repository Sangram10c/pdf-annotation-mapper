export function assertMapping(item) {
  const required = ['process', 'form_id', 'field_id', 'field_name', 'field_type', 'bbox', 'page', 'scale'];
  for (const k of required) {
    if (item[k] === undefined || item[k] === null) {
      const err = new Error(`Missing field: ${k}`);
      err.status = 400;
      throw err;
    }
  }
  const { bbox } = item;
  if (!Array.isArray(bbox) || bbox.length !== 4) {
    const err = new Error(`bbox must be [x1, y1, x2, y2]`);
    err.status = 400;
    throw err;
  }
}
