module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("Review", {
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
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'reviews'
    });

    Review.associate = (models) => {
        Review.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
        Review.belongsTo(models.Product, {
            foreignKey: "productId",
            onDelete: "cascade"
        });
    };

    return Review;
}
