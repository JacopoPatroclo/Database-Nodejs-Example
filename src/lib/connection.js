const net = require("net");
const defaultPort = 12045;

module.exports = parser => isReadyCallback => {
  const server = net.createServer();
  server.on("connection", socket => {
    let stringData = "";
    socket.on("data", data => {
      let string = data.toString("utf8");
      if (string.includes("END")) {
        stringData = stringData + string.replace("END", "");
        parser.parseToAction(stringData, socket);
      } else {
        stringData = stringData + data.toString("utf8");
      }
    });
    socket.on("error", err => {
      parser.errorOnConnection(err, socket);
    });
  });
  server.on("error", error => {
    throw error;
  });
  server.listen(defaultPort, () => {
    isReadyCallback();
  });
  return server;
};
