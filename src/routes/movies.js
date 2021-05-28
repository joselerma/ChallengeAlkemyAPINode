const server = require("express").Router();
const { Peliculaserie, Genero, Personaje } = require("../db");
const { logicaOrden } = require("../helpers/logicaMoviesOrder");
const {
  isUrl,
  tituloCapitalizado,
  validarEstrellas,
} = require("../helpers/verificadores");
///////////////////////////////////////////////////////////////GET & QUERY´S
server.get("/", async (req, res) => {
  const { order } = req.query;
  const { name } = req.query;
  const { genre } = req.query;
  try {
    if (order) {
      const movies = await Peliculaserie.findAll();
      const moviesOrdered = logicaOrden(order, movies);
      if (moviesOrdered !== 400) {
        return res.json(moviesOrdered);
      } else {
        return res.sendStatus(400);
      }
    } else if (name) {
      const titulo = tituloCapitalizado(name);
      const movie = await Peliculaserie.findOne({ where: { titulo: titulo } });
      if (movie) {
        return res.json(movie);
      } else {
        res.sendStatus(404);
      }
    } else if (genre) {
      const movies = await Peliculaserie.findAll({
        include: [{ model: Genero, as: "generos", where: { id: genre } }],
      });
      return res.json(movies);
    } else {
      const movies = await Peliculaserie.findAll({
        attributes: ["titulo", "imagen", "creado"], //Filtramos solo estos tres atributos en la busqueda
      });
      return res.json(movies);
    }
  } catch {
    res.sendStatus(500);
  }
});

//////////////////////////////////////////////////////////////CRUD
server.post("/", async (req, res) => {
  try {
    const { imagen, titulo, creado, stars, idGenero } = req.body;
    if (
      imagen &&
      isUrl(imagen) &&
      titulo &&
      creado &&
      stars &&
      validarEstrellas(stars)
    ) {
      const tituloPropio = tituloCapitalizado(titulo);
      const yaExiste = await Peliculaserie.findOne({
        where: { titulo: tituloPropio },
      });
      if (!yaExiste) {
        const newMovie = await Peliculaserie.create({
          imagen,
          titulo: tituloPropio,
          creado,
          stars,
          generoId: idGenero,
        });
        res.sendStatus(201);
      } else {
        res.sendStatus(409);
      }
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});
/////////////////////////////////////////////////////////////////
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Peliculaserie.findOne({
      where: { id: id },
      include: [
        { model: Personaje, as: "personajes" },
        { model: Genero, as: "genero" },
      ],
    });
    if (movie) {
      res.json(movie);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(500);
  }
});
/////////////////////////////////////////////////////////////////////
server.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { creado, titulo, stars, imagen } = req.body;
  try {
    const existe = await Peliculaserie.findOne({ where: { id: id } });
    if (existe) {
      let obj = {}; //Agregamos los campos validos a un objeto para ahorrar condicionales
      if (creado) {
        obj = { ...obj, creado: creado };
      }
      if (stars || stars === 0) {
        if (validarEstrellas(stars)) {
          obj = { ...obj, stars: stars };
        } else {
          return res.sendStatus(400);
        }
      }
      if (titulo) {
        let tituloPropio = tituloCapitalizado(titulo);
        obj = { ...obj, titulo: tituloPropio };
      }
      if (imagen) {
        if (isUrl(imagen)) {
          obj = { ...obj, imagen: imagen };
        } else {
          res.sendStatus(400);
        }
      }
      const actualizado = await Peliculaserie.update(
        {
          //Sequelize updetea solo los campos con algo
          creado: obj.creado && obj.creado,
          imagen: obj.imagen && obj.imagen,
          titulo: obj.titulo && obj.titulo,
          stars: obj.stars && obj.stars,
        },
        { where: { id: id } }
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(500);
  }
});
///////////////////////////////////////////////////////////////////////////////////////
server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Peliculaserie.findOne({ where: { id: id } });
    if (existe) {
      const eliminado = await Peliculaserie.destroy({ where: { id: id } });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(500);
  }
});
//////////////////////////////////////////////////////Ruta para relacionar una pelicula a un genero
server.put("/:movieId/genre/:genreId", async (req, res) => {
  const { movieId, genreId } = req.params;
  try {
    const relacionarlos = await Peliculaserie.update(
      { generoId: genreId },
      { where: { id: movieId } }
    );
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
});

module.exports = server;
