module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        prod_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        prod_desc: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        prod_img: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        prod_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        prod_rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        prod_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prod_sold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
        
    }, {
        tableName: 'products',
    });

    Product.associate = (models) => {
        Product.hasMany(models.Purchase, {
            foreignKey: "productId",
            onDelete: "cascade"
        });
        
        Product.hasMany(models.Review, {
            foreignKey: "productId",
            onDelete: "cascade"
        });

        Product.hasMany(models.Cart, {
            foreignKey: "productId",
            onDelete: "CASCADE"
        });
    };

    return Product;
}
