from typing import List, Dict

class ExtractPDFFieldsAgent:
    """Placeholder agent that pretends to extract text from a PDF."""

    def run(self, pdf_path: str) -> Dict[str, str]:
        # In a real implementation this would parse the PDF.
        return {"text": f"[extracted text from {pdf_path}]"}


class GenerateQuestionsAgent:
    """Generates quiz questions from extracted text."""

    def run(self, content: Dict[str, str]) -> List[str]:
        # Placeholder question generation.
        text = content.get("text", "")
        return [f"What is a key point from the text: {text[:30]}?"]


class LanguageAdapterAgent:
    """Adapts text to the target language (stub)."""

    def run(self, text: str, language: str) -> str:
        # For now we simply return the text unmodified.
        return text


class ProgressTrackingAgent:
    """Stores a simple in-memory log of user messages."""

    def __init__(self) -> None:
        self.history: Dict[str, List[str]] = {}

    def log(self, user: str, message: str) -> None:
        self.history.setdefault(user, []).append(message)

    def get_history(self, user: str) -> List[str]:
        return self.history.get(user, [])


class StudentSessionAgent:
    """Main session agent coordinating other agents."""

    def __init__(self) -> None:
        self.progress = ProgressTrackingAgent()
        self.language_adapter = LanguageAdapterAgent()
        self.generator = GenerateQuestionsAgent()

    def handle_message(self, message: str, user: str) -> str:
        self.progress.log(user, message)
        # Simple logic: echo message and show history length.
        history_len = len(self.progress.get_history(user))
        reply = (
            f"Oasis LMS received your message: '{message}'. "
            f"You have sent {history_len} messages so far."
        )
        return reply
