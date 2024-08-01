module.exports = (sequelize, DataTypes) => {
    const Registration = sequelize.define("Registration", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'registrations'
    });

    Registration.associate = (models) => {
        Registration.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        Registration.belongsTo(models.Event, {
            foreignKey: "eventId",
            as: 'event'
        });
    };

    return Registration;
};
