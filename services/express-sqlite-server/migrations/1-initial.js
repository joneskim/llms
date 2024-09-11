'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Tasks", deps: []
 * createTable "Assignments", deps: []
 * createTable "Quizzes", deps: []
 * createTable "Students", deps: []
 * createTable "Teachers", deps: []
 * createTable "Courses", deps: []
 * createTable "CourseStudent", deps: []
 * createTable "StudentQuizResults", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initial",
    "created": "2024-09-10T17:25:23.506Z",
    "comment": ""
};

var migrationCommands = [
    {
        fn: "createTable",
        params: [
            "Tasks",
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                taskName: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                taskType: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                dueDate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Assignments",
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                assignmentName: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                moduleId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Modules',
                        key: 'id',
                    },
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Quizzes",
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                quizName: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                moduleId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Modules',
                        key: 'id',
                    },
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Students",
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                uniqueId: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: true,
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Teachers",
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Courses",
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                courseName: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                teacherId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'Teachers',
                        key: 'id',
                    },
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "CourseStudent",
            {
                studentId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'Students',
                        key: 'id',
                    },
                    allowNull: false,
                },
                courseId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'Courses',
                        key: 'id',
                    },
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "StudentQuizResults",
            {
                studentId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'Students',
                        key: 'id',
                    },
                    allowNull: false,
                },
                quizId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'Quizzes',
                        key: 'id',
                    },
                    allowNull: false,
                },
                score: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
