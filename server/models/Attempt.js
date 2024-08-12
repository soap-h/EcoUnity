module.exports = (sequelize, DataTypes) => {
    const Attempt = sequelize.define('Attempt', {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', // Assuming your Users table is named 'Users'
            key: 'id'
          }
        },
        quizId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Quizzes', // Assuming your Quizzes table is named 'Quizzes'
            key: 'id'
          }
        },
        pointsEarned: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
    }, {
        tableName: 'lessons',
    });

    Attempt.associate = (models) => {
        Attempt.belongsTo(models.Lesson, {
            foreignKey: "LessonId",
            onDelete: "cascade"
        });
    };

    return Attempt;
}
