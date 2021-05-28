require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
const { Usuario } = require("../db");
const bcrypt = require("bcrypt");
const { FIRMA } = process.env;

//Aqui se debe actualizar el orden del usuario con los detalles de la orden
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async function (email, password, done) {
      const user = await Usuario.findOne({
        where: { email: email },
      });
      if (!user) return done(null, false);
      if (!bcrypt.compareSync(password, user.password))
        return done(null, false);
      const { id, nombre, apellido } = user;
      return done(null, {
        id,
        email,
        nombre,
        apellido,
      });
    }
  )
);

passport.use(
  new BearerStrategy(function (token, done) {
    jwt.verify(token, FIRMA, function (err, user) {
      if (err) return done(err);
      return done(null, user ? user : false);
    });
  })
);

module.exports = passport;
