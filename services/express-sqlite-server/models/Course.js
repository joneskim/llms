const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Teacher = require('./Teacher');
const Student = require('./Student');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Teacher,
      key: 'id',
    },
  },
});

Course.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Course.belongsToMany(Student, { through: 'CourseStudent', as: 'students' });
Student.belongsToMany(Course, { through: 'CourseStudent', as: 'courses' });

module.exports = Course;
