from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    course_name: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    teacher_id: int

    class Config:
        orm_mode = True

class ModuleBase(BaseModel):
    module_name: str
    description: Optional[str] = None

class ModuleCreate(ModuleBase):
    pass

class Module(ModuleBase):
    id: int
    course_id: int

    class Config:
        orm_mode = True

class AssignmentBase(BaseModel):
    assignment_name: str
    description: Optional[str] = None

class AssignmentCreate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: int
    module_id: int

    class Config:
        orm_mode = True

class QuizBase(BaseModel):
    quiz_name: str
    description: Optional[str] = None

class QuizCreate(QuizBase):
    module_id: int

class Quiz(QuizBase):
    id: int
    module_id: int

    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    question_text: str
    question_type: str

class QuestionCreate(QuestionBase):
    quiz_id: int

class Question(QuestionBase):
    id: int
    quiz_id: int

    class Config:
        orm_mode = True

class OptionBase(BaseModel):
    answer_text: str
    correct: int

class OptionCreate(OptionBase):
    question_id: int

class Option(OptionBase):
    id: int
    question_id: int

    class Config:
        orm_mode = True

class StudentQuizScoreBase(BaseModel):
    student_id: int
    quiz_id: int
    score: int

class StudentQuizScoreCreate(StudentQuizScoreBase):
    pass

class StudentQuizScore(StudentQuizScoreBase):
    id: int

    class Config:
        orm_mode = True

class ProgressTrackingBase(BaseModel):
    user_id: int
    course_id: int
    progress: str

class ProgressTrackingCreate(ProgressTrackingBase):
    pass

class ProgressTracking(ProgressTrackingBase):
    id: int

    class Config:
        orm_mode = True

class StudentCourseBase(BaseModel):
    student_id: int
    course_id: int

class StudentCourseCreate(StudentCourseBase):
    pass

class StudentCourse(StudentCourseBase):
    id: int

    class Config:
        orm_mode = True
