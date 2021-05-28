module.exports.logicaOrden = (order, movies) => {
  if (
    order.toUpperCase().trim() == "ASC|DESC" ||
    order.toUpperCase().trim() == "ASC|DES" ||
    order.toUpperCase().trim() == "ASC|DEC" ||
    order.toUpperCase().trim() == "ASC-DESC" ||
    order.toUpperCase().trim() == "ASC-DES" ||
    order.toUpperCase().trim() == "ASC-DEC"
  ) {
    let peliculasOrdenadas = movies.sort(function (a, b) {
      if (a.titulo < b.titulo) {
        return 1;
      }
      if (a.titulo > b.titulo) {
        return -1;
      }
      return 0;
    });

    return peliculasOrdenadas;
  } else if (
    order.toUpperCase().trim() == "DESC|ASC" ||
    order.toUpperCase().trim() == "DES|ASC" ||
    order.toUpperCase().trim() == "DEC|ASC" ||
    order.toUpperCase().trim() == "DESC-ASC" ||
    order.toUpperCase().trim() == "DES-ASC" ||
    order.toUpperCase().trim() == "DEC-ASC"
  ) {
    console.log(movies);
    let peliculasOrdenadas = movies.sort(function (a, b) {
      if (a.titulo > b.titulo) {
        return 1;
      }
      if (a.titulo < b.titulo) {
        return -1;
      }
      return 0;
    });
    return peliculasOrdenadas;
  } else {
    return 400;
  }
};
