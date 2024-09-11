from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, crud
from .database import SessionLocal, engine

import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)



app = FastAPI(debug=True)

# Allow all origins, methods, and headers (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User-related endpoints
@app.get("/api/users/teacher", response_model=schemas.User)
def get_teacher_by_username(username: str, db: Session = Depends(get_db)):
    teacher = crud.get_user_by_username_and_role(db, username=username, role="teacher")
    if teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Course-related endpoints
@app.get("/api/courses/teacher/{teacher_id}", response_model=List[schemas.Course])
def read_courses_by_teacher(teacher_id: int, db: Session = Depends(get_db)):
    courses = crud.get_courses_by_teacher(db, teacher_id=teacher_id)
    if not courses:
        raise HTTPException(status_code=404, detail="Courses not found")
    return courses

@app.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    return crud.create_course(db=db, course=course)

# Module-related endpoints
@app.post("/modules/", response_model=schemas.Module)
def create_module(module: schemas.ModuleCreate, db: Session = Depends(get_db)):
    return crud.create_module(db=db, module=module)

@app.get("/api/modules/course/{course_id}", response_model=List[schemas.Module])
def read_modules_by_course(course_id: int, db: Session = Depends(get_db)):
    modules = crud.get_modules_by_course_id(db, course_id=course_id)
    if not modules:
        raise HTTPException(status_code=404, detail="Modules not found")
    return modules

# Assignment-related endpoints
@app.post("/assignments/", response_model=schemas.Assignment)
def create_assignment(assignment: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    return crud.create_assignment(db=db, assignment=assignment)

@app.get("/api/assignments/module/{module_id}", response_model=List[schemas.Assignment])
def read_assignments_by_module(module_id: int, db: Session = Depends(get_db)):
    assignments = crud.get_assignments_by_module_id(db, module_id=module_id)
    if not assignments:
        raise HTTPException(status_code=404, detail="Assignments not found")
    return assignments

# Quiz-related endpoints
@app.post("/api/quizzes", response_model=schemas.Quiz)
def create_quiz(quiz: schemas.QuizCreate, db: Session = Depends(get_db)):
    return crud.create_quiz(db=db, quiz=quiz)

@app.get("/api/quizzes/module/{module_id}", response_model=List[schemas.Quiz])
async def fetch_quizzes_by_module_id(module_id: int, db: Session = Depends(get_db)):
    quizzes = crud.get_quizzes_by_module_id(db, module_id=module_id)
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found for this module")
    return quizzes

@app.get("/api/quizzes/{quiz_id}", response_model=schemas.Quiz)
def read_quiz_by_id(quiz_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz_by_id(db, quiz_id=quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@app.get("/api/quizzes/{quiz_id}/results", response_model=List[schemas.StudentQuizScore])
def read_quiz_scores_by_quiz(quiz_id: int, db: Session = Depends(get_db)):
    scores = crud.get_quiz_scores_by_quiz_id(db, quiz_id=quiz_id)
    if not scores:
        raise HTTPException(status_code=404, detail="Quiz results not found")
    return scores

# Enrollment-related endpoints
@app.post("/students/{student_id}/enroll/", response_model=schemas.StudentCourse)
def enroll_student(student_id: int, course_id: int, db: Session = Depends(get_db)):
    return crud.enroll_student_in_course(db=db, student_id=student_id, course_id=course_id)

@app.get("/students/{course_id}", response_model=List[schemas.StudentCourse])
def read_students_by_course(course_id: int, db: Session = Depends(get_db)):
    students = crud.get_students_by_course_id(db, course_id=course_id)
    return students

# Quiz Scores and Progress Tracking
@app.post("/quiz_scores/", response_model=schemas.StudentQuizScore)
def record_quiz_score(score: schemas.StudentQuizScoreCreate, db: Session = Depends(get_db)):
    return crud.record_quiz_score(db=db, score=score)

@app.get("/quiz_scores/student/{student_id}", response_model=List[schemas.StudentQuizScore])
def read_quiz_scores_by_student(student_id: int, db: Session = Depends(get_db)):
    scores = crud.get_quiz_scores_by_student(db, student_id=student_id)
    return scores

@app.get("/quiz_scores/quiz/{quiz_id}", response_model=List[schemas.StudentQuizScore])
def read_quiz_scores_by_quiz(quiz_id: int, db: Session = Depends(get_db)):
    scores = crud.get_quiz_scores_by_quiz_id(db, quiz_id=quiz_id)
    return scores

@app.post("/progress/", response_model=schemas.ProgressTracking)
def track_progress(progress: schemas.ProgressTrackingCreate, db: Session = Depends(get_db)):
    return crud.track_progress(db=db, progress=progress)

@app.get("/progress/{user_id}/course/{course_id}", response_model=schemas.ProgressTracking)
def read_progress_by_user_and_course(user_id: int, course_id: int, db: Session = Depends(get_db)):
    progress = crud.get_progress_by_user_and_course(db, user_id=user_id, course_id=course_id)
    return progress

@app.post("/students/{student_id}/enroll/", response_model=schemas.StudentCourse)
def enroll_student(student_id: int, course_id: int, db: Session = Depends(get_db)):
    return crud.enroll_student_in_course(db=db, student_id=student_id, course_id=course_id)
