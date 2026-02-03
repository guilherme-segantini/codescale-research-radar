# CodeScale Research Radar - Setup Guide

## Prerequisites

- **Python** 3.10+
- **Node.js** v20.11.0+ or v22.0.0+
- **xAI API key** from https://console.x.ai/

## Backend Setup (Track B)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your XAI_API_KEY
   ```

5. Start the server (database initializes automatically on startup):
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. Verify it works:
   ```bash
   curl http://localhost:8000/health
   # {"status":"ok"}

   curl http://localhost:8000/api/radar
   # {"radar_date":null,"trends":[]}
   ```

## Frontend Setup (Track A)

1. From the project root:
   ```bash
   npm install
   ```

2. Start the UI5 dev server:
   ```bash
   npm start
   ```

3. Open http://localhost:8080 in your browser.

## xAI API Key Setup

1. Sign up at https://console.x.ai/
2. Navigate to the API Keys section
3. Create a new API key
4. Add the key to `backend/.env`:
   ```
   XAI_API_KEY=xai-your-actual-key-here
   ```

## Testing the LiteLLM Connection

```python
import litellm
import os
from dotenv import load_dotenv

load_dotenv()

response = litellm.completion(
    model="xai/grok-beta",
    messages=[{"role": "user", "content": "Say hello"}]
)
print(response.choices[0].message.content)
```

Run from the `backend/` directory with the venv activated.

## Running Tests

```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

## Switching from Mock Data to Real API

In `webapp/manifest.json`, change the default model's dataSource:

```json
"models": {
  "": {
    "dataSource": "radarAPI",
    "preload": true
  }
}
```

This switches the frontend from reading `mock_radar.json` to calling `http://localhost:8000/api/radar`.

## Troubleshooting

**CORS errors in the browser:**
- Verify the backend is running on port 8000
- Check that `CORS_ORIGINS` in `.env` includes `http://localhost:8080`

**xAI/Grok API errors:**
- Verify `XAI_API_KEY` is set in `backend/.env`
- Check the key is valid at https://console.x.ai/
- Review LiteLLM provider docs: https://docs.litellm.ai/docs/providers/xai

**UI5 dev server won't start:**
- Check Node.js version: `node --version` (needs v20.11.0+ or v22.0.0+)
- Run `npm run lint` to check for configuration errors

**Database issues:**
- Delete `radar.db` and restart the server to recreate from scratch
- The database is auto-created on first startup
