module.exports = (sequelize, DataTypes) => {
    const Inbox = sequelize.define("Inbox", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        recipient: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        unread: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 1
        }
    }, {
        tableName: 'inbox'
    });

    Inbox.associate = (models) => {
        Inbox.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'cascade'
        });
    };
    return Inbox;
}