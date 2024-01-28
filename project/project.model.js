const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        title: { type: DataTypes.STRING, allowNull: false },
        startDate: { type: DataTypes.STRING, allowNull: false },
        endDate: { type: DataTypes.STRING, allowNull: false },
        size: { type: DataTypes.STRING, allowNull: true },
        architect: { type: DataTypes.STRING, allowNull: true },
        desc: { type: DataTypes.STRING, allowNull: true },
        companyId: { type: DataTypes.INTEGER, allowNull: true }
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

    return sequelize.define('Project', attributes, options);
}