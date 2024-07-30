module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        timeStart: {
            type: DataTypes.TIME,
            allowNull: false
        },
        timeEnd: {
            type: DataTypes.TIME,
            allowNull: false
        },
        venue: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        participants: {
            type: DataTypes.INTEGER(100)
        },
        price: {
            type: DataTypes.DOUBLE(5,2),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        registerEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'events'
    });

    Event.associate = (models) => {
        Event.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Event;
}
