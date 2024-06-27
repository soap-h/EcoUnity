module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define("Purchase", {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'products',
                key: 'id'
            },
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'purchases'
    });

    Purchase.associate = (models) => {
        Purchase.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
        Purchase.belongsTo(models.Product, {
            foreignKey: "productId",
            onDelete: "cascade"
        });
    };

    return Purchase;
}
