import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

export default function AnnotationLayer({ pageWidth, pageHeight, boxes, setBoxes, selectedId, setSelectedId }) {
  const [drawing, setDrawing] = useState(null); // { x, y }

  function onMouseDown(e) {
    if (e.target !== e.target.getStage()) return; // start only on empty space
    const pos = e.target.getStage().getPointerPosition();
    setDrawing({ x: pos.x, y: pos.y });
    const id = `box_${Date.now()}`;
    setBoxes((prev) => [...prev, { id, x: pos.x, y: pos.y, width: 0, height: 0 }]);
    setSelectedId(id);
  }

  function onMouseMove(e) {
    if (!drawing) return;
    const pos = e.target.getStage().getPointerPosition();
    const lastId = selectedId;
    setBoxes((prev) => prev.map(b => b.id === lastId ? ({ ...b, width: pos.x - drawing.x, height: pos.y - drawing.y }) : b));
  }

  function onMouseUp() {
    setDrawing(null);
  }

  function clampToPage(b) {
    const x = Math.max(0, Math.min(b.x, pageWidth));
    const y = Math.max(0, Math.min(b.y, pageHeight));
    const width = Math.max(5, Math.min(Math.abs(b.width), pageWidth - x));
    const height = Math.max(5, Math.min(Math.abs(b.height), pageHeight - y));
    return { ...b, x, y, width, height };
  }

  useEffect(() => {
    setBoxes((prev) => prev.map(clampToPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageWidth, pageHeight]);

  return (
    <Stage width={pageWidth} height={pageHeight} onMouseDown={onMouseDown} onMousemove={onMouseMove} onMouseup={onMouseUp}>
      <Layer>
        {boxes.map((b) => (
          <Rect
            key={b.id}
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            stroke={b.id === selectedId ? '#60a5fa' : '#22d3ee'}
            strokeWidth={2}
            draggable
            onClick={() => setSelectedId(b.id)}
            onDragEnd={(e) => {
              const { x, y } = e.target.position();
              setBoxes((prev) => prev.map(bb => bb.id === b.id ? { ...bb, x, y } : bb));
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
}
