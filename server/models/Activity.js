module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define("Activity", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'activities'
    });

    // Activity.associate = (models) => {
    //     Activity.belongsTo(models.Tracker, {
    //         foreignKey: "activityId",
    //         as: 'activity'
    //     });
    // };
    return Activity;
}