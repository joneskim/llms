export {
    fetchTasks,
    addTask,
    deleteTask,
    updateTask,
    fetchTaskById,
    fetchTasksByType,
    fetchTasksByCourseId, // Ensure this is exported
  } from './subApi/tasksApi';
  
  // Other imports and exports...
  export {
    fetchQuizzesByModuleId,
    addQuizToModule,
    fetchQuizzesByStudentInCourse,
    fetchQuizById,
    submitQuiz,
    fetchStudentQuizResults,
    fetchResultsByQuizId,
    updateQuizInModule,
  } from './subApi/quizzesApi';
  
  export {
    fetchAssignmentsByModuleId,
    fetchResultsByAssignmentId,
  } from './subApi/assignmentsApi';
  
  export {
    fetchStudentById,
    fetchStudentByUniqueId,
    fetchStudentsByCourseId, // Ensure this is exported
  } from './subApi/studentsApi';
  
  export {
    fetchCoursesByTeacherId,
    addCourse,
    addModule,
    fetchModuleById,
    fetchModulesByCourseId,
    fetchCoursesByStudentId, // Ensure this is exported
  } from './subApi/coursesApi';
  
  export { validateTeacherLogin } from './subApi/loginApi';
  