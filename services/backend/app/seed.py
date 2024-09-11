from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, SessionLocal
from sqlalchemy import MetaData

# Drop tables manually in the correct order
metadata = MetaData()
metadata.reflect()

# Drop dependent tables first
if 'answers' in metadata.tables:
    metadata.tables['answers'].drop(engine, checkfirst=True)
if 'options' in metadata.tables:
    metadata.tables['options'].drop(engine, checkfirst=True)
if 'questions' in metadata.tables:
    metadata.tables['questions'].drop(engine, checkfirst=True)
if 'student_quiz_scores' in metadata.tables:
    metadata.tables['student_quiz_scores'].drop(engine, checkfirst=True)
if 'quizzes' in metadata.tables:
    metadata.tables['quizzes'].drop(engine, checkfirst=True)

# Finally, drop the rest
models.Base.metadata.drop_all(bind=engine)

# Recreate all tables
models.Base.metadata.create_all(bind=engine)

# Seed data
def seed_data(db: Session):
    # Seed Users (1 teacher and some students)
    teacher = crud.get_user_by_username_and_role(db, username="teacher1", role="teacher")
    if not teacher:
        teacher_data = schemas.UserCreate(
            username="teacher1",
            name="Teacher One",
            email="teacher1@example.com",
            password="securepassword",  # Use a strong password
            role="teacher"
        )
        teacher = crud.create_user(db=db, user=teacher_data)

    for i in range(1, 21):  # Create 20 students
        username = f"student{i}"
        student = crud.get_user_by_username_and_role(db, username=username, role="student")
        if not student:
            student_data = schemas.UserCreate(
                username=username,
                name=f"Student {i}",
                email=f"student{i}@example.com",
                password="securepassword",  # Use a strong password
                role="student"
            )
            crud.create_user(db=db, user=student_data)

    # Seed Courses
    courses = [
        {"course_name": "Physics 101", "description": "Introduction to basic physics concepts", "teacher_id": teacher.id},
        {"course_name": "Mathematics 101", "description": "Introduction to basic mathematics concepts", "teacher_id": teacher.id},
        {"course_name": "Chemistry 101", "description": "Introduction to basic chemistry concepts", "teacher_id": teacher.id},
    ]

    for course_data in courses:
        course = crud.get_course_by_name_and_teacher(db, course_name=course_data["course_name"], teacher_id=teacher.id)
        if not course:
            course_data = schemas.CourseCreate(**course_data)
            crud.create_course(db=db, course=course_data)

    # Seed Modules
    course = crud.get_course_by_name_and_teacher(db, course_name="Physics 101", teacher_id=teacher.id)
    modules = [
        {"module_name": "Module 1: Basics of Motion", "description": "An introduction to the basics of motion", "course_id": course.id},
        {"module_name": "Module 2: Energy and Work", "description": "Understanding energy and work", "course_id": course.id},
    ]

    for module_data in modules:
        module = crud.get_module_by_name_and_course(db, module_name=module_data["module_name"], course_id=course.id)
        if not module:
            module_data = schemas.ModuleCreate(**module_data)
            crud.create_module(db=db, module=module_data)

    # Seed Quizzes
    module = crud.get_module_by_name_and_course(db, module_name="Module 1: Basics of Motion", course_id=course.id)
    quizzes = [
        {"quiz_name": "Quiz 1: Motion Basics", "description": "Test your knowledge on the basics of motion", "module_id": module.id},
        {"quiz_name": "Quiz 2: Energy Concepts", "description": "Test your knowledge on energy concepts", "module_id": module.id},
    ]

    for quiz_data in quizzes:
        quiz = crud.get_quiz_by_name_and_module(db, quiz_name=quiz_data["quiz_name"], module_id=module.id)
        if not quiz:
            quiz_data = schemas.QuizCreate(**quiz_data)
            crud.create_quiz(db=db, quiz=quiz_data)

    print("Database seeded successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_data(db)  # Seed the database
    finally:
        db.close()
