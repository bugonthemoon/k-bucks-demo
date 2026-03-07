import os
import math
from collections import Counter, defaultdict
from PIL import Image

def reduce_ratio(w: int, h: int) -> str:
    g = math.gcd(w, h)
    return f"{w//g}:{h//g}"

def main():
    folder = "flags_w80"
    if not os.path.isdir(folder):
        raise SystemExit(f"Folder not found: {folder} (run from the same folder that contains {folder})")

    ratios = Counter()
    examples = defaultdict(list)
    total = 0

    for name in sorted(os.listdir(folder)):
        if not name.lower().endswith(".png"):
            continue
        path = os.path.join(folder, name)
        with Image.open(path) as im:
            w, h = im.size
        if w != 80:
            # still count it, but note it
            pass
        r = reduce_ratio(w, h)
        ratios[r] += 1
        total += 1
        if len(examples[r]) < 8:
            examples[r].append(name.replace(".png", ""))

    print(f"Total flags counted: {total}\n")

    # Print buckets sorted by count desc, then by ratio
    print("Ratio  Count  Example cca2 codes")
    print("-----  -----  ------------------")
    for r, c in sorted(ratios.items(), key=lambda x: (-x[1], x[0])):
        print(f"{r:<5}  {c:<5}  {', '.join(examples[r])}")

if __name__ == "__main__":
    main()