module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define("Lesson", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
        },
        slidesPath: {
            type: DataTypes.STRING(20),
        },
        questions: {
            type: DataTypes.JSON,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tags: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        averagescore: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        totalpoints: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        attemptcount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'lessons',
    });

    Lesson.associate = (models) => {
        Lesson.hasMany(models.Attempt, {
            foreignKey: "LessonId",
            onDelete: "cascade"
        });
    };

    return Lesson;
}
