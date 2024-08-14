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

        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },

        goals: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 5000
        },

        goaltype: {
            type: DataTypes.STRING(10),
            validate: {
                isIn: {
                    args: [['monthly', 'weekly']],
                    msg: "Goal type must be either 'monthly' or 'weekly'"
                }
            },
            defaultValue: "monthly"
        },

        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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

        // One-to-Many Relationship with Threads Table
        User.hasMany(models.Thread, {
            foreignKey: "userId",
            onDelete: "CASCADE"
        });

        // One-to-Many Relationship with Comments Table
        User.hasMany(models.Comment, {
            foreignKey: "userId",
            as: 'comments',
            onDelete: "CASCADE"
        });
    
        User.hasMany(models.IncidentReporting, {
            foreignKey: "userId",
            as: 'incidentReports',
            onDelete: 'cascade'
        });
        User.hasMany(models.IncidentReporting, {
            foreignKey: "EditNoteId",
            as: 'EditNoteUser',
            onDelete: 'cascade'
        });

        // Report Thread Relationship
        User.hasMany(models.ReportThread, {
            foreignKey: 'reporterId',
            as: 'reportedThreads',
            onDelete: 'CASCADE'
        });

        // User can have many comment likes 
        User.hasMany(models.CommentLike, {
            foreignKey: 'userId',
            as: 'likedComments'
        });

        // One-to-Many Relationship with Cart Table
        User.hasMany(models.Cart, {
            foreignKey: "userId",
            onDelete: 'cascade'
        });

        User.hasMany(models.Review, { 
            foreignKey: 'userId',
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
