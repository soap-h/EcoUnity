module.exports = (sequelize, DataTypes) => {
    const Tracker = sequelize.define("Tracker", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
    }, {
        tableName: 'trackers'
    });

    // Tracker.associate = (models) => {
    //     Tracker.hasMany(models.Activity, {
    //         foreignKey: "activityId",
    //         onDelete: "cascade"
    //     });
    // };
    return Tracker;
}