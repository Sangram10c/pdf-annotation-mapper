export function rectToBBox(rect) {
  // rect: { x, y, width, height }
  return [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height];
}

export function normalizeBBox([x1, y1, x2, y2], pageWidth, pageHeight) {
  return {
    x1: x1 / pageWidth,
    y1: y1 / pageHeight,
    x2: x2 / pageWidth,
    y2: y2 / pageHeight,
  };
}

export function denormalizeBBox(n, pageWidth, pageHeight) {
  return {
    x: n.x1 * pageWidth,
    y: n.y1 * pageHeight,
    width: (n.x2 - n.x1) * pageWidth,
    height: (n.y2 - n.y1) * pageHeight,
  };
}
