# Oasis LMS - WhatsApp Learning Management System

Oasis LMS delivers lessons and assessments through WhatsApp using a lightweight agent architecture inspired by **smolagents**. Each incoming message is processed by small, single-responsibility agents that can be combined for more advanced workflows. Teachers can post quiz questions from WhatsApp, and students reply directly in the chat with automatic marking.

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
   - `TEACHER_NUMBERS` – comma-separated list of WhatsApp numbers that are treated as teachers

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
- `TeacherSessionAgent` – allows teachers to broadcast messages and view student history

These agents can be extended to call local models or external LLMs such as OpenRouter when network access is available.

### Teacher Commands
Teachers can interact with the bot from phone numbers specified in `TEACHER_NUMBERS`.
Available commands:

```
broadcast <message>        # send a note to every student
history <number>           # view recent messages from a student
ask <question>|<answer>    # distribute a quiz question
results <number>           # see quiz results for a student
```
