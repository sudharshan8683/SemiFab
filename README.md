# FABSENSE: Semiconductor Manufacturing Predictive Maintenance & Defect Prediction

An end-to-end machine learning system and digital monitoring dashboard for semiconductor fabrication, trained and evaluated on the UCI SECOM manufacturing dataset.

## Overview

In semiconductor fabrication, high-dimensional sensor streams monitor complex multi-stage wafer production. Defects are rare (~6.6% in SECOM), but yield excursions result in severe scrap costs. FABSENSE provides a complete pipeline from raw sensor data ingestion and leakage-free offline ML evaluation to an operational FastAPI backend and React-based monitoring dashboard.

The system connects:
- **Offline ML Pipeline (`ml/`)**: Rigorous time-ordered cross-validation, drift diagnostics, feature reduction, and model persistence.
- **Backend API (`backend/`)**: FastAPI server loading preprocessor and model artifacts to serve batch and single-wafer defect risk inference.
- **Frontend Dashboard (`frontend/`)**: React/TypeScript interface featuring fab telemetry, equipment status, and an interactive prediction explorer.

## Key Finding: Temporal Drift in Fab Data

Standard machine learning benchmarks on SECOM frequently report inflated metrics due to random train/test splitting or shuffled k-fold cross-validation. Evaluating the data chronologically reveals significant non-stationarity:

1. **Adversarial Validation**: Training a classifier to distinguish early production runs from late production runs yielded an **ROC-AUC of 0.999** (where 0.50 represents indistinguishable distributions). Many sensor variables drift substantially over the 5-month collection period.
2. **Evaluation Metric Inflation**: Shuffled validation dramatically overstates performance compared to realistic time-series evaluation:

| Model | Cross-Validation Scheme | ROC-AUC | PR-AUC |
| :--- | :--- | :--- | :--- |
| **RandomForest** | Shuffled (5 folds x 3) | 0.739 +/- 0.073 | 0.220 +/- 0.076 |
| **RandomForest** | Time-Ordered (5 folds) | 0.570 +/- 0.129 | 0.101 +/- 0.045 |
| **LogisticRegression** | Shuffled (5 folds x 3) | 0.658 +/- 0.063 | 0.167 +/- 0.059 |
| **LogisticRegression** | Time-Ordered (5 folds) | 0.525 +/- 0.100 | 0.088 +/- 0.058 |
| *No-Skill Baseline* | *Prevalence Reference* | *0.500* | *0.066* |

*Data source: [diagnose_results.csv](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/results/diagnose_results.csv).*

## Methodology

The ML pipeline is organized into distinct, repeatable stages ensuring strict temporal isolation:

1. **Data Inspection ([inspect_data.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/inspect_data.py))**: Ingested 1,567 runs with 591 attributes recorded between July 19, 2008 and December 10, 2008, containing 104 failure instances (6.64% positive prevalence).
2. **Leakage-Free Preprocessing ([preprocess.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/preprocess.py))**: Preserved strict chronological order. Held out the newest 20% of rows (314 samples) as an untouched test set before any feature analysis. On the 1,253 training rows, removed 116 zero-variance constant columns and 35 columns with >40% missing values, leaving 440 features. Imputed missing values with training medians and normalized using `StandardScaler` (saved in `ml/processed/preprocessor.joblib`).
3. **Baseline Modeling ([train_baseline.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/train_baseline.py))**: Established benchmark performance using Dummy, Logistic Regression, and Random Forest classifiers across 5-fold `TimeSeriesSplit`.
4. **Drift & Outlier Diagnosis ([diagnose.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/diagnose.py))**: Quantified early-vs-late distribution divergence and assessed the impact of capping feature values at +/-5 standard deviations.
5. **Feature Selection Study ([feature_study.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/feature_study.py))**: Compared 5 variants: full 440 features, recency sample weighting, dropping top time-revealing features, and retaining top-k tree-importance features.
6. **Final Model Selection ([select_final.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/select_final.py))**: Evaluated variants across repeated time-ordered splits. Selected a Random Forest using the **top 50 features** with linear recency weighting (weighting newest training rows up to 5x older rows) to mitigate drift.
7. **Held-Out Test Evaluation ([final_evaluate.py](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/final_evaluate.py))**: Single final evaluation on the chronologically held-out test partition. Saved the production model bundle to `ml/models/final_model.joblib`.

## Results

### Cross-Validation Operational Performance (Training Set)
Because default 0.5 probability thresholds yield zero recalls on severe class imbalances, the system operates as a tiered prioritization filter. Pooling out-of-fold predictions on training validation folds produced the following triage characteristics:

| Flagged Cohort | Probability Cutoff | Wafers Flagged | Positives Caught | Precision | Recall | Lift vs Random |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Top 5%** | 0.236 | 52 | 8 / 58 | 15.4% | 13.8% | 2.76x |
| **Top 10%** | 0.203 | 104 | 13 / 58 | 12.5% | 22.4% | 2.24x |
| **Top 20%** | 0.157 | 208 | 23 / 58 | 11.1% | 39.7% | 1.98x |
| **Top 30%** | 0.130 | 312 | 29 / 58 | 9.3% | 50.0% | 1.67x |

*Data source: [flag_table.csv](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/results/flag_table.csv).*

### Held-Out Test Set Performance
The untouched test set comprises 314 consecutive wafers with 17 positive defects (5.41% prevalence):

| Metric | Result | Reference / Baseline |
| :--- | :--- | :--- |
| **ROC-AUC** | **0.5506** | 0.5000 (No-skill) |
| **PR-AUC** | **0.0719** | 0.0541 (Random chance) |
| **Default Threshold (0.50)** | Precision: 0.0%, Recall: 0.0% | TP: 0, FN: 17, FP: 0, TN: 297 |
| **Top 20% Flagged (Cutoff >= 0.117)** | Precision: 3.17%, Recall: 11.76% | 63 flagged, 2 caught (Lift: 0.59x) |

*Data source: [final_test_metrics.json](file:///c:/Users/asus/Downloads/Semi%20Fab/ml/results/final_test_metrics.json).*

## System Architecture

```text
[ Raw SECOM Sensor Vector (590 features) ]
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│                   ml/ Pipeline                         │
│  preprocess.py       ─► preprocessor.joblib (impute/scale)│
│  final_evaluate.py   ─► final_model.joblib (top-50 RF) │
└──────────────────────────┬─────────────────────────────┘
                           │ Loaded at startup
                           ▼
┌────────────────────────────────────────────────────────┐
│             backend/ (FastAPI Service)                 │
│  app/ml/secom_service.py : Pipeline singleton          │
│  app/routers/predictions.py : REST endpoints           │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST / JSON
                           ▼
┌────────────────────────────────────────────────────────┐
│             frontend/ (React Dashboard)                │
│  SecomPredictor.tsx : Interactive risk scoring         │
│  FabFloor.tsx / Analytics.tsx : Plant monitoring       │
└────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Machine Learning**: Python 3.11+, Scikit-Learn 1.9.1, Pandas 3.0.6, NumPy 2.4.6, Joblib 1.6.0.
- **Backend API**: FastAPI 0.115+, Uvicorn 0.34+, Pydantic 2.10+, SQLAlchemy 2.0+, SQLite, APScheduler 3.11+.
- **Frontend Dashboard**: React 18.2.0, TypeScript 5.2.0, Vite 5.0.0, Tailwind CSS 3.4.0, Recharts 2.10.0, Framer Motion 11.0.0, Axios 1.6.0, Zustand 4.4.0, Lucide React 0.300.0.

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend Setup
From the project root:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI server on http://127.0.0.1:8000
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

### 2. Frontend Setup
In a second terminal window:
```powershell
cd frontend
npm install
npm run dev
```

The frontend will be accessible at `http://localhost:5173`, and the interactive OpenAPI documentation at `http://localhost:8000/docs`.

### One-Click Launch (Windows)
Double-click `start_all.bat` in the repository root to launch both services concurrently in dedicated consoles.

## API Reference (`/api/predictions`)

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/predictions/secom` | Ingests 590-element raw sensor arrays, executes preprocessing and top-50 inference, and returns defect probability and flagging based on a configurable threshold. |
| `POST` | `/api/predictions/defect` | Canonical alias for `/api/predictions/secom`. |
| `GET` | `/api/predictions/sample-rows` | Returns real benchmark wafer rows (nominal and high-risk vectors) from `ml/sample_rows.data` for testing and UI demonstration. |
| `GET` | `/api/predictions/failure` | Retrieves equipment degradation and failure predictions. |
| `GET` | `/api/predictions/yield-forecast` | Returns lot-level aggregate yield forecasts. |

## Limitations

1. **Benchmark Data Age**: The model is built on the public 2008 UCI SECOM dataset. While representative of semiconductor dimensionality, modern manufacturing tools employ higher sampling rates, spatial wafer maps, and contextual process step telemetry.
2. **Small Positive Test Class**: The chronologically held-out test partition contains only 17 positive defect instances out of 314 rows. Performance estimates on this set have wide confidence intervals.
3. **Severe Process Drift**: The observed drift (adversarial AUC 0.999) severely limits forward generalization of a static model over 5-month spans without adaptive retraining.
4. **Scope**: This is an applied research and engineering demonstration rather than a production-qualified process control system.

## Future Work

- **Adaptive Retraining Cadence**: Implement a sliding-window training schedule to account for continuous tool drift and consumable aging.
- **Sensor Metadata Integration**: Map anonymous sensor indices (`feature_0` through `feature_590`) to physical fab process stages (etch gas flow, RF bias power, chamber pressure) for causal explainability.
- **Semi-Supervised & Autoencoder Architectures**: Evaluate unsupervised reconstruction error (e.g., deep autoencoders or PCA T²/Q statistics) as complementary anomaly signals alongside supervised classifiers.
