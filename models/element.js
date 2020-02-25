module.exports = (sequelize, DataTypes) => {
    const Element = sequelize.define('Element', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Element.associate = (models) => {
        models.Element.belongsTo(models.User, {
            onDelete: 'CASCADE',
            foreignKey: 'user_id',
            allowNull: false
        });
    };

    return Element;
};