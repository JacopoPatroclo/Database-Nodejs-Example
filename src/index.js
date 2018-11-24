const fs = require("fs");
const path = require("path");

const startConnection = require("./lib/connection");
const initParser = require("./lib/parser");
const initOperator = require("./lib/operations");

const basePath = path.resolve(__dirname, "..");

module.exports = (pathTo = basePath) => {
  const pathToDB = path.resolve(pathTo, "db");
  if (!fs.existsSync(pathToDB)) {
    fs.mkdirSync(pathToDB);
  }

  const operator = initOperator(pathToDB);

  const parser = initParser(operator);

  startConnection(parser)(() => {
    console.log("DB is started");
  });
};
