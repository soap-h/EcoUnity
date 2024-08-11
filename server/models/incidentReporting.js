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

        Note: {
            type: DataTypes.STRING(500),
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
        IncidentReporting.belongsTo(models.User, {
            foreignKey: "EditNoteId", // A different foreign key
            as: 'EditNoteUser' // A different alias
        });
    };
    return IncidentReporting;
}