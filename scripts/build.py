#!/usr/bin/env python3
"""Genera data/recipes.json a partir de los markdown de recipes/.

Cada receta es un archivo .md con front matter YAML simple y secciones:
  ## Ingredientes      lista con guiones
  ## Elaboracion       fases ### con pasos numerados y trucos en cita (>)
  ## Secretos de la abuela   lista con guiones "- **titulo**: texto"

Sin dependencias externas: parsea solo el formato del proyecto.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECIPES = ROOT / "recipes"
OUT = ROOT / "data" / "recipes.json"

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


def parse_recipe(path):
    meta, body = parse_front_matter(path.read_text(encoding="utf-8"))
    for k in REQUIRED:
        if k not in meta:
            raise ValueError(f"{path.name}: falta el campo '{k}'")

    # Intro: todo lo que hay antes del primer ##
    m = re.search(r"^## ", body, re.M)
    intro = body[: m.start()].strip() if m else body.strip()

    ingredientes, fases, secretos = [], [], []

    sec = re.split(r"^## ", body, flags=re.M)
    for chunk in sec[1:]:
        title, _, content = chunk.partition("\n")
        title = title.strip().lower()
        if title.startswith("ingredientes"):
            ingredientes = [
                l[2:].strip()
                for l in content.splitlines()
                if l.strip().startswith("- ")
            ]
        elif title.startswith("elaboraci"):
            fases = parse_fases(content)
        elif title.startswith("secretos"):
            for l in content.splitlines():
                l = l.strip()
                if l.startswith("- "):
                    mm = re.match(r"- \*\*(.+?)\*\*:?\s*(.*)", l)
                    if mm:
                        secretos.append({"titulo": mm.group(1), "texto": mm.group(2)})
    if not ingredientes:
        raise ValueError(f"{path.name}: sin ingredientes")
    if not fases:
        raise ValueError(f"{path.name}: sin elaboracion")

    return {
        "id": meta["id"],
        "nombre": meta["nombre"],
        "subtitulo": meta.get("subtitulo", ""),
        "region": meta["region"],
        "lugar": meta.get("lugar", ""),
        "categoria": meta["categoria"],
        "dificultad": int(meta["dificultad"]),
        "raciones": int(meta.get("raciones", 4)),
        "tiempo_min": int(meta["tiempo_min"]),
        "tags": meta.get("tags", []),
        "intro": intro,
        "ingredientes": ingredientes,
        "fases": fases,
        "secretos": secretos,
    }


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
                # truco de la abuela en la linea siguiente como cita
                j = i + 1
                if j < len(lines) and lines[j].strip().startswith(">"):
                    paso["ab"] = lines[j].strip()[1:].strip()
                pasos.append(paso)
            i += 1
        fases.append({"n": nombre.strip(), "pasos": pasos})
    return fases


def main():
    recetas = []
    errores = []
    for path in sorted(RECIPES.glob("*.md")):
        if path.name.startswith("_"):
            continue  # plantillas
        try:
            recetas.append(parse_recipe(path))
        except Exception as e:  # noqa: BLE001
            errores.append(str(e))
    for e in errores:
        print(f"ERROR: {e}", file=sys.stderr)
    if errores:
        sys.exit(1)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(recetas, ensure_ascii=False, indent=1), encoding="utf-8")
    total_pasos = sum(len(f["pasos"]) for r in recetas for f in r["fases"])
    print(f"OK: {len(recetas)} recetas, {total_pasos} pasos -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
