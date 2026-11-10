import os
import sys
import math
import subprocess
from PIL import Image

RAW_VIDEO = "/home/aditya/Antigravity/temp_raw_noctalia.webm"
AUDIO_TRACK = "/home/aditya/Antigravity/public/studio_soundscape.wav"
OUTPUT_MP4 = "/home/aditya/Antigravity/public/pixel_engine_showcase.mp4"
ARTIFACT_MP4 = "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/pixel_engine_showcase.mp4"

TARGET_W = 1280
TARGET_H = 720
FPS = 25

# Camera keyframes: (time_sec, zoom_level, center_x_norm, center_y_norm)
CAMERA_KEYFRAMES = [
    (0.0,  1.00, 0.50, 0.50),  # Full Overview
    (1.2,  1.00, 0.50, 0.50),  # Hold overview
    (2.4,  1.48, 0.44, 0.52),  # Zoom in onto 8-bit sprite drawing
    (4.6,  1.48, 0.44, 0.52),  # Keep zoomed on sprite
    (5.4,  1.32, 0.38, 0.22),  # Pan up to Rainbow / Life toolbar
    (6.4,  1.22, 0.46, 0.48),  # Re-center for Game of Life expansion
    (9.0,  1.22, 0.46, 0.48),  # Cellular evolution
    (9.8,  1.36, 0.46, 0.72),  # Pan down to Sand physics cascade
    (12.0, 1.36, 0.46, 0.72),  # Sand particles settling
    (13.8, 1.00, 0.50, 0.50),  # Smooth pull back to full desktop UI
    (16.0, 1.00, 0.50, 0.50),  # Final full frame
]

def smoothstep(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)

def get_camera_at(t):
    if t <= CAMERA_KEYFRAMES[0][0]:
        return CAMERA_KEYFRAMES[0][1:]
    if t >= CAMERA_KEYFRAMES[-1][0]:
        return CAMERA_KEYFRAMES[-1][1:]

    for i in range(len(CAMERA_KEYFRAMES) - 1):
        t0, z0, x0, y0 = CAMERA_KEYFRAMES[i]
        t1, z1, x1, y1 = CAMERA_KEYFRAMES[i + 1]
        if t0 <= t <= t1:
            alpha = smoothstep(t0, t1, t)
            zoom = z0 + (z1 - z0) * alpha
            cx = x0 + (x1 - x0) * alpha
            cy = y0 + (y1 - y0) * alpha
            return zoom, cx, cy
    return 1.0, 0.5, 0.5

def main():
    print(f"Reading frames from: {RAW_VIDEO}")

    # Pipe to read raw frames from webm
    read_cmd = [
        "ffmpeg", "-i", RAW_VIDEO,
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-"
    ]
    pipe_in = subprocess.Popen(read_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

    # Pipe to write final cinematic video with audio
    write_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{TARGET_W}x{TARGET_H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_TRACK,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_MP4
    ]
    pipe_out = subprocess.Popen(write_cmd, stdin=subprocess.PIPE)

    frame_bytes = TARGET_W * TARGET_H * 3
    frame_idx = 0

    while True:
        raw = pipe_in.stdout.read(frame_bytes)
        if not raw or len(raw) < frame_bytes:
            break

        time_sec = frame_idx / FPS
        zoom, norm_cx, norm_cy = get_camera_at(time_sec)

        img = Image.frombytes("RGB", (TARGET_W, TARGET_H), raw)

        # Dynamic Zoom & Pan cropping
        if zoom > 1.001:
            crop_w = TARGET_W / zoom
            crop_h = TARGET_H / zoom
            center_x = norm_cx * TARGET_W
            center_y = norm_cy * TARGET_H

            left = max(0, min(TARGET_W - crop_w, center_x - crop_w / 2))
            top = max(0, min(TARGET_H - crop_h, center_y - crop_h / 2))
            right = left + crop_w
            bottom = top + crop_h

            cropped = img.crop((left, top, right, bottom))
            final_frame = cropped.resize((TARGET_W, TARGET_H), Image.Resampling.BICUBIC)
        else:
            final_frame = img

        pipe_out.stdin.write(final_frame.tobytes())
        frame_idx += 1

        if frame_idx % 75 == 0:
            print(f"Rendered cinematic frame {frame_idx} (time: {time_sec:.2f}s, zoom: {zoom:.2f}x)")

    pipe_in.stdout.close()
    pipe_in.wait()
    pipe_out.stdin.close()
    pipe_out.wait()

    print(f"Cinematic video created successfully: {OUTPUT_MP4}")
    import shutil
    shutil.copyfile(OUTPUT_MP4, ARTIFACT_MP4)
    print(f"Copied to artifact path: {ARTIFACT_MP4}")

if __name__ == "__main__":
    main()
