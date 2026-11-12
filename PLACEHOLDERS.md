# 3D Story Landing — Asset Placeholders & Replacement Guide

This document lists every 3D asset placeholder used along the `diundi.space` journey spline, including spatial dimensions, pixel art textures, recommended artistic styling, and instructions for swapping in final custom models or handcrafted pixel sprites.

All station configurations, seed copy, dates, and links live in [`content/journey.ts`](file:///home/aditya/Antigravity/content/journey.ts).

---

## 1. Station Placeholder Inventory

| Station ID | Title | Asset Key | Current Procedural Placeholder | Target Dimensions | Recommended Art Style | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `00_boot` | System Initializing | `crt_terminal` | CRT Box + Green Phosphor Canvas Texture with blinking cursor | `2.4 x 2.0 x 1.8` units (screen: `1.9 x 1.4`) | 1990s IBM/DEC beige or charcoal CRT monitor, amber/green terminal glyphs | Built & Functional |
| `01_arcade` | Arcade Days | `arcade_cabinet` | Beveled Box Cabinet + Marquee (`VIRTUA COP 2`) + Screen + Coin Door | `2.0 x 4.2 x 2.2` units (screen: `1.6 x 1.3`) | Sega Model 2 upright arcade cabinet, low-poly with unlit 16-color pixel textures | Placeholder (Ready for GLTF or sprite) |
| `02_timeskip` | Timeskip | `warp_tunnel` | 6 Concentric rotating wireframe torus rings + floating billboard card | Radius `3.5 - 7.0` units, Length `36` units | Ethereal time dilation tunnel, cyan & purple vector lines | Built & Functional |
| `03_mfine` | MFine Healthcare | `mfine_claims` | Floating pedestal + Isometric claims dashboard plane (`-62% HR Admin`) | `3.6 x 2.5` plane, `4.2 x 0.4` pedestal | Minimalist dark UI slab with teal clinical accents and crisp pixel text | Built & Functional |
| `04_mosaic` | Mosaic Wellness | `mosaic_habits` | Floating streak matrix display plane (`+44% Day 14 Retention`) | `3.6 x 2.5` plane | Habit calendar grid, emerald green pixel tiles on graphite | Built & Functional |
| `05_quiet-year` | Quiet Year *(optional)* | `quiet_horizon` | Wooden bench + stepped pixel pine tree | Bench: `2.4 x 0.3 x 0.8`, Tree: `1.1 x 3.5` | Japanese stationery woodblock style, muted earth tones | Built & Disabled by default |
| `06_field` | Grassroots Fieldwork | `field_hills` | Terraced hill plateau + bamboo pole frame + Kumaon cognitive diagnostic matrix | Plateau: `4.8 x 0.6 x 3.6`, Board: `3.2 x 2.1` | Tactile organic materials: bamboo, clay, hand-ruled paper diagnostics | Built & Functional |
| `07_studio` | Independent Studio | `studio_desk` | Designer desk + dual-pane client work monitor (`INVENIX`) | Desk: `4.4 x 0.2 x 2.2`, Screen: `2.3 x 1.4` | Calm dark-mode studio workstation, graphite surface with warm lamp glow | Built & Functional |
| `08_builds` | Personal Builds | `builds_trio` | Three hovering angled isometric cards (Pixel Studio, JANEVAL, AdityaOS) | 3 cards: `2.0 x 1.6` each, span `6.0` | High-contrast retro cards showcasing tool identities | Built & Functional |
| `09_landing` | AdityaOS Desktop | `aditya_desktop` | 16:9 monitor frame whose inner screen aligns pixel-for-pixel with the real desktop | `6.6 x 4.0 x 0.2` (screen: `6.4 x 3.8`) | Seamless portal into the live interactive AdityaOS environment | Built & Functional |

---

## 2. Parallax Backdrop Layers

| Layer | Depth (Z) | Asset Source | Dimensions | Description |
| :--- | :--- | :--- | :--- | :--- |
| `dot_grid` | `z = -350` | Procedural 64x64 Canvas Texture (`NearestFilter`) | `800 x 400` | 24px stationery dot grid matching AdityaOS desktop wallpaper |
| `pixel_sun` | `z = -340` | Procedural 160x160 Dithered Sun | `70 x 70` | Stepped horizontal dither bars from `PaperPixelWallpaper.tsx` |
| `ridge_far` | `z = -330` | Stepped Ridge Texture (`#EFE9DE` / `#171B24`) | `800 x 160` | Distant mountain silhouette |
| `ridge_mid` | `z = -310` | Mid Ridge Texture (`#E5DECF` / `#1D222E`) | `800 x 140` | Secondary rolling mountain chain |
| `ridge_near`| `z = -290` | Near Foothills Texture (`#DDD4C3` / `#232A39`) | `800 x 120` | Front foothills anchoring the horizon line |

---

## 3. How to Replace Placeholders with Custom 3D Assets or Sprites

### Option A: Replacing a Texture / Sprite
All textures in `StationLandmarks.ts` are generated via `createPixelCanvasTexture(w, h, draw)`. To use an image file (e.g. `/assets/story/arcade_art.png`):
1. Place your PNG in `public/story/<asset_name>.png`.
2. Load it using Three.js `TextureLoader`:
   ```ts
   const loader = new THREE.TextureLoader();
   const texture = loader.load('/story/arcade_art.png');
   texture.magFilter = THREE.NearestFilter;
   texture.minFilter = THREE.NearestFilter;
   ```
3. Assign the texture to the mesh material:
   ```ts
   const screenMat = new THREE.MeshBasicMaterial({ map: texture });
   ```

### Option B: Replacing with a `.glb` / `.gltf` 3D Model
1. Place the optimized `.glb` file in `public/models/<station_name>.glb` (ensure it is under 150KB, vertex-colored or with pixel palette textures).
2. Use `three/examples/jsm/loaders/GLTFLoader.js`:
   ```ts
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   const loader = new GLTFLoader();
   loader.load("/models/arcade_cabinet.glb", (gltf) => {
     gltf.scene.scale.set(1.5, 1.5, 1.5);
     stationGroup.add(gltf.scene);
   });
   ```

---

## 4. Copyright & Brand Rules
- **Virtua Cop 2**: Referenced strictly as historical text metadata in `JOURNEY_STATIONS[1]`. Do not bundle copyrighted Sega ROMs, sprites, or trademarked logos.
- **Client & Work Assets**: Only use public screenshots and metrics already cleared in `config/caseStudies.ts`.
