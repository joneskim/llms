from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)

    courses = relationship("Course", back_populates="teacher")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String, index=True)
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey("users.id"))

    teacher = relationship("User", back_populates="courses")
    modules = relationship("Module", back_populates="course")

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    module_name = Column(String, index=True)
    description = Column(Text)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="modules")
    assignments = relationship("Assignment", back_populates="module")
    quizzes = relationship("Quiz", back_populates="module")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    assignment_name = Column(String, index=True)
    description = Column(Text)
    module_id = Column(Integer, ForeignKey("modules.id"))

    module = relationship("Module", back_populates="assignments")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    quiz_name = Column(String, index=True)
    description = Column(Text)
    module_id = Column(Integer, ForeignKey("modules.id"))

    module = relationship("Module", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz")
    scores = relationship("StudentQuizScore", back_populates="quiz")  # Added this line


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text)
    question_type = Column(String)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("Option", back_populates="question")

class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    answer_text = Column(Text)
    correct = Column(Integer)  # 1 for true, 0 for false
    question_id = Column(Integer, ForeignKey("questions.id"))

    question = relationship("Question", back_populates="options")

class StudentQuizScore(Base):
    __tablename__ = "student_quiz_scores"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer)

    quiz = relationship("Quiz", back_populates="scores")


class ProgressTracking(Base):
    __tablename__ = "progress_tracking"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    course_id = Column(Integer)
    progress = Column(Text)
