#!/usr/bin/env python3
"""One-time Kaggle symptom vocabulary gap analysis.

Downloads the three approved Kaggle datasets with kagglehub, extracts symptom-like
labels, compares them with the local symptom catalog and concept phrases, and
writes a review report. This is intentionally offline-only and does not mutate app
or database data.
"""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path

DATASETS = [
    "shivanshmittal22/home-remedies",
    "devikshah/health-symptoms-and-disease-prediction-dataset",
    "dhivyeshrk/diseases-and-symptoms-dataset",
]

ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "reports" / "kaggle-symptom-gap-analysis.json"
SYMPTOMS_PATHS = [ROOT / "src" / "data" / "symptoms.js", ROOT / "src" / "constants" / "symptoms.js"]
CONCEPT_PHRASES_PATH = ROOT / "src" / "data" / "conceptPhrases.js"

NOISE_COLUMNS = {
    "disease", "prognosis", "remedy", "remedies", "treatment", "medicine", "description",
    "precaution", "precautions", "unnamed", "id", "label", "name", "category",
}


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value.lower())).strip()


def tokens(value: str) -> set[str]:
    return {t for t in normalize(value).split() if len(t) > 1}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""


def load_catalog_terms() -> dict[str, set[str]]:
    terms: dict[str, set[str]] = defaultdict(set)
    label_re = re.compile(r"\{[^{}]*?id:\s*['\"]([^'\"]+)['\"][^{}]*?label:\s*['\"]([^'\"]+)['\"]", re.S)

    for path in SYMPTOMS_PATHS:
        text = read_text(path)
        for symptom_id, label in label_re.findall(text):
            terms[symptom_id].add(label)
            terms[symptom_id].add(symptom_id.replace("_", " ").replace("-", " "))

    concept_text = read_text(CONCEPT_PHRASES_PATH)
    for symptom_id, body in re.findall(r"([a-zA-Z0-9_-]+)\s*:\s*\[([^\]]*)\]", concept_text, re.S):
        for phrase in re.findall(r"['\"]([^'\"]+)['\"]", body):
            terms[symptom_id].add(phrase)

    return terms


def looks_like_symptom_column(name: str) -> bool:
    clean = normalize(name)
    if not clean or clean in NOISE_COLUMNS:
        return False
    if clean.startswith("symptom") or "symptom" in clean:
        return True
    # One-hot symptom datasets commonly use human-readable symptom names as headers.
    return len(clean.split()) <= 5 and clean not in NOISE_COLUMNS


def extract_csv_terms(path: Path) -> set[str]:
    found: set[str] = set()
    try:
        with path.open("r", encoding="utf-8-sig", errors="ignore", newline="") as handle:
            sample = handle.read(4096)
            handle.seek(0)
            try:
                dialect = csv.Sniffer().sniff(sample) if sample.strip() else csv.excel
            except csv.Error:
                dialect = csv.excel
            reader = csv.DictReader(handle, dialect=dialect)
            if not reader.fieldnames:
                return found

            symptom_columns = [h for h in reader.fieldnames if h and looks_like_symptom_column(h)]
            for header in symptom_columns:
                clean_header = normalize(header.replace("_", " "))
                if clean_header not in NOISE_COLUMNS and not clean_header.startswith("symptom "):
                    found.add(clean_header)

            for index, row in enumerate(reader):
                for key, value in row.items():
                    if not value:
                        continue
                    key_clean = normalize(key or "")
                    value_clean = normalize(str(value))
                    if key_clean.startswith("symptom") and value_clean and value_clean not in {"0", "1", "yes", "no", "true", "false"}:
                        found.add(value_clean)
                    elif looks_like_symptom_column(key or "") and value_clean in {"1", "yes", "true"}:
                        found.add(normalize((key or "").replace("_", " ")))
                if index > 50000:
                    break
    except Exception as exc:  # keep one malformed file from killing the full report
        print(f"[warn] Could not parse {path}: {exc}")
    return found


def collect_dataset_terms(download_dirs: dict[str, Path]) -> dict[str, list[str]]:
    by_dataset: dict[str, list[str]] = {}
    for dataset, directory in download_dirs.items():
        terms: set[str] = set()
        for csv_path in directory.rglob("*.csv"):
            terms.update(extract_csv_terms(csv_path))
        by_dataset[dataset] = sorted(t for t in terms if t)
    return by_dataset


def best_match(term: str, catalog: dict[str, set[str]]) -> dict:
    term_norm = normalize(term)
    term_tokens = tokens(term)
    best = {"symptomId": None, "term": None, "score": 0.0, "tokenOverlap": 0.0}

    for symptom_id, phrases in catalog.items():
        for phrase in phrases:
            phrase_norm = normalize(phrase)
            phrase_tokens = tokens(phrase)
            ratio = SequenceMatcher(None, term_norm, phrase_norm).ratio()
            overlap = len(term_tokens & phrase_tokens) / max(len(term_tokens | phrase_tokens), 1)
            score = max(ratio, overlap)
            if score > best["score"]:
                best = {"symptomId": symptom_id, "term": phrase, "score": round(score, 3), "tokenOverlap": round(overlap, 3)}

    return best


def main() -> None:
    import kagglehub

    download_dirs = {dataset: Path(kagglehub.dataset_download(dataset)) for dataset in DATASETS}
    dataset_terms = collect_dataset_terms(download_dirs)
    catalog = load_catalog_terms()

    all_terms = sorted({term for terms in dataset_terms.values() for term in terms})
    exact_catalog_terms = {normalize(phrase) for phrases in catalog.values() for phrase in phrases}

    phrasing_gaps = []
    genuine_gaps = []
    exact_matches = []

    for term in all_terms:
        if normalize(term) in exact_catalog_terms:
            exact_matches.append(term)
            continue
        match = best_match(term, catalog)
        item = {"datasetTerm": term, "bestCatalogMatch": match}
        if match["score"] >= 0.72 or match["tokenOverlap"] >= 0.5:
            phrasing_gaps.append(item)
        else:
            genuine_gaps.append(item)

    report = {
        "datasets": {dataset: str(path) for dataset, path in download_dirs.items()},
        "counts": {
            "datasetTerms": len(all_terms),
            "exactMatches": len(exact_matches),
            "phrasingGaps": len(phrasing_gaps),
            "genuineGapsForReview": len(genuine_gaps),
        },
        "exactMatches": exact_matches,
        "phrasingGaps": phrasing_gaps,
        "genuineGapsForReview": genuine_gaps,
        "termsByDataset": dataset_terms,
    }

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Wrote {REPORT_PATH}")
    print(json.dumps(report["counts"], indent=2))


if __name__ == "__main__":
    main()

