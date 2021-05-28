require("dotenv").config();
const server = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Usuario } = require("../db");
const saltRounds = 12;
const { FIRMA } = process.env;
const { isEmail } = require("../helpers/verificadores");
const { accountCreatedEmail } = require("../helpers/sendmails");

server.post("/login", async function (req, res, next) {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    else if (!user) return res.sendStatus(401);
    // Email o contraseña incorrectos
    else {
      return res.json({
        token: jwt.sign(user, FIRMA, { expiresIn: "7d" }), //generamos la respuesta con el token
      });
    }
  })(req, res, next);
});

server.post("/register", async (req, res) => {
  const { email, nombre, apellido, password } = req.body;

  if (email && isEmail(email) && nombre && apellido && password) {
    const emailRepetido = await Usuario.findOne({ where: { email: email } });
    if (!emailRepetido) {
      const hash = bcrypt.hashSync(password, saltRounds);
      try {
        const nuevoUsuario = await Usuario.create({
          email: email,
          password: hash,
          nombre: nombre,
          apellido: apellido,
        });
        accountCreatedEmail(email); //enviamos el email de creacion de cuenta
        return res.sendStatus(201); //Recurso creado
      } catch {
        return res.sendStatus(500); //Error en la db
      }
    } else {
      return res.sendStatus(409); //El recurso ya existia
    }
  } else {
    return res.sendStatus(400); //Falto algun parametro
  }
});

module.exports = server;
