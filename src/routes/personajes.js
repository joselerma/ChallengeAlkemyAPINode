const server = require("express").Router();
const { Personaje, Peliculaserie, PersonajesPelicula } = require("../db");
const { nombreCapitalizado, isUrl } = require("../helpers/verificadores");
////////////////////////////////////////////////////////////////////////////
server.get("/", async (req, res) => {
  const { name } = req.query;
  const { age } = req.query;
  const { movies } = req.query;

  try {
    if (name) {
      const nombrePropio = nombreCapitalizado(name);

      const personaje = await Personaje.findOne({
        where: { nombre: nombrePropio },
        include: [{ model: Peliculaserie, as: "peliculaseries" }],
      });

      if (personaje) {
        return res.json(personaje);
      } else {
        return res.sendStatus(404);
      }
    } else if (age) {
      const personajes = await Personaje.findAll({
        where: { edad: age },
        include: [{ model: Peliculaserie, as: "peliculaseries" }],
      });

      if (personajes) {
        return res.json(personajes);
      } else {
        return res.sendStatus(404);
      }
    } else if (movies) {
      const personajes = await Personaje.findAll({
        include: [
          { model: Peliculaserie, as: "peliculaseries", where: { id: movies } },
        ],
      });

      if (personajes) {
        return res.json(personajes);
      } else {
        return res.sendStatus(404);
      }
    } else {
      const personajes = await Personaje.findAll();
      return res.json(personajes);
    }
  } catch {
    res.sendStatus(500);
  }
});
////////////////////////////////////////////////////////////////////////////CRUD
server.post("/", async (req, res) => {
  const { imagen, nombre, edad, peso, historia } = req.body;

  try {
    if (imagen && isUrl(imagen) && nombre && edad && peso && historia) {
      //Capitalizamos la primera letra de cada palabra
      const nombrePropio = nombreCapitalizado(nombre);

      const yaExiste = await Personaje.findOne({
        where: {
          nombre: nombrePropio,
        },
      });
      if (!yaExiste) {
        const nuevoPersonaje = await Personaje.create({
          imagen: imagen,
          nombre: nombrePropio,
          edad: edad,
          peso: peso,
          historia: historia,
        });
        return res.sendStatus(201); //Recurso creado
      } else {
        return res.sendStatus(400); //Faltaron parametros
      }
    } else {
      return res.sendStatus(409); //El recurso a crear ya existia
    }
  } catch {
    return res.sendStatus(500);
  }
});
/////////////////////////////////////////////////////////////////
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const personaje = await Personaje.findOne({
      where: { id: id },
      include: [{ model: Peliculaserie, as: "peliculaseries" }],
    });

    if (personaje) {
      return res.json(personaje);
    } else {
      return res.sendStatus(404);
    }
  } catch {
    res.sendStatus(500);
  }
});
///////////////////////////////////////////////////////////////
server.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { imagen, nombre, edad, peso, historia } = req.body;

  try {
    const siExiste = await Personaje.findOne({ where: { id: id } });

    if (siExiste) {
      //validamos los parametros necesarios
      if (imagen && isUrl(imagen) && nombre) {
        const nombrePropio = nombreCapitalizado(nombre);
        const actualizado = await Personaje.update(
          { imagen, edad, nombre: nombrePropio, peso, historia },
          { where: { id: id } }
        );
        return res.sendStatus(200);
      } else if (imagen && isUrl(imagen)) {
        const actualizado = await Personaje.update(
          { imagen, edad, peso, historia },
          { where: { id: id } }
        );
        return res.sendStatus(200);
      } else if (nombre) {
        const nombrePropio = nombreCapitalizado(nombre);
        const actualizado = await Personaje.update(
          { edad, nombre: nombrePropio, peso, historia },
          { where: { id: id } }
        );
        return res.sendStatus(200);
      } else {
        const actualizado = await Personaje.update(
          { edad, peso, historia },
          { where: { id: id } }
        );
        return res.sendStatus(200);
      }
    } else {
      return res.sendStatus(404); //El recurso no fue encontrado
    }
  } catch {
    return res.sendStatus(500); //Hubo un error en la actualizacion
  }
});
/////////////////////////////////////////////////////////////////////////////
server.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existe = await Personaje.findOne({ where: { id: id } });

    if (existe) {
      const eliminado = Personaje.destroy({ where: { id: id } });
      return res.sendStatus(200); //Recurso eliminado
    } else {
      return res.sendStatus(404); //recurso no encotrado
    }
  } catch {
    return res.sendStatus(500); //error en db
  }
});

////////////////////////////////////////////////////////////////////Ruta para asociar un personaje a una pelicula
server.post("/:idPersonaje/movie/:idMovie", async (req, res) => {
  const { idPersonaje, idMovie } = req.params;
  try {
    const crearRelacion = await PersonajesPelicula.create({
      personajeId: idPersonaje,
      peliculaserieId: idMovie,
    });
    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
});

module.exports = server;
