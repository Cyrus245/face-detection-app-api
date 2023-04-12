const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    // postgres default port
    port: 5432,
    user: "postgres",
    // postgres access password
    password: "1234",
    database: "Smart-Brain",
  },
});

module.exports = db;
