const { Router } = require("express");

const authRouter = require("./auth");
const personajesRouter = require("./personajes");
const moviesRouter = require("./movies");
const genresRouter = require("./generos");

const router = Router();

router.use("/auth", authRouter);
router.use("/characters", personajesRouter);
router.use("/movies", moviesRouter);
router.use("/genres", genresRouter);

module.exports = router;
