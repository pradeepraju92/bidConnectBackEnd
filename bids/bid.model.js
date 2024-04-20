const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        title: { type: DataTypes.STRING, allowNull: false },
        keywords: { type: DataTypes.STRING, allowNull: false },
        companyId: { type: DataTypes.STRING, allowNull: false },
        projectId: { type: DataTypes.STRING, allowNull: false },
        pkgLead: {type: DataTypes.STRING, allowNull: true},
        pkgCost: {type: DataTypes.STRING, allowNull: true},
        pkgInstructions: {type: DataTypes.STRING, allowNull: true},
        bidDueDate: {type: DataTypes.STRING, allowNull: true},
        bidWalkDate: {type: DataTypes.STRING, allowNull: true},
        rfiDueDate: {type: DataTypes.STRING, allowNull: true},
        bidContactName: {type: DataTypes.STRING, allowNull: true},
        bidPhone: {type: DataTypes.STRING, allowNull: true},
        bidEmail: {type: DataTypes.STRING, allowNull: true},
        revisionNo: {type: DataTypes.STRING, allowNull: true}
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Bid', attributes, options);
}