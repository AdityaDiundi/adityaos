# High-Functioning Asset Creation Guide for Story Stations

This guide details the complete, production-grade workflows for creating, optimizing, and integrating assets for the **diundi.space** 3D scroll story journey:
- **Part A: 2D Assets** (Pixel Art Sprites, Multi-layer Parallax Planes, Animated Canvases)
- **Part B: 3D Assets** (Low-Poly GLTF/GLB Models, Palette UV Swatch Mapping, Blender Pipeline)

---

## Part A: Creating High-Functioning 2D Assets

### 1. Integer Resolution & Canvas Framing
All 2D assets follow an integer pixel grid without sub-pixel blurring or anti-aliasing.
- **Hero Station Props** (e.g. arcade cabinet, CRT terminal, studio desk):
  - Target canvas resolution: **160 × 120 px** or **240 × 160 px**
  - World scale in Three.js: ~`2.0` to `3.5` units wide (`PlaneGeometry(3.0, 2.25)`)
- **Backdrop Parallax Layers** (mountain ridges, city skylines):
  - Target canvas resolution: **320 × 90 px** or **480 × 120 px** (tileable horizontally)
- **Small Foreground Accents & Icons**:
  - Target canvas resolution: **32 × 32 px** or **64 × 64 px**

### 2. Strict 24-Color Retro Palette
Every pixel must match the site's unified 24-color palette:
- **Background / Shadows**: `#0A0D0E`, `#131A2E`, `#1B263B`, `#222A21`, `#1C1917`
- **Midtones / Ramps**: `#415A77`, `#778DA9`, `#576856`, `#8A7B68`, `#78716C`
- **Highlights & Accents**: `#E0E1DD`, `#FAF7F2`, `#00F0FF` (Cyan), `#FFE600` (Amber), `#FF0055` (Ruby)
- **Outline Rule**: Every object silhouette has a 1px non-black darker outline (calculated in OKLab color space preserving the underlying hue). Avoid `#000000` pitch black outlines which destroy retro pixel depth.

### 3. Layered Parallax Setup
To create real 2.5D depth, break station compositions into distinct planes along the Z-axis:
1. **Backdrop Sky / Moon Plane**: $Z = -80$ to $-120$, scale factor $0.05$ camera parallax.
2. **Distant Mountain Ridge**: $Z = -40$ to $-60$, scale factor $0.15$.
3. **Mid-ground Architecture / Foliage**: $Z = -15$ to $-25$, scale factor $0.40$.
4. **Hero Station Landmark**: Anchored directly at `STATION_COORDINATES[stationId].position`.
5. **Foreground Framing**: $Z = +2$ to $+4$ relative to station anchor, scale factor $1.20$.

### 4. Three.js Material & Texture Standards
When importing 2D pixel art textures into Three.js:
```typescript
import * as THREE from "three";
import { StationAssetLoader } from "./StationAssetLoader";

// Method 1: Using the helper
const spriteMesh = await StationAssetLoader.loadPixelSprite("/assets/story/arcade_hero.png", {
  width: 3.2,
  height: 2.4,
  alphaTest: 0.5,
  position: new THREE.Vector3(12, 1, -40),
});
scene.add(spriteMesh);

// Method 2: Manual Three.js texture setup
const texture = new THREE.TextureLoader().load("/assets/story/hero.png");
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
texture.generateMipmaps = false;

const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: false, // Prevents z-buffer alpha sorting artifacts
  alphaTest: 0.5,     // Hard 1-bit alpha cutout for crisp pixel boundaries
  side: THREE.DoubleSide,
});
```

### 5. Recommended 2D Authoring Tools
1. **AdityaOS Built-in Pixel Studio** (`diundi.space/pixel`):
   - Already includes the exact color palettes, integer grids, and instant export.
2. **Aseprite** (Desktop industry standard):
   - Export with fixed 24-color palette `.gpl` file.
   - For animated loops (e.g. blinking monitors, scanlines), export as horizontal spritesheets or sequential PNG frames.

---

## Part B: Creating High-Functioning 3D Assets

### 1. Geometry & Polycount Guidelines
Low-poly pixel styling relies on clean, intentional planar topology rather than high density:
- **Hero Prop (Arcade, Terminal, Desk)**: **500 to 1,500 triangles**.
- **Station Environment (Ground platform, props, signage)**: **2,000 to 5,000 triangles max**.
- **Shading**: Use **Flat Shading** (`flatShading: true` in Three.js or *Flat Shading* in Blender) or hard edge marks. Do not use smooth normal smoothing on flat pixelated planes.
- **Modifiers**: Apply all modifiers (Boolean, Mirror, Solidify) before exporting.

### 2. The Color-Swatch UV Palette Technique (Industry Standard)
Instead of high-res UV unwrapped textures, use a **16 × 16 pixel color swatch texture** (`palette_swatch.png`):
1. Create a `16x16` or `24x1` PNG containing each color from `PIXEL_PALETTE_24` in a 1-pixel cell.
2. In Blender's **UV Editing workspace**:
   - Select all faces of a given material/color (e.g., the CRT cabinet casing).
   - In the UV Editor, select all vertices and scale them down to `0` (`S -> 0 -> Enter`).
   - Drag that collapsed UV point into the center of the corresponding color pixel on the swatch image.
3. **Benefits**:
   - **Texture file size**: Under **1 KB**!
   - **Memory**: Negligible VRAM usage.
   - **Zero texture stretching**: Sharp flat colors from any camera angle, zoom distance, or resolution.
   - **Performance**: Multiple meshes can share the exact same material and texture, reducing draw calls to 1.

### 3. Blender Export Settings for Three.js
In Blender (`File -> Export -> glTF 2.0 (.glb)`):
- **Format**: `glTF Binary (.glb)` (packs geometry, hierarchy, and palette into one binary file).
- **Include**:
  - `Selected Objects` (keep cameras and lights unchecked).
  - `Custom Properties` (optional).
- **Transform**:
  - `+Y Up` (standard glTF orientation, matching Three.js).
- **Geometry**:
  - `Apply Modifiers`: **Checked**.
  - `Normals`: **Checked**.
  - `Tangents`: Unchecked.
  - `Vertex Colors`: **Checked** (if using vertex color baking).
- **Materials**:
  - `Export Materials`: **Checked**.
  - `Images`: Embed.
- **Compression**:
  - Optional Draco compression for files over 200 KB (low-poly models are typically under 40 KB uncompressed).

### 4. Integration into `StoryWorld`
Drop your exported `.glb` files into `public/assets/story/`:
```
public/assets/story/
├── models/
│   ├── terminal_boot.glb
│   ├── arcade_machine.glb
│   ├── desk_workstation.glb
│   └── aditya_os_tower.glb
└── sprites/
    ├── backdrop_mountains.png
    └── scanline_overlay.png
```

Load them cleanly into `components/Story/world/StationLandmarks.ts` or `StoryWorld.ts`:
```typescript
import { StationAssetLoader } from "./StationAssetLoader";

// Loading into a station
async function setupStationAssets(stationGroup: THREE.Group) {
  const model = await StationAssetLoader.loadStationModel(
    "/assets/story/models/arcade_machine.glb",
    {
      targetHeight: 3.0,     // Automatically scales model height to 3 Three.js units
      position: new THREE.Vector3(12, 0, -40),
      flatShading: true,     // Enforces pixelated low-poly facets
    }
  );
  stationGroup.add(model);
}
```

---

## 3D Viewport Interaction Summary

The 3D space is equipped with intuitive CAD/Blender viewport controls:
| Action | Input (Mouse) | Input (Touch) | Keyboard |
| :--- | :--- | :--- | :--- |
| **Orbit** | Left Click + Drag | 1 Finger Drag | — |
| **Pan** | Shift + Drag / Right Click Drag | 2 Finger Drag | — |
| **Zoom** | Wheel (Inspect mode / Ctrl/Alt) | 2 Finger Pinch | `+` / `-` |
| **Inspect Mode** | Toggle `[3D ORBIT]` Pill | Tap Pill | `I` |
| **Reset to Track** | Click `[RESET]` Button | Tap Reset | `R` / `Esc` |
