module.exports = (sequelize, DataTypes) => {
    const EventParticipant = sequelize.define("EventParticipant", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        emailAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        response: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        reply: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'eventParticipants',
    });
    return EventParticipant;
}