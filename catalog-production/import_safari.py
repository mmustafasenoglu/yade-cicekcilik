from pathlib import Path
import json,concurrent.futures,urllib.request,re,shutil
from PIL import Image
root=Path(__file__).resolve().parents[1]
candidates={r['index']:r for r in json.loads((root/'catalog-production/safari-candidates.json').read_text())}
selection=[line.split('|') for line in (root/'catalog-production/safari-selection.txt').read_text().splitlines() if line.strip()]
folder=root/'catalog-source/safari-full';folder.mkdir(exist_ok=True)
def fetch(row):
 i=int(row[0]); c=candidates[i]; url=c['url'].split('=w')[0]+'=s1600'; target=folder/c['file']
 try:
  if not target.exists():
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as r: target.write_bytes(r.read())
  with Image.open(target) as im:
   im.verify()
  with Image.open(target) as im:w,h=im.size
  if max(w,h)<350:raise ValueError('Düşük çözünürlük')
  return dict(index=i,name=row[1],category=row[2],sourceUrl=url,file=c['file'],width=w,height=h)
 except Exception as e:return dict(index=i,error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(fetch,selection))
(root/'catalog-production/safari-imported.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps({'selected':len(results),'downloaded':sum('error' not in r for r in results),'errors':[r for r in results if 'error'in r]},ensure_ascii=False))
