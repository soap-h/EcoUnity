module.exports = (sequelize, DataTypes) => {
    const CommentLike = sequelize.define("CommentLike", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'comments',
                key: 'id'
            }
        }
    }, {
        tableName: 'comment_likes',
        indexes: [
            { unique: true, fields: ['userId', 'commentId'] } // Ensures a user can only like a comment once
        ]
    });

    CommentLike.associate = (models) => {
        CommentLike.belongsTo(models.User, { foreignKey: 'userId' });
        CommentLike.belongsTo(models.Comment, { foreignKey: 'commentId' });
    };

    return CommentLike;
};
