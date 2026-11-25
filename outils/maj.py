#!/usr/bin/env python3
"""Met à jour data/journal.json : dernières nouvelles de chaque projet du bac.

Sources :
  1. GitHub (data/sources.json) : derniers commits des dépôts publics.
  2. data/journal-manuel.json : lignes écrites à la main.
  3. Option --qg CHEMIN : sections « ## Journal public » des pages projet du QG
     (front matter `portfolio: <id>`), recopiées dans journal-manuel.json.
     Seules ces sections sont lues : rien d'autre du QG n'est publié.

Usage : python3 outils/maj.py [--qg ~/Documents/CLAUDE/QG]
Le jeton GITHUB_TOKEN (facultatif) évite la limite d'appels de l'API.
"""
import json, os, re, sys, urllib.request, datetime, pathlib, argparse

RACINE = pathlib.Path(__file__).resolve().parent.parent
DATA = RACINE / "data"
MAX_PAR_PROJET, MAX_FIL = 6, 30
LIGNE = re.compile(r"^\s*[-*]\s*(\d{4}-\d{2}-\d{2})\s*[—–-]+\s*(.+?)\s*$")


def api(url):
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": "bac-de-paul-journal"})
    tok = os.environ.get("GITHUB_TOKEN")
    if tok:
        req.add_header("Authorization", "Bearer " + tok)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)


def github(sources):
    owner, out, cache = sources["owner"], [], {}
    for pid, s in sources["projets"].items():
        repo = s["repo"]
        if repo not in cache:
            try:
                cache[repo] = api(f"https://api.github.com/repos/{owner}/{repo}/commits?per_page=40")
            except Exception as e:  # un dépôt en panne ne bloque pas les autres
                print(f"  ! {repo} : {e}", file=sys.stderr)
                cache[repo] = []
        for c in cache[repo]:
            msg = c["commit"]["message"].split("\n")[0].strip()
            if s.get("match") and not re.search(s["match"], msg):
                continue
            if s.get("exclude") and re.search(s["exclude"], msg):
                continue
            out.append({"date": c["commit"]["author"]["date"][:10], "id": pid, "text": msg,
                        "url": c.get("html_url"), "source": "github"})
    return out


def qg(chemin):
    """Lit les sections « ## Journal public » des pages Projet du QG."""
    trouves = []
    for f in pathlib.Path(chemin).expanduser().glob("10-Projets/*/Projet*.md"):
        t = f.read_text(encoding="utf-8")
        m = re.search(r"^portfolio:\s*([\w-]+)\s*$", t, re.M)
        sec = re.search(r"^## Journal public\s*\n(.*?)(?=^## |\Z)", t, re.M | re.S)
        if not (m and sec):
            continue
        for l in sec.group(1).splitlines():
            x = LIGNE.match(l)
            if x:
                trouves.append({"date": x.group(1), "id": m.group(1), "text": x.group(2)})
    return trouves


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--qg", help="chemin du QG pour lire ses sections « Journal public »")
    a = ap.parse_args()

    manuel_f = DATA / "journal-manuel.json"
    manuel = json.loads(manuel_f.read_text(encoding="utf-8"))
    if a.qg:
        vus = {(e["date"], e["id"], e["text"]) for e in manuel}
        nouveaux = [e for e in qg(a.qg) if (e["date"], e["id"], e["text"]) not in vus]
        manuel = sorted(manuel + nouveaux, key=lambda e: (e["date"], e["id"]))
        manuel_f.write_text(json.dumps(manuel, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"QG : {len(nouveaux)} nouvelle(s) ligne(s) publique(s)")

    sources = json.loads((DATA / "sources.json").read_text(encoding="utf-8"))
    tout = github(sources) + [dict(e, source="journal") for e in manuel]
    tout.sort(key=lambda e: e["date"], reverse=True)

    projets = {}
    for e in tout:
        p = projets.setdefault(e["id"], {"last": e["date"], "entries": []})
        if len(p["entries"]) < MAX_PAR_PROJET:
            p["entries"].append({k: v for k, v in e.items() if k != "id"})

    # fil : un résumé par projet et par jour (évite qu'un projet très actif noie les autres)
    # au plus 2 jours par projet, pour que le fil reste varié
    fil, vus, par_projet = [], {}, {}
    for e in tout:
        k = (e["id"], e["date"])
        if k in vus:
            vus[k]["more"] = vus[k].get("more", 0) + 1
            continue
        if par_projet.get(e["id"], 0) >= 2:
            continue
        par_projet[e["id"]] = par_projet.get(e["id"], 0) + 1
        vus[k] = dict(e)
        fil.append(vus[k])
    sortie = {
        "generated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "projects": projets,
        "feed": fil[:MAX_FIL],
    }
    ancien = DATA / "journal.json"
    if ancien.exists():
        vieux = json.loads(ancien.read_text(encoding="utf-8"))
        if {k: v for k, v in vieux.items() if k != "generated"} == {k: v for k, v in sortie.items() if k != "generated"}:
            print("Rien de neuf.")
            return
    ancien.write_text(json.dumps(sortie, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"journal.json : {len(tout)} nouvelles, {len(projets)} projets, dernière le {tout[0]['date'] if tout else '—'}")


if __name__ == "__main__":
    main()
