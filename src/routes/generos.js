const server = require("express").Router();
const { Genero, Peliculaserie } = require("../db");
const { isUrl, nombreCapitalizado } = require("../helpers/verificadores");
////////////////////////////////////////////////////////////////////
server.get("/", async (req, res) => {
  try {
    if (req.user) {
      const { name } = req.query;
      if (name) {
        const nombre = nombreCapitalizado(name);
        const genero = await Genero.findOne({
          where: { nombre: nombre },
          include: [{ model: Peliculaserie, as: "peliculaseries" }],
        });
        if (genero) {
          res.json(genero);
        } else {
          res.sendStatus(404);
        }
      } else {
        const allGenres = await Genero.findAll({
          include: [{ model: Peliculaserie, as: "peliculaseries" }],
        });

        return res.json(allGenres); //retorna array vacio si no hay generos
      }
    } else {
      res.sendStatus(401);
    }
  } catch {
    return res.sendStatus(500);
  }
});

////////////////////////////////////////////////////////////////CRUD
server.post("/", async (req, res) => {
  const { imagen, nombre } = req.body;

  try {
    if (req.user) {
      if (imagen && isUrl(imagen) && nombre) {
        const nombrePropio = nombreCapitalizado(nombre);

        const genero = await Genero.create({
          imagen: imagen,
          nombre: nombrePropio,
        });
        return res.sendStatus(201);
      } else {
        return res.sendStatus(400);
      }
    } else {
      res.sendStatus(401);
    }
  } catch {
    return res.sendStatus(500);
  }
});
///////////////////////////////////////////////////////////////////////////////
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user) {
      const genero = await Genero.findOne({ where: { id: id } });
      if (genero) {
        return res.sendStatus(200);
      } else {
        return res.sendStatus(404);
      }
    } else {
      res.sendStatus(401);
    }
  } catch {
    return res.sendStatus(500);
  }
});
///////////////////////////////////////////////////////////////////////////////////////
server.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { imagen, nombre } = req.body;

  try {
    if (req.user) {
      const existe = await Genero.findOne({ where: { id: id } });
      if (existe) {
        let obj = {}; //usamos un objeto para ahorrar condicionales
        if (imagen && isUrl(imagen)) obj = { ...obj, imagen: imagen }; //verificamos que imagen sea una url
        if (nombre) {
          nombre = nombreCapitalizado(nombre); //capitalizamos nombre si son dos o mas palabras se capitaliza la primera letra
          obj = { ...obj, nombre: nombre };
        }
        const actualizado = await Genero.update(
          { imagen: obj.imgen && obj.imagen, nombre: obj.nombre && obj.nombre },
          { where: { id: id } }
        );
        return res.sendStatus(200);
      } else {
        return res.sendStatus(404);
      }
    } else {
      res.sendStatus(401);
    }
  } catch {
    return res.sendStatus(500);
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user) {
      const existe = await Genero.findOne({ where: { id: id } });
      if (existe) {
        const eliminado = await Genero.destroy({ where: { id: id } });
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }
});
/////////////////////////////////////////////////////////////////////////////////////

module.exports = server;
