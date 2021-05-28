const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "peliculaserie",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      imagen: {
        type: DataTypes.TEXT,
        isUrl: true,
        allowNull: true,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creado: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
