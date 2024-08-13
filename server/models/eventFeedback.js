module.exports = (sequelize, DataTypes) => {
    const EventFeedback = sequelize.define("EventFeedback", {
        EventName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        Improvement: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Enjoy: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER(100),
            allowNull: false
        }
    }, {
        tableName: 'eventFeedback',
    });
    EventFeedback.associate = (models) => {
        EventFeedback.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        EventFeedback.belongsTo(models.Event, {
            foreignKey: "eventId",
            as: 'event'
        });
        EventFeedback.belongsTo(models.Registration, {
            foreignKey:'userId',  // Part of composite key
            as: 'feedbacks'
        });
    };
    return EventFeedback;
}