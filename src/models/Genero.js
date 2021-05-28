const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "genero",

    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING,
        isUrl: true,
        allowNull: true,
      },
    },
    { timestamps: false }
  );
};
