import sqlite3
from typing import List, Dict, Any

DATABASE = '../data/database.db'

class DBService:
    def __init__(self, db_path=DATABASE):
        self.db_path = db_path

    def _connect(self):
        return sqlite3.connect(self.db_path)

    def execute_query(self, query: str, params: tuple = ()):
        connection = self._connect()
        cursor = connection.cursor()
        cursor.execute(query, params)
        connection.commit()
        connection.close()

    def fetch_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        connection = self._connect()
        cursor = connection.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        connection.close()
        return [dict(zip(columns, row)) for row in rows]

    # CRUD operations for Users table
    def create_user(self, username: str, name: str, role: str):
        query = '''
        INSERT INTO users (username, name, role)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (username, name, role))

    def get_user_by_id(self, user_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM users WHERE id = ?
        '''
        result = self.fetch_query(query, (user_id,))
        return result[0] if result else None

    def get_all_users(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM users
        '''
        return self.fetch_query(query)

    def update_user(self, user_id: int, username: str, name: str, role: str):
        query = '''
        UPDATE users SET username = ?, name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (username, name, role, user_id))

    def delete_user(self, user_id: int):
        query = '''
        DELETE FROM users WHERE id = ?
        '''
        self.execute_query(query, (user_id,))

    def check_user_exists(self, username: str) -> str:
        query = '''
        SELECT * FROM users WHERE username = ?
        '''
        result = self.fetch_query(query, (username,))
        return "User exists" if result else "DNE"

    # CRUD operations for Courses table
    def create_course(self, course_name: str, description: str, teacher_id: int):
        query = '''
        INSERT INTO courses (course_name, description, teacher_id)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (course_name, description, teacher_id))

    def get_course_by_id(self, course_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM courses WHERE id = ?
        '''
        result = self.fetch_query(query, (course_id,))
        return result[0] if result else None

    def get_all_courses(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM courses
        '''
        return self.fetch_query(query)

    def update_course(self, course_id: int, course_name: str, description: str, teacher_id: int):
        query = '''
        UPDATE courses SET course_name = ?, description = ?, teacher_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (course_name, description, teacher_id, course_id))

    def delete_course(self, course_id: int):
        query = '''
        DELETE FROM courses WHERE id = ?
        '''
        self.execute_query(query, (course_id,))

    # CRUD operations for Modules table
    def create_module(self, module_name: str, description: str, course_id: int):
        query = '''
        INSERT INTO modules (module_name, description, course_id)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (module_name, description, course_id))

    def get_module_by_id(self, module_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM modules WHERE id = ?
        '''
        result = self.fetch_query(query, (module_id,))
        return result[0] if result else None

    def get_all_modules(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM modules
        '''
        return self.fetch_query(query)

    def update_module(self, module_id: int, module_name: str, description: str, course_id: int):
        query = '''
        UPDATE modules SET module_name = ?, description = ?, course_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (module_name, description, course_id, module_id))

    def delete_module(self, module_id: int):
        query = '''
        DELETE FROM modules WHERE id = ?
        '''
        self.execute_query(query, (module_id,))

    # CRUD operations for Lessons table
    def create_lesson(self, lesson_name: str, content: str, module_id: int):
        query = '''
        INSERT INTO lessons (lesson_name, content, module_id)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (lesson_name, content, module_id))

    def get_lesson_by_id(self, lesson_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM lessons WHERE id = ?
        '''
        result = self.fetch_query(query, (lesson_id,))
        return result[0] if result else None

    def get_all_lessons(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM lessons
        '''
        return self.fetch_query(query)

    def update_lesson(self, lesson_id: int, lesson_name: str, content: str, module_id: int):
        query = '''
        UPDATE lessons SET lesson_name = ?, content = ?, module_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (lesson_name, content, module_id, lesson_id))

    def delete_lesson(self, lesson_id: int):
        query = '''
        DELETE FROM lessons WHERE id = ?
        '''
        self.execute_query(query, (lesson_id,))

    # CRUD operations for Quizzes table
    def create_quiz(self, quiz_name: str, description: str, module_id: int):
        query = '''
        INSERT INTO quizzes (quiz_name, description, module_id)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (quiz_name, description, module_id))

    def get_quiz_by_id(self, quiz_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM quizzes WHERE id = ?
        '''
        result = self.fetch_query(query, (quiz_id,))
        return result[0] if result else None

    def get_all_quizzes(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM quizzes
        '''
        return self.fetch_query(query)

    def update_quiz(self, quiz_id: int, quiz_name: str, description: str, module_id: int):
        query = '''
        UPDATE quizzes SET quiz_name = ?, description = ?, module_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (quiz_name, description, module_id, quiz_id))

    def delete_quiz(self, quiz_id: int):
        query = '''
        DELETE FROM quizzes WHERE id = ?
        '''
        self.execute_query(query, (quiz_id,))

    # CRUD operations for Questions table
    def create_question(self, question_text: str, quiz_id: int, question_type: str):
        query = '''
        INSERT INTO questions (question_text, quiz_id, question_type)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (question_text, quiz_id, question_type))

    def get_question_by_id(self, question_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM questions WHERE id = ?
        '''
        result = self.fetch_query(query, (question_id,))
        return result[0] if result else None

    def get_all_questions(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM questions
        '''
        return self.fetch_query(query)

    def update_question(self, question_id: int, question_text: str, quiz_id: int, question_type: str):
        query = '''
        UPDATE questions SET question_text = ?, quiz_id = ?, question_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (question_text, quiz_id, question_type, question_id))

    def delete_question(self, question_id: int):
        query = '''
        DELETE FROM questions WHERE id = ?
        '''
        self.execute_query(query, (question_id,))

    # CRUD operations for Answers table
    def create_answer(self, answer_text: str, correct: int, question_id: int):
        query = '''
        INSERT INTO answers (answer_text, correct, question_id)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (answer_text, correct, question_id))

    def get_answer_by_id(self, answer_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM answers WHERE id = ?
        '''
        result = self.fetch_query(query, (answer_id,))
        return result[0] if result else None

    def get_all_answers(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM answers
        '''
        return self.fetch_query(query)

    def update_answer(self, answer_id: int, answer_text: str, correct: int, question_id: int):
        query = '''
        UPDATE answers SET answer_text = ?, correct = ?, question_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (answer_text, correct, question_id, answer_id))

    def delete_answer(self, answer_id: int):
        query = '''
        DELETE FROM answers WHERE id = ?
        '''
        self.execute_query(query, (answer_id,))

    # CRUD operations for Student_Quiz_Scores table
    def create_student_quiz_score(self, student_id: int, quiz_id: int, score: int):
        query = '''
        INSERT INTO student_quiz_scores (student_id, quiz_id, score)
        VALUES (?, ?, ?)
        '''
        self.execute_query(query, (student_id, quiz_id, score))

    def get_student_quiz_score(self, student_id: int, quiz_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM student_quiz_scores WHERE student_id = ? AND quiz_id = ?
        '''
        result = self.fetch_query(query, (student_id, quiz_id))
        return result[0] if result else None

    def get_all_student_quiz_scores(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM student_quiz_scores
        '''
        return self.fetch_query(query)

    def update_student_quiz_score(self, student_id: int, quiz_id: int, score: int):
        query = '''
        UPDATE student_quiz_scores SET score = ?, completed_at = CURRENT_TIMESTAMP WHERE student_id = ? AND quiz_id = ?
        '''
        self.execute_query(query, (score, student_id, quiz_id))

    def delete_student_quiz_score(self, student_id: int, quiz_id: int):
        query = '''
        DELETE FROM student_quiz_scores WHERE student_id = ? AND quiz_id = ?
        '''
        self.execute_query(query, (student_id, quiz_id))

    # CRUD operations for Progress Tracking table
    def create_progress_tracking(self, student_id: int, course_id: int, module_id: int, lesson_id: int, status: str):
        query = '''
        INSERT INTO progress_tracking (student_id, course_id, module_id, lesson_id, status)
        VALUES (?, ?, ?, ?, ?)
        '''
        self.execute_query(query, (student_id, course_id, module_id, lesson_id, status))

    def get_progress_tracking_by_id(self, progress_id: int) -> Dict[str, Any]:
        query = '''
        SELECT * FROM progress_tracking WHERE id = ?
        '''
        result = self.fetch_query(query, (progress_id,))
        return result[0] if result else None

    def get_all_progress_tracking(self) -> List[Dict[str, Any]]:
        query = '''
        SELECT * FROM progress_tracking
        '''
        return self.fetch_query(query)

    def update_progress_tracking(self, progress_id: int, status: str):
        query = '''
        UPDATE progress_tracking SET status = ?, last_accessed = CURRENT_TIMESTAMP WHERE id = ?
        '''
        self.execute_query(query, (status, progress_id))

    def delete_progress_tracking(self, progress_id: int):
        query = '''
        DELETE FROM progress_tracking WHERE id = ?
        '''
        self.execute_query(query, (progress_id,))

if __name__ == "__main__":
    db_service = DBService()

    # Example usage:
    db_service.create_user('john_doe', 'John Doe', 'student')
    print(db_service.get_user_by_id(1))
    print(db_service.get_all_users())
    print(db_service.check_user_exists('john_doe'))
    db_service.update_user(1, 'john_doe_updated', 'John Doe Updated', 'student')
    db_service.delete_user(1)
