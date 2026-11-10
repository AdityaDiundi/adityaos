// Pure Integer Pixel Shape Rasterizers
// Bresenham lines, Midpoint Ellipses, Triangles, Polygons, and Rounded Rectangles
// All functions write strictly integer grid coordinates [col, row] with no anti-aliasing.

export interface ShapeOptions {
  mode: "outline" | "fill" | "both";
  strokeThickness: number; // 1, 2, 3, 4
  outlineColor: string;
  fillColor: string;
}

export interface PixelPoint {
  col: number;
  row: number;
  color: string;
}

// Bresenham's Integer Line Algorithm with optional integer thickness
export function rasterizeLine(
  c0: number,
  r0: number,
  c1: number,
  r1: number,
  color: string,
  thickness = 1
): PixelPoint[] {
  const points: Map<string, PixelPoint> = new Map();
  const dx = Math.abs(c1 - c0);
  const dy = Math.abs(r1 - r0);
  const sx = c0 < c1 ? 1 : -1;
  const sy = r0 < r1 ? 1 : -1;
  let err = dx - dy;

  let curC = c0;
  let curR = r0;

  const halfT = Math.floor((thickness - 1) / 2);

  while (true) {
    // Apply stroke thickness in integer block
    for (let ty = -halfT; ty <= thickness - 1 - halfT; ty++) {
      for (let tx = -halfT; tx <= thickness - 1 - halfT; tx++) {
        const pc = curC + tx;
        const pr = curR + ty;
        const key = `${pr}_${pc}`;
        if (!points.has(key)) {
          points.set(key, { col: pc, row: pr, color });
        }
      }
    }

    if (curC === c1 && curR === r1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      curC += sx;
    }
    if (e2 < dx) {
      err += dx;
      curR += sy;
    }
  }

  return Array.from(points.values());
}

// Rectangle Rasterizer (Outline, Fill, Both)
export function rasterizeRectangle(
  c0: number,
  r0: number,
  c1: number,
  r1: number,
  options: ShapeOptions
): PixelPoint[] {
  const points: Map<string, PixelPoint> = new Map();
  const minC = Math.min(c0, c1);
  const maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1);
  const maxR = Math.max(r0, r1);
  const t = Math.max(1, options.strokeThickness);

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const isEdge =
        r < minR + t || r > maxR - t || c < minC + t || c > maxC - t;

      if (options.mode === "fill") {
        points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
      } else if (isEdge) {
        points.set(`${r}_${c}`, { col: c, row: r, color: options.outlineColor });
      } else if (options.mode === "both") {
        points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
      }
    }
  }

  return Array.from(points.values());
}

// Midpoint Ellipse Algorithm with Integer Symmetry
export function rasterizeEllipse(
  c0: number,
  r0: number,
  c1: number,
  r1: number,
  options: ShapeOptions
): PixelPoint[] {
  const points: Map<string, PixelPoint> = new Map();
  const minC = Math.min(c0, c1);
  const maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1);
  const maxR = Math.max(r0, r1);

  const rx = (maxC - minC) / 2;
  const ry = (maxR - minR) / 2;
  if (rx <= 0 && ry <= 0) {
    return [{ col: minC, row: minR, color: options.outlineColor }];
  }

  const cx = minC + rx;
  const cy = minR + ry;
  const t = Math.max(1, options.strokeThickness);

  // Exact integer test: (dx / rx)^2 + (dy / ry)^2 <= 1
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const dx = c - cx;
      const dy = r - cy;
      const normDistOuter = (dx * dx) / ((rx + 0.5) * (rx + 0.5)) + (dy * dy) / ((ry + 0.5) * (ry + 0.5));
      if (normDistOuter <= 1.0) {
        const innerRx = Math.max(0.1, rx - t + 0.5);
        const innerRy = Math.max(0.1, ry - t + 0.5);
        const normDistInner = (dx * dx) / (innerRx * innerRx) + (dy * dy) / (innerRy * innerRy);

        const isBorder = normDistInner > 1.0 || rx <= t || ry <= t;

        if (options.mode === "fill") {
          points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
        } else if (isBorder) {
          points.set(`${r}_${c}`, { col: c, row: r, color: options.outlineColor });
        } else if (options.mode === "both") {
          points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
        }
      }
    }
  }

  return Array.from(points.values());
}

// Triangle Rasterizer with Scanline Horizontal Spans
export function rasterizeTriangle(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  options: ShapeOptions
): PixelPoint[] {
  const points: Map<string, PixelPoint> = new Map();

  // If fill or both, perform integer scanline triangle rasterization
  if (options.mode === "fill" || options.mode === "both") {
    // Sort vertices by Y (row) ascending
    const pts = [p0, p1, p2].sort((a, b) => a[1] - b[1]);
    const [x0, y0] = pts[0];
    const [x1, y1] = pts[1];
    const [x2, y2] = pts[2];

    const interpolate = (y: number, yA: number, xA: number, yB: number, xB: number) => {
      if (yA === yB) return xA;
      return xA + ((y - yA) * (xB - xA)) / (yB - yA);
    };

    for (let y = y0; y <= y2; y++) {
      const xA = interpolate(y, y0, x0, y2, x2);
      const xB = y < y1 ? interpolate(y, y0, x0, y1, x1) : interpolate(y, y1, x1, y2, x2);
      const minX = Math.round(Math.min(xA, xB));
      const maxX = Math.round(Math.max(xA, xB));

      for (let x = minX; x <= maxX; x++) {
        points.set(`${y}_${x}`, { col: x, row: y, color: options.fillColor });
      }
    }
  }

  // Draw outline on top with Bresenham edges
  if (options.mode === "outline" || options.mode === "both") {
    const edge1 = rasterizeLine(p0[0], p0[1], p1[0], p1[1], options.outlineColor, options.strokeThickness);
    const edge2 = rasterizeLine(p1[0], p1[1], p2[0], p2[1], options.outlineColor, options.strokeThickness);
    const edge3 = rasterizeLine(p2[0], p2[1], p0[0], p0[1], options.outlineColor, options.strokeThickness);

    [...edge1, ...edge2, ...edge3].forEach((pt) => {
      points.set(`${pt.row}_${pt.col}`, pt);
    });
  }

  return Array.from(points.values());
}

// Polygon Rasterizer with Scanline Parity (Ray-Casting)
export function rasterizePolygon(
  vertices: [number, number][],
  options: ShapeOptions
): PixelPoint[] {
  if (vertices.length < 3) return [];
  const points: Map<string, PixelPoint> = new Map();

  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (const [c, r] of vertices) {
    if (c < minC) minC = c;
    if (c > maxC) maxC = c;
    if (r < minR) minR = r;
    if (r > maxR) maxR = r;
  }

  // Point in polygon test using ray casting
  if (options.mode === "fill" || options.mode === "both") {
    const numVerts = vertices.length;
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        let inside = false;
        for (let i = 0, j = numVerts - 1; i < numVerts; j = i++) {
          const xi = vertices[i][0], yi = vertices[i][1];
          const xj = vertices[j][0], yj = vertices[j][1];
          const intersect =
            yi > r !== yj > r && c < ((xj - xi) * (r - yi)) / (yj - yi || 0.0001) + xi;
          if (intersect) inside = !inside;
        }

        if (inside) {
          points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
        }
      }
    }
  }

  // Outline with Bresenham
  if (options.mode === "outline" || options.mode === "both") {
    for (let i = 0; i < vertices.length; i++) {
      const next = (i + 1) % vertices.length;
      const edge = rasterizeLine(
        vertices[i][0],
        vertices[i][1],
        vertices[next][0],
        vertices[next][1],
        options.outlineColor,
        options.strokeThickness
      );
      edge.forEach((pt) => {
        points.set(`${pt.row}_${pt.col}`, pt);
      });
    }
  }

  return Array.from(points.values());
}

// Rounded Rectangle Rasterizer with Integer Corner Arcs
export function rasterizeRoundedRectangle(
  c0: number,
  r0: number,
  c1: number,
  r1: number,
  radius: number,
  options: ShapeOptions
): PixelPoint[] {
  const points: Map<string, PixelPoint> = new Map();
  const minC = Math.min(c0, c1);
  const maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1);
  const maxR = Math.max(r0, r1);

  const w = maxC - minC + 1;
  const h = maxR - minR + 1;
  const maxRad = Math.floor(Math.min(w, h) / 2);
  const rad = Math.max(1, Math.min(radius, maxRad));
  const t = Math.max(1, options.strokeThickness);

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      // Check which corner quadrant (if any) this pixel belongs to
      let inCorner = false;
      let cornerCenterC = 0;
      let cornerCenterR = 0;

      if (c < minC + rad && r < minR + rad) {
        // Top-left corner
        inCorner = true;
        cornerCenterC = minC + rad;
        cornerCenterR = minR + rad;
      } else if (c > maxC - rad && r < minR + rad) {
        // Top-right corner
        inCorner = true;
        cornerCenterC = maxC - rad;
        cornerCenterR = minR + rad;
      } else if (c < minC + rad && r > maxR - rad) {
        // Bottom-left corner
        inCorner = true;
        cornerCenterC = minC + rad;
        cornerCenterR = maxR - rad;
      } else if (c > maxC - rad && r > maxR - rad) {
        // Bottom-right corner
        inCorner = true;
        cornerCenterC = maxC - rad;
        cornerCenterR = maxR - rad;
      }

      if (inCorner) {
        const dc = c - cornerCenterC;
        const dr = r - cornerCenterR;
        const dist = Math.sqrt(dc * dc + dr * dr);

        if (dist <= rad + 0.5) {
          const isBorder = dist >= rad - t + 0.5;
          if (isBorder) {
            if (options.mode === "outline" || options.mode === "both") {
              points.set(`${r}_${c}`, { col: c, row: r, color: options.outlineColor });
            }
          } else {
            if (options.mode === "fill" || options.mode === "both") {
              points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
            }
          }
        }
      } else {
        // Linear edge or interior
        const isBorder =
          r < minR + t || r > maxR - t || c < minC + t || c > maxC - t;
        if (isBorder) {
          if (options.mode === "outline" || options.mode === "both") {
            points.set(`${r}_${c}`, { col: c, row: r, color: options.outlineColor });
          }
        } else {
          if (options.mode === "fill" || options.mode === "both") {
            points.set(`${r}_${c}`, { col: c, row: r, color: options.fillColor });
          }
        }
      }
    }
  }

  return Array.from(points.values());
}
