# VetoProxy

**AI-powered proxy voting automation for institutional investors.**

Built at BME HackNight 2026 by el quattro.

---

## What It Does

Every year, corporations send shareholders proxy filings — dense legal documents asking them to vote on board elections, executive compensation, mergers, and ESG proposals. Mid-size pension funds, university endowments, and sovereign wealth funds have no scalable way to read and act on thousands of these documents with limited staff.

VetoProxy lets institutions encode their governance values once in plain English and automatically votes every proxy ballot according to their own rules — with a tamper-evident blockchain audit trail for every single decision.

---

## Live Demo

- **Frontend:** https://vetoproxy-weld.vercel.app
- **Backend:** https://vetoproxy-production-230b.up.railway.app/api/health

---

## How It Works

```
User writes policy in plain English
        ↓
Groq/Llama converts it to structured JSON rules
        ↓
User enters ticker / uploads PDF / pastes text
        ↓
SEC EDGAR fetches the DEF 14A proxy filing
        ↓
Groq/Llama extracts proposals from the filing
        ↓
Python rules engine applies rules to proposals (zero AI — pure deterministic logic)
        ↓
Decisions recorded to VetoChain (SHA-256 blockchain)
        ↓
Results displayed in the UI
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + Flask |
| AI Engine | Groq API (Llama 3.3 70B) |
| Blockchain | Custom VetoChain (SHA-256) |
| Data | SEC EDGAR public API |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Key Design Decision

**AI does not vote. Ever.**

The AI engine does two things only: parse plain English rules into structured JSON, and extract proposals from SEC filings. All voting is deterministic Python logic. This is intentional — regulators and fiduciaries need to explain every vote. "The AI decided" is not a defensible answer. "Rule r2 states vote NO on pay raises above 10%, the filing showed 15%, therefore NO" is.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/compile-policy` | Plain English → JSON rules |
| POST | `/api/fetch-proxy` | Fetch SEC EDGAR filing by ticker |
| POST | `/api/extract-proposals` | Extract proposals from PDF or text |
| POST | `/api/vote` | Run rules engine + record to VetoChain |
| GET | `/api/audit-log` | All VetoChain blocks |
| GET | `/api/verify-chain` | Validate chain integrity |

---

## Running Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your GROQ_API_KEY
python3 main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` — Backend runs on `http://localhost:5001`

---

## Environment Variables

### Backend `.env`
```
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend `.env.production`
```
VITE_API_URL=https://your-railway-url.up.railway.app
```

---

## The VetoChain

Every voting decision is recorded as a SHA-256 linked block. Each block contains the decision, the rule that triggered it, the company and proposal, and a hash of all the above plus the previous block's hash.

Alter any past decision — even one character — and the hash of that block changes, breaking the link to the next block, breaking the entire chain. The `/api/verify-chain` endpoint detects this instantly.

---

## Team

**el quattro** — BME HackNight 2026

- Rehman Elahi
- Ahmed Mugeeb
- Ahmed Jahir
- Tinoda Sam Dangwa
