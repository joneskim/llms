// Simulate loading data from a local JSON file or localStorage
const loadData = () => {
  const storedData = localStorage.getItem('lmsData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  // If no stored data, use the initial data
  return {
    "teachers": [
      {
        "teacher_id": 1,
        "username": "teacher1",
        "password": "password1",
        "name": "John Doe",
        "courses": [
          {
            "course_id": 101,
            "course_name": "Physics 101",
            "modules": [
              {
                "module_id": 201,
                "module_name": "Module 1: Basics of Motion",
                "assignments": [],
                "quizzes": []
              },
              {
                "module_id": 202,
                "module_name": "Module 2: Forces and Energy",
                "assignments": [],
                "quizzes": []
              }
            ],
            "students": [
              {
                "student_id": 301,
                "name": "Student One",
                "progress": []
              }
            ]
          },
          {
            "course_id": 102,
            "course_name": "Mathematics 101",
            "modules": [
              {
                "module_id": 203,
                "module_name": "Module 1: Algebra Basics",
                "assignments": [],
                "quizzes": []
              },
              {
                "module_id": 204,
                "module_name": "Module 2: Calculus Introduction",
                "assignments": [],
                "quizzes": []
              }
            ],
            "students": [
              {
                "student_id": 302,
                "name": "Student Two",
                "progress": []
              }
            ]
          }
        ]
      },
      {
        "teacher_id": 2,
        "username": "teacher2",
        "password": "password2",
        "name": "Jane Smith",
        "courses": [
          {
            "course_id": 103,
            "course_name": "Chemistry 101",
            "modules": [
              {
                "module_id": 205,
                "module_name": "Module 1: Introduction to Chemistry",
                "assignments": [],
                "quizzes": []
              },
              {
                "module_id": 206,
                "module_name": "Module 2: Chemical Reactions",
                "assignments": [],
                "quizzes": []
              }
            ],
            "students": [
              {
                "student_id": 303,
                "name": "Student Three",
                "progress": []
              }
            ]
          },
          {
            "course_id": 104,
            "course_name": "Biology 101",
            "modules": [
              {
                "module_id": 207,
                "module_name": "Module 1: Cell Biology",
                "assignments": [],
                "quizzes": []
              },
              {
                "module_id": 208,
                "module_name": "Module 2: Genetics",
                "assignments": [],
                "quizzes": []
              }
            ],
            "students": [
              {
                "student_id": 304,
                "name": "Student Four",
                "progress": []
              }
            ]
          }
        ]
      }
    ],
    "students": [
      {
        "student_id": 301,
        "name": "Student One",
        "assignments": [],
        "quizzes": [],
        "messages": [],
        "notifications": []
      },
      {
        "student_id": 302,
        "name": "Student Two",
        "assignments": [],
        "quizzes": [],
        "messages": [],
        "notifications": []
      },
      {
        "student_id": 303,
        "name": "Student Three",
        "assignments": [],
        "quizzes": [],
        "messages": [],
        "notifications": []
      },
      {
        "student_id": 304,
        "name": "Student Four",
        "assignments": [],
        "quizzes": [],
        "messages": [],
        "notifications": []
      }
    ]
  };
};

// Save data to localStorage
const saveData = (data) => {
  localStorage.setItem('lmsData', JSON.stringify(data));
};

// Initialize data
let data = loadData();

// Fake API calls

// Validate teacher login
const validateTeacherLogin = (username, password) => {
  const teacher = data.teachers.find(
    (teacher) => teacher.username === username && teacher.password === password
  );
  return teacher ? { teacher_id: teacher.teacher_id, name: teacher.name } : null;
};

// Fetch courses by teacher ID
const fetchCoursesByTeacherId = (teacherId) => {
  const teacher = data.teachers.find((teacher) => teacher.teacher_id === teacherId);
  return teacher ? teacher.courses : [];
};

// Fetch modules by course ID
const fetchModulesByCourseId = (courseId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course.modules : [];
};

// Fetch assignments by module ID
const fetchAssignmentsByModuleId = (courseId, moduleId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const module = course ? course.modules.find((mod) => mod.module_id === moduleId) : null;
  return module ? module.assignments : [];
};

// Fetch quizzes by module ID
const fetchQuizzesByModuleId = (courseId, moduleId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const module = course ? course.modules.find((mod) => mod.module_id === moduleId) : null;
  return module ? module.quizzes : [];
};

// Fetch students by course ID
const fetchStudentsByCourseId = (courseId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course.students : [];
};

// Fetch detailed student profile
const fetchStudentProfile = (studentId) => {
  return data.students.find((student) => student.student_id === studentId) || null;
};

// Fetch student progress in a course
const fetchStudentProgress = (courseId, studentId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const student = course.students.find((student) => student.student_id === studentId);
  return student ? student.progress : null;
};

// Add a new course
const addCourse = (teacherId, courseName) => {
  const teacher = data.teachers.find((teacher) => teacher.teacher_id === teacherId);
  if (teacher) {
    const newCourse = {
      course_id: Date.now(),
      course_name: courseName,
      modules: [],
      students: [],
    };
    teacher.courses.push(newCourse);
    saveData(data);
    return newCourse;
  }
  return null;
};

// Add a new module to a course
const addModule = (courseId, moduleName, moduleDescription = '', resources = []) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  if (course) {
    const newModule = {
      module_id: Date.now(),
      module_name: moduleName,
      module_description: moduleDescription,
      resources: resources,
      assignments: [],
      quizzes: [],
    };
    course.modules.push(newModule);
    saveData(data);
    return newModule;
  }
  return null;
};

// Add an assignment to a module
const addAssignment = (moduleId, assignmentName, assignmentType, criteria) => {
  const module = data.teachers
    .flatMap((teacher) => teacher.courses)
    .flatMap((course) => course.modules)
    .find((module) => module.module_id === moduleId);
  if (module) {
    const newAssignment = {
      assignment_id: Date.now(),
      assignment_name: assignmentName,
      assignment_type: assignmentType,
      grading_criteria: criteria,
    };
    module.assignments.push(newAssignment);
    saveData(data);
    return newAssignment;
  }
  return null;
};

// Grade an assignment
const gradeAssignment = (studentId, assignmentId, grade, feedback) => {
  const student = data.students.find((student) => student.student_id === studentId);
  const assignment = student.assignments.find((assignment) => assignment.assignment_id === assignmentId);
  if (assignment) {
    assignment.grade = grade;
    assignment.feedback = feedback;
    assignment.graded_at = new Date();
    saveData(data);
    return assignment;
  }
  return null;
};

// Submit quiz results
const submitQuizResults = (studentId, quizId, score) => {
  const student = data.students.find((student) => student.student_id === studentId);
  const quiz = student.quizzes.find((quiz) => quiz.quiz_id === quizId);
  if (quiz) {
    quiz.score = score;
    quiz.submitted_at = new Date();
    saveData(data);
    return quiz;
  }
  return null;
};

// Fetch course details
const fetchCourseDetails = (courseId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course : null;
};

// Fetch course analytics
const fetchCourseAnalytics = (courseId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const analyticsData = {
    averageGrade: calculateAverageGrade(course),
    completionRate: calculateCompletionRate(course),
  };
  return course ? analyticsData : null;
};

// Upload course material
const uploadCourseMaterial = (courseId, materialName, materialUrl) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  if (course) {
    const newMaterial = {
      material_id: Date.now(),
      material_name: materialName,
      material_url: materialUrl,
      uploaded_at: new Date(),
    };
    course.materials.push(newMaterial);
    saveData(data);
    return newMaterial;
  }
  return null;
};

// Add course event
const addCourseEvent = (courseId, eventName, eventDate, eventDescription) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  if (course) {
    const newEvent = {
      event_id: Date.now(),
      event_name: eventName,
      event_date: eventDate,
      event_description: eventDescription,
    };
    course.events.push(newEvent);
    saveData(data);
    return newEvent;
  }
  return null;
};

// Send notification
const sendNotification = (userId, message) => {
  const user = data.students.find((user) => user.student_id === userId);
  if (user) {
    user.notifications.push({ id: Date.now(), message, date: new Date() });
    saveData(data);
    return user.notifications;
  }
  return null;
};

// Send a message
const sendMessage = (senderId, recipientId, messageContent) => {
  const sender = data.students.find((user) => user.student_id === senderId);
  const recipient = data.students.find((user) => user.student_id === recipientId);
  if (sender && recipient) {
    const message = { id: Date.now(), senderId, messageContent, date: new Date() };
    recipient.messages.push(message);
    saveData(data);
    return message;
  }
  return null;
};

// Helper function to calculate average grade
const calculateAverageGrade = (courses) => {
  const grades = courses.flatMap((course) => course.modules.flatMap((mod) => mod.assignments.map((assign) => assign.grade)));
  const validGrades = grades.filter((grade) => grade !== undefined && grade !== null);
  return validGrades.length ? validGrades.reduce((acc, grade) => acc + grade, 0) / validGrades.length : 0;
};

// Helper function to calculate module completion rate
const calculateCompletionRate = (course) => {
  const modules = course.modules || [];
  const completedModules = modules.filter((module) => {
    const assignmentsCompleted = module.assignments.every((assign) => assign.grade !== undefined);
    const quizzesCompleted = module.quizzes.every((quiz) => quiz.score !== undefined);
    return assignmentsCompleted && quizzesCompleted;
  });
  return modules.length ? (completedModules.length / modules.length) * 100 : 0;
};

// Add a new quiz to a module
const addQuizToModule = (courseId, moduleId, quizTitle, questions = []) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);

  if (course) {
    const module = course.modules.find((mod) => mod.module_id === moduleId);
    if (module) {
      const newQuiz = {
        quiz_id: Date.now(),
        quiz_title: quizTitle,
        questions: questions.map((q, index) => ({
          question_id: Date.now() + index,
          text: q.text,
          options: q.options.map((opt, idx) => ({
            option_id: Date.now() + index + idx,
            text: opt.text
          })),
          correct_option_id: q.options.find(opt => opt.correct)?.option_id
        })),
      };
      module.quizzes.push(newQuiz);
      saveData(data);
      return newQuiz;
    }
  }
  return null;
};


export {
  validateTeacherLogin,
  fetchCoursesByTeacherId,
  fetchModulesByCourseId,
  fetchAssignmentsByModuleId,
  fetchQuizzesByModuleId,
  fetchStudentsByCourseId,
  fetchStudentProfile,
  fetchStudentProgress,
  addCourse,
  addModule,
  addAssignment,
  addQuizToModule,
  gradeAssignment,
  submitQuizResults,
  fetchCourseDetails,
  fetchCourseAnalytics,
  uploadCourseMaterial,
  addCourseEvent,
  sendNotification,
  sendMessage,
};
