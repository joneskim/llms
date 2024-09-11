from sqlalchemy.orm import Session
from app import models, schemas

# User CRUD operations
def get_user_by_username_and_role(db: Session, username: str, role: str):
    return db.query(models.User).filter(models.User.username == username, models.User.role == role).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        hashed_password=user.password,  # This should be hashed
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Course CRUD operations
def get_course_by_name_and_teacher(db: Session, course_name: str, teacher_id: int):
    return db.query(models.Course).filter(models.Course.course_name == course_name, models.Course.teacher_id == teacher_id).first()

def create_course(db: Session, course: schemas.CourseCreate):
    db_course = models.Course(
        course_name=course.course_name,
        description=course.description,
        teacher_id=course.teacher_id
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def get_courses_by_teacher(db: Session, teacher_id: int):
    return db.query(models.Course).filter(models.Course.teacher_id == teacher_id).all()

# Module CRUD operations
def get_module_by_name_and_course(db: Session, module_name: str, course_id: int):
    return db.query(models.Module).filter(models.Module.module_name == module_name, models.Module.course_id == course_id).first()

def create_module(db: Session, module: schemas.ModuleCreate):
    db_module = models.Module(
        module_name=module.module_name,
        description=module.description,
        course_id=module.course_id
    )
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

def get_modules_by_course_id(db: Session, course_id: int):
    return db.query(models.Module).filter(models.Module.course_id == course_id).all()

# Quiz CRUD operations
def get_quiz_by_name_and_module(db: Session, quiz_name: str, module_id: int):
    return db.query(models.Quiz).filter(models.Quiz.quiz_name == quiz_name, models.Quiz.module_id == module_id).first()

def create_quiz(db: Session, quiz: schemas.QuizCreate):
    db_quiz = models.Quiz(
        quiz_name=quiz.quiz_name,
        description=quiz.description,
        module_id=quiz.module_id
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def get_quizzes_by_module_id(db: Session, module_id: int):
    return db.query(models.Quiz).filter(models.Quiz.module_id == module_id).all()

# StudentQuizScore CRUD operations
def get_quiz_scores_by_quiz_id(db: Session, quiz_id: int):
    return db.query(models.StudentQuizScore).filter(models.StudentQuizScore.quiz_id == quiz_id).all()

def record_quiz_score(db: Session, score: schemas.StudentQuizScoreCreate):
    db_score = models.StudentQuizScore(
        student_id=score.student_id,
        quiz_id=score.quiz_id,
        score=score.score
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_quiz_scores_by_student(db: Session, student_id: int):
    return db.query(models.StudentQuizScore).filter(models.StudentQuizScore.student_id == student_id).all()

# Enrollment CRUD operations
def enroll_student_in_course(db: Session, student_id: int, course_id: int):
    db_enrollment = models.StudentCourse(
        student_id=student_id,
        course_id=course_id
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def get_students_by_course_id(db: Session, course_id: int):
    return db.query(models.StudentCourse).filter(models.StudentCourse.course_id == course_id).all()

# Progress Tracking CRUD operations
def track_progress(db: Session, progress: schemas.ProgressTrackingCreate):
    db_progress = models.ProgressTracking(
        user_id=progress.user_id,
        course_id=progress.course_id,
        progress=progress.progress
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

def get_progress_by_user_and_course(db: Session, user_id: int, course_id: int):
    return db.query(models.ProgressTracking).filter(models.ProgressTracking.user_id == user_id, models.ProgressTracking.course_id == course_id).first()
