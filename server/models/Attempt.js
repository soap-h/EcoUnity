module.exports = (sequelize, DataTypes) => {
    const Attempt = sequelize.define('Attempt', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Reference to the Users table
          key: 'id',
        },
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Lessons', // Reference to the Quizzes table
          key: 'id',
        },
      },
      pointsEarned: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'attempts', // Assuming your table for attempts is named 'attempts'
    });
  
    Attempt.associate = (models) => {
      Attempt.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
      Attempt.belongsTo(models.Lesson, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
    };
  
    return Attempt;
  };
  