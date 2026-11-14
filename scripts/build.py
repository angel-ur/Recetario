#!/usr/bin/env python3
"""Genera data/recipes.json y el sitio estatico en _site/.

Fuentes:
  - recipes/*.md            texto canonico de cada receta (fuente de verdad)
  - data/enriquecido.json   datos estructurados del recetario original
                            (cantidades por racion, temporizadores, escenas
                            ilustradas, metodos alternativos), indexado por id

El Markdown manda en el texto; el enriquecido aporta la estructura. Si una
receta nueva no tiene entrada en el enriquecido, se publica igual con los
datos del Markdown (sin escalado de cantidades ni escenas).

Sin dependencias: python3 scripts/build.py
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECIPES = ROOT / "recipes"
OUT = ROOT / "data" / "recipes.json"
ENRIQUECIDO = ROOT / "data" / "enriquecido.json"
SITE = ROOT / "_site"

HEROES_FILE = ROOT / "data" / "heroes_extra.json"
ILU_DIR = ROOT / "data" / "ilustraciones"


def heroe_de(rid):
    f = ILU_DIR / (rid + ".svg")
    if f.exists():
        return {"k": "ilu", "svg": f.read_text(encoding="utf-8").replace("ID", "i_" + rid + "_")}
    return HEROES_EXTRA.get(rid, {"k": "plato"})

HEROES_EXTRA = json.loads(HEROES_FILE.read_text(encoding="utf-8")) if HEROES_FILE.exists() else {}

REQUIRED = ["id", "nombre", "categoria", "region", "dificultad", "tiempo_min"]


def parse_front_matter(text):
    if not text.startswith("---"):
        raise ValueError("falta el front matter (---)")
    end = text.index("\n---", 3)
    block = text[3:end].strip()
    body = text[end + 4:].strip()
    meta = {}
    for line in block.splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        key, _, val = line.partition(":")
        key, val = key.strip(), val.strip()
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1].replace('\\"', '"')
        elif val.startswith("[") and val.endswith("]"):
            val = [v.strip() for v in val[1:-1].split(",") if v.strip()]
        elif val.isdigit():
            val = int(val)
        meta[key] = val
    return meta, body


def parse_fases(content):
    fases = []
    for chunk in re.split(r"^### ", content, flags=re.M)[1:]:
        nombre, _, resto = chunk.partition("\n")
        pasos = []
        lines = resto.splitlines()
        i = 0
        while i < len(lines):
            l = lines[i]
            mm = re.match(r"\s*\d+\.\s+\*\*(.+?)\*\*\s*(?:\((\d+)\s*min\))?\s*-\s*(.*)", l)
            if mm:
                paso = {"t": mm.group(1), "m": int(mm.group(2) or 0), "x": mm.group(3).strip()}
                j = i + 1
                if j < len(lines) and lines[j].strip().startswith(">"):
                    paso["ab"] = lines[j].strip()[1:].strip()
                pasos.append(paso)
            i += 1
        fases.append({"n": nombre.strip(), "pasos": pasos})
    return fases


def parse_recipe(path):
    meta, body = parse_front_matter(path.read_text(encoding="utf-8"))
    for k in REQUIRED:
        if k not in meta:
            raise ValueError(f"{path.name}: falta el campo '{k}'")

    m = re.search(r"^## ", body, re.M)
    intro = body[: m.start()].strip() if m else body.strip()

    ingredientes, fases, secretos = [], [], []
    sec = re.split(r"^## ", body, flags=re.M)
    for chunk in sec[1:]:
        title, _, content = chunk.partition("\n")
        title = title.strip().lower()
        if title.startswith("ingredientes"):
            ingredientes = [l[2:].strip() for l in content.splitlines() if l.strip().startswith("- ")]
        elif title.startswith("elaboraci"):
            fases = parse_fases(content)
        elif title.startswith("secretos"):
            for l in content.splitlines():
                l = l.strip()
                if l.startswith("- "):
                    mm = re.match(r"- \*\*(.+?)\*\*:?\s*(.*)", l)
                    if mm:
                        secretos.append([mm.group(1), mm.group(2)])
    if not ingredientes:
        raise ValueError(f"{path.name}: sin ingredientes")
    if not fases:
        raise ValueError(f"{path.name}: sin elaboracion")
    return meta, intro, ingredientes, fases, secretos


def norm(s):
    return re.sub(r"\s+", " ", s or "").strip()


def subst_tokens(texto, pork):
    """Sustituye {clave} por el nombre del ingrediente (singular o plural)."""
    def rep(m):
        i = pork.get(m.group(1))
        return i["s"] if i else m.group(1)
    return norm(re.sub(r"\{(\w+)\}", rep, texto))


def subst_tokens_plural(texto, pork):
    def rep(m):
        i = pork.get(m.group(1))
        return i["p"] if i else m.group(1)
    return norm(re.sub(r"\{(\w+)\}", rep, texto))


def merge_recipe(meta, intro, ingredientes, fases_md, secretos_md, enr, avisos):
    """Combina el Markdown (texto canonico) con el enriquecido (estructura)."""
    e = {k: enr[k] for k in ("id", "n", "sub", "reg", "lugar", "cat", "dif", "b", "rac") if k in enr}
    for k in ("ud", "notaRac", "listo", "fac", "met", "heroe"):
        if k in enr:
            e[k] = enr[k]
    e["regs"] = enr.get("regs", [enr["reg"]])
    if meta.get("region") != e.get("reg"):
        avisos.append(f"{enr['id']}: region md={meta.get('region')} != enriquecido={e.get('reg')} (manda md)")
        e["reg"] = meta["region"]
    e["intro"] = intro
    e["secretos"] = secretos_md

    pork = {}
    ings = []
    for x in enr.get("ing", []):
        if isinstance(x, str):
            ings.append(x)  # cabecera de grupo, p.ej. '#Para rebozar'
            continue
        nom = x[1].split("|")
        pork[x[0]] = {"s": nom[0], "p": nom[1] if len(nom) > 1 else nom[0]}
        ings.append(x)
    e["ing"] = ings
    if len(ings) != len(ingredientes):
        avisos.append(f"{enr['id']}: {len(ingredientes)} ingredientes en md, {len(ings)} en enriquecido")

    fases = []
    md_plan = [p for f in fases_md for p in f["pasos"]]
    enr_plan = [p for f in enr.get("fases", []) for p in f["p"]]
    if len(md_plan) != len(enr_plan):
        avisos.append(f"{enr['id']}: {len(md_plan)} pasos en md, {len(enr_plan)} en enriquecido")
    idx = 0
    for fi, f in enumerate(enr.get("fases", [])):
        nombre = fases_md[fi]["n"] if fi < len(fases_md) else f["n"]
        pasos = []
        for p in f["p"]:
            md_p = md_plan[idx] if idx < len(md_plan) else None
            idx += 1
            paso = {"t": p["t"], "m": p.get("m", 0), "x": p["x"]}
            for k in ("tim", "f", "w", "pre", "post", "solo", "alt", "e"):
                if k in p:
                    paso[k] = p[k]
            if "ab" in p:
                paso["ab"] = p["ab"]
            if md_p:
                paso["m"] = md_p["m"] or paso["m"]
                # el texto md manda; si coincide con el enriquecido (singular o
                # plural), conservamos las {claves} para el escalado en vivo
                if norm(md_p["x"]) not in (subst_tokens(p["x"], pork), subst_tokens_plural(p["x"], pork)):
                    paso["x"] = md_p["x"]
                if md_p.get("ab"):
                    if "ab" not in paso or norm(md_p["ab"]) not in (subst_tokens(paso.get("ab", ""), pork), subst_tokens_plural(paso.get("ab", ""), pork)):
                        paso["ab"] = md_p["ab"]
                elif "ab" in paso:
                    avisos.append(f"{enr['id']}: paso '{p['t']}' tiene truco en enriquecido y no en md")
            pasos.append(paso)
        fases.append({"n": nombre, "tipo": f.get("tipo", "tu"), "p": pasos})
    e["fases"] = fases
    return e


def fallback_recipe(meta, intro, ingredientes, fases_md, secretos_md):
    """Receta sin enriquecido: se publica con los datos del Markdown."""
    return {
        "id": meta["id"], "n": meta["nombre"], "sub": meta.get("subtitulo", ""),
        "reg": meta["region"], "regs": [meta["region"]], "lugar": meta.get("lugar", ""),
        "cat": meta["categoria"], "dif": int(meta["dificultad"]),
        "b": int(meta.get("raciones", 4)), "rac": [int(meta.get("raciones", 4))],
        "intro": intro,
        "ing": [[f"i{n}", t, None, None, 1, "plano"]
                for n, t in enumerate(ingredientes)],
        "fases": [{"n": f["n"], "tipo": "tu",
                   "p": [dict(p, f=0, **({"w": 1} if p.get("m", 0) >= 120 else {})) for p in f["pasos"]]} for f in fases_md],
        "secretos": secretos_md,
        "heroe": heroe_de(meta["id"]),
    }


def main():
    enriquecido = {r["id"]: r for r in json.loads(ENRIQUECIDO.read_text(encoding="utf-8"))} \
        if ENRIQUECIDO.exists() else {}
    recetas, errores, avisos = [], [], []
    for path in sorted(RECIPES.glob("*.md")):
        if path.name.startswith("_"):
            continue
        try:
            meta, intro, ings, fases, secretos = parse_recipe(path)
            if meta["id"] in enriquecido:
                recetas.append(merge_recipe(meta, intro, ings, fases, secretos,
                                            enriquecido[meta["id"]], avisos))
            else:
                avisos.append(f"{meta['id']}: sin enriquecido, se publica la version simple")
                recetas.append(fallback_recipe(meta, intro, ings, fases, secretos))
        except Exception as e:  # noqa: BLE001
            errores.append(str(e))
    for a in avisos:
        print(f"AVISO: {a}", file=sys.stderr)
    for e in errores:
        print(f"ERROR: {e}", file=sys.stderr)
    if errores:
        sys.exit(1)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(recetas, ensure_ascii=False, indent=1), encoding="utf-8")
    total_pasos = sum(len(f["p"]) for r in recetas for f in r["fases"])
    print(f"OK: {len(recetas)} recetas, {total_pasos} pasos -> {OUT.relative_to(ROOT)}")

    # Sitio estatico listo para desplegar (Cloudflare Pages: directorio _site)
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    for item in ("index.html", "styles.css"):
        shutil.copy(ROOT / item, SITE / item)
    shutil.copytree(ROOT / "js", SITE / "js")
    shutil.copytree(ROOT / "data", SITE / "data")
    print(f"OK: sitio estatico -> {SITE.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
