const { DataTypes } = require('sequelize');

module.exports = model;
    
function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        bidId: { type: DataTypes.INTEGER, allowNull: false },
        lastInviteSentAt: { type: DataTypes.DATE, allowNull: false },
        inviteAccepted: { type: DataTypes.BOOLEAN, allowNull: true, default: false }
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

    return sequelize.define('VendorBidInvite', attributes, options);
}