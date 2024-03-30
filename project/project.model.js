const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        internalId: { type: DataTypes.STRING, allowNull: true },
        title: { type: DataTypes.STRING, allowNull: false },
        size: { type: DataTypes.STRING, allowNull: false },
        jobWalkDate: { type: DataTypes.STRING, allowNull: true },
        jobName1: { type: DataTypes.STRING, allowNull: true },
        jobNo1: { type: DataTypes.STRING, allowNull: true },
        jobName2: { type: DataTypes.STRING, allowNull: true },
        jobNo2: { type: DataTypes.STRING, allowNull: true },
        companyId: { type: DataTypes.INTEGER, allowNull: false },
        desc: { type: DataTypes.STRING, allowNull: false },
        isPublic: { type: DataTypes.BOOLEAN, allowNull: true },
        isPrivate: { type: DataTypes.BOOLEAN, allowNull: true },
        clName: { type: DataTypes.STRING, allowNull: true },
        clProjLead: { type: DataTypes.STRING, allowNull: true },
        clProjDueDate: { type: DataTypes.STRING, allowNull: true },
        clNotes: { type: DataTypes.STRING, allowNull: true }
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