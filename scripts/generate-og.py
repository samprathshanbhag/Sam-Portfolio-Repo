from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import os

W, H = 1200, 630
bg_color = (20, 19, 19)
amber = (232, 176, 74)
text_primary = (244, 241, 234)
text_secondary = (184, 179, 170)
text_muted = (122, 117, 111)
border_color = (46, 43, 41)

im = Image.new('RGB', (W, H), bg_color)
draw = ImageDraw.Draw(im)

# Outer border
draw.rectangle([(16, 16), (W - 16, H - 16)], outline=border_color, width=2)

# Ambient glow on right
glow_right = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow_right)
gdraw.ellipse([(800, 100), (1200, 500)], fill=(232, 176, 74, 12))
glow_right = glow_right.filter(ImageFilter.GaussianBlur(80))
im.paste(glow_right, (0, 0), glow_right)

# Left panel dimensions: 350 x 438 (exact 4:5 ratio)
px, py = 75, 96
pw, ph = 350, 438

panel_base = Image.new('RGB', (pw, ph), (15, 14, 14))

# Clean warm amber halo glow centered behind head and slightly above it
glow_panel = Image.new('RGB', (pw, ph), (0, 0, 0))
gdraw2 = ImageDraw.Draw(glow_panel)
gx, gy = 175, 105
for r in range(160, 0, -8):
    alpha = int(120 * (1 - r/160.0))
    gdraw2.ellipse([(gx - r, gy - r), (gx + r, gy + r)], fill=(int(232 * alpha / 255), int(176 * alpha / 255), int(74 * alpha / 255)))
glow_panel = glow_panel.filter(ImageFilter.GaussianBlur(25))

# Composite halo glow on panel base
panel_bg = ImageChops.add(panel_base, glow_panel)

# Subtle dot grid at 7% opacity
for gy_dot in range(6, ph, 12):
    for gx_dot in range(6, pw, 12):
        pxl = panel_bg.getpixel((gx_dot, gy_dot))
        panel_bg.putpixel((gx_dot, gy_dot), (min(255, pxl[0] + 16), min(255, pxl[1] + 12), min(255, pxl[2] + 5)))

# Load tightly cropped 4:5 portrait-bw.jpg
bw_path = r'public/portrait-bw.jpg'
if not os.path.exists(bw_path):
    raise FileNotFoundError("Cannot load public/portrait-bw.jpg")

bw = Image.open(bw_path).convert('RGB')
bw_scaled = bw.resize((pw, ph), Image.Resampling.LANCZOS)

# Screen blend mode
panel_composite = ImageChops.screen(panel_bg, bw_scaled)

# Round corners of panel
panel_mask = Image.new('L', (pw, ph), 0)
m_draw = ImageDraw.Draw(panel_mask)
m_draw.rounded_rectangle([(0, 0), (pw, ph)], radius=24, fill=255)

im.paste(panel_composite, (px, py), panel_mask)

# Hairline amber border around panel
draw.rounded_rectangle([(px, py), (px + pw, py + ph)], radius=24, outline=amber, width=1)

# Load fonts
try:
    font_large = ImageFont.truetype('arialbd.ttf', 48)
    font_medium = ImageFont.truetype('arialbd.ttf', 28)
    font_sub = ImageFont.truetype('arial.ttf', 21)
    font_badge = ImageFont.truetype('courbd.ttf', 17)
    font_small = ImageFont.truetype('cour.ttf', 15)
except Exception:
    font_large = font_medium = font_sub = font_badge = font_small = ImageFont.load_default()

# Pill badge on panel at bottom-left: BLR · INDIA
draw.rounded_rectangle([(px + 14, py + ph - 42), (px + 130, py + ph - 14)], radius=14, fill=(20, 19, 19), outline=(46, 43, 41), width=1)
draw.text((px + 24, py + ph - 36), 'BLR · INDIA', fill=text_secondary, font=font_small)

tx = 475
# Brand label
draw.ellipse([(tx, 102), (tx + 12, 114)], fill=amber)
draw.text((tx + 20, 97), 'SAMPRATH SHANBHAG', fill=amber, font=font_badge)

# DP-600 badge
badge_text = 'DP-600 CERTIFIED · SCORE 919/1000'
draw.rounded_rectangle([(W - 395, 92), (W - 70, 126)], radius=12, fill=(35, 30, 24), outline=amber, width=1)
draw.text((W - 380, 100), badge_text, fill=amber, font=font_badge)

# Main Title & Headline
draw.text((tx, 160), 'Data Analyst &', fill=text_primary, font=font_large)
draw.text((tx, 218), 'Fabric Analytics Engineer', fill=text_primary, font=font_large)

# Subtitle
draw.text((tx, 298), 'Specializing in Microsoft Fabric, Power BI, SQL, Python,', fill=text_secondary, font=font_sub)
draw.text((tx, 328), 'and Enterprise Dimensional Warehouses (9D / 10F).', fill=text_secondary, font=font_sub)

# Horizontal separator
draw.line([(tx, 390), (W - 70, 390)], fill=(46, 43, 41), width=1)

# Stats row
stats = [
    ('1.5M+', 'Records Analyzed'),
    ('10+', 'Dashboards Built'),
    ('9D / 10F', 'Enterprise Tables'),
]

sx = tx
for val, lbl in stats:
    draw.text((sx, 415), val, fill=amber, font=font_medium)
    draw.text((sx, 455), lbl, fill=text_muted, font=font_small)
    sx += 205

# Bottom footer line
draw.text((tx, 515), 'Bengaluru, Karnataka, India · samprath.ks@gmail.com', fill=text_muted, font=font_small)

out_path = r'public/og-image.jpg'
im.save(out_path, quality=95)
print('Successfully generated 4:5 halo B&W OG image:', out_path)
