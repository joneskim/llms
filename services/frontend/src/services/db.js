const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database
const initDB = () => {
  const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
      createTables(db);
    }
  });
  return db;
};

// Create tables based on the provided SQL structure
const createTables = (db) => {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT,
        role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Courses table
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_name TEXT NOT NULL,
        description TEXT,
        teacher_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(teacher_id) REFERENCES users(id)
      )
    `);

    // Create Students_Courses junction table
    db.run(`
      CREATE TABLE IF NOT EXISTS students_courses (
        student_id INTEGER,
        course_id INTEGER,
        enrollment_date TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(student_id, course_id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
      )
    `);

    // Create Modules table
    db.run(`
      CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_name TEXT NOT NULL,
        description TEXT,
        course_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(course_id) REFERENCES courses(id)
      )
    `);

    // Create Lessons table
    db.run(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_name TEXT NOT NULL,
        content TEXT,
        module_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(module_id) REFERENCES modules(id)
      )
    `);

    // Create Quizzes table
    db.run(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_name TEXT NOT NULL,
        description TEXT,
        module_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(module_id) REFERENCES modules(id)
      )
    `);

    // Create Questions table
    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_text TEXT NOT NULL,
        quiz_id INTEGER,
        question_type TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
      )
    `);

    // Create Answers table
    db.run(`
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        answer_text TEXT NOT NULL,
        correct INTEGER NOT NULL,
        question_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(question_id) REFERENCES questions(id)
      )
    `);

    // Create Student Quiz Scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS student_quiz_scores (
        student_id INTEGER,
        quiz_id INTEGER,
        score INTEGER,
        completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(student_id, quiz_id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
      )
    `);

    // Create Progress Tracking table
    db.run(`
      CREATE TABLE IF NOT EXISTS progress_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        course_id INTEGER,
        module_id INTEGER,
        lesson_id INTEGER,
        status TEXT NOT NULL,
        last_accessed TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(course_id) REFERENCES courses(id),
        FOREIGN KEY(module_id) REFERENCES modules(id),
        FOREIGN KEY(lesson_id) REFERENCES lessons(id)
      )
    `);

    console.log('Tables created successfully.');
  });
};

// Initialize the database
const db = initDB();

module.exports = db;
