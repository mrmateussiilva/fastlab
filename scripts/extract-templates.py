import os
import glob
from PIL import Image, ImageDraw
import numpy as np

BASE_DIR = r"Y:\MOCKUP\MODELOS"
OUTPUT_DIR = r"c:\Users\User\Documents\Mateus\festalab\public\templates-art"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Definir parâmetros de corte limpo (sem fundo, sem rodapé, sem marca d'água Silkart, sem código)
# Painel Redondo: Centro (313.5, 320), Raio 263
# Painel Lateral: Bounding box (92, 85, 396, 708), cantos arredondados raio 28
# Cilindros:
#   G (Alto):  (181, 166, 483, 587)
#   M (Médio): (624, 212, 901, 577)
#   P (Baixo): (1024, 298, 1267, 574)

# Carregar máscara dos cilindros a partir de MOCKUP_CILINDROS.tif
tpl_cyl = Image.open(r"Y:\MOCKUP\MOCKUP_CILINDROS.tif").convert("RGB")
t_arr_cyl = np.array(tpl_cyl)

CYL_COORDS = [
    ("cilindro_g.png", (181, 166, 483, 587)),
    ("cilindro_m.png", (624, 212, 901, 577)),
    ("cilindro_p.png", (1024, 298, 1267, 574))
]

def extract_redondo(src_path, dst_path):
    try:
        img = Image.open(src_path).convert("RGBA")
        cx, cy, r = 313.5, 320, 263
        bbox = (int(cx - r), int(cy - r), int(cx + r), int(cy + r))
        cropped = img.crop(bbox)
        cw, ch = cropped.size
        mask = Image.new("L", (cw, ch), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, cw, ch), fill=255)
        clean = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        clean.paste(cropped, (0, 0), mask=mask)
        clean.thumbnail((600, 600))
        clean.save(dst_path, "PNG", optimize=True)
        return True
    except Exception as e:
        print(f"Erro redondo {src_path}: {e}")
        return False

def extract_lateral(src_path, dst_path):
    try:
        img = Image.open(src_path).convert("RGBA")
        bbox = (92, 85, 396, 708)
        cropped = img.crop(bbox)
        cw, ch = cropped.size
        mask = Image.new("L", (cw, ch), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, cw, ch), radius=28, fill=255)
        clean = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        clean.paste(cropped, (0, 0), mask=mask)
        clean.thumbnail((450, 750))
        clean.save(dst_path, "PNG", optimize=True)
        return True
    except Exception as e:
        print(f"Erro lateral {src_path}: {e}")
        return False

def extract_cylinders(src_path, out_folder):
    try:
        img = Image.open(src_path).convert("RGBA")
        for fname, (x0, y0, x1, y1) in CYL_COORDS:
            sub_tpl = t_arr_cyl[y0:y1+1, x0:x1+1]
            sub_mask = ((sub_tpl[:, :, 0] > 230) & (sub_tpl[:, :, 1] > 230) & (sub_tpl[:, :, 2] > 230)).astype(np.uint8) * 255
            mask_im = Image.fromarray(sub_mask, mode="L")
            sub_img = img.crop((x0, y0, x1+1, y1+1))
            clean_cyl = Image.new("RGBA", sub_img.size, (0, 0, 0, 0))
            clean_cyl.paste(sub_img, (0, 0), mask=mask_im)
            clean_cyl.thumbnail((400, 500))
            dst_path = os.path.join(out_folder, fname)
            clean_cyl.save(dst_path, "PNG", optimize=True)
        return True
    except Exception as e:
        print(f"Erro cilindros {src_path}: {e}")
        return False

# Mapeamento dos 20 temas selecionados
THEMES_CONFIG = [
    { "slug": "3-palavrinhas", "folder": "3 PALAVRINHAS", "name": "3 Palavrinhas (Deus é Amor)", "category": "Infantil", "icon": "🕊️", "color": "from-sky-200 via-amber-100 to-rose-100", "tableFill": "#4FC3F7", "balloons": ["#03A9F4", "#FFEB3B", "#F44336"] },
    { "slug": "mickey-disney", "folder": "MICKEY - DISNEY", "name": "Mickey Mouse & Disney", "category": "Infantil", "icon": "🐭", "color": "from-red-200 via-amber-100 to-zinc-900", "tableFill": "#E53935", "balloons": ["#E53935", "#FFD600", "#212121"] },
    { "slug": "astronauta-espaco", "folder": "ASTRONAUTA - ESPAO - GALXIA", "name": "Astronauta & Galáxia", "category": "Infantil", "icon": "🚀", "color": "from-indigo-300 via-blue-200 to-slate-900", "tableFill": "#1A237E", "balloons": ["#0D47A1", "#FF6F00", "#B0BEC5"] },
    { "slug": "fundo-do-mar", "folder": "FUNDO DO MAR", "name": "Fundo do Mar", "category": "Infantil", "icon": "🐠", "color": "from-teal-200 via-cyan-100 to-sky-300", "tableFill": "#26C6DA", "balloons": ["#00ACC1", "#4DD0E1", "#80CBC4"] },
    { "slug": "sereia", "folder": "SEREIA", "name": "Sereia Encantada", "category": "Infantil", "icon": "🧜‍♀️", "color": "from-purple-200 via-teal-100 to-pink-200", "tableFill": "#BA68C8", "balloons": ["#9C27B0", "#00BCD4", "#E1BEE7"] },
    { "slug": "a-bela-e-a-fera", "folder": "A BELA E A FERA", "name": "A Bela e a Fera", "category": "Princesas", "icon": "🌹", "color": "from-amber-200 via-yellow-100 to-blue-900", "tableFill": "#FBC02D", "balloons": ["#FBC02D", "#1565C0", "#C62828"] },
    { "slug": "branca-de-neve", "folder": "BRANCA DE NEVE", "name": "Branca de Neve", "category": "Princesas", "icon": "🍎", "color": "from-blue-200 via-yellow-100 to-red-300", "tableFill": "#1976D2", "balloons": ["#1976D2", "#FDD835", "#D32F2F"] },
    { "slug": "cinderela", "folder": "CINDERELA", "name": "Cinderela Real", "category": "Princesas", "icon": "👑", "color": "from-sky-200 via-blue-100 to-amber-100", "tableFill": "#64B5F6", "balloons": ["#42A5F5", "#BBDEFB", "#FFD54F"] },
    { "slug": "enrolados-rapunzel", "folder": "ENROLADOS", "name": "Enrolados (Rapunzel)", "category": "Princesas", "icon": "☀️", "color": "from-purple-200 via-amber-100 to-pink-200", "tableFill": "#AB47BC", "balloons": ["#8E24AA", "#FDD835", "#CE93D8"] },
    { "slug": "safari-baby", "folder": "SAFARI BABY", "name": "Safari Baby", "category": "Infantil", "icon": "🦁", "color": "from-amber-100 via-emerald-100 to-orange-100", "tableFill": "#D7CCC8", "balloons": ["#8D6E63", "#81C784", "#FFB74D"] },
    { "slug": "fazendinha", "folder": "FAZENDINHA", "name": "Fazendinha Feliz", "category": "Infantil", "icon": "🐮", "color": "from-amber-200 via-red-100 to-emerald-200", "tableFill": "#E65100", "balloons": ["#E65100", "#43A047", "#FFE082"] },
    { "slug": "dino-baby", "folder": "DINO BABY", "name": "Dino Baby", "category": "Infantil", "icon": "🦕", "color": "from-emerald-200 via-teal-100 to-amber-100", "tableFill": "#4CAF50", "balloons": ["#388E3C", "#81C784", "#FFCC80"] },
    { "slug": "circo-rosa", "folder": "CIRCO ROSA", "name": "Circo Rosa", "category": "Infantil", "icon": "🎪", "color": "from-pink-200 via-rose-100 to-teal-100", "tableFill": "#F48FB1", "balloons": ["#EC407A", "#80CBC4", "#FFF59D"] },
    { "slug": "circo-tradicional", "folder": "CIRCO", "name": "Circo Tradicional", "category": "Infantil", "icon": "🎪", "color": "from-red-200 via-yellow-100 to-blue-200", "tableFill": "#E53935", "balloons": ["#E53935", "#1E88E5", "#FDD835"] },
    { "slug": "bolofofos", "folder": "BOLOFOFOS", "name": "Bolofofos", "category": "Infantil", "icon": "🎶", "color": "from-purple-200 via-cyan-100 to-pink-200", "tableFill": "#7E57C2", "balloons": ["#7E57C2", "#26C6DA", "#FF4081"] },
    { "slug": "patrulha-canina", "folder": "PATRULHA CANINA", "name": "Patrulha Canina", "category": "Infantil", "icon": "🐶", "color": "from-blue-200 via-red-100 to-yellow-200", "tableFill": "#1E88E5", "balloons": ["#1976D2", "#D32F2F", "#FBC02D"] },
    { "slug": "homem-aranha", "folder": "HOMEM ARANHA", "name": "Homem Aranha", "category": "Heróis", "icon": "🕷️", "color": "from-red-300 via-blue-200 to-zinc-900", "tableFill": "#C62828", "balloons": ["#C62828", "#1565C0", "#212121"] },
    { "slug": "herois-vingadores", "folder": "HERIS - VINGADORES - LIGA DA JUSTIA", "name": "Vingadores & Heróis", "category": "Heróis", "icon": "⚡", "color": "from-blue-300 via-red-200 to-amber-200", "tableFill": "#1565C0", "balloons": ["#1565C0", "#B71C1C", "#FFD600"] },
    { "slug": "barbie", "folder": "BARBIE", "name": "Barbie Fashion", "category": "Infantil", "icon": "💖", "color": "from-pink-300 via-rose-200 to-fuchsia-200", "tableFill": "#E91E63", "balloons": ["#D81B60", "#F48FB1", "#FFFFFF"] },
    { "slug": "frozen", "folder": "FROZEN", "name": "Frozen Aventuras Congelantes", "category": "Princesas", "icon": "❄️", "color": "from-cyan-200 via-sky-100 to-blue-200", "tableFill": "#4FC3F7", "balloons": ["#0288D1", "#B3E5FC", "#EDE7F6"] },
    { "slug": "jardim-encantado", "folder": "JARDIM", "name": "Jardim Encantado", "category": "Infantil", "icon": "🌸", "color": "from-pink-100 via-emerald-100 to-purple-100", "tableFill": "#CE93D8", "balloons": ["#BA68C8", "#81C784", "#F48FB1"] }
]

all_subfolders = os.listdir(BASE_DIR)

results = []
for cfg in THEMES_CONFIG:
    # Achar pasta real
    folder_match = None
    target_clean = cfg["slug"].replace("-", "").upper()
    for f in all_subfolders:
        f_clean = f.replace(" ", "").replace("-", "").upper()
        if target_clean in f_clean or f_clean in target_clean or cfg["name"].split()[0].upper() in f.upper():
            folder_match = f
            break
    if not folder_match:
        # Tenta pelo nome original
        for f in all_subfolders:
            if cfg["name"].split()[0].upper() in f.upper():
                folder_match = f
                break

    if not folder_match:
        print(f"Não encontrou pasta para: {cfg['name']}")
        continue

    folder_path = os.path.join(BASE_DIR, folder_match)
    out_theme_dir = os.path.join(OUTPUT_DIR, cfg["slug"])
    os.makedirs(out_theme_dir, exist_ok=True)

    # 1. Redondo
    red_files = sorted(glob.glob(os.path.join(folder_path, "REDONDO", "*.jpg")))
    has_red = False
    if red_files:
        has_red = extract_redondo(red_files[0], os.path.join(out_theme_dir, "redondo.png"))

    # 2. Lateral
    lat_files = sorted(glob.glob(os.path.join(folder_path, "LATERAL*", "*.jpg")))
    has_lat = False
    if lat_files:
        has_lat = extract_lateral(lat_files[0], os.path.join(out_theme_dir, "lateral.png"))

    # 3. Cilindros
    cyl_files = sorted(glob.glob(os.path.join(folder_path, "CILINDRO*", "*.jpg")))
    has_cyl = False
    if cyl_files:
        has_cyl = extract_cylinders(cyl_files[0], out_theme_dir)

    print(f"Tema [{cfg['name']}] -> Redondo: {has_red}, Lateral: {has_lat}, Cilindros: {has_cyl}")
    results.append({
        "cfg": cfg,
        "has_red": has_red,
        "has_lat": has_lat,
        "has_cyl": has_cyl
    })

print(f"\nConcluído processamento de {len(results)} temas!")
