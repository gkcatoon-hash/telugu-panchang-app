"""Isolate the gold emblem as a transparent PNG, then composite onto solid
#0A1128 for the icon and adaptive icon so backgrounds are perfectly uniform.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ASSETS = Path("/app/frontend/assets/images")
STORE = Path("/app/store-assets")
STORE.mkdir(exist_ok=True)

NAVY = (10, 17, 40)      # #0A1128
GOLD = (212, 175, 55)


def detect_navy_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    """Return bbox of design region (any non-white, non-checker pixel)."""
    arr = np.array(img.convert("RGB"))
    lum = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
    mask = lum < 180
    if not mask.any():
        return (0, 0, img.width, img.height)
    ys, xs = np.where(mask)
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def emblem_alpha_from(path: Path) -> Image.Image:
    """Given a source that shows a gold emblem on a navy square (with a checker
    outside), return an RGBA image sized to the navy square where:
      - Gold pixels are opaque with gold color preserved
      - Everything non-gold (navy, near-white border artifacts) is transparent
    """
    img = Image.open(path).convert("RGB")
    bbox = detect_navy_bbox(img)
    img = img.crop(bbox)
    arr = np.array(img).astype(np.int16)   # HxWx3

    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # Real gold has: R and G high (>90), B noticeably lower than R.
    #   goldness = (R + G) - 2*B  → positive & large for gold, tiny for
    #   whites/greys (R≈G≈B ⇒ goldness ≈ 0) and negative for pure navy.
    goldness = (r.astype(np.int32) + g.astype(np.int32)) - 2 * b.astype(np.int32)

    # Gold mask: only pixels with a strong warm cast AND enough brightness
    is_gold = (goldness > 55) & (r > 90) & (g > 60)

    # Alpha channel driven by goldness, clamped 0..255
    alpha = np.zeros_like(r, dtype=np.uint8)
    # Soft anti-alias in the "just gold" boundary band
    soft = np.clip(((goldness - 20) * 4).astype(np.int32), 0, 255).astype(np.uint8)
    alpha[is_gold] = np.maximum(soft[is_gold], 200)  # kept pixels ≥200 for solid gold
    # Feather edges: pixels just under threshold get partial alpha
    near_edge = (~is_gold) & (goldness > 20) & (goldness <= 55)
    alpha[near_edge] = soft[near_edge]

    # Force gold color on kept pixels so any bleed-through from bright-white
    # source pixels is neutralised (keeps design purely gold-on-transparent).
    out = arr.copy().astype(np.uint8)
    # Preserve the original R/G/B for smooth shading, but darken any pixel
    # that is too neutral (near-white artifact) toward gold hue.
    neutral = (goldness < 20) & (r > 200)  # near-white border artifact pixels
    out[neutral] = [GOLD[0], GOLD[1], GOLD[2]]
    alpha[neutral] = 0  # completely hide the near-white outline

    rgba = np.concatenate([out, alpha[..., None]], axis=-1)
    return Image.fromarray(rgba, mode="RGBA")


def emblem_on_navy(emblem_rgba: Image.Image, canvas_side: int, scale: float) -> Image.Image:
    """Return an RGB image (canvas_side x canvas_side) of solid #0A1128 with
    the emblem centered and sized to `scale` fraction of the canvas."""
    canvas = Image.new("RGB", (canvas_side, canvas_side), NAVY)
    target = int(canvas_side * scale)
    # Preserve aspect if not square already
    ew, eh = emblem_rgba.size
    m = max(ew, eh)
    if ew != eh:
        sq = Image.new("RGBA", (m, m), (0, 0, 0, 0))
        sq.paste(emblem_rgba, ((m - ew) // 2, (m - eh) // 2), emblem_rgba)
        emblem_rgba = sq
    emb = emblem_rgba.resize((target, target), Image.LANCZOS)
    canvas.paste(emb, ((canvas_side - target) // 2, (canvas_side - target) // 2), emb)
    return canvas


# --- Extract the emblem once from the higher-quality source ---
emblem = emblem_alpha_from(ASSETS / "adaptive-icon-source.png")
emblem.save(ASSETS / "emblem-transparent.png", "PNG", optimize=True)
print(f"emblem-transparent.png saved (size={emblem.size})")

# --- 1. Main app icon (1024x1024, emblem ~86% of canvas) ---
icon = emblem_on_navy(emblem, 1024, scale=0.86)
icon.save(ASSETS / "icon.png", "PNG", optimize=True)
print("icon.png saved (1024x1024, solid navy)")

# --- 2. Adaptive icon foreground (1024x1024, emblem 65% for safe zone) ---
adaptive = emblem_on_navy(emblem, 1024, scale=0.65)
adaptive.save(ASSETS / "adaptive-icon.png", "PNG", optimize=True)
print("adaptive-icon.png saved (1024x1024, solid navy, safe-zone emblem)")

# --- 3. Splash image (kept portrait, from splash source) ---
splash_src = Image.open(ASSETS / "splash-source.png").convert("RGB")
sw, sh = splash_src.size
crop_size = min(sw, sh)
left = (sw - crop_size) // 2
top = max(0, (sh - crop_size) // 2 - int(crop_size * 0.03))
splash_sq = splash_src.crop((left, top, left + crop_size, top + crop_size))
splash_sq = splash_sq.resize((1024, 1024), Image.LANCZOS)
splash_sq.save(ASSETS / "splash-image.png", "PNG", optimize=True)
print("splash-image.png saved")

# --- 4. Favicon (48x48) ---
icon.resize((48, 48), Image.LANCZOS).save(ASSETS / "favicon.png", "PNG", optimize=True)
print("favicon.png saved")

# --- 5. Play Store icon 512x512 ---
icon.resize((512, 512), Image.LANCZOS).save(STORE / "play-store-icon-512.png", "PNG", optimize=True)
print("play-store-icon-512.png saved")

# --- 6. Feature graphic (1024x500) with title overlay ---
fg_src = Image.open(ASSETS / "feature-graphic-source.png").convert("RGB")
target_w, target_h = 1024, 500
src_ratio = fg_src.width / fg_src.height
target_ratio = target_w / target_h
if src_ratio > target_ratio:
    new_h = target_h
    new_w = int(new_h * src_ratio)
else:
    new_w = target_w
    new_h = int(new_w / src_ratio)
fg_src = fg_src.resize((new_w, new_h), Image.LANCZOS)
left = (new_w - target_w) // 2
top = (new_h - target_h) // 2
fg_src = fg_src.crop((left, top, left + target_w, top + target_h))

draw = ImageDraw.Draw(fg_src)
font_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
title_font = None
sub_font = None
for p in font_paths:
    try:
        title_font = ImageFont.truetype(p, 78)
        sub_font_path = p.replace("Bold", "").replace("-Bold", "")
        sub_font = ImageFont.truetype(sub_font_path, 30)
        break
    except Exception:
        continue
if title_font is None:
    title_font = ImageFont.load_default()
    sub_font = ImageFont.load_default()

x, y = 70, 130
draw.text((x + 2, y + 2), "ManaLife", font=title_font, fill=(0, 0, 0))
draw.text((x, y), "ManaLife", font=title_font, fill=GOLD)
draw.text((x + 2, y + 90 + 2), "Calendar", font=title_font, fill=(0, 0, 0))
draw.text((x, y + 90), "Calendar", font=title_font, fill=(255, 255, 255))
draw.text((x, y + 90 + 100), "Telugu Panchang  •  Devotion", font=sub_font, fill=(212, 175, 55))
fg_src.save(STORE / "feature-graphic-1024x500.png", "PNG", optimize=True)
print("feature-graphic-1024x500.png saved")

print("--- All final assets regenerated ---")
