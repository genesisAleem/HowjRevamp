"""
Rename and web-optimize ministration images across all folders.
Renames: [folder]-ministration-01.jpg, -02.jpg, etc.
Optimizes: max 1920px wide/tall, JPEG quality 82, sRGB, strips metadata.
Handles HEIC via pillow-heif if installed, else skips with a warning.
"""

import os
import sys
from pathlib import Path

# ── config ───────────────────────────────────────────────────────────────────
BASE = Path(r"C:\Users\Olalekan\Downloads")
FOLDERS = ["Ghana", "Atlanta", "Brazil", "London", "Korea", "Chicago"]
MAX_DIM  = 1920       # max width or height
QUALITY  = 82         # JPEG quality
EXTS     = {".jpg", ".jpeg", ".png", ".heic", ".heif"}

# ── dependencies ─────────────────────────────────────────────────────────────
try:
    from PIL import Image, ImageOps
    import PIL
except ImportError:
    print("Pillow not found. Installing…")
    os.system(f'"{sys.executable}" -m pip install Pillow')
    from PIL import Image, ImageOps

heif_ok = False
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    heif_ok = True
except ImportError:
    try:
        print("pillow-heif not found. Installing…")
        os.system(f'"{sys.executable}" -m pip install pillow-heif')
        import pillow_heif
        pillow_heif.register_heif_opener()
        heif_ok = True
    except Exception:
        print("WARNING: pillow-heif unavailable — HEIC files will be skipped.\n")

# ── helpers ──────────────────────────────────────────────────────────────────
def sort_key(p: Path):
    """Sort by filename, case-insensitive."""
    return p.name.lower()

def process_folder(folder_name: str):
    folder = BASE / folder_name
    if not folder.is_dir():
        print(f"  Skipping {folder_name} — not found")
        return

    prefix = folder_name.lower()

    # collect image files, sorted for deterministic numbering
    files = sorted(
        [f for f in folder.iterdir()
         if f.is_file() and f.suffix.lower() in EXTS
         and not f.name.startswith(prefix + "-ministration")],   # skip already-renamed
        key=sort_key
    )

    if not files:
        print(f"  {folder_name}: no images found")
        return

    count = 0
    for i, src in enumerate(files, start=1):
        suffix = src.suffix.lower()
        is_heic = suffix in {".heic", ".heif"}
        if is_heic and not heif_ok:
            print(f"  SKIP (HEIC) {src.name}")
            continue

        new_name = f"{prefix}-ministration-{i:02d}.jpg"
        dst = folder / new_name

        try:
            img = Image.open(src)
            img = ImageOps.exif_transpose(img)           # auto-rotate
            img = img.convert("RGB")                     # ensure RGB for JPEG

            # resize if needed
            w, h = img.size
            if max(w, h) > MAX_DIM:
                ratio = MAX_DIM / max(w, h)
                img = img.resize(
                    (int(w * ratio), int(h * ratio)),
                    Image.LANCZOS
                )

            img.save(dst, "JPEG", quality=QUALITY, optimize=True,
                     progressive=True)

            # remove original only if it's different from dst
            if src != dst:
                src.unlink()

            size_kb = dst.stat().st_size // 1024
            print(f"  ✓  {src.name}  →  {new_name}  ({size_kb} KB)")
            count += 1

        except Exception as e:
            print(f"  ✗  {src.name}: {e}")

    print(f"  {folder_name}: {count} image(s) processed\n")

# ── main ─────────────────────────────────────────────────────────────────────
print("=" * 60)
print("Ministration image renamer + web optimiser")
print("=" * 60 + "\n")

for folder in FOLDERS:
    print(f"[{folder}]")
    process_folder(folder)

print("Done.")
