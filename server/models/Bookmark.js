module.exports = (sequelize, DataTypes) => {
    const Bookmark = sequelize.define("Bookmark", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        threadId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'threads',
                key: 'id'
            }
        }
    }, {
        tableName: 'bookmarks'
    });

    Bookmark.associate = (models) => {
        // One Bookmark belongs to one User
        Bookmark.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        // One Bookmark belongs to one Thread
        Bookmark.belongsTo(models.Thread, {
            foreignKey: 'threadId',
            as: 'thread'
        });
    };

    return Bookmark;
};
