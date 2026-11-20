"""Keep the website's Noto Sans SC subset in sync with its content."""

from hashlib import sha256
from html import unescape
from io import BytesIO
import json
from pathlib import Path
from tempfile import NamedTemporaryFile
from unicodedata import name
from urllib.request import urlopen

from fontTools import subset
from fontTools.ttLib import TTFont


FONT_PATH = "assets/fonts/notosanssc-site.woff2"
SOURCE_URL = (
    "https://raw.githubusercontent.com/google/fonts/"
    "2894aab31764f10f29c421bdfd2340d3b382d384/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"
)
SOURCE_SHA256 = "a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da"
SOURCE_CACHE = Path(__file__).resolve().parent / ".cache" / "NotoSansSC-2894aab.ttf"


def required_codepoints(root, data):
    site_text = "\n".join(
        (root / filename).read_text(encoding="utf-8-sig")
        for filename in ("index.html", "site.js", "style.css")
    )
    text = unescape(site_text + json.dumps(data, ensure_ascii=False))
    return {
        ord(char) for char in set(text)
        if name(char, "").startswith(("CJK UNIFIED IDEOGRAPH", "CJK COMPATIBILITY IDEOGRAPH"))
        or 0x3000 <= ord(char) <= 0x303F
        or 0xFF01 <= ord(char) <= 0xFF60
        or 0x2010 <= ord(char) <= 0x2027
    }


def atomic_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    output = NamedTemporaryFile(dir=path.parent, delete=False)
    temporary = Path(output.name)
    try:
        with output:
            output.write(data)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)


def load_source():
    if SOURCE_CACHE.is_file():
        cached = SOURCE_CACHE.read_bytes()
        if sha256(cached).hexdigest() == SOURCE_SHA256:
            return cached
    with urlopen(SOURCE_URL, timeout=45) as response:
        source = response.read()
    if sha256(source).hexdigest() != SOURCE_SHA256:
        raise ValueError("The Noto Sans SC source checksum does not match the pinned release.")
    atomic_write(SOURCE_CACHE, source)
    return source


def ensure_fonts(root, data):
    target = root / FONT_PATH
    codepoints = required_codepoints(root, data)
    if target.is_file():
        with TTFont(target) as existing:
            if set(existing.getBestCmap()) == codepoints:
                return {"characters": len(codepoints), "bytes": target.stat().st_size, "rebuilt": False}

    options = subset.Options()
    options.name_IDs = ["*"]
    options.recalc_timestamp = False
    builder = subset.Subsetter(options)
    builder.populate(unicodes=codepoints)
    with TTFont(BytesIO(load_source()), recalcTimestamp=False) as source:
        builder.subset(source)
        missing = codepoints - set(source.getBestCmap())
        if missing:
            missing_text = ", ".join(f"U+{codepoint:04X}" for codepoint in sorted(missing))
            raise ValueError(f"Noto Sans SC has no glyphs for {missing_text}.")
        source.flavor = "woff2"
        output = BytesIO()
        source.save(output)
    font_data = output.getvalue()
    atomic_write(target, font_data)
    return {"characters": len(codepoints), "bytes": len(font_data), "rebuilt": True}
