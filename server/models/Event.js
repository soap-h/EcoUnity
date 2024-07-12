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
        price: {
            type: DataTypes.DOUBLE,
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
    }, {
        tableName: 'events'
    });

    // Event.associate = (models) => {
    //     Event.belongsTo(models.User, {
    //         foreignKey: "userId",
    //         as: 'user'
    //     });
    // };

    return Event;
}
