# Synapse

Synapse - це платформа для колективного брейнштормінгу, яка використовує ШІ для групування, узагальнення та візуалізації ідей у реальному часі.

## Getting Started

### Configuration

This project uses OpenRouter for AI functionalities. You need to provide your OpenRouter API key.

1.  Create a file named `.env` in the root directory of the project.
2.  Copy the content from `.env.example` into `.env`.
3.  Replace `YOUR_OPENROUTER_API_KEY` with your actual key.

```
OPENROUTER_API_KEY="sk-or-v1-..."
```

### Prerequisites

- Python 3.9+
- Node.js 16+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

### Demo & Backfilling Data

To populate the database with sample ideas for a compelling demo, run the backfill script from the root directory:

```bash
python scripts/backfill_db.py
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Exposing Your Local Server (Optional)

To share your local development server with others (e.g., for the hackathon jury), you can use `ngrok`.

1.  [Install ngrok](https://ngrok.com/download) and authenticate it.
2.  Expose your backend server (running on port 8000):

    ```bash
    ngrok http 8000
    ```

3.  `ngrok` will give you a public URL (e.g., `https://<random-string>.ngrok.io`).
4.  Update the `API_URL` constant in `frontend/src/App.jsx` to this new public URL and restart your frontend.

