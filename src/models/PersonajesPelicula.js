const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "PersonajesPelicula",
    {},
    {
      timestamps: false,
      tableName: "personajes_pelicula",
    }
  );
};
