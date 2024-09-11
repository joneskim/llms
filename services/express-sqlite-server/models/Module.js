const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Course = require('./Course');

const Module = sequelize.define('Module', {
  module_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  }
});

Module.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(Module, { foreignKey: 'courseId' });

module.exports = Module;
