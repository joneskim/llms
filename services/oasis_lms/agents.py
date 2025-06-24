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


class QuizAgent:
    """Simple agent for distributing and grading quiz questions."""

    def __init__(self) -> None:
        self.pending: Dict[str, tuple[str, str]] = {}
        self.results: Dict[str, List[tuple[str, str, bool]]] = {}

    def distribute(self, students: List[str], question: str, answer: str) -> None:
        for student in students:
            self.pending[student] = (question, answer)

    def answer(self, user: str, text: str) -> str:
        question, expected = self.pending.pop(user)
        correct = text.strip().lower() == expected.strip().lower()
        self.results.setdefault(user, []).append((question, text, correct))
        if correct:
            return "Correct!"
        return f"Incorrect. Correct answer: {expected}"

    def get_results(self, user: str) -> List[tuple[str, str, bool]]:
        return self.results.get(user, [])


class StudentSessionAgent:
    """Main session agent coordinating other agents."""

    def __init__(self) -> None:
        self.progress = ProgressTrackingAgent()
        self.language_adapter = LanguageAdapterAgent()
        self.generator = GenerateQuestionsAgent()
        self.pending: Dict[str, List[str]] = {}
        self.quiz = QuizAgent()

    def add_pending_message(self, user: str, msg: str) -> None:
        self.pending.setdefault(user, []).append(msg)

    def add_quiz(self, question: str, answer: str) -> None:
        students = list(
            set(self.progress.history.keys()) | set(self.pending.keys())
        )
        if not students:
            return
        self.quiz.distribute(students, question, answer)
        for s in students:
            self.add_pending_message(s, f"Quiz: {question}")

    def handle_message(self, message: str, user: str) -> str:
        self.progress.log(user, message)

        if user in self.quiz.pending:
            return self.quiz.answer(user, message)

        pending = self.pending.pop(user, [])
        history_len = len(self.progress.get_history(user))

        reply = (
            f"Oasis LMS received your message: '{message}'. "
            f"You have sent {history_len} messages so far."
        )

        if pending:
            teacher_notes = "\n".join(pending)
            reply = f"Teacher says: {teacher_notes}\n" + reply

        return reply


class TeacherSessionAgent:
    """Handles teacher commands and manages student sessions."""

    def __init__(self, student_agent: StudentSessionAgent) -> None:
        self.students = student_agent
        self.progress = ProgressTrackingAgent()

    def handle_message(self, message: str, user: str) -> str:
        self.progress.log(user, message)

        command = message.strip()
        lower = command.lower()

        if lower.startswith("broadcast "):
            note = command[len("broadcast ") :]
            all_students = (
                set(self.students.progress.history.keys())
                | set(self.students.pending.keys())
            )
            if not all_students:
                return "No students have interacted yet."
            for student in all_students:
                self.students.add_pending_message(student, note)
            return "Broadcast sent to all students."

        if lower.startswith("ask "):
            qa = command[len("ask ") :]
            if "|" not in qa:
                return "Format: ask <question>|<answer>"
            question, answer = qa.split("|", 1)
            self.students.add_quiz(question.strip(), answer.strip())
            return "Quiz question sent to all students."

        if lower.startswith("results "):
            number = command[len("results ") :].strip()
            results = self.students.quiz.get_results(number)
            if not results:
                return f"No results for {number}."
            lines = []
            for i, (q, a, correct) in enumerate(results[-5:], 1):
                status = "✅" if correct else "❌"
                lines.append(f"{i}. {q} -> {a} {status}")
            return "\n".join(lines)

        if lower.startswith("history "):
            number = command[len("history ") :].strip()
            history = self.students.progress.get_history(number)
            if not history:
                return f"No history for {number}."
            last = "; ".join(history[-5:])
            return f"Last messages from {number}: {last}"

        return (
            "Teacher commands:\n"
            "broadcast <msg> - send a message to all students\n"
            "history <number> - show recent messages from a student\n"
            "ask <question>|<answer> - send a quiz question to students\n"
            "results <number> - show quiz results for a student"
        )
