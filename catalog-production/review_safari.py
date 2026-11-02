from pathlib import Path
import json,html
rows=json.loads(Path('cicekci/catalog-production/safari-candidates.json').read_text())
for page in range((len(rows)+23)//24):
 subset=rows[page*24:(page+1)*24]
 body=''.join(f'<div><img src="../catalog-source/safari-thumbs/{r["file"]}"><b>{r["index"]:03}</b></div>' for r in subset)
 Path(f'cicekci/review-{page+1}.html').write_text('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#eee;font:12px Arial}main{display:grid;grid-template-columns:repeat(8,1fr);gap:5px;padding:6px}div{height:220px;text-align:center;background:white}img{height:195px;max-width:100%;object-fit:contain;display:block;margin:auto}b{display:block;padding:5px}</style><main>'+body+'</main>')
print('Review pages:',(len(rows)+23)//24)
