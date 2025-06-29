# Oasis LMS - WhatsApp Learning Management System

Oasis LMS delivers lessons and assessments through WhatsApp using a lightweight agent architecture inspired by **smolagents**. Each incoming message is processed by small, single-responsibility agents that can be combined for more advanced workflows.

## Setup

1. Install Python 3.10 or newer.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables for Twilio credentials:
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_ACCOUNT_SID`

5. Start the server:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

Expose the `/whatsapp` endpoint to Twilio as your WhatsApp webhook URL.

## Agent Overview
- `ExtractPDFFieldsAgent` – parses PDFs and returns structured text *(stub)*
- `GenerateQuestionsAgent` – produces quiz questions from extracted text
- `LanguageAdapterAgent` – adapts content to the student's language
- `ProgressTrackingAgent` – records a user's message history
- `StudentSessionAgent` – orchestrates conversations with students

These agents can be extended to call local models or external LLMs such as OpenRouter when network access is available.
