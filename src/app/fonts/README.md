# Fonts

`comforter-brush-taglines.woff2` is Comforter Brush (SIL Open Font License,
© 2015 The Comforter Brush Project Authors,
https://github.com/googlefonts/comforter-brush), subset to the glyphs of the
two hand-lettered taglines, "Broadbeach" and "Good Hair Better People". The
full font is 133 KB; this subset is 35 KB.

If a script tagline changes, regenerate the subset with the new text
(`pip install fonttools brotli`), from the full Comforter Brush woff2:

```bash
pyftsubset ComforterBrush-Regular.woff2 \
  --text="Broadbeach Good Hair Better People" \
  --layout-features='*' --flavor=woff2 \
  --output-file=src/app/fonts/comforter-brush-taglines.woff2
```
