module.exports.isUrl = (s) => {
  let regexUrl =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexUrl.test(s);
};

module.exports.isEmail = (e) => {
  let regexEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regexEmail.test(e);
};

module.exports.nombreCapitalizado = (nombre) => {
  let nombrePropio = nombre.replace(/\w\S*/g, (w) =>
    w.replace(/^\w/, (c) => c.toUpperCase())
  );
  return nombrePropio;
};

module.exports.tituloCapitalizado = (titulo) => {
  const tituloPropio = titulo.charAt(0).toUpperCase() + titulo.slice(1);
  return tituloPropio;
};

module.exports.formatoValidoFecha = (creado) => {
  let regexFecha = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/;

  return regexFecha.test(creado);
};

module.exports.validarEstrellas = (stars) => {
  if (stars > 0 && stars < 6) {
    return true;
  } else {
    return false;
  }
};
