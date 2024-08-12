module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // name of the table
                key: 'id' // key in the users table that we're referencing
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products', // name of the table
                key: 'id' // key in the products table that we're referencing
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    }, {
        tableName: 'cart'
    });

    // Associations
    Cart.associate = (models) => {
        // A cart item belongs to a single user
        Cart.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade"
        });

        // A cart item belongs to a single product
        Cart.belongsTo(models.Product, {
            foreignKey: "productId",
            onDelete: "cascade"
        });
    };

    return Cart;
};
