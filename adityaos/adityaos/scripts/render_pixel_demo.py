import os
import sys
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1280
HEIGHT = 720
FPS = 60
TOTAL_FRAMES = 780  # 13 seconds @ 60fps

# Load system font
try:
    FONT_PATH = "/usr/share/fonts/Adwaita/AdwaitaMono-Bold.ttf"
    font_sm = ImageFont.truetype(FONT_PATH, 11)
    font_md = ImageFont.truetype(FONT_PATH, 13)
    font_lg = ImageFont.truetype(FONT_PATH, 18)
    font_xl = ImageFont.truetype(FONT_PATH, 28)
except Exception:
    font_sm = ImageFont.load_default()
    font_md = ImageFont.load_default()
    font_lg = ImageFont.load_default()
    font_xl = ImageFont.load_default()

# Canvas grid dimensions
GRID_COLS = 40
GRID_ROWS = 24
CANVAS_X = 64
CANVAS_Y = 96
CANVAS_W = 1040
CANVAS_H = 580
CELL_W = CANVAS_W / GRID_COLS
CELL_H = CANVAS_H / GRID_ROWS

def hsv_to_rgb(h, s, v):
    c = v * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = v - c
    if 0 <= h < 60:
        r, g, b = c, x, 0
    elif 60 <= h < 120:
        r, g, b = x, c, 0
    elif 120 <= h < 180:
        r, g, b = 0, c, x
    elif 180 <= h < 240:
        r, g, b = 0, x, c
    elif 240 <= h < 300:
        r, g, b = x, 0, c
    else:
        r, g, b = c, 0, x
    return (int((r + m) * 255), int((g + m) * 255), int((b + m) * 255))

# Conway Game of Life step
def step_life(grid):
    counts = {}
    for (r, c), col in grid.items():
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if dr == 0 and dc == 0:
                    continue
                nr, nc = r + dr, c + dc
                counts[(nr, nc)] = counts.get((nr, nc), 0) + 1

    next_grid = {}
    for (r, c), cnt in counts.items():
        if 0 <= r < GRID_ROWS and 0 <= c < GRID_COLS:
            is_alive = (r, c) in grid
            if is_alive and cnt in (2, 3):
                next_grid[(r, c)] = grid[(r, c)]
            elif not is_alive and cnt == 3:
                next_grid[(r, c)] = "#00FFCC"
    return next_grid

# Sand simulation step
def step_sand(grid):
    next_grid = dict(grid)
    keys = sorted(grid.keys(), key=lambda k: -k[0])
    for (r, c) in keys:
        col = next_grid.get((r, c))
        if not col or r >= GRID_ROWS - 1:
            continue
        # Check below
        if (r + 1, c) not in next_grid:
            del next_grid[(r, c)]
            next_grid[(r + 1, c)] = col
        elif c > 0 and (r + 1, c - 1) not in next_grid:
            del next_grid[(r, c)]
            next_grid[(r + 1, c - 1)] = col
        elif c < GRID_COLS - 1 and (r + 1, c + 1) not in next_grid:
            del next_grid[(r, c)]
            next_grid[(r + 1, c + 1)] = col
    return next_grid

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 6:
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
    return (0, 255, 204)

# Predefine retro heart coordinates (relative to center)
HEART_COORDS = [
    (-3, -2), (-3, -1), (-3, 1), (-3, 2),
    (-2, -3), (-2, -2), (-2, -1), (-2, 0), (-2, 1), (-2, 2), (-2, 3),
    (-1, -3), (-1, -2), (-1, -1), (-1, 0), (-1, 1), (-1, 2), (-1, 3),
    (0, -2), (0, -1), (0, 0), (0, 1), (0, 2),
    (1, -1), (1, 0), (1, 1),
    (2, 0),
]

def render():
    out_dir = "/home/aditya/Antigravity/public"
    os.makedirs(out_dir, exist_ok=True)
    video_path = os.path.join(out_dir, "pixel_engine_showcase.mp4")

    # Start ffmpeg pipe
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "18",
        video_path
    ]

    pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

    grid = {}
    mode = "draw"
    life_gen = 0
    rainbow_on = False

    cursor_x = CANVAS_X + 200
    cursor_y = CANVAS_Y + 450
    cursor_label = "Pixel Studio Initialization"
    cursor_click = False

    mid_r = GRID_ROWS // 2
    mid_c = GRID_COLS // 2

    for frame_idx in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (10, 14, 23))
        draw = ImageDraw.Draw(img)

        # 1. Top Window Titlebar
        draw.rectangle([0, 0, WIDTH, 42], fill=(15, 21, 34))
        draw.line([0, 42, WIDTH, 42], fill=(30, 41, 59), width=1)

        # Window dots
        draw.ellipse([14, 16, 24, 26], fill=(239, 68, 68))
        draw.ellipse([30, 16, 40, 26], fill=(245, 158, 11))
        draw.ellipse([46, 16, 56, 26], fill=(16, 185, 129))

        # Title
        draw.text((70, 14), "PIXEL STUDIO // CELLULAR DYNAMICS & SYNTH", fill=(0, 255, 204), font=font_md)
        draw.text((880, 15), "ENGINE: 60FPS • VOXELS: 40×24 • SYNTH: READY", fill=(100, 116, 139), font=font_sm)

        # 2. Mode Selector Bar
        draw.rectangle([0, 43, WIDTH, 80], fill=(13, 17, 28))
        draw.line([0, 80, WIDTH, 80], fill=(30, 41, 59), width=1)

        # Mode buttons
        modes = [("DRAW", "draw"), ("GAME OF LIFE", "life"), ("SAND SIM", "sand")]
        bx = 20
        for label, m_key in modes:
            is_active = (mode == m_key)
            bg = (0, 255, 204) if is_active else (22, 30, 46)
            txt_col = (0, 0, 0) if is_active else (148, 163, 184)
            draw.rounded_rectangle([bx, 50, bx + 115, 73], radius=4, fill=bg, outline=(30, 41, 59))
            draw.text((bx + 12, 55), label, fill=txt_col, font=font_sm)
            bx += 125

        # Rainbow Brush Toggle indicator
        rb_bg = (255, 42, 133) if rainbow_on else (22, 30, 46)
        rb_txt = (255, 255, 255) if rainbow_on else (148, 163, 184)
        draw.rounded_rectangle([bx, 50, bx + 125, 73], radius=4, fill=rb_bg, outline=(30, 41, 59))
        draw.text((bx + 10, 55), "RAINBOW BRUSH", fill=rb_txt, font=font_sm)

        # Autoplay indicator if in life mode
        if mode == "life":
            draw.rounded_rectangle([bx + 135, 50, bx + 270, 73], radius=4, fill=(16, 185, 129), outline=(16, 185, 129))
            draw.text((bx + 145, 55), "▶ AUTOPLAY (EVOLVING)", fill=(0, 0, 0), font=font_sm)
            draw.text((bx + 285, 55), f"GEN: {life_gen}", fill=(0, 255, 204), font=font_sm)

        # 3. Canvas Viewport Area
        draw.rectangle([CANVAS_X, CANVAS_Y, CANVAS_X + CANVAS_W, CANVAS_Y + CANVAS_H], fill=(6, 9, 15), outline=(30, 41, 59), width=1)

        # Subtle grid lines
        for c in range(GRID_COLS + 1):
            gx = CANVAS_X + c * CELL_W
            draw.line([gx, CANVAS_Y, gx, CANVAS_Y + CANVAS_H], fill=(16, 24, 40), width=1)
        for r in range(GRID_ROWS + 1):
            gy = CANVAS_Y + r * CELL_H
            draw.line([CANVAS_X, gy, CANVAS_X + CANVAS_W, gy], fill=(16, 24, 40), width=1)

        # Draw placed pixels
        for (r, c), color in grid.items():
            px = CANVAS_X + c * CELL_W + 1
            py = CANVAS_Y + r * CELL_H + 1
            pw = CELL_W - 2
            ph = CELL_H - 2
            rgb = hex_to_rgb(color) if isinstance(color, str) else color
            draw.rectangle([px, py, px + pw, py + ph], fill=rgb)
            # Inner bevel highlight
            draw.line([px, py, px + pw, py], fill=(255, 255, 255, 60), width=1)

        # 4. Timeline Animation Events
        cursor_click = False

        # Phase 1: Draw 8-bit Heart (Frames 60 - 240)
        if 60 <= frame_idx < 240:
            mode = "draw"
            step = (frame_idx - 60) // 6
            if step < len(HEART_COORDS):
                dr, dc = HEART_COORDS[step]
                target_r = mid_r + dr
                target_c = mid_c + dc
                col = "#FF2A85" if step % 2 == 0 else "#00FFCC"
                grid[(target_r, target_c)] = col
                target_x = CANVAS_X + target_c * CELL_W + CELL_W / 2
                target_y = CANVAS_Y + target_r * CELL_H + CELL_H / 2
                cursor_x += (target_x - cursor_x) * 0.45
                cursor_y += (target_y - cursor_y) * 0.45
                cursor_label = "Drawing 8-bit Sprite"
                cursor_click = True

        # Phase 2: Click Rainbow Brush & Trace Waves (Frames 240 - 380)
        elif 240 <= frame_idx < 380:
            if frame_idx < 270:
                # Move to Rainbow button
                target_x = 450
                target_y = 62
                cursor_x += (target_x - cursor_x) * 0.25
                cursor_y += (target_y - cursor_y) * 0.25
                cursor_label = "Enabling Rainbow Chroma"
                if frame_idx >= 265:
                    rainbow_on = True
                    cursor_click = True
            else:
                # Wave drawing
                rainbow_on = True
                w_step = (frame_idx - 270) // 4
                if w_step <= 24:
                    c = mid_c - 12 + w_step
                    r = mid_r - 6 + int(math.sin(w_step * 0.5) * 3)
                    hue = (w_step * 15) % 360
                    grid[(r, c)] = hsv_to_rgb(hue, 1.0, 1.0)
                    target_x = CANVAS_X + c * CELL_W + CELL_W / 2
                    target_y = CANVAS_Y + r * CELL_H + CELL_H / 2
                    cursor_x += (target_x - cursor_x) * 0.45
                    cursor_y += (target_y - cursor_y) * 0.45
                    cursor_label = "Rainbow Chroma Brush"
                    cursor_click = True

        # Phase 3: Conway's Game of Life Autoplay (Frames 380 - 540)
        elif 380 <= frame_idx < 540:
            if frame_idx < 410:
                # Move to Life button
                target_x = 180
                target_y = 62
                cursor_x += (target_x - cursor_x) * 0.25
                cursor_y += (target_y - cursor_y) * 0.25
                cursor_label = "Switching to Game of Life"
                if frame_idx >= 405:
                    mode = "life"
                    cursor_click = True
            elif frame_idx < 440:
                # Move to Autoplay button
                target_x = 550
                target_y = 62
                cursor_x += (target_x - cursor_x) * 0.25
                cursor_y += (target_y - cursor_y) * 0.25
                cursor_label = "Triggering Autoplay Evolution"
                if frame_idx >= 435:
                    cursor_click = True
            else:
                mode = "life"
                cursor_label = f"Conway B3/S23 Automata (Gen {life_gen})"
                # Float cursor gently around canvas
                cursor_x = CANVAS_X + CANVAS_W / 2 + math.sin(frame_idx * 0.05) * 120
                cursor_y = CANVAS_Y + CANVAS_H / 2 + math.cos(frame_idx * 0.05) * 60
                if frame_idx % 8 == 0:
                    grid = step_life(grid)
                    life_gen += 1

        # Phase 4: Sand Sim mode (Frames 540 - 700)
        elif 540 <= frame_idx < 700:
            if frame_idx < 570:
                target_x = 310
                target_y = 62
                cursor_x += (target_x - cursor_x) * 0.25
                cursor_y += (target_y - cursor_y) * 0.25
                cursor_label = "Switching to Falling Sand Sim"
                if frame_idx >= 565:
                    mode = "sand"
                    cursor_click = True
            else:
                mode = "sand"
                cursor_label = "Cellular Gravity & Sand Physics"
                drop_step = (frame_idx - 570)
                # Drop sand particles
                if drop_step % 3 == 0:
                    c = mid_c - 8 + (drop_step // 3) % 17
                    r = 2
                    col = (251, 191, 36) if (drop_step // 6) % 2 == 0 else (56, 189, 248)
                    grid[(r, c)] = col
                    cursor_x = CANVAS_X + c * CELL_W + CELL_W / 2
                    cursor_y = CANVAS_Y + r * CELL_H + CELL_H / 2
                    cursor_click = True
                grid = step_sand(grid)

        # Phase 5: Outro overlay (Frames 700 - 780)
        elif frame_idx >= 700:
            cursor_label = "Live Interactive Studio"
            alpha = min(1.0, (frame_idx - 700) / 30)
            overlay = Image.new("RGBA", (WIDTH, HEIGHT), (10, 14, 23, int(alpha * 190)))
            o_draw = ImageDraw.Draw(overlay)
            o_draw.rectangle([WIDTH // 2 - 280, HEIGHT // 2 - 90, WIDTH // 2 + 280, HEIGHT // 2 + 90], fill=(15, 23, 42, 235), outline=(0, 255, 204, 200), width=2)
            o_draw.text((WIDTH // 2 - 220, HEIGHT // 2 - 65), "PIXEL STUDIO // CELLULAR ENGINE", fill=(0, 255, 204), font=font_lg)
            o_draw.text((WIDTH // 2 - 220, HEIGHT // 2 - 30), "Retro Canvas • Cellular Automata • Sand Physics", fill=(241, 245, 249), font=font_md)
            o_draw.text((WIDTH // 2 - 220, HEIGHT // 2 + 15), "Live at: adityaos-delta.vercel.app/pixel", fill=(251, 191, 36), font=font_md)
            img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
            draw = ImageDraw.Draw(img)

        # 5. Render Virtual Cursor with Glow
        cx = int(cursor_x)
        cy = int(cursor_y)
        scale = 0.85 if cursor_click else 1.0

        # Cursor SVG polygon points
        c_poly = [
            (cx, cy),
            (cx + int(12 * scale), cy + int(24 * scale)),
            (cx + int(16 * scale), cy + int(16 * scale)),
            (cx + int(25 * scale), cy + int(14 * scale)),
        ]
        # Glow
        draw.polygon(c_poly, fill=(0, 255, 204), outline=(0, 0, 0))

        # Cursor HUD Label
        if cursor_label:
            lw = len(cursor_label) * 8 + 16
            draw.rounded_rectangle([cx + 18, cy - 2, cx + 18 + lw, cy + 18], radius=3, fill=(15, 23, 42), outline=(0, 255, 204))
            draw.text((cx + 25, cy + 1), cursor_label, fill=(0, 255, 204), font=font_sm)

        # Feed frame to ffmpeg pipe
        pipe.stdin.write(img.tobytes())

        if frame_idx % 120 == 0:
            print(f"Rendered frame {frame_idx}/{TOTAL_FRAMES} ({(frame_idx/TOTAL_FRAMES)*100:.1f}%)")

    pipe.stdin.close()
    pipe.wait()
    print(f"Video export complete: {video_path}")

if __name__ == "__main__":
    render()
