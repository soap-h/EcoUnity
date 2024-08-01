module.exports = (sequelize, DataTypes) => {
    const IncidentReporting = sequelize.define("IncidentReporting", {
        ReportType: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ReportDetails: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        Location: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ActionTaken: {
            type: DataTypes.STRING(100),
        },
        imageFile: {
            type: DataTypes.STRING(20)
            },
       

    }, {
        tableName: 'IncidentReporting',
    });

    IncidentReporting.associate = (models) => {
        IncidentReporting.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };
    return IncidentReporting;
}