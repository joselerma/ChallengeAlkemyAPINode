const server = require("./app.js");
const { conn } = require("./db.js");
const { API_PORT } = process.env;

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(process.env.PORT || API_PORT, async () => {
    console.log(
      `The server is listening at the port ${process.env.PORT || API_PORT}`
    );
  });
});
