import os
import sys
import math
import subprocess
import shutil
from PIL import Image

RAW_VIDEO = "/home/aditya/Antigravity/temp_raw_noctalia.webm"
AUDIO_TRACK = "/home/aditya/Antigravity/public/studio_soundscape.wav"
OUTPUT_MP4 = "/home/aditya/Antigravity/public/pixel_engine_showcase.mp4"
ARTIFACT_MP4 = "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/pixel_engine_showcase.mp4"

TARGET_W = 1280
TARGET_H = 720
FPS = 60  # 60 FPS
START_SEC = 1.7  # Completely skips white load screen & initial portfolio flash!
TOTAL_DURATION = 14.0  # Exactly 14.0 seconds (840 frames)

# Camera keyframes: (time_sec, zoom_level, center_x_norm, center_y_norm)
CAMERA_KEYFRAMES = [
    (0.0,  1.00, 0.50, 0.50),  # Full Overview - Pixel Studio cleanly centered
    (0.4,  1.00, 0.50, 0.50),  # Virtual cursor boots Pixel Studio
    (1.1,  1.42, 0.44, 0.52),  # Smooth zoom into 8-bit sprite drawing
    (2.4,  1.42, 0.44, 0.52),  # Finish sprite
    (3.2,  1.28, 0.38, 0.24),  # Pan up to Rainbow brush button & toolbar
    (4.0,  1.18, 0.46, 0.48),  # Re-center for rainbow wave and Game of Life
    (7.6,  1.18, 0.46, 0.48),  # Cellular evolution
    (8.6,  1.32, 0.46, 0.70),  # Pan down to falling sand cascade
    (10.8, 1.32, 0.46, 0.70),  # Sand particles settling
    (12.2, 1.00, 0.50, 0.50),  # Smooth pull back to full desktop UI overview
    (14.0, 1.00, 0.50, 0.50),  # Final hold on full desktop overview
]

def smootherstep(edge0, edge1, x):
    """Ken Perlin's smootherstep with 1st and 2nd derivatives zero at endpoints"""
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)

def get_camera_at(t):
    if t <= CAMERA_KEYFRAMES[0][0]:
        return CAMERA_KEYFRAMES[0][1:]
    if t >= CAMERA_KEYFRAMES[-1][0]:
        return CAMERA_KEYFRAMES[-1][1:]

    for i in range(len(CAMERA_KEYFRAMES) - 1):
        t0, z0, x0, y0 = CAMERA_KEYFRAMES[i]
        t1, z1, x1, y1 = CAMERA_KEYFRAMES[i + 1]
        if t0 <= t <= t1:
            alpha = smootherstep(t0, t1, t)
            zoom = z0 + (z1 - z0) * alpha
            cx = x0 + (x1 - x0) * alpha
            cy = y0 + (y1 - y0) * alpha
            return zoom, cx, cy
    return 1.0, 0.5, 0.5

def main():
    print(f"--- Launching 60 FPS Studio-Only Video Renderer ---")
    print(f"Source video: {RAW_VIDEO} (seeking start: {START_SEC}s to remove portfolio frames)")
    print(f"Audio track: {AUDIO_TRACK}")
    print(f"Framerate: {FPS} FPS, Duration: {TOTAL_DURATION}s")

    # Read decoded frames seeking past initial portfolio load
    read_cmd = [
        "ffmpeg",
        "-ss", str(START_SEC),
        "-i", RAW_VIDEO,
        "-t", str(TOTAL_DURATION),
        "-vf", f"fps={FPS},minterpolate=fps={FPS}:mi_mode=blend",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-"
    ]
    pipe_in = subprocess.Popen(read_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

    # Output high bitrate 60 FPS MP4 with AAC stereo audio
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
        "-preset", "fast",
        "-crf", "17",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        OUTPUT_MP4
    ]
    pipe_out = subprocess.Popen(write_cmd, stdin=subprocess.PIPE)

    frame_bytes = TARGET_W * TARGET_H * 3
    frame_idx = 0
    max_frames = int(TOTAL_DURATION * FPS)

    while frame_idx < max_frames:
        raw = pipe_in.stdout.read(frame_bytes)
        if not raw or len(raw) < frame_bytes:
            break

        time_sec = frame_idx / FPS
        zoom, norm_cx, norm_cy = get_camera_at(time_sec)

        img = Image.frombytes("RGB", (TARGET_W, TARGET_H), raw)

        # Dynamic Subpixel Zoom & Pan using Image.Transform.EXTENT
        if zoom > 1.001:
            crop_w = TARGET_W / zoom
            crop_h = TARGET_H / zoom
            center_x = norm_cx * TARGET_W
            center_y = norm_cy * TARGET_H

            left = max(0.0, min(float(TARGET_W - crop_w), center_x - crop_w / 2.0))
            top = max(0.0, min(float(TARGET_H - crop_h), center_y - crop_h / 2.0))
            right = left + crop_w
            bottom = top + crop_h

            final_frame = img.transform(
                (TARGET_W, TARGET_H),
                Image.Transform.EXTENT,
                (left, top, right, bottom),
                resample=Image.Resampling.BICUBIC
            )
        else:
            final_frame = img

        pipe_out.stdin.write(final_frame.tobytes())
        frame_idx += 1

        if frame_idx % (FPS * 2) == 0:
            print(f"  [60fps] Rendered frame {frame_idx}/{max_frames} ({time_sec:.1f}s, zoom: {zoom:.2f}x)")

    pipe_in.stdout.close()
    pipe_in.wait()
    pipe_out.stdin.close()
    pipe_out.wait()

    print(f"SUCCESS: Pure Pixel Studio 60 FPS video rendered to: {OUTPUT_MP4}")

    # Copy to artifact directory
    shutil.copyfile(OUTPUT_MP4, ARTIFACT_MP4)
    print(f"SUCCESS: Copied to artifact: {ARTIFACT_MP4}")

    # Mirror to adityaos/public/
    adityaos_pub = "/home/aditya/Antigravity/adityaos/public/pixel_engine_showcase.mp4"
    if os.path.exists(os.path.dirname(adityaos_pub)):
        shutil.copyfile(OUTPUT_MP4, adityaos_pub)
        print(f"SUCCESS: Mirrored to adityaos/public: {adityaos_pub}")

if __name__ == "__main__":
    main()
