module.exports = (sequelize, DataTypes) => {
    const ReportThread = sequelize.define("ReportThread", {
        problem: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        // Foreign key for the reported Thread
        threadId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Foreign key for the user who submitted the report
        reporterId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'report_threads',
    });

    ReportThread.associate = (models) => {
        // A ReportThread belongs to one Thread
        ReportThread.belongsTo(models.Thread, {
            foreignKey: "threadId",
            as: 'thread'
        });

        // A ReportThread belongs to one User (the reporter)
        ReportThread.belongsTo(models.User, {
            foreignKey: "reporterId",
            as: 'reporter'
        });
    };

    return ReportThread;
};
