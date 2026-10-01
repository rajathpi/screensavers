"""Build index.html: inject the shan-shui-inf generator into template.html.

Usage:  py build.py            (uses vendor/shan-shui-inf.html)
        py build.py other.html (build from a different copy of upstream)
"""
import re
import sys
from pathlib import Path

here = Path(__file__).parent
src_path = Path(sys.argv[1]) if len(sys.argv) > 1 else here / "vendor" / "shan-shui-inf.html"
src = src_path.read_text(encoding="utf-8").splitlines()

# Generator = everything before the mouse/UI code; drop <script> tags and the URL/seed block
end = next(i for i, l in enumerate(src) if 'addEventListener("mousemove"' in l)
lines = src[:end]
seed_start = next(i for i, l in enumerate(lines) if "function parseArgs" in l)
seed_end = next(i for i, l in enumerate(lines) if "console.log(Prng.seed)" in l)
lines = lines[:seed_start] + ["  Math.seed(SEED);"] + lines[seed_end + 1:]
gen = "\n".join(l for l in lines if not re.match(r"\s*</?script", l))
assert "</script" not in gen

out = (here / "template.html").read_text(encoding="utf-8").replace("/*__GEN__*/", gen)
(here / "index.html").write_text(out, encoding="utf-8", newline="\n")
print("wrote index.html", len(out), "bytes")
