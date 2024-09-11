const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const CourseStudent = sequelize.define('CourseStudent', {
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Courses',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = CourseStudent;
