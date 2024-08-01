module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        like: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislike: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null for top-level comments
            references: {
                model: 'comments',
                key: 'id'
            }
        }
    }, {
        tableName: 'comments'
    });

    Comment.associate = (models) => {
        // One Comment belongs to one User
        Comment.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });

        // One Comment belongs to one Thread
        Comment.belongsTo(models.Thread, {
            foreignKey: "threadId",
            as: 'thread'
        });

        // A Comment can have many replies (comments)
        Comment.hasMany(models.Comment, {
            foreignKey: "parentId",
            as: 'replies',
            onDelete: 'CASCADE', // delete all the child comments when the parent is deleted
        });
    };

    return Comment;
};
