// server/models/Proposal.js
module.exports = (sequelize, DataTypes) => {
    const Proposal = sequelize.define("Proposal", {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        document: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending'
        }
    }, {
        tableName: 'proposals'
    });

    Proposal.associate = (models) => {
        Proposal.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Proposal;
};
