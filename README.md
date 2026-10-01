# FABSENSE: AI-Powered Semiconductor Fab Monitoring

FABSENSE is an Industry 4.0 smart-manufacturing digital-monitoring platform that ingests semiconductor manufacturing data, providing real-time monitoring, analytics, ML predictions, explanations, alerts, and recommendations to minimize production defects.

## Architecture Data Flow
```text
Simulation / Sensor Data → Ingestion Layer → FastAPI → SQLite Database 
  ↳ ML Processing (Scikit-Learn/Joblib) → Predictions → Alerts 
    ↳ WebSocket / REST API → Frontend Dashboard (React/Tailwind)
```

## Features
- Overall Equipment Effectiveness (OEE) and Utilization KPI monitoring
- Predictive Maintenance using Machine Learning (Failure probabilities, risk levels)
- Defect Risk scoring for in-flight wafers
- Yield Regression and Pareto loss analysis
- Anomaly Detection (Isolation Forest) on sensor parameters
- Extensible Ingestion: Built-in simulator, ready for MQTT/OPC-UA/MES

## Prerequisites
- Python 3.11+
- Node.js 18+

## Setup Instructions

### 1. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Seed the database
python scripts/init_db.py

# Generate Datasets and Train ML Models
python scripts/train_all.py

# Run the FastAPI Server
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

## Demo Credentials
- **Admin**: `admin` / `admin123`
- **Prod Manager**: `prod_mgr` / `prod123`
- **Maint Engineer**: `maint_eng` / `maint123`
- **Quality Engineer**: `qual_eng` / `qual123`
- **Viewer**: `viewer` / `viewer123`

## Future Extensibility
To connect real factory data instead of the simulator, modify `backend/app/ingestion/ingest.py`. Replace calls from `simulation/engine.py` with payloads received from your MQTT broker or OPC-UA client. The single entry point `ingest_reading(db, payload)` handles the rest.

## Troubleshooting
1. **"powershell" executable not found**: If running terminal commands fails, execute the setup steps manually in your own terminal.
2. **Missing ML Models / 503 Errors**: Ensure you have run `python scripts/train_all.py` to generate data and artifacts.
3. **Database Locked**: SQLite might lock on high concurrency. Restart the server or switch to PostgreSQL by changing `DATABASE_URL` in `.env`.
4. **WebSocket Blocked**: Check browser extensions or CORS rules in `main.py`.
