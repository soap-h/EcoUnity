module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
    },

        imageFile: {
            type: DataTypes.STRING(20),
            allowNull: true,
            default: null

        }
    }, {
        tableName: 'users'
    });

    User.associate = (models) => {

        User.hasMany(models.Event, {
            foreignKey: "userId",
            as: 'events',
          onDelete: "cascade"
        });

        User.hasMany(models.Tracker, {
            foreignKey: "userId",

            onDelete: "cascade"
        });
    
        User.hasMany(models.IncidentReporting, {
            foreignKey: "userId",
            as: 'incidentReports',
            onDelete: 'cascade'
        });

    };
    // User.associate = (models) => {
    //     User.hasMany(models.EventFeedback, {
    //     foreignKey: "userId",
    //     onDelete: "cascade"
    //     });
    //     };
    

    return User;
}
