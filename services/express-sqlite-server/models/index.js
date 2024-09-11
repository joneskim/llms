const sequelize = require('../database');

const Task = require('./Task');
const Assignment = require('./Assignment');
const Quiz = require('./Quiz');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Course = require('./Course');
const StudentQuizResult = require('./StudentQuizResult');

// Export all models
module.exports = {
  sequelize,
  Task,
  Assignment,
  Quiz,
  Student,
  Teacher,
  Course,
  StudentQuizResult,
};
