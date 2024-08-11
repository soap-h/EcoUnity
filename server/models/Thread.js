module.exports = (sequelize, DataTypes) => {
    const Thread = sequelize.define("Thread", {
        title: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        upvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        downvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        imageFile: {
            type: DataTypes.STRING(20)
        }
    }, {
        tableName: 'threads'
    });

    Thread.associate = (models) => {
        // One Thread belongs to one User
        Thread.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });

        // One Thread has many Comments
        Thread.hasMany(models.Comment, {
            foreignKey: "threadId",
            as: 'comments',
            onDelete: 'CASCADE'
        });

        // Thread.hasMany(models.UserVote, {
        //     foreignKey: "threadId",
        //     as: 'votes'
        // });

        // One Thread has many ReportThreads (reports)
        Thread.hasMany(models.ReportThread, {
            foreignKey: 'threadId',
            as: 'reports',
            onDelete: 'CASCADE'
        });
    };

    return Thread;
};
