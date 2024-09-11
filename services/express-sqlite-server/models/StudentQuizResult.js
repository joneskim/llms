const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Student = require('./Student');
const Quiz = require('./Quiz');

const StudentQuizResult = sequelize.define('StudentQuizResult', {
  studentId: {
    type: DataTypes.UUID,
    references: {
      model: Student,
      key: 'id',
    },
  },
  quizId: {
    type: DataTypes.UUID,
    references: {
      model: Quiz,
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

StudentQuizResult.belongsTo(Student, { foreignKey: 'studentId' });
StudentQuizResult.belongsTo(Quiz, { foreignKey: 'quizId' });
Student.hasMany(StudentQuizResult, { foreignKey: 'studentId' });
Quiz.hasMany(StudentQuizResult, { foreignKey: 'quizId' });

module.exports = StudentQuizResult;
