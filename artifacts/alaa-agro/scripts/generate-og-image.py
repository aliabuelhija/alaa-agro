"""Build a purpose-made 1200x630 Open Graph card.

Run from artifacts/alaa-agro with Pillow installed:
    python scripts/generate-og-image.py

Only needs re-running if the branding or hero photo changes.

The previous og:image was the raw hero photo: 1536x1024 (1.50:1) at 359 KB.
Scrapers want 1.91:1 and a small file, and a raw photo carries no branding when
cropped to a chat-preview thumbnail. This composes the port photo, a scrim for
legibility, the real logo and the company wordmark.
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

PUB = pathlib.Path("public")
W, H = 1200, 630

GOLD = (201, 163, 58)
IVORY = (247, 242, 232)
FONTS = pathlib.Path("C:/Windows/Fonts")


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


# ── background: cover-crop the port photo to 1.91:1 ─────────────────────────
photo = Image.open(PUB / "hero/slide-1-port.jpg").convert("RGB")
scale = max(W / photo.width, H / photo.height)
photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
left = (photo.width - W) // 2
top = (photo.height - H) // 2
card = photo.crop((left, top, left + W, top + H))

# ── scrim: dark on the left where the text sits, lighter on the right ───────
scrim = Image.new("L", (W, 1))
for x in range(W):
    t = x / W
    scrim.putpixel((x, 0), int(232 - 150 * t))  # 232 -> 82 alpha
scrim = scrim.resize((W, H))
overlay = Image.new("RGB", (W, H), (13, 24, 20))  # forest dark
card = Image.composite(overlay, card, scrim.point(lambda v: v))
card = Image.blend(card, Image.new("RGB", (W, H), (13, 24, 20)), 0.18)

draw = ImageDraw.Draw(card)

# ── logo ────────────────────────────────────────────────────────────────────
logo = Image.open(PUB / "alaa-agro-logo.png").convert("RGBA")
logo = logo.crop(logo.getbbox())
lh = 250
logo = logo.resize((round(logo.width * lh / logo.height), lh), Image.LANCZOS)
card.paste(logo, (72, (H - lh) // 2 - 10), logo)

# ── wordmark and tagline ────────────────────────────────────────────────────
x = 72 + logo.width + 52
draw.text((x, 214), "ALAA AGRO", font=font("georgiab.ttf", 68), fill=IVORY)
draw.text((x + 4, 292), "T R A D E   L L C", font=font("georgia.ttf", 27), fill=GOLD)
draw.line([(x + 4, 344), (x + 260, 344)], fill=GOLD, width=2)
draw.text((x + 4, 366), "Russian Agricultural Products", font=font("arial.ttf", 27), fill=IVORY)
draw.text((x + 4, 402), "for Global Trade", font=font("arial.ttf", 27), fill=IVORY)
draw.text((x + 4, 452), "Grains · Pulses · Oilseeds · Vegetable Oils",
          font=font("arial.ttf", 21), fill=(200, 214, 200))

# gold rule along the bottom edge, echoing the site's section dividers
draw.rectangle([(0, H - 6), (W, H)], fill=GOLD)

out = PUB / "og-image.jpg"
card.save(out, quality=86, optimize=True, progressive=True)
print(f"wrote {out}  {card.size[0]}x{card.size[1]}  {out.stat().st_size/1024:.0f} KB")
